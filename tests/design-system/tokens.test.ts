import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { DESIGN_TOKENS, designTokens } from "../../src/design-system/tokens";

describe("design tokens", () => {
  it("exports a stable DESIGN_TOKENS object", () => {
    expect(DESIGN_TOKENS).toBeTruthy();
    expect(designTokens).toBe(DESIGN_TOKENS);
  });

  it("defines only the authoritative light color palette", () => {
    expect(DESIGN_TOKENS.colors.light.primary[500]).toBe("#C46A4A");
    expect(DESIGN_TOKENS.colors.light.neutral[950]).toBe("#111111");
    expect("dark" in DESIGN_TOKENS.colors).toBe(false);
  });

  it("uses a 4px spacing grid", () => {
    expect(DESIGN_TOKENS.spacing.xs).toBe(4);
    expect(DESIGN_TOKENS.spacing.sm).toBe(8);
    expect(DESIGN_TOKENS.spacing.md).toBe(16);
    expect(DESIGN_TOKENS.spacing.lg).toBe(24);
    expect(DESIGN_TOKENS.spacing.xl).toBe(32);
    expect(DESIGN_TOKENS.spacing["2xl"]).toBe(48);
  });

  it("provides typography, shadows, and radii tokens", () => {
    expect(DESIGN_TOKENS.typography.heading.sizes.lg.fontSize).toBe("2rem");
    expect(DESIGN_TOKENS.typography.body.sizes.md.lineHeight).toBe("1.55");
    expect(DESIGN_TOKENS.typography.caption.fontWeight).toBe(500);
    expect(DESIGN_TOKENS.shadows.md).toContain("rgba");
    expect(DESIGN_TOKENS.radii.lg).toBe("24px");
  });

  it("publishes the approved wide Container token in typed and CSS representations", () => {
    expect(DESIGN_TOKENS.layout.containers).toEqual({
      sm: 640,
      md: 768,
      lg: 1120,
      xl: 1280,
      wide: 1400,
    });
    expect(readFileSync(resolve("src/styles/theme.css"), "utf8")).toContain(
      "--container-wide: 1400px",
    );
  });
});
