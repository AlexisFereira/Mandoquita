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
        imageAltText="Calzado deportivo y casual."
        count={12}
      />,
    );

    const element = container.firstElementChild as HTMLElement;

    expect(container.querySelector('a[href="/categories/shoes"]')).toBeTruthy();
    expect(screen.getByText("Running and lifestyle silhouettes")).toBeTruthy();
    expect(screen.getByText("12")).toBeTruthy();
    expect(screen.getByAltText("Calzado deportivo y casual.")).toBeTruthy();
    expect(element.className).toContain("hover:-translate-y-0.5");
  });

  it("applies the public asset base URL to relative category media", () => {
    const previous = process.env.NEXT_PUBLIC_ASSET_BASE_URL;
    process.env.NEXT_PUBLIC_ASSET_BASE_URL = "https://cdn.example.com/store/";
    render(
      <CategoryCard
        title="Ropa y moda"
        href="/categorias/ropa-y-moda"
        imageUrl="/images/categories/ropa-y-moda.png"
      />,
    );
    expect(screen.getByRole("img").getAttribute("src")).toBe(
      "https://cdn.example.com/store/images/categories/ropa-y-moda.png",
    );
    if (previous === undefined) delete process.env.NEXT_PUBLIC_ASSET_BASE_URL;
    else process.env.NEXT_PUBLIC_ASSET_BASE_URL = previous;
  });
});
