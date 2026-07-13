import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import ProductDetailPage, {
  createProductStructuredData,
} from "../../pages/products/[slug]";
import type { ProductItem } from "../../src/types/catalog";

const unavailableProduct: ProductItem = {
  id: 7,
  slug: "producto-sin-oferta",
  name: "Producto sin oferta",
  description: "Disponible para exploración editorial.",
  price: null,
  currency: null,
  imageUrl: "/images/banners/banner-1.svg",
  active: true,
  editorialApproved: true,
  published: true,
  commerciallyAvailable: false,
  featured: true,
  featuredOrder: 1,
  category: { id: "cat_audio", slug: "audio", name: "Audio" },
  subcategory: { id: "sub_audio", slug: "audio", name: "Audio" },
  productType: { name: "Audífonos" },
};

afterEach(cleanup);

describe("Product detail commercial availability", () => {
  it("shows a deterministic unavailable offer while preserving published detail", () => {
    const { container } = render(
      <ProductDetailPage item={unavailableProduct} related={[]} />,
    );

    expect(screen.getByRole("heading", { name: unavailableProduct.name })).toBeTruthy();
    expect(screen.getByText("Oferta no disponible actualmente")).toBeTruthy();
    expect(container.textContent).not.toMatch(/null|0\.00/);

    expect(createProductStructuredData(unavailableProduct).offers).toBeUndefined();
    expect(screen.getAllByRole("link", { name: "Audio" }).some(
      (link) => link.getAttribute("href") === "/categorias/audio",
    )).toBe(true);
    expect(screen.getAllByRole("link", { name: "Audio" }).some(
      (link) => link.getAttribute("href") === "/categorias/audio/audio",
    )).toBe(true);
    expect(screen.getAllByText("Audífonos").length).toBeGreaterThan(0);
    expect(screen.queryByRole("link", { name: "Audífonos" })).toBeNull();
  });
});
