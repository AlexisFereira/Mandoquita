import "@testing-library/jest-dom/vitest";

import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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
  images: [], shortDescription: null, brand: null, collection: null,
  genderApplicability: null, tags: [], seo: { title: null, description: null },
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
      <ProductDetailPage
        item={unavailableProduct}
        variantSelection={{ mode: "none", variants: [] }}
        related={[]}
      />,
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

  it("integrates ordered gallery, meaningful options and variant-associated media", () => {
    const item: ProductItem = {
      ...unavailableProduct,
      id: 8,
      slug: "camiseta-opciones",
      name: "Camiseta con opciones",
      shortDescription: "Una descripción breve del producto.",
      description: "Descripción completa para conocer materiales y cuidado.",
      imageUrl: "/images/products/roja.jpg",
      images: [
        { id: "image-blue", url: "/images/products/azul.jpg", altText: "Camiseta azul", position: 0, isPrimary: false },
        { id: "image-red", url: "/images/products/roja.jpg", altText: "Camiseta roja", position: 1, isPrimary: true },
      ],
      brand: "Mandoquita",
      collection: "Esenciales",
      genderApplicability: "unisex",
      tags: ["Algodón", "Uso diario"],
      commerciallyAvailable: true,
      price: "59.00",
      currency: "COP",
    };

    render(
      <ProductDetailPage
        item={item}
        variantSelection={{
          mode: "selectable",
          variants: [
            {
              id: "variant-blue-m",
              imageId: "image-blue",
              attributes: [
                { name: "Talla", value: "M" },
                { name: "Color", value: "Azul" },
              ],
            },
            {
              id: "variant-red-g",
              imageId: "image-red",
              attributes: [
                { name: "Talla", value: "G" },
                { name: "Color", value: "Rojo" },
              ],
            },
          ],
        }}
        related={[]}
      />,
    );

    expect(screen.getByRole("region", { name: `Galería de ${item.name}` })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Camiseta roja" })).toBeTruthy();
    expect(screen.getByText(item.shortDescription!)).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Descripción" })).toBeTruthy();
    expect(screen.getByText("Marca:").nextSibling?.textContent).toBe("Mandoquita");
    expect(screen.getByText("Unisex")).toBeTruthy();
    expect(screen.getByText("Algodón")).toBeTruthy();

    const sizeM = screen.getByRole("radio", { name: "M" });
    const blue = screen.getByRole("radio", { name: "Azul" });
    expect(sizeM).toHaveAttribute("aria-checked", "false");
    expect(blue).toHaveAttribute("aria-checked", "false");

    fireEvent.click(sizeM);
    expect(screen.getByRole("radio", { name: "Rojo" })).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(blue);

    expect(screen.getByRole("img", { name: "Camiseta azul" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Características seleccionadas" })).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/variant-blue-m|sku|barcode|variante base/i);

    fireEvent.click(screen.getByRole("radio", { name: "G" }));
    expect(screen.getByRole("radio", { name: "Azul" })).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("radio", { name: "Rojo" })).not.toHaveAttribute("aria-disabled");
  });

  it("presents one meaningful variant as read-only characteristics without a selector", () => {
    render(
      <ProductDetailPage
        item={{ ...unavailableProduct, images: [] }}
        variantSelection={{
          mode: "read_only",
          variants: [{
            id: "variant-material",
            imageId: null,
            attributes: [{ name: "Material", value: "Algodón" }],
          }],
        }}
        related={[]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Características" })).toBeTruthy();
    expect(screen.getByText("Algodón")).toBeTruthy();
    expect(screen.queryByRole("radio")).toBeNull();
    expect(screen.getByText("No hay imágenes disponibles para este producto.")).toBeTruthy();
  });
});
