const WebSocket = require("ws");

const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
const viewports = [320, 768, 1440];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  const targets = await fetch("http://localhost:9222/json").then((response) => response.json());
  const target = targets.find((candidate) => candidate.type === "page");
  assert(target, "No Chrome page target is available on port 9222");

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  let commandId = 0;
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
    commandId += 1;
    socket.send(JSON.stringify({ id: commandId, method, params }));
    return new Promise((resolve, reject) => pending.set(commandId, { resolve, reject }));
  };
  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    return result.result.value;
  };
  const navigate = async () => {
    await send("Page.navigate", { url: baseUrl });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await evaluate("document.fonts.ready.then(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))))");
  };

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `window.__qaLayoutShifts = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__qaLayoutShifts += entry.value;
      }).observe({ type: 'layout-shift', buffered: true });`,
  });

  const results = [];
  for (const width of viewports) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: width === 320 ? 800 : 900,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    await send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
    });
    await send("Emulation.setScriptExecutionDisabled", { value: false });
    await navigate();

    const before = await evaluate(`(() => {
      const nodes = [...document.querySelectorAll('.scroll-entry-motion')];
      return {
        title: document.title,
        token: getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim(),
        count: nodes.length,
        states: nodes.map(n => n.dataset.motionState),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        cls: window.__qaLayoutShifts || 0,
        navigationMs: performance.getEntriesByType('navigation')[0]?.duration || 0,
        geometry: nodes.map(n => ({ top: n.offsetTop, width: n.offsetWidth, height: n.offsetHeight })),
      };
    })()`);
    assert(before.title && !before.title.includes("500"), `${width}px rendered an error page`);
    assert(before.token, `${width}px did not load Design System CSS`);
    assert(before.count > 0 && before.count <= 50, `${width}px observed ${before.count} motion nodes`);
    assert(!before.overflow, `${width}px has horizontal overflow`);
    assert(before.navigationMs < 2000, `${width}px navigation took ${before.navigationMs}ms`);

    await evaluate(`(() => {
      const node = [...document.querySelectorAll('.scroll-entry-motion')]
        .find(candidate => candidate.dataset.motionState === 'prepared');
      if (node) {
        node.dataset.qaMotionSelected = 'true';
        node.scrollIntoView({ block: 'center' });
      }
    })()`);
    await evaluate(`new Promise((resolve) => {
      const deadline = performance.now() + 2000;
      const check = () => {
        const selected = document.querySelector('[data-qa-motion-selected="true"]');
        if (!selected || selected.dataset.motionState === 'final' || performance.now() >= deadline) {
          resolve(selected?.dataset.motionState ?? null);
          return;
        }
        requestAnimationFrame(check);
      };
      check();
    })`);
    const after = await evaluate(`(() => {
      const nodes = [...document.querySelectorAll('.scroll-entry-motion')];
      return {
        states: nodes.map(n => n.dataset.motionState),
        selectedState: document.querySelector('[data-qa-motion-selected="true"]')?.dataset.motionState ?? null,
        cls: window.__qaLayoutShifts || 0,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        geometry: nodes.map(n => ({ top: n.offsetTop, width: n.offsetWidth, height: n.offsetHeight })),
        styles: nodes.map(n => {
          const style = getComputedStyle(n);
          return { duration: style.transitionDuration, property: style.transitionProperty, pointerEvents: style.pointerEvents };
        }),
      };
    })()`);
    assert(after.selectedState === null || after.selectedState === "final", `${width}px selected motion did not complete`);
    assert(JSON.stringify(before.geometry) === JSON.stringify(after.geometry), `${width}px motion changed layout geometry`);
    assert(after.cls === 0, `${width}px motion caused CLS ${after.cls}`);
    assert(!after.overflow, `${width}px motion caused horizontal overflow`);
    assert(after.styles.every(({ pointerEvents }) => pointerEvents !== "none"), `${width}px motion blocked pointer interaction`);

    await evaluate("scrollTo(0, 0)");
    await new Promise((resolve) => setTimeout(resolve, 100));
    await evaluate("scrollTo(0, document.documentElement.scrollHeight)");
    await new Promise((resolve) => setTimeout(resolve, 300));
    const replay = await evaluate(`({
      selectedState: document.querySelector('[data-qa-motion-selected="true"]')?.dataset.motionState ?? null,
      states: [...document.querySelectorAll('.scroll-entry-motion')].map(n => n.dataset.motionState)
    })`);
    assert(replay.selectedState === null || replay.selectedState === "final", `${width}px replayed motion after reveal`);

    results.push({ width, ...before, finalStates: replay.states, finalCls: after.cls });
  }

  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await navigate();
  const reduced = await evaluate(`[...document.querySelectorAll('.scroll-entry-motion')].map(node => {
    const style = getComputedStyle(node);
    return { state: node.dataset.motionState, opacity: style.opacity, transform: style.transform,
      duration: style.transitionDuration, willChange: style.willChange };
  })`);
  assert(reduced.length > 0, "Reduced-motion page has no eligible nodes");
  assert(reduced.every(({ state, opacity, transform, duration }) =>
    state === "final" && opacity === "1" && transform === "none" && Number.parseFloat(duration) <= 0.001
  ), `Reduced motion did not resolve every node immediately: ${JSON.stringify(reduced)}`);

  await send("Emulation.setScriptExecutionDisabled", { value: true });
  await send("Page.navigate", { url: baseUrl });
  await new Promise((resolve) => setTimeout(resolve, 600));
  const noScript = await evaluate(`[...document.querySelectorAll('.scroll-entry-motion')].map(node => ({
    state: node.dataset.motionState, opacity: getComputedStyle(node).opacity,
    transform: getComputedStyle(node).transform
  }))`);
  assert(noScript.length > 0, "No-script page has no server-rendered motion nodes");
  assert(noScript.every(({ state, opacity, transform }) => state === "final" && opacity === "1" && transform === "none"),
    "No-script content was hidden");

  socket.close();
  console.log(JSON.stringify({ viewports: results, reducedMotion: reduced, noScript }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
