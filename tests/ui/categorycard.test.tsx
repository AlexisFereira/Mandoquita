import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { CategoryCard } from "../../src/components";

afterEach(() => {
  cleanup();
});

describe("CategoryCard", () => {
  it("renders as a linked card with metadata", () => {
    const { container } = render(
      <CategoryCard
        title="Shoes"
        href="/categories/shoes"
        description="Running and lifestyle silhouettes"
        imageUrl="/images/banners/banner-2.svg"
        count={12}
      />,
    );

    const element = container.firstElementChild as HTMLElement;

    expect(container.querySelector('a[href="/categories/shoes"]')).toBeTruthy();
    expect(screen.getByText("Running and lifestyle silhouettes")).toBeTruthy();
    expect(screen.getByText("12")).toBeTruthy();
    expect(element.className).toContain("hover:-translate-y-0.5");
  });
});
