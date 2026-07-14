const WebSocket = require("ws");

const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
const chromeUrl = process.env.CHROME_URL ?? "http://localhost:9222";
const viewports = [
  { width: 320, columns: 2 },
  { width: 640, columns: 3 },
  { width: 1024, columns: 4 },
  { width: 1400, columns: 6 },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  const targets = await fetch(`${chromeUrl}/json`).then((response) => response.json());
  const target = targets.find((candidate) => candidate.type === "page");
  assert(target, `No Chrome page target is available at ${chromeUrl}`);
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
    for (let attempt = 0; attempt < 80; attempt += 1) {
      if (await evaluate(expression)) return;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    const state = await evaluate(`({ title: document.title, body: document.body?.innerText?.slice(0, 600) ?? '' })`);
    throw new Error(`${message}: ${JSON.stringify(state)}`);
  };

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Accessibility.enable");
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "dark" }, { name: "prefers-reduced-motion", value: "reduce" }] });
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `
    window.__qaCLS = 0;
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__qaCLS += entry.value;
      }).observe({ type: 'layout-shift', buffered: true });
    } catch {}
  ` });

  const results = [];
  for (const viewport of viewports) {
    await send("Emulation.clearDeviceMetricsOverride");
    await send("Emulation.setDeviceMetricsOverride", { width: viewport.width, height: 900, deviceScaleFactor: 1, mobile: false });
    await send("Page.navigate", { url: `${baseUrl}/` });
    await waitFor(`Boolean(document.querySelector('#categorias ul') && document.querySelector('#destacados ul') && document.querySelector('#seleccion-categoria ul'))`, `${viewport.width}px Homepage merchandising did not load`);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const result = await evaluate(`(() => {
      const ids = ['categorias', 'destacados', 'medios-de-pago', 'seleccion-categoria', 'contacto'];
      const carousel = document.querySelector('main > section[aria-label="Contenido destacado"]');
      const nodes = [carousel, ...ids.map(id => document.getElementById(id))];
      const gridInfo = id => {
        const list = document.querySelector('#' + id + ' ul');
        return list ? {
          columns: getComputedStyle(list).gridTemplateColumns.split(' ').filter(Boolean).length,
          items: list.children.length,
          tag: list.tagName,
          directItems: [...list.children].every(child => child.tagName === 'LI'),
        } : null;
      };
      const wideContainers = ids.map(id => document.getElementById(id)?.querySelector('[class*="max-w-[1400px]"]')).filter(Boolean);
      const carouselButtons = [...(carousel?.querySelectorAll('button') ?? [])];
      const targets = [...document.querySelectorAll('main a,main button,main input,main summary')].filter(node => node.offsetParent !== null && !node.disabled).map(node => node.getBoundingClientRect());
      return {
        title: document.title,
        viewport: {
          innerWidth: window.innerWidth,
          clientWidth: document.documentElement.clientWidth,
          sm: matchMedia('(min-width: 640px)').matches,
          lg: matchMedia('(min-width: 1024px)').matches,
          wide: matchMedia('(min-width: 1400px)').matches,
        },
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        overflowing: [...document.querySelectorAll('body *')].map(node => {
          const rect = node.getBoundingClientRect();
          return { node, rect };
        }).filter(({ rect }) => rect.left < -1 || rect.right > document.documentElement.clientWidth + 1)
          .slice(0, 8)
          .map(({ node, rect }) => ({
            tag: node.tagName,
            id: node.id,
            className: typeof node.className === 'string' ? node.className.slice(0, 160) : '',
            left: rect.left,
            right: rect.right,
            width: rect.width,
          })),
        order: nodes.map(node => node ? (node.id || node.getAttribute('aria-label')) : null),
        ordered: nodes.every(Boolean) && nodes.every((node, index) => index === 0 || Boolean(nodes[index - 1].compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING)),
        carousel: carousel ? {
          left: carousel.getBoundingClientRect().left,
          right: carousel.getBoundingClientRect().right,
          width: carousel.getBoundingClientRect().width,
          controls: carouselButtons.map(node => node.getAttribute('aria-label')),
          minimumTarget: Math.min(...carouselButtons.map(node => Math.min(node.getBoundingClientRect().width, node.getBoundingClientRect().height))),
          transition: getComputedStyle(carousel.querySelector(':scope > div')).transitionDuration,
          current: carousel.querySelector('button[aria-current="true"]')?.getAttribute('aria-label'),
        } : null,
        categories: gridInfo('categorias'),
        featured: gridInfo('destacados'),
        selected: gridInfo('seleccion-categoria'),
        wide: wideContainers.map(node => ({ width: node.getBoundingClientRect().width, maxWidth: getComputedStyle(node).maxWidth })),
        payment: [...(document.querySelector('#medios-de-pago ul')?.children ?? [])].map(node => node.textContent?.trim()),
        paymentActions: document.querySelectorAll('#medios-de-pago a, #medios-de-pago button, #medios-de-pago input').length,
        contactAfterSelection: Boolean(document.getElementById('seleccion-categoria')?.compareDocumentPosition(document.getElementById('contacto')) & Node.DOCUMENT_POSITION_FOLLOWING),
        colorScheme: getComputedStyle(document.documentElement).colorScheme,
        darkClass: document.documentElement.classList.contains('dark'),
        minimumTarget: Math.min(...targets.map(rect => Math.min(rect.width, rect.height))),
        cls: window.__qaCLS ?? 0,
        navMs: performance.getEntriesByType('navigation')[0]?.duration ?? 0,
        selectedTitle: document.querySelector('#seleccion-categoria h2')?.textContent?.trim() ?? '',
        selectedProductLinks: [...document.querySelectorAll('#seleccion-categoria ul a')].map(node => node.getAttribute('href')),
        selectedContinuationLinks: [...document.querySelectorAll('#seleccion-categoria a')]
          .filter(node => node.closest('ul') === null)
          .map(node => node.getAttribute('href')),
        jsonLdCount: document.querySelectorAll('script[type="application/ld+json"]').length,
      };
    })()`);

    assert(result.title.includes("Mandoquita") && !result.title.includes("500"), `${viewport.width}px rendered an error`);
    assert(!result.overflow && result.ordered, `${viewport.width}px section order or page reflow failed: ${JSON.stringify({ order: result.order, overflow: result.overflow, overflowing: result.overflowing })}`);
    assert(result.order.join("|") === "Contenido destacado|categorias|destacados|medios-de-pago|seleccion-categoria|contacto", `${viewport.width}px canonical section order failed`);
    for (const grid of [result.categories, result.featured, result.selected]) {
      assert(grid?.columns === viewport.columns && grid.tag === "UL" && grid.directItems, `${viewport.width}px CollectionGrid density/semantics failed: ${JSON.stringify({ grid, cssViewport: result.viewport })}`);
    }
    assert(result.categories.items >= 7 && result.featured.items === (viewport.width >= 1280 ? 8 : 4), `${viewport.width}px Category/Featured membership failed`);
    assert(result.selected.items > 0 && result.selected.items <= 6 && result.selectedTitle.startsWith("Productos de "), `${viewport.width}px selected Category projection failed`);
    assert(result.wide.length === 5 && result.wide.every((entry) => entry.maxWidth === "1400px" && entry.width <= Math.min(1400, viewport.width)), `${viewport.width}px wide Container boundary failed`);
    assert(
      result.carousel?.left === 0
        && Math.abs(result.carousel.right - result.viewport.clientWidth) < 1
        && Math.abs(result.carousel.width - result.viewport.clientWidth) < 1,
      `${viewport.width}px Carousel is not full-width: ${JSON.stringify({ carousel: result.carousel, cssViewport: result.viewport })}`,
    );
    assert(result.carousel.minimumTarget >= 44 && result.carousel.controls.includes("Diapositiva anterior") && result.carousel.controls.includes("Diapositiva siguiente"), `${viewport.width}px Carousel controls failed`);
    assert(Number.parseFloat(result.carousel.transition) <= 0.00001, `${viewport.width}px reduced-motion transition remains active: ${result.carousel.transition}`);
    assert(result.payment.join("|") === "Binance|Pago móvil|Dólares en efectivo" && result.paymentActions === 0, `${viewport.width}px Payment Banner meaning changed`);
    assert(result.contactAfterSelection && result.colorScheme === "light" && !result.darkClass, `${viewport.width}px contact hierarchy or light-only contract failed: ${JSON.stringify({ contactAfterSelection: result.contactAfterSelection, colorScheme: result.colorScheme, darkClass: result.darkClass })}`);
    assert(result.minimumTarget >= 44 && result.cls <= 0.01, `${viewport.width}px target or CLS failed: target=${result.minimumTarget}, CLS=${result.cls}`);
    assert(
      result.selectedProductLinks.length === result.selected.items
        && result.selectedProductLinks.every((href) => href?.startsWith("/products/"))
        && result.selectedContinuationLinks.length === 1
        && result.selectedContinuationLinks[0]?.startsWith("/categorias/")
        && result.jsonLdCount === 1,
      `${viewport.width}px canonical Product/Category continuation or metadata failed`,
    );

    const axTree = await send("Accessibility.getFullAXTree");
    const axNames = axTree.nodes.map((node) => node.name?.value).filter(Boolean);
    assert(axNames.includes("Contenido destacado") && axNames.includes("Categorías") && axNames.includes("Productos destacados") && axNames.includes(result.selectedTitle), `${viewport.width}px accessibility tree hierarchy failed`);

    let zoom200Overflow = null;
    if (viewport.width === 1400) {
      const before = result.carousel.current;
      await new Promise((resolve) => setTimeout(resolve, 6200));
      const after = await evaluate(`document.querySelector('button[aria-current="true"]')?.getAttribute('aria-label')`);
      assert(after === before, "Carousel autoplay advanced under reduced motion");
      await send("Emulation.clearDeviceMetricsOverride");
      await send("Emulation.setDeviceMetricsOverride", { width: 700, height: 450, deviceScaleFactor: 1, mobile: false });
      await send("Page.navigate", { url: `${baseUrl}/` });
      await waitFor(`Boolean(document.querySelector('#categorias ul') && document.querySelector('#destacados ul') && document.querySelector('#seleccion-categoria ul'))`, "Homepage did not reflow at the 200% effective viewport");
      await waitFor(`getComputedStyle(document.querySelector('#categorias ul')).gridTemplateColumns.split(' ').filter(Boolean).length === 3`, "Homepage styles did not settle at the 200% effective viewport");
      zoom200Overflow = await evaluate(`document.documentElement.scrollWidth > document.documentElement.clientWidth`);
      const zoom200Columns = await evaluate(`getComputedStyle(document.querySelector('#categorias ul')).gridTemplateColumns.split(' ').filter(Boolean).length`);
      assert(!zoom200Overflow && zoom200Columns === 3, `Homepage 200% reflow failed: overflow=${zoom200Overflow}, columns=${zoom200Columns}`);
    }
    results.push({ width: viewport.width, expectedColumns: viewport.columns, ...result, accessibilityTree: true, zoom200Overflow });
  }
  assert(new Set(results.map((result) => result.selectedTitle)).size === 1, "Selected Category changed across repeated SSR navigations for the same Bogotá day");
  assert(new Set(results.map((result) => JSON.stringify(result.selectedProductLinks))).size === 1, "Selected Product membership changed across SSR/hydration or viewport navigations");
  socket.close();
  console.log(JSON.stringify(results.map((result) => ({
    width: result.width,
    columns: result.expectedColumns,
    ordered: result.ordered,
    overflow: result.overflow,
    accessibilityTree: result.accessibilityTree,
    minimumTarget: result.minimumTarget,
    cls: result.cls,
    navMs: Math.round(result.navMs),
    zoom200Overflow: result.zoom200Overflow,
  })), null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
