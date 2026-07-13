import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const sharedComponents = [
  "Badge",
  "Button",
  "Card",
  "Carousel",
  "CategoryCard",
  "Chip",
  "Container",
  "Footer",
  "Header",
  "Hero",
  "Input",
  "ProductCard",
  "ProductOffer",
  "SearchInput",
  "Section",
  "SectionHeader",
];

describe("visual ownership", () => {
  it("prevents static hex and numeric rgb colors in shared components", () => {
    for (const component of sharedComponents) {
      const file = `src/components/${component}.tsx`;
      const source = readFileSync(resolve(file), "utf8");

      expect(source, file).not.toMatch(/#[\da-f]{3,8}\b/i);
      expect(source, file).not.toMatch(/rgba?\(\s*\d/i);
    }
  });

  it("keeps Product Detail free of static React style blocks", () => {
    const source = readFileSync(resolve("pages/products/[slug].tsx"), "utf8");
    expect(source).not.toContain("style={{");
  });

  it("centralizes page theme-color metadata", () => {
    for (const file of [
      "pages/index.tsx",
      "pages/categorias/[slug].tsx",
      "pages/products/[slug].tsx",
    ]) {
      const source = readFileSync(resolve(file), "utf8");
      expect(source, file).toContain("APPLICATION_THEME_COLOR");
      expect(source, file).not.toMatch(/<meta name="theme-color" content="#/);
    }
  });
});
