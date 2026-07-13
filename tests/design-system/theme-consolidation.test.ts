import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const globalStyles = readFileSync(resolve("styles/globals.css"), "utf8");
const themeStyles = readFileSync(resolve("src/styles/theme.css"), "utf8");
const tailwindConfig = readFileSync(resolve("tailwind.config.ts"), "utf8");

function collectSourceFiles(directory: string): string[] {
  return readdirSync(resolve(directory)).flatMap((entry) => {
    const file = `${directory}/${entry}`;
    if (statSync(resolve(file)).isDirectory()) return collectSourceFiles(file);
    return /\.(?:css|ts|tsx)$/.test(entry) ? [file] : [];
  });
}

const applicationFiles = [...collectSourceFiles("pages"), ...collectSourceFiles("src")];

const homepageFiles = [
  "pages/index.tsx",
  "src/components/Header.tsx",
  "src/components/Hero.tsx",
  "src/components/Carousel.tsx",
  "src/components/ProductCard.tsx",
  "src/components/CategoryCard.tsx",
  "src/components/Footer.tsx",
];

describe("theme stylesheet consolidation", () => {
  it("keeps semantic root declarations exclusively in theme.css", () => {
    expect(globalStyles).not.toMatch(/^:root\s*\{/m);
    expect(themeStyles.match(/^:root\s*\{/gm)).toHaveLength(1);
    expect(themeStyles).not.toMatch(/^:root\.dark\s*\{/m);
    expect(themeStyles).toContain("color-scheme: light");
  });

  it("keeps body and legacy surface rules exclusively in theme.css", () => {
    for (const selector of ["body", ".ds-surface", ".ds-card"]) {
      expect(globalStyles).not.toMatch(new RegExp(`^${selector.replace(".", "\\.")}\\s*\\{`, "m"));
      expect(themeStyles).toMatch(new RegExp(`^${selector.replace(".", "\\.")}\\s*\\{`, "m"));
    }
  });

  it("does not introduce an independent system-dark CSS palette", () => {
    expect(themeStyles).not.toContain("prefers-color-scheme: dark");
  });

  it("removes the public theme runtime", () => {
    expect(existsSync(resolve("src/design-system/theme.ts"))).toBe(false);
  });

  it("keeps deprecated runtime aliases out of application consumers", () => {
    for (const file of applicationFiles) {
      const source = readFileSync(resolve(file), "utf8");
      expect(source, file).not.toMatch(/var\(--(?:color|spacing)-/);
    }
  });

  it("prevents multi-theme behavior from returning to application code", () => {
    const source = applicationFiles
      .map((file) => readFileSync(resolve(file), "utf8"))
      .join("\n");

    expect(source).not.toMatch(/\bdark:/);
    expect(source).not.toContain("prefers-color-scheme");
    expect(source).not.toContain("theme-preference");
    expect(source).not.toMatch(/(?:localStorage|sessionStorage)[\s\S]{0,80}theme/i);
    expect(source).not.toMatch(/documentElement\.(?:classList|dataset)[\s\S]{0,80}(?:dark|theme)/i);
    expect(source).not.toMatch(
      /ThemeProvider|useTheme|ThemeMode|ThemePreference|getThemeBootstrapScript|setThemePreference|toggleTheme/,
    );
    expect(tailwindConfig).not.toContain("darkMode");
  });

  it("prevents deprecated color aliases in homepage components", () => {
    for (const file of homepageFiles) {
      const source = readFileSync(resolve(file), "utf8");
      expect(source, file).not.toMatch(/var\(--color-/);
    }
  });

  it("maps Tailwind semantic roles to authoritative CSS variables", () => {
    for (const token of [
      "background",
      "surface",
      "surface-muted",
      "foreground",
      "muted",
      "border",
      "accent",
      "success",
      "warning",
      "danger",
      "focus",
      "inverse-surface",
      "inverse-foreground",
    ]) {
      expect(tailwindConfig).toContain(`var(--${token})`);
    }
  });

  it("provides shared focus-visible and reduced-motion contracts", () => {
    expect(globalStyles).toContain(":focus-visible");
    expect(globalStyles).toContain("outline: 3px solid rgb(var(--focus) / 1)");
    expect(globalStyles).toContain("prefers-reduced-motion: reduce");
  });
});
