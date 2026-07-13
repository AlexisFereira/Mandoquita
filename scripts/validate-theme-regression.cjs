const { existsSync, mkdirSync, readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");
const WebSocket = require("ws");
const baseUrl = process.env.APP_URL ?? "http://localhost:3000";

const cases = [
  { name: "homepage", path: "/" },
  { name: "category", path: "/categorias/audio" },
  { name: "product-detail", path: "/products/wireless-headset-pro" },
];
const baselineDirectory = join(process.cwd(), "tests", "visual", "baselines");
const updateBaselines = process.env.UPDATE_VISUAL_BASELINES === "1";

async function validate() {
  mkdirSync(baselineDirectory, { recursive: true });
  const targets = await fetch("http://localhost:9222/json").then((response) =>
    response.json(),
  );
  const target = targets.find((candidate) => candidate.type === "page");

  if (!target) throw new Error("No Chrome page target is available.");

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
    return new Promise((resolve, reject) => pending.set(commandId, { resolve, reject }));
  }

  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-color-scheme", value: "dark" }],
  });

  const results = [];

  for (const testCase of cases) {
    for (const stalePreference of ["light", "dark", "system"]) {
      const url = `${baseUrl}${testCase.path}`;
      await send("Page.navigate", { url });
      await new Promise((resolve) => setTimeout(resolve, 800));
      await send("Runtime.evaluate", {
        expression: `localStorage.setItem('theme-preference', '${stalePreference}')`,
      });
      await send("Page.reload", { ignoreCache: true });
      await new Promise((resolve) => setTimeout(resolve, 1200));
      await send("Runtime.evaluate", {
        awaitPromise: true,
        expression: `(async () => {
          await document.fonts.ready;
          const relevantImages = Array.from(document.images).filter((image) => {
            const rect = image.getBoundingClientRect();
            return image.loading !== 'lazy' || (rect.top < innerHeight && rect.bottom > 0);
          });
          await Promise.all(relevantImages.map((image) => {
            if (image.complete) return undefined;
            return new Promise((resolve) => {
              image.addEventListener('load', resolve, { once: true });
              image.addEventListener('error', resolve, { once: true });
            });
          }));
          const imageDeadline = performance.now() + 2500;
          while (
            relevantImages.some((image) => image.naturalWidth === 0) &&
            performance.now() < imageDeadline
          ) {
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
          await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        })()`,
      });
      await send("Input.dispatchKeyEvent", {
        type: "keyDown",
        key: "Tab",
        code: "Tab",
        windowsVirtualKeyCode: 9,
      });
      await send("Input.dispatchKeyEvent", {
        type: "keyUp",
        key: "Tab",
        code: "Tab",
        windowsVirtualKeyCode: 9,
      });

      const evaluation = await send("Runtime.evaluate", {
        returnByValue: true,
        expression: `(() => {
          const root = document.documentElement;
          const styles = getComputedStyle(root);
          const header = document.querySelector('header');
          const headerLink = header?.querySelector('nav a');
          const logo = header?.querySelector('img');
          const standardSurface = document.querySelector('main article');
          const carousel = document.querySelector('section[aria-label="Contenido destacado"]');
          const semanticTokens = [
            '--foreground', '--muted', '--primary', '--focus', '--success',
            '--warning', '--danger', '--inverse-surface', '--inverse-foreground',
            '--inverse-muted',
          ];
          const tokenValues = Object.fromEntries(
            semanticTokens.map((token) => [token, styles.getPropertyValue(token).trim()]),
          );
          const inheritedValues = (element) => element
            ? Object.fromEntries(semanticTokens.map((token) => [
                token,
                getComputedStyle(element).getPropertyValue(token).trim(),
              ]))
            : null;
          const localOverrides = Array.from(document.querySelectorAll('*')).flatMap((element) =>
            Array.from(element.style).filter((property) => property.startsWith('--')),
          );
          const focusEvidence = [
            headerLink,
            carousel?.querySelector('button'),
            standardSurface?.querySelector('a, button'),
          ].filter(Boolean).map((element) => {
            element.focus();
            const computed = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            let focusNotClipped = true;
            for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
              const overflow = getComputedStyle(ancestor).overflow;
              if (overflow === 'hidden' || overflow === 'clip') {
                const ancestorRect = ancestor.getBoundingClientRect();
                if (rect.left < ancestorRect.left || rect.right > ancestorRect.right ||
                    rect.top < ancestorRect.top || rect.bottom > ancestorRect.bottom) {
                  focusNotClipped = false;
                }
              }
            }
            return {
              outlineColor: computed.outlineColor,
              outlineStyle: computed.outlineStyle,
              outlineWidth: computed.outlineWidth,
              focusNotClipped,
            };
          });
          return {
            title: document.title,
            theme: styles.colorScheme,
            darkClass: root.classList.contains('dark'),
            foreground: styles.getPropertyValue('--foreground').trim(),
            background: styles.getPropertyValue('--background').trim(),
            focus: styles.getPropertyValue('--focus').trim(),
            overflow: root.scrollWidth > root.clientWidth,
            hasMain: Boolean(document.querySelector('main')),
            hasHeader: Boolean(document.querySelector('header')),
            hasFooter: Boolean(document.querySelector('footer')),
            headerText: header?.textContent?.trim() ?? null,
            headerLinkColor: headerLink ? getComputedStyle(headerLink).color : null,
            logoRect: logo ? { width: logo.getBoundingClientRect().width, height: logo.getBoundingClientRect().height } : null,
            tokenValues,
            standardInheritedValues: inheritedValues(standardSurface),
            inverseInheritedValues: inheritedValues(header),
            carouselInheritedValues: inheritedValues(carousel),
            localOverrides,
            focusEvidence,
          };
        })()`,
      });

      await send("Emulation.setEmulatedMedia", {
        features: [{ name: "prefers-color-scheme", value: "light" }],
      });
      const livePreferenceEvaluation = await send("Runtime.evaluate", {
        returnByValue: true,
        expression: `(() => {
          const styles = getComputedStyle(document.documentElement);
          return {
            theme: styles.colorScheme,
            foreground: styles.getPropertyValue('--foreground').trim(),
            background: styles.getPropertyValue('--background').trim(),
            hasHydrationError: /hydration (failed|error|mismatch)/i.test(document.body.innerText),
          };
        })()`,
      });
      await send("Emulation.setEmulatedMedia", {
        features: [{ name: "prefers-color-scheme", value: "dark" }],
      });

      const livePreferenceStable =
        livePreferenceEvaluation.result.value.theme === evaluation.result.value.theme &&
        livePreferenceEvaluation.result.value.foreground === evaluation.result.value.foreground &&
        livePreferenceEvaluation.result.value.background === evaluation.result.value.background;

      const screenshot = await send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: false,
      });
      const screenshotBuffer = Buffer.from(screenshot.data, "base64");
      const screenshotPath = `/private/tmp/mandoquita-${testCase.name}-${stalePreference}.png`;
      const baselinePath = join(
        baselineDirectory,
        `${testCase.name}-${stalePreference}.png`,
      );
      writeFileSync(screenshotPath, screenshotBuffer);

      if (updateBaselines) {
        writeFileSync(baselinePath, screenshotBuffer);
      }

      const baselineMatches = existsSync(baselinePath)
        ? readFileSync(baselinePath).equals(screenshotBuffer)
        : false;
      const baselineExists = existsSync(baselinePath);

      results.push({
        case: testCase.name,
        stalePreference,
        expectedTheme: "light",
        screenshotPath,
        baselinePath,
        baselineExists,
        baselineMatches,
        livePreferenceStable,
        hasHydrationError: livePreferenceEvaluation.result.value.hasHydrationError,
        ...evaluation.result.value,
      });
    }
  }

  socket.close();
  console.log(JSON.stringify(results, null, 2));

  if (
    results.some(
      (result) =>
        result.theme !== result.expectedTheme ||
        result.darkClass ||
        result.overflow ||
        !result.hasMain ||
        !result.hasHeader ||
        !result.hasFooter ||
        !result.baselineExists ||
        !result.livePreferenceStable ||
        result.hasHydrationError ||
        result.localOverrides.length > 0 ||
        [result.standardInheritedValues, result.inverseInheritedValues, result.carouselInheritedValues]
          .filter(Boolean)
          .some((values) => Object.keys(result.tokenValues)
            .some((token) => values[token] !== result.tokenValues[token])) ||
        result.focusEvidence.some((focus) =>
          focus.outlineStyle === 'none' || focus.outlineWidth === '0px' || !focus.focusNotClipped),
    )
  ) {
    process.exitCode = 1;
  }
}

validate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
