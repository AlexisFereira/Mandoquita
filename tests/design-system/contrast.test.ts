import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { SEMANTIC_THEME_TOKENS } from "../../src/design-system/tokens";

const themeCss = readFileSync(resolve("src/styles/theme.css"), "utf8");

function parseChannels(block: string, token: string) {
  const match = block.match(new RegExp(`--${token}:\\s*(\\d+)\\s+(\\d+)\\s+(\\d+);`));
  if (!match) throw new Error(`Missing --${token}`);
  return match.slice(1).map(Number) as [number, number, number];
}

function parseHex(hex: string): [number, number, number] {
  return [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16)) as [number, number, number];
}

function luminance(rgb: [number, number, number]) {
  const channels = rgb.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a: [number, number, number], b: [number, number, number]) {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

const lightBlock = themeCss.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";

describe("light semantic contrast", () => {
  const block = lightBlock;
  const color = (token: string) => parseChannels(block, token);

  it.each([
    ["body text", "foreground", "background"],
    ["muted text", "muted", "background"],
    ["primary action", "primary-foreground", "primary"],
    ["inverse text", "inverse-foreground", "inverse-surface"],
    ["inverse muted text", "inverse-muted", "inverse-surface"],
    ["success status", "success", "background"],
    ["warning status", "warning", "background"],
    ["danger status", "danger", "background"],
  ])("keeps %s at 4.5:1 or higher", (_label, foreground, background) => {
    expect(contrast(color(foreground), color(background))).toBeGreaterThanOrEqual(4.5);
  });

  it.each([
    ["focus on background", "focus", "background"],
    ["focus on surface", "focus", "surface"],
    ["focus on inverse surface", "focus", "inverse-surface"],
    ["carousel control", "inverse-foreground", "inverse-surface"],
    ["primary interaction border", "primary", "surface"],
  ])("keeps %s at 3:1 or higher", (_label, foreground, background) => {
    expect(contrast(color(foreground), color(background))).toBeGreaterThanOrEqual(3);
  });

  it("matches the typed primary-action decision", () => {
    expect(color("primary")).toEqual(parseHex(SEMANTIC_THEME_TOKENS.light.primaryAction));
    expect(color("primary-foreground")).toEqual(
      parseHex(SEMANTIC_THEME_TOKENS.light.primaryActionForeground),
    );
  });
});
