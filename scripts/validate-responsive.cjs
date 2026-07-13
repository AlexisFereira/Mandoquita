const WebSocket = require("ws");
const { existsSync, mkdirSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");
const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
const baselineDirectory = join(process.cwd(), "tests", "visual", "responsive");
const updateBaselines = process.env.UPDATE_VISUAL_BASELINES === "1";

const viewports = [
  { name: "mobile-320", width: 320, height: 800 },
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "tablet-portrait", width: 768, height: 1024 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "desktop-1280", width: 1280, height: 900 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1920", width: 1920, height: 1080 },
];

async function getPageTarget() {
  const targets = await fetch("http://localhost:9222/json").then((response) =>
    response.json(),
  );
  const target = targets.find((candidate) => candidate.type === "page");

  if (!target) {
    throw new Error("No Chrome page target is available on port 9222.");
  }

  return target;
}

async function validate() {
  mkdirSync(baselineDirectory, { recursive: true });
  const target = await getPageTarget();
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  let commandId = 0;
  const pending = new Map();

  socket.on("message", (rawMessage) => {
    const message = JSON.parse(rawMessage.toString());
    const request = pending.get(message.id);

    if (!request) return;
    pending.delete(message.id);
    message.error ? request.reject(message.error) : request.resolve(message.result);
  });

  await new Promise((resolve, reject) => {
    socket.once("open", resolve);
    socket.once("error", reject);
  });

  function send(method, params = {}) {
    commandId += 1;
    socket.send(JSON.stringify({ id: commandId, method, params }));

    return new Promise((resolve, reject) => {
      pending.set(commandId, { resolve, reject });
    });
  }

  const results = [];

  for (const viewport of viewports) {
    await send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.width < 768,
    });
    await send("Page.navigate", { url: baseUrl });
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const evaluation = await send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const root = document.documentElement;
        const header = document.querySelector('header');
        const anchors = ['destacados', 'categorias', 'contacto'].map((id) => {
          const element = document.getElementById(id);
          return { id, exists: Boolean(element), scrollMarginTop: element ? getComputedStyle(element).scrollMarginTop : null };
        });
        const measureCards = (selector) => {
          const cards = Array.from(document.querySelectorAll(selector));
          const rects = cards.map((card) => card.getBoundingClientRect());
          const firstTop = rects[0]?.top;
          return {
            count: cards.length,
            firstRowCount: rects.filter((rect) => Math.abs(rect.top - firstTop) < 2).length,
            firstCardWidth: rects[0]?.width ?? null,
            parentWidth: cards[0]?.parentElement?.getBoundingClientRect().width ?? null,
            parentClass: cards[0]?.parentElement?.className ?? null,
            parentDisplay: cards[0] ? getComputedStyle(cards[0].parentElement).display : null,
            gridTemplateColumns: cards[0] ? getComputedStyle(cards[0].parentElement).gridTemplateColumns : null,
          };
        };
        const measureBox = (selector) => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const computed = getComputedStyle(element);
          return {
            paddingTop: parseFloat(computed.paddingTop),
            paddingRight: parseFloat(computed.paddingRight),
            paddingBottom: parseFloat(computed.paddingBottom),
            paddingLeft: parseFloat(computed.paddingLeft),
            rowGap: parseFloat(computed.rowGap) || 0,
            columnGap: parseFloat(computed.columnGap) || 0,
            minHeight: parseFloat(computed.minHeight) || 0,
            height: element.getBoundingClientRect().height,
          };
        };
        return {
          navigationDurationMs: performance.getEntriesByType('navigation')[0]?.duration ?? null,
          cumulativeLayoutShift: performance.getEntriesByType('layout-shift')
            .filter((entry) => !entry.hadRecentInput)
            .reduce((total, entry) => total + entry.value, 0),
          clientWidth: root.clientWidth,
          scrollWidth: root.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
          overflow: root.scrollWidth > root.clientWidth || document.body.scrollWidth > root.clientWidth,
          headerPosition: header ? getComputedStyle(header).position : null,
          headerTop: header ? getComputedStyle(header).top : null,
          anchors,
          featuredCount: document.querySelectorAll('#destacados a[aria-label^="Ver detalles de"]').length,
          productCards: measureCards('#destacados article'),
          categoryCards: measureCards('#categorias > div > div:last-child > a'),
          spacing: {
            sectionContainer: measureBox('#destacados > div'),
            productGrid: measureBox('#destacados .product-card-grid'),
            productContent: measureBox('#destacados article a > div:last-child'),
            categoryCard: measureBox('#categorias .category-card-grid > a'),
            primaryButton: measureBox('a[data-variant="primary"]'),
            headerContainer: measureBox('header > div'),
            footer: measureBox('footer'),
          },
        };
      })()`,
    });

    const screenshot = await send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });
    const baselinePath = join(baselineDirectory, `${viewport.name}.png`);
    if (updateBaselines) {
      writeFileSync(baselinePath, Buffer.from(screenshot.data, "base64"));
    }

    results.push({
      viewport,
      baselinePath,
      baselineExists: existsSync(baselinePath),
      ...evaluation.result.value,
    });
  }

  socket.close();
  console.log(JSON.stringify(results, null, 2));

  if (
    results.some(
      (result) =>
        !result.baselineExists ||
        result.navigationDurationMs === null ||
        result.navigationDurationMs >= 2000 ||
        result.cumulativeLayoutShift > 0.1 ||
        result.overflow ||
        result.headerPosition !== "sticky" ||
        result.headerTop !== "0px" ||
        result.featuredCount > (result.viewport.width >= 1280 ? 8 : 4) ||
        result.productCards.firstRowCount !==
          (result.viewport.width >= 1280 ? Math.min(4, result.productCards.count) :
            result.viewport.width >= 640 ? Math.min(2, result.productCards.count) :
            Math.min(1, result.productCards.count)) ||
        result.categoryCards.firstRowCount !==
          (result.viewport.width >= 1024 ? Math.min(3, result.categoryCards.count) :
            result.viewport.width >= 640 ? Math.min(2, result.categoryCards.count) :
            Math.min(1, result.categoryCards.count)) ||
        result.spacing.sectionContainer.paddingLeft !== 24 ||
        result.spacing.sectionContainer.paddingRight !== 24 ||
        result.spacing.productGrid.rowGap !== 24 ||
        result.spacing.productGrid.columnGap !== 24 ||
        result.spacing.productContent.paddingLeft !== 20 ||
        result.spacing.productContent.paddingRight !== 20 ||
        result.spacing.categoryCard.paddingLeft !== 24 ||
        result.spacing.categoryCard.paddingRight !== 24 ||
        result.spacing.primaryButton.height < 44 ||
        result.spacing.headerContainer.paddingLeft !== 24 ||
        result.spacing.headerContainer.paddingRight !== 24 ||
        result.spacing.footer.paddingTop !== 40 ||
        result.spacing.footer.paddingBottom !== 40 ||
        result.anchors.some((anchor) => anchor.scrollMarginTop !== "88px"),
    )
  ) {
    process.exitCode = 1;
  }
}

validate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
