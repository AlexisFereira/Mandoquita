const WebSocket = require("ws");

const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
const widths = [320, 768, 1440];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const fixtures = {
  session: { authorized: true, idleExpiresAt: "2026-07-13T20:00:00.000Z", absoluteExpiresAt: "2026-07-14T02:00:00.000Z", csrfToken: "browser-csrf" },
  product: { id: 1, slug: "reloj-clasico", name: "Reloj clásico", price: "100.00", currency: "USD", active: true, editorialApproved: true, published: true, commerciallyAvailable: true, featured: false, featuredOrder: null, productType: null, subcategory: null, category: null, updatedAt: "2026-07-13T18:00:00.000Z" },
  images: [
    { id: "cmg123456789012345678901", previewUrl: "/images/one.webp", altText: "Vista frontal del reloj", position: 0, isPrimary: true, referencedByVariants: true, variantReferenceCount: 1, contentType: "image/webp", width: 800, height: 800, size: 1000, checksumSha256: "abc", updatedAt: "2026-07-13T18:00:00.000Z" },
    { id: "cmg223456789012345678901", previewUrl: "/images/two.webp", altText: "Vista lateral del reloj", position: 1, isPrimary: false, referencedByVariants: false, variantReferenceCount: 0, contentType: "image/webp", width: 800, height: 800, size: 1000, checksumSha256: "def", updatedAt: "2026-07-13T18:00:00.000Z" },
  ],
  category: { id: "cat-audio", slug: "audio", name: "Audio", active: true, visible: true, image: { previewUrl: "/images/audio.webp", altText: "Audífonos sobre una mesa", contentType: "image/webp", width: 800, height: 800, size: 1000, checksumSha256: "ghi" }, updatedAt: "2026-07-13T18:00:00.000Z" },
};

