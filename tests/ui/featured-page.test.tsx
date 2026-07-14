import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import FeaturedProductsPage from "../../pages/destacados";
import type { ProductItem } from "../../src/types/catalog";

const product: ProductItem = {
  id: 1,
  slug: "reloj-destacado",
  name: "Reloj destacado",
  description: "Selección editorial.",
  shortDescription: null,
  price: "49.00",
  currency: "USD",
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
  featured: true,
  featuredOrder: 1,
  category: { id: "cat_accesorios", slug: "accesorios", name: "Accesorios" },
  subcategory: { id: "sub_relojes", slug: "relojes", name: "Relojes" },
  productType: { name: "Reloj" },
};

afterEach(() => cleanup());

describe("Featured products page", () => {
  it("renders the expanded featured collection", () => {
    render(<FeaturedProductsPage products={[product]} />);

    expect(screen.getByRole("heading", { level: 1, name: "Productos destacados" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Ver detalles de Reloj destacado" })).toBeTruthy();
  });

  it("provides a useful empty state", () => {
    render(<FeaturedProductsPage products={[]} />);

    expect(screen.getByRole("heading", { name: "No hay productos destacados disponibles" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Explorar categorías" }).getAttribute("href")).toBe(
      "/categorias",
    );
  });
});
