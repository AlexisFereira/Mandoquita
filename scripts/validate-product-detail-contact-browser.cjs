const WebSocket = require("ws");

const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
const expectedPublicOrigin = (process.env.EXPECTED_PUBLIC_ORIGIN ?? baseUrl).replace(/\/$/, "");
const viewports = [320, 768, 1440];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  const catalog = await fetch(`${baseUrl}/api/products?page=1&limit=1`).then((response) => response.json());
  const product = catalog.items?.[0];
  assert(product?.slug, "No public Product is available for browser validation");

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
    for (let attempt = 0; attempt < 100; attempt += 1) {
      if (await evaluate(expression)) return;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error(message);
  };

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Accessibility.enable");
  await send("Emulation.setEmulatedMedia", {
    features: [
      { name: "prefers-color-scheme", value: "dark" },
      { name: "prefers-reduced-motion", value: "reduce" },
    ],
  });
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `try { Object.defineProperty(navigator, 'share', { configurable: true, value: undefined }); } catch {}`,
  });

  const results = [];
  for (const width of viewports) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
    await send("Page.navigate", { url: `${baseUrl}/products/${product.slug}` });
    await waitFor(
      `Boolean(document.querySelector('h1') && document.querySelector('[data-product-share]') && document.querySelector('section[aria-label^="Imágenes de "]'))`,
      `${width}px Product Detail did not load configured continuation actions`,
    );
    await waitFor(
      `getComputedStyle(document.documentElement).colorScheme === 'light' && document.querySelector('[data-product-share]').getBoundingClientRect().height >= 44`,
      `${width}px Product Detail styles did not settle`,
    );

    const result = await evaluate(`(() => {
      const gallery = document.querySelector('section[aria-label^="Imágenes de "]');
      const heading = document.querySelector('h1');
      const action = document.querySelector('[data-product-share]')?.closest('section');
      const contact = action?.querySelector('a[href^="https://wa.me/"]');
      const canonical = document.querySelector('link[rel="canonical"]')?.href ?? '';
      const controls = [...(action?.querySelectorAll('a,button') ?? [])];
      const whatsapp = contact ? new URL(contact.href) : null;
      return {
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        colorScheme: getComputedStyle(document.documentElement).colorScheme,
        darkClass: document.documentElement.classList.contains('dark'),
        ordered: Boolean(gallery && heading && action
          && (gallery.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING)
          && (heading.compareDocumentPosition(action) & Node.DOCUMENT_POSITION_FOLLOWING)),
        galleryName: gallery?.getAttribute('aria-label') ?? '',
        galleryControls: gallery?.querySelectorAll('button').length ?? 0,
        contact: Boolean(contact),
        contactSafe: Boolean(contact?.target === '_blank'
          && contact.rel.includes('noopener')
          && contact.rel.includes('noreferrer')
          && contact.referrerPolicy === 'no-referrer'
          && whatsapp?.hostname === 'wa.me'),
        contactContext: action?.textContent?.includes('WhatsApp se abrirá para que puedas enviar tu consulta.') ?? false,
        canonical,
        whatsappUsesCanonical: whatsapp?.searchParams.get('text')?.includes(canonical) ?? false,
        minimumTarget: Math.min(...controls.map(control => {
          const rect = control.getBoundingClientRect();
          return Math.min(rect.width, rect.height);
        })),
      };
    })()`);

    assert(!result.overflow && result.ordered, `${width}px order/reflow failed`);
    assert(result.colorScheme === "light" && !result.darkClass, `${width}px light-only contract failed: ${JSON.stringify({ colorScheme: result.colorScheme, darkClass: result.darkClass })}`);
    assert(result.galleryName === `Imágenes de ${product.name}`, `${width}px gallery accessible name failed`);
    assert(result.contact && result.contactSafe && result.contactContext && result.whatsappUsesCanonical, `${width}px WhatsApp safety/context failed`);
    assert(result.canonical === `${expectedPublicOrigin}/products/${product.slug}`, `${width}px canonical URL failed`);
    assert(result.minimumTarget >= 44, `${width}px action target is below 44px: ${result.minimumTarget}`);

    await evaluate(`(() => { const button = document.querySelector('[data-product-share]'); button.focus(); button.click(); })()`);
    await waitFor(`Boolean(document.querySelector('[aria-label="Enlace canónico de ${product.name.replaceAll('"', '\\"')}"]'))`, `${width}px Share fallback did not render`);
    const fallback = await evaluate(`(() => ({
      focused: document.activeElement?.hasAttribute('data-product-share') ?? false,
      manual: document.querySelector('[aria-label^="Enlace canónico de "]')?.href ?? '',
      status: document.querySelector('[role="status"]')?.textContent?.trim() ?? '',
    }))()`);
    assert(fallback.focused && fallback.manual === result.canonical && fallback.status === "", `${width}px neutral Share fallback/focus failed`);

    const axTree = await send("Accessibility.getFullAXTree");
    const axNames = axTree.nodes.map((node) => node.name?.value).filter(Boolean);
    assert(
      axNames.includes(product.name)
        && axNames.includes(`Imágenes de ${product.name}`)
        && axNames.includes("¿Quieres más información?")
        && axNames.includes("Compartir producto")
        && axNames.includes(`Enlace canónico de ${product.name}`),
      `${width}px accessibility tree failed`,
    );

    results.push({ width, overflow: result.overflow, minimumTarget: result.minimumTarget, accessibilityTree: true });
  }

  await send("Emulation.setDeviceMetricsOverride", { width: 720, height: 450, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: `${baseUrl}/products/${product.slug}` });
  await waitFor(`Boolean(document.querySelector('[data-product-share]'))`, "Product Detail did not load at the 200% effective viewport");
  const zoomOverflow = await evaluate(`document.documentElement.scrollWidth > document.documentElement.clientWidth`);
  assert(!zoomOverflow, "Product Detail overflows at the 200% effective viewport");

  socket.close();
  console.log(JSON.stringify({ product: product.slug, results, zoom200Overflow: zoomOverflow }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
