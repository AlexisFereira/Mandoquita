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
          images: [], shortDescription: null, brand: null, collection: null,
          genderApplicability: null, tags: [], seo: { title: null, description: null },
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
          images: [], shortDescription: null, brand: null, collection: null,
          genderApplicability: null, tags: [], seo: { title: null, description: null },
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

  it("uses approved listing content and preserves a stable missing-media state", () => {
    const base = {
      id: 3,
      slug: "producto-sin-imagen",
      name: "Producto sin imagen",
      description: "Descripción completa que no compite en la tarjeta.",
      shortDescription: "Resumen aprobado para listados.",
      price: "29.00",
      currency: "COP",
      imageUrl: "",
      images: [],
      brand: null,
      collection: null,
      genderApplicability: null,
      tags: [],
      seo: { title: null, description: null },
      active: true,
      editorialApproved: true,
      published: true,
      commerciallyAvailable: true,
      featured: false,
      featuredOrder: null,
      category: { id: "cat_hogar", slug: "hogar", name: "Hogar" },
      subcategory: { id: "sub_hogar", slug: "hogar", name: "Hogar" },
      productType: { name: "Accesorio" },
    };

    render(<ProductCard product={base} />);

    expect(screen.getByText("Resumen aprobado para listados.")).toBeTruthy();
    expect(screen.queryByText(base.description)).toBeNull();
    expect(screen.getByText("Sin imagen")).toBeTruthy();
    expect(screen.queryByRole("img")).toBeNull();
  });
});
