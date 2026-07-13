import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Hero, SectionHeader } from "../../src/components";

afterEach(() => {
  cleanup();
});

describe("SectionHeader", () => {
  it("renders title, eyebrow, description, and action", () => {
    const { container } = render(
      <SectionHeader
        eyebrow="Featured"
        title="Discover products"
        description="Browse the latest catalog items."
        action={<button>View all</button>}
      />,
    );

    const element = container.firstElementChild as HTMLElement;

    expect(screen.getByText("Featured")).toBeTruthy();
    expect(
      screen.getByRole("heading", { level: 2, name: "Discover products" }),
    ).toBeTruthy();
    expect(screen.getByText("Browse the latest catalog items.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "View all" })).toBeTruthy();
    expect(element.className).toContain("items-start");
  });
});

describe("Hero", () => {
  it("renders the main content and media layout", () => {
    const { container } = render(
      <Hero
        eyebrow="Modern catalog"
        title="Discover products with clarity"
        description="A premium browsing experience for the product catalog."
        primaryAction={<button>Explore</button>}
        secondaryAction={<button>Categories</button>}
        media={<img alt="Hero visual" src="/images/banners/banner-1.svg" />}
      />,
    );

    const element = container.firstElementChild as HTMLElement;

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Discover products with clarity",
      }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Explore" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Categories" })).toBeTruthy();
    expect(screen.getByAltText("Hero visual")).toBeTruthy();
    expect(element.tagName).toBe("SECTION");
  });
});
