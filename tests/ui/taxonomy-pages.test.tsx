import React from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import CategoriesPage from "../../pages/categorias";
import CategoryPage from "../../pages/categorias/[slug]";
import SubcategoryPage from "../../pages/categorias/[slug]/[subcategory]";
import type { ProductItem, TaxonomyCategory } from "../../src/types/catalog";

const product: ProductItem = {
  id: 1,
  slug: "camiseta-basica",
  name: "Camiseta básica",
  description: "Prenda de uso diario.",
  price: "49.00",
  currency: "USD",
  imageUrl: "/images/banners/banner-1.svg",
  images: [], shortDescription: null, brand: null, collection: null,
  genderApplicability: null, tags: [], seo: { title: null, description: null },
  active: true,
  editorialApproved: true,
  published: true,
  commerciallyAvailable: true,
  featured: false,
  featuredOrder: null,
  category: { id: "cat_ropa_moda", slug: "ropa-y-moda", name: "Ropa y moda" },
  subcategory: { id: "sub_camisetas", slug: "camisetas", name: "Camisetas" },
  productType: { name: "Camiseta básica" },
};

const category: TaxonomyCategory = {
  ...product.category,
  description: "Prendas y accesorios para distintos estilos.",
  productCount: 1,
  subcategories: [{ ...product.subcategory, productCount: 1 }],
};

afterEach(cleanup);

describe("Category taxonomy pages", () => {
  it("presents the complete eligible category collection in supplied order", () => {
    const second = {
      ...category,
      id: "cat_belleza",
      slug: "belleza-y-cuidado-personal",
      name: "Belleza y cuidado personal",
    };
    render(<CategoriesPage categories={[category, second]} />);

    const destinations = screen.getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.startsWith("/categorias/"))
      .map((link) => link.getAttribute("href"));
    expect(destinations).toEqual([
      "/categorias/ropa-y-moda",
      "/categorias/belleza-y-cuidado-personal",
    ]);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 2, name: "Categorías disponibles" })).toBeTruthy();
  });

  it("provides a recovery state when no category is eligible", () => {
    render(<CategoriesPage categories={[]} />);

    expect(screen.getByRole("heading", { name: /no disponibles temporalmente/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Volver al inicio" }).getAttribute("href")).toBe("/");
  });

  it("presents eligible subcategories before category products", () => {
    render(<CategoryPage category={category} products={[product]} />);

    const subcategoryLink = screen.getByRole("link", { name: /Camisetas 1 productos/i });
    expect(subcategoryLink.getAttribute("href")).toBe("/categorias/ropa-y-moda/camisetas");
    expect(screen.getByRole("heading", { name: "Productos de Ropa y moda" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Ver detalles de Camiseta básica" })).toBeTruthy();
    expect(screen.getByText("Camisetas · Camiseta básica")).toBeTruthy();
  });

  it("keeps category context and filters presentation to the selected subcategory", () => {
    render(
      <SubcategoryPage
        category={{ slug: category.slug, name: category.name }}
        subcategory={category.subcategories[0]}
        products={[product]}
      />,
    );

    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(breadcrumb).getByRole("link", { name: "Categorías" }).getAttribute("href")).toBe("/categorias");
    expect(within(breadcrumb).getByRole("link", { name: category.name }).getAttribute("href")).toBe(`/categorias/${category.slug}`);
    expect(screen.getByRole("heading", { level: 1, name: "Camisetas" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Productos de Camisetas" })).toBeTruthy();
    expect(within(breadcrumb).getByText("Camisetas").getAttribute("aria-current")).toBe("page");
    for (const link of within(breadcrumb).getAllByRole("link")) {
      expect(link.className).toContain("min-h-11");
    }
  });

  it("omits the subcategory region instead of leaving inaccessible empty choices", () => {
    render(<CategoryPage category={{ ...category, subcategories: [] }} products={[product]} />);

    expect(screen.queryByRole("heading", { name: "Subcategorías" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Productos de Ropa y moda" })).toBeTruthy();
  });

  it("provides recovery from invalid category and subcategory destinations", () => {
    const { unmount } = render(<CategoryPage category={null} products={[]} />);
    expect(screen.getByRole("heading", { name: "Categoría no disponible" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Ver todas las categorías" }).getAttribute("href")).toBe("/categorias");
    unmount();

    render(<SubcategoryPage category={null} subcategory={null} products={[]} />);
    expect(screen.getByRole("heading", { name: "Subcategoría no disponible" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Ver todas las categorías" }).getAttribute("href")).toBe("/categorias");
  });
});
