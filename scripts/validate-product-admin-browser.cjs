const WebSocket = require("ws");

const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
const widths = [320, 768, 1440];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

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
    return response.result.value;
  };
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-color-scheme", value: "dark" }],
  });

  const results = [];
  for (const width of widths) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: width === 320 ? 800 : 900,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    await send("Page.navigate", { url: `${baseUrl}/admin` });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const result = await evaluate(`(() => {
      const input = document.querySelector('input[type="password"]');
      const button = [...document.querySelectorAll('button')].find(node => node.textContent?.trim() === 'Ingresar');
      input?.focus();
      const inputRect = input?.getBoundingClientRect();
      const buttonRect = button?.getBoundingClientRect();
      return {
        title: document.title,
        robots: document.querySelector('meta[name="robots"]')?.content ?? '',
        token: getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim(),
        colorScheme: getComputedStyle(document.documentElement).colorScheme,
        darkClass: document.documentElement.classList.contains('dark'),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        hasPublicHeader: Boolean(document.querySelector('header.site-header')),
        hasPublicFooter: Boolean(document.querySelector('footer')),
        hasPublicNavigation: Boolean(document.querySelector('nav[aria-label="Navegación principal"]')),
        heading: document.querySelector('h1')?.textContent?.trim() ?? '',
        label: document.querySelector('label[for="admin-code"]')?.textContent?.trim() ?? '',
        input: input ? { type: input.type, inputMode: input.inputMode, autocomplete: input.autocomplete,
          width: inputRect.width, height: inputRect.height, focused: document.activeElement === input } : null,
        button: button ? { width: buttonRect.width, height: buttonRect.height } : null,
        navMs: performance.getEntriesByType('navigation')[0]?.duration ?? 0,
      };
    })()`);
    assert(result.title && !result.title.includes("500"), `${width}px rendered an error`);
    assert(result.robots.includes("noindex") && result.robots.includes("nofollow"), `${width}px lacks noindex/nofollow`);
    assert(result.token && result.colorScheme === "light" && !result.darkClass, `${width}px violates light-only contract`);
    assert(!result.overflow, `${width}px has horizontal overflow`);
    assert(!result.hasPublicHeader && !result.hasPublicFooter && !result.hasPublicNavigation, `${width}px composed public navigation`);
    assert(result.heading === "Acceso administrativo" && result.label === "Código de acceso", `${width}px lacks semantic gate labels`);
    assert(result.input?.type === "password" && result.input.inputMode === "numeric" && result.input.focused, `${width}px code input semantics/focus failed`);
    assert(result.input.height >= 44 && result.button?.height >= 44, `${width}px has a target below 44px`);
    assert(result.navMs < 2000, `${width}px navigation exceeded 2s`);
    results.push({ width, ...result });
  }
  socket.close();
  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
