import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Container, Section } from "../../src/components";

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
