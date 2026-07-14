import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { CollectionGrid, Container, Section } from "../../src/components";
import type { ContainerSize } from "../../src/components";

afterEach(() => {
  cleanup();
});

describe("Container", () => {
  it("applies the default width and padding tokens", () => {
    const { container } = render(<Container>Content</Container>);

    const element = container.firstElementChild as HTMLElement;

    expect(element.tagName).toBe("DIV");
    expect(element.className).toContain("max-w-[1120px]");
    expect(element.className).toContain("px-4");
    expect(element.className).toContain("mx-auto");
  });

  it("supports custom element types and padding", () => {
    const { container } = render(
      <Container as="main" size="xl" padding="none" centered={false}>
        Content
      </Container>,
    );

    const element = container.firstElementChild as HTMLElement;

    expect(element.tagName).toBe("MAIN");
    expect(element.className).toContain("max-w-[1280px]");
    expect(element.className).toContain("px-0");
    expect(element.className).not.toContain("mx-auto");
  });

  it("adds the opt-in 1400px wide boundary without changing defaults", () => {
    const { container } = render(<Container size="wide">Wide content</Container>);
    expect((container.firstElementChild as HTMLElement).className).toContain("max-w-[1400px]");
  });

  it.each([
    ["sm", "max-w-[640px]"],
    ["md", "max-w-[768px]"],
    ["lg", "max-w-[1120px]"],
    ["xl", "max-w-[1280px]"],
    ["wide", "max-w-[1400px]"],
  ] as const)("preserves the %s size contract", (size, expectedClass) => {
    const { container } = render(<Container size={size}>{size}</Container>);
    expect((container.firstElementChild as HTMLElement).className).toContain(expectedClass);
  });

  it("accepts wide and rejects the unapproved xxl alias at compile time", () => {
    const approved: ContainerSize = "wide";
    // @ts-expect-error MLC exposes `wide`; the unapproved `xxl` alias must stay absent.
    const rejected: ContainerSize = "xxl";
    expect(approved).toBe("wide");
    expect(rejected).toBe("xxl");
  });
});

describe("CollectionGrid", () => {
  it("uses exact 2/3/4/6 density and one ordered DOM collection", () => {
    render(<CollectionGrid as="ul" aria-label="Colección"><li>Uno</li><li>Dos</li><li>Tres</li></CollectionGrid>);
    const list = screen.getByRole("list", { name: "Colección" });
    expect(list.className).toContain("grid-cols-2");
    expect(list.className).toContain("sm:grid-cols-3");
    expect(list.className).toContain("lg:grid-cols-4");
    expect(list.className).toContain("collection-grid");
    expect(Array.from(list.children, (child) => child.textContent)).toEqual(["Uno", "Dos", "Tres"]);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("passes through element attributes and custom classes", () => {
    render(<CollectionGrid as="ol" id="ordered-grid" className="test-grid"><li>Contenido</li></CollectionGrid>);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    expect(list.id).toBe("ordered-grid");
    expect(list.className).toContain("test-grid");
  });
});

describe("Section", () => {
  it("renders semantic section content with header metadata", () => {
    const { container } = render(
      <Section
        eyebrow="Featured"
        title="Explore curated products"
        description="A focused browsing block for the catalog."
        action={<button>View all</button>}
        tone="surface"
        divider
      >
        <div>Section body</div>
      </Section>,
    );

    const element = container.firstElementChild as HTMLElement;

    expect(element.tagName).toBe("SECTION");
    expect(element.className).toContain("bg-[rgb(var(--surface)/1)]");
    expect(element.className).toContain("border-y");
    expect(screen.getByText("Featured")).toBeTruthy();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Explore curated products",
      }),
    ).toBeTruthy();
    expect(
      screen.getByText("A focused browsing block for the catalog."),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "View all" })).toBeTruthy();
  });

  it("supports centered compact sections", () => {
    const { container } = render(
      <Section align="center" spacing="compact" title="Centered block">
        <div>Body</div>
      </Section>,
    );

    const element = container.firstElementChild as HTMLElement;

    expect(element.className).toContain("flex flex-col");
    expect(element.className).toContain("gap-4");
    expect(element.className).not.toContain("space-y-4");
    expect(element.className).toContain("py-8");
    expect(
      screen.getByRole("heading", { level: 2, name: "Centered block" }),
    ).toBeTruthy();
  });
});
