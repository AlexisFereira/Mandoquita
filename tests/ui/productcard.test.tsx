import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ProductCard } from "../../src/components";

afterEach(() => {
  cleanup();
});

describe("ProductCard", () => {
  it("renders the product summary and actions", () => {
    render(
      <ProductCard
        product={{
          id: 1,
          slug: "minimal-chair",
          name: "Minimal Chair",
          description: "A clean chair for modern interiors.",
          price: "129.00",
          currency: "USD",
          imageUrl: "/images/banners/banner-1.svg",
          active: true,
          editorialApproved: true,
          published: true,
          commerciallyAvailable: true,
          featured: true,
          featuredOrder: 1,
          category: { id: "cat_furniture", slug: "furniture", name: "Furniture" },
          subcategory: { id: "sub_chairs", slug: "chairs", name: "Chairs" },
          productType: { name: "Chair" },
        }}
      />,
    );

    expect(screen.getByText("Furniture")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Minimal Chair" })).toBeTruthy();
    expect(
      screen.getByText("A clean chair for modern interiors."),
    ).toBeTruthy();
    expect(screen.getByText("USD 129.00")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Ver detalles de Minimal Chair" }),
    ).toBeTruthy();
  });

  it("keeps an unavailable product navigable without exposing commercial values", () => {
    render(
      <ProductCard
        product={{
          id: 2,
          slug: "archivo-editorial",
          name: "Archivo Editorial",
          description: "Producto publicado sin oferta vigente.",
          price: null,
          currency: null,
          imageUrl: "/images/banners/banner-1.svg",
          active: true,
          editorialApproved: true,
          published: true,
          commerciallyAvailable: false,
          featured: true,
          featuredOrder: 2,
          category: { id: "cat_furniture", slug: "furniture", name: "Furniture" },
          subcategory: { id: "sub_chairs", slug: "chairs", name: "Chairs" },
          productType: { name: "Chair" },
        }}
      />,
    );

    expect(screen.getByText("Oferta no disponible actualmente")).toBeTruthy();
    expect(screen.queryByText(/null|0\.00|USD/i)).toBeNull();
    expect(
      screen.getByRole("link", { name: "Ver detalles de Archivo Editorial" }).getAttribute("href"),
    ).toBe("/products/archivo-editorial");
  });
});