async function main() {
  const targets = await fetch("http://localhost:9222/json").then((response) => response.json());
  const target = targets.find((candidate) => candidate.type === "page");
  assert(target, "No Chrome page target is available on port 9222");
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  socket.on("message", (raw) => {
    const message = JSON.parse(raw.toString());
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    message.error ? request.reject(message.error) : request.resolve(message.result);
  });
  await new Promise((resolve, reject) => {
    socket.once("open", resolve);
    socket.once("error", reject);
  });
  const send = (method, params = {}) => {
    id += 1;
    socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
  };
  const evaluate = async (expression) => {
    const response = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
    return response.result.value;
  };
  const waitFor = async (expression, message) => {
    for (let attempt = 0; attempt < 40; attempt += 1) {
      if (await evaluate(expression)) return;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    const state = await evaluate(`(async () => ({ title: document.title, url: location.href, body: document.body?.innerText?.slice(0, 500) ?? '', fetchSource: String(window.fetch).slice(0, 120), session: await window.fetch('/api/admin/session').then(response => response.json()).catch(error => String(error)) }))()`);
    throw new Error(`${message}: ${JSON.stringify(state)}`);
  };

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Accessibility.enable");
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "dark" }] });
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `
    (() => {
      const fixtures = ${JSON.stringify(fixtures)};
      const response = (body, status = 200) => Promise.resolve(new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }));
      window.fetch = (input, init = {}) => {
        const url = String(input);
        if (url === "/api/admin/session") return response(fixtures.session);
        if (url.startsWith("/api/admin/products?")) return response({ items: [fixtures.product], metadata: { page: 1, limit: 20, totalItems: 1, totalPages: 1 }, filters: {} });
        if (url === "/api/admin/product-types") return response({ items: [] });
        if (url === "/api/admin/products/1/images") return response({ product: { id: 1, slug: fixtures.product.slug, name: fixtures.product.name, updatedAt: fixtures.product.updatedAt }, images: fixtures.images });
        if (url === "/api/admin/categories") return response({ items: [fixtures.category] });
        return response({ error: "Unexpected browser QA request" }, 404);
      };
    })();
  ` });

  const results = [];
  for (const width of widths) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: width === 320 ? 800 : 900, deviceScaleFactor: 1, mobile: width < 768 });
    await send("Page.navigate", { url: `${baseUrl}/admin` });
    await waitFor(`Boolean([...document.querySelectorAll('button')].find(node => node.getAttribute('aria-label') === 'Administrar imágenes de Reloj clásico'))`, `${width}px product list did not load`);

    await evaluate(`([...document.querySelectorAll('button')].find(node => node.getAttribute('aria-label') === 'Administrar imágenes de Reloj clásico')).click()`);
    await waitFor(`[...document.querySelectorAll('h2')].some(node => node.offsetParent !== null && node.textContent?.trim() === 'Galería del producto')`, `${width}px product gallery did not load`);
    const product = await evaluate(`(() => {
      const buttons = [...document.querySelectorAll('button')];
      const actionable = buttons.filter(node => !node.disabled && node.offsetParent !== null);
      const rects = actionable.map(node => node.getBoundingClientRect());
      return {
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        colorScheme: getComputedStyle(document.documentElement).colorScheme,
        darkClass: document.documentElement.classList.contains('dark'),
        title: [...document.querySelectorAll('h1')].find(node => node.offsetParent !== null)?.textContent?.trim() ?? '',
        gallery: [...document.querySelectorAll('h2')].some(node => node.offsetParent !== null && node.textContent?.trim() === 'Galería del producto'),
        orderedImages: [...document.querySelectorAll('ol > li h3')].map(node => node.textContent?.trim()),
        alts: [...document.querySelectorAll('ol > li img')].map(node => node.alt),
        hasPrimary: document.body.innerText.includes('Principal'),
        hasVariantContext: document.body.innerText.includes('Usada por variantes (1)'),
        protectedRemoval: document.body.innerText.includes('No puedes eliminar esta imagen porque está usada por variantes.'),
        namedActions: ['Agregar imagen', 'Reordenar galería', 'Cambiar imagen principal'].every(name => buttons.some(node => node.textContent?.trim() === name)),
        minimumTarget: Math.min(...rects.map(rect => Math.min(rect.width, rect.height))),
      };
    })()`);
    assert(!product.overflow, `${width}px product gallery has horizontal overflow`);
    assert(product.colorScheme === "light" && !product.darkClass, `${width}px product gallery violates light-only contract`);
    assert(product.title === "Reloj clásico" && product.gallery, `${width}px product media context is unclear`);
    assert(product.orderedImages.join("|") === "Imagen 1 de 2|Imagen 2 de 2", `${width}px product order is not conveyed`);
    assert(product.alts.join("|") === "Vista frontal del reloj|Vista lateral del reloj", `${width}px product alt text is not exposed`);
    assert(product.hasPrimary && product.hasVariantContext && product.protectedRemoval && product.namedActions, `${width}px product state/actions are incomplete`);
    assert(product.minimumTarget >= 44, `${width}px product gallery has a target below 44px`);
    const accessibilityTree = await send("Accessibility.getFullAXTree");
    const accessibleNames = accessibilityTree.nodes.map((node) => node.name?.value).filter(Boolean);
    assert(accessibleNames.includes("Galería del producto"), `${width}px accessibility tree lacks the gallery heading`);
    assert(accessibleNames.includes("Administrar imágenes de Reloj clásico") || accessibleNames.includes("Agregar imagen"), `${width}px accessibility tree lacks named media actions`);

    let zoom200Overflow = null;
    if (width === 1440) {
      zoom200Overflow = await evaluate(`(async () => {
        document.documentElement.style.zoom = '2';
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;
        document.documentElement.style.zoom = '';
        return overflow;
      })()`);
      assert(!zoom200Overflow, "Product gallery has horizontal overflow at 200% zoom");
    }

    await evaluate(`([...document.querySelectorAll('button')].find(node => node.textContent?.trim() === 'Imágenes de categorías')).click()`);
    await waitFor(`Boolean([...document.querySelectorAll('button')].find(node => node.getAttribute('aria-label') === 'Administrar imagen de Audio'))`, `${width}px category list did not load`);
    await evaluate(`([...document.querySelectorAll('button')].find(node => node.getAttribute('aria-label') === 'Administrar imagen de Audio')).click()`);
    await waitFor(`[...document.querySelectorAll('h2')].some(node => node.textContent?.trim() === 'Imagen de la categoría')`, `${width}px category media did not load`);
    const category = await evaluate(`(() => {
      const buttons = [...document.querySelectorAll('button')];
      const actionable = buttons.filter(node => !node.disabled && node.offsetParent !== null);
      const rects = actionable.map(node => node.getBoundingClientRect());
      return {
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        title: document.querySelector('h1')?.textContent?.trim() ?? '',
        heading: [...document.querySelectorAll('h2')].some(node => node.textContent?.trim() === 'Imagen de la categoría'),
        alt: document.querySelector('main img')?.alt ?? '',
        productOrderAbsent: !buttons.some(node => node.textContent?.trim() === 'Reordenar galería'),
        removalName: buttons.some(node => node.getAttribute('aria-label') === 'Solicitar eliminar imagen de Audio'),
        minimumTarget: Math.min(...rects.map(rect => Math.min(rect.width, rect.height))),
      };
    })()`);
    assert(!category.overflow, `${width}px category editor has horizontal overflow`);
    assert(category.title === "Audio" && category.heading, `${width}px category media context is unclear`);
    assert(category.alt === "Audífonos sobre una mesa", `${width}px category alt text is not exposed`);
    assert(category.productOrderAbsent && category.removalName, `${width}px category actions are ambiguous`);
    assert(category.minimumTarget >= 44, `${width}px category editor has a target below 44px`);
    results.push({ width, product: { ...product, accessibilityTree: true, zoom200Overflow }, category });
  }
  socket.close();
  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
