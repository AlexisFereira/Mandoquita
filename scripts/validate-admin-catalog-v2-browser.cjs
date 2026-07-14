const WebSocket = require("ws");

const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
const widths = [320, 768, 1440];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const fixtures = {
  session: {
    authorized: true,
    idleExpiresAt: "2026-07-13T20:00:00.000Z",
    absoluteExpiresAt: "2026-07-14T02:00:00.000Z",
    csrfToken: "browser-csrf-v2",
    account: { id: "super-1", username: "superadmin", role: "SUPER_ADMIN", mustChangePassword: false },
  },
  product: {
    id: 1, slug: "reloj-clasico", name: "Reloj clásico", price: "100.00", currency: "USD",
    active: true, editorialApproved: true, published: true, commerciallyAvailable: true,
    featured: false, featuredOrder: null, productType: null, subcategory: null, category: null,
    retiredAt: null, baseVariant: { id: "base-1", sku: "RELOJ-BASE", active: true },
    updatedAt: "2026-07-13T18:00:00.000Z",
  },
  category: {
    id: "cat-audio", slug: "audio", name: "Audio", description: "Audio personal",
    sortOrder: 1, active: true, visible: true, retiredAt: null, image: null,
    dependencies: { subcategories: 2, productTypes: 4, products: 9 },
    createdAt: "2026-07-13T17:00:00.000Z", updatedAt: "2026-07-13T18:00:00.000Z",
  },
  accounts: [
    { id: "super-1", username: "superadmin", role: "SUPER_ADMIN", enabled: true, mustChangePassword: false, lastLoginAt: null, createdAt: "2026-07-13T17:00:00.000Z", updatedAt: "2026-07-13T18:00:00.000Z" },
    { id: "admin-1", username: "catalogo", role: "ADMIN", enabled: true, mustChangePassword: false, lastLoginAt: null, createdAt: "2026-07-13T17:00:00.000Z", updatedAt: "2026-07-13T18:00:00.000Z" },
  ],
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
    for (let attempt = 0; attempt < 50; attempt += 1) {
      if (await evaluate(expression)) return;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    const state = await evaluate(`({ url: location.href, body: document.body?.innerText?.slice(0, 500) ?? '' })`);
    throw new Error(`${message}: ${JSON.stringify(state)}`);
  };

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Accessibility.enable");
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "dark" }, { name: "prefers-reduced-motion", value: "reduce" }] });
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `
    (() => {
      const fixtures = ${JSON.stringify(fixtures)};
      const response = (body, status = 200) => Promise.resolve(new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }));
      window.fetch = (input) => {
        const url = String(input);
        if (url === "/api/admin/session") return location.search.includes("gate") ? response({ error: "Unauthorized" }, 401) : response(fixtures.session);
        if (url.startsWith("/api/admin/products?")) return response({ items: [fixtures.product], metadata: { page: 1, limit: 20, totalItems: 1, totalPages: 1 }, filters: {} });
        if (url.startsWith("/api/admin/categories?")) return response({ items: [fixtures.category], metadata: { page: 1, limit: 20, totalItems: 1, totalPages: 1 }, filters: { q: null, retired: false } });
        if (url === "/api/admin/accounts") return response({ items: fixtures.accounts });
        return response({ error: "Unexpected browser QA request" }, 404);
      };
    })();
  ` });

  const results = [];
  for (const width of widths) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: width === 320 ? 800 : 900, deviceScaleFactor: 1, mobile: width < 768 });

    await send("Page.navigate", { url: `${baseUrl}/admin?qa=gate` });
    await waitFor(`Boolean(document.querySelector('input[autocomplete="username"]') && document.querySelector('input[autocomplete="current-password"]'))`, `${width}px named access gate did not load`);
    const gate = await evaluate(`(() => {
      const username = document.querySelector('input[autocomplete="username"]');
      const password = document.querySelector('input[autocomplete="current-password"]');
      const buttons = [...document.querySelectorAll('button')].filter(node => node.offsetParent !== null);
      return {
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        heading: document.querySelector('h1')?.textContent?.trim() ?? '',
        usernameLabel: document.querySelector('label[for="admin-username"]')?.textContent?.trim() ?? '',
        passwordLabel: document.querySelector('label[for="admin-password"]')?.textContent?.trim() ?? '',
        passwordType: password?.type,
        noSelfRecovery: document.body.textContent.includes('Solicita al Superadministrador') && !document.body.textContent.toLowerCase().includes('recuperar contraseña'),
        minimumTarget: Math.min(...buttons.map(node => Math.min(node.getBoundingClientRect().width, node.getBoundingClientRect().height))),
      };
    })()`);
    assert(!gate.overflow && gate.heading === "Acceso administrativo", `${width}px access gate reflow/context failed`);
    assert(gate.usernameLabel === "Usuario" && gate.passwordLabel === "Contraseña" && gate.passwordType === "password", `${width}px named credential semantics failed`);
    assert(gate.noSelfRecovery && gate.minimumTarget >= 44, `${width}px access/no-recovery contract failed: ${JSON.stringify(gate)}`);

    await send("Page.navigate", { url: `${baseUrl}/admin?qa=authorized` });
    await waitFor(`Boolean(document.querySelector('div[aria-label="Tabla de productos"] table'))`, `${width}px Product table did not load`);
    const inspectTable = async (label) => evaluate(`(() => {
      const region = document.querySelector('div[aria-label="${label}"]');
      const table = region?.querySelector('table');
      const actions = [...(region?.querySelectorAll('button') ?? [])].filter(node => !node.disabled);
      return {
        pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        documentWidth: [document.documentElement.clientWidth, document.documentElement.scrollWidth],
        bodyWidth: [document.body.clientWidth, document.body.scrollWidth],
        regionWidth: region ? [region.clientWidth, region.scrollWidth, region.getBoundingClientRect().left, region.getBoundingClientRect().right] : [],
        mainWidth: (() => { const rect = document.querySelector('main')?.getBoundingClientRect(); return rect ? [rect.left, rect.right, rect.width] : []; })(),
        outerOffenders: [...document.querySelectorAll('body *')].filter(node => !region?.contains(node)).map(node => ({ node, rect: node.getBoundingClientRect() })).filter(({ rect }) => rect.right > document.documentElement.clientWidth || rect.left < 0).slice(0, 8).map(({ node, rect }) => ({ tag: node.tagName, className: String(node.className).slice(0, 100), text: node.textContent?.trim().slice(0, 60), rect: [rect.left, rect.right, rect.width] })),
        regionOverflow: region ? region.scrollWidth > region.clientWidth : false,
        tabIndex: region?.tabIndex,
        caption: table?.querySelector('caption')?.textContent?.trim() ?? '',
        columnHeaders: table?.querySelectorAll('th[scope="col"]').length ?? 0,
        rowHeaders: table?.querySelectorAll('th[scope="row"]').length ?? 0,
        tableCount: document.querySelectorAll('main table').length,
        minimumTarget: actions.length ? Math.min(...actions.map(node => Math.min(node.getBoundingClientRect().width, node.getBoundingClientRect().height))) : 44,
      };
    })()`);
    const product = await inspectTable("Tabla de productos");
    assert(!product.pageOverflow && product.tabIndex === 0 && product.columnHeaders === 7 && product.rowHeaders === 1 && product.tableCount === 1, `${width}px Product table semantics/reflow failed: ${JSON.stringify(product)}`);
    assert(product.minimumTarget >= 44, `${width}px Product table has a target below 44px`);
    if (width === 320) assert(product.regionOverflow, "320px Product overflow is not contained in its named region");

    const axTree = await send("Accessibility.getFullAXTree");
    const axNames = axTree.nodes.map((node) => node.name?.value).filter(Boolean);
    assert(axNames.some((name) => String(name).includes("Productos vigentes")) && axNames.includes("Editar Reloj clásico"), `${width}px Product accessibility tree is incomplete`);

    await evaluate(`([...document.querySelectorAll('button')].find(node => node.textContent?.trim() === 'Categorías')).click()`);
    await waitFor(`Boolean(document.querySelector('div[aria-label="Tabla de categorías"] table'))`, `${width}px Category table did not load`);
    const category = await inspectTable("Tabla de categorías");
    assert(!category.pageOverflow && category.tabIndex === 0 && category.columnHeaders === 6 && category.rowHeaders === 1 && category.tableCount === 1, `${width}px Category table semantics/reflow failed`);
    assert(category.minimumTarget >= 44, `${width}px Category table has a target below 44px`);

    await evaluate(`([...document.querySelectorAll('button')].find(node => node.textContent?.trim() === 'Cuentas de administradores')).click()`);
    await waitFor(`document.body.innerText.includes('Cuenta protegida')`, `${width}px Account table did not load or protect the Superadministrator`);
    const accounts = await inspectTable("Tabla de cuentas de administradores");
    const accountState = await evaluate(`({
      protectedRole: document.body.innerText.includes('Superadministrador') && document.body.innerText.includes('Cuenta protegida'),
      selfAction: [...document.querySelectorAll('button')].some(node => node.textContent?.includes('superadmin')),
      adminActions: ['Restablecer contraseña de catalogo', 'Desactivar acceso de catalogo'].every(name => [...document.querySelectorAll('button')].some(node => node.textContent?.trim() === name)),
      colorScheme: getComputedStyle(document.documentElement).colorScheme,
      darkClass: document.documentElement.classList.contains('dark'),
    })`);
    assert(!accounts.pageOverflow && accounts.tabIndex === 0 && accounts.columnHeaders === 5 && accounts.rowHeaders === 2 && accounts.tableCount === 1, `${width}px Account table semantics/reflow failed`);
    assert(accounts.minimumTarget >= 44 && accountState.protectedRole && !accountState.selfAction && accountState.adminActions, `${width}px Account protection/actions failed`);
    assert(accountState.colorScheme === "light" && !accountState.darkClass, `${width}px light-only contract failed`);

    let zoom200Overflow = null;
    if (width === 1440) {
      zoom200Overflow = await evaluate(`(async () => {
        document.documentElement.style.zoom = '2';
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;
        document.documentElement.style.zoom = '';
        return overflow;
      })()`);
      assert(!zoom200Overflow, "Admin V2 page overflows at 200% zoom");
    }
    results.push({ width, gate, product, category, accounts, accountState, accessibilityTree: true, zoom200Overflow });
  }
  socket.close();
  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
