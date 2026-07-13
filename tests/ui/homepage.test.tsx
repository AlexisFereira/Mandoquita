import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import HomePage, { selectVisibleFeaturedProducts } from "../../pages/index";
import type { HomepagePayload, ProductItem } from "../../src/types/catalog";

const product: ProductItem = {
  id: 1,
  slug: "audifonos-studio",
  name: "Audífonos Studio",
  description: "Audio claro para acompañar tu día.",
  price: "120.00",
  currency: "USD",
  imageUrl: "/images/banners/banner-1.svg",
  active: true,
  editorialApproved: true,
  published: true,
  commerciallyAvailable: true,
  featured: true,
  featuredOrder: 1,
  category: { id: 1, slug: "audio", name: "Audio" },
};

const populatedPayload: HomepagePayload = {
  featuredProducts: [product],
  categories: [
    {
      slug: "audio",
      name: "Audio",
      imageUrl: "/images/banners/banner-2.svg",
      productCount: 1,
    },
  ],
};

function createProducts(count: number): ProductItem[] {
  return Array.from({ length: count }, (_, index) => ({
    ...product,
    id: index + 1,
    slug: `producto-${index + 1}`,
    name: `Producto ${index + 1}`,
    featuredOrder: index + 1,
  }));
}

function setWideViewport(isWide: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query === "(min-width: 1280px)" ? isWide : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Homepage", () => {
  it("limits featured density without creating hidden duplicate cards", () => {
    const products = Array.from({ length: 8 }, (_, index) => index + 1);

    expect(selectVisibleFeaturedProducts(products, false)).toEqual([1, 2, 3, 4]);
    expect(selectVisibleFeaturedProducts(products, true)).toEqual(products);
  });

  it("renders only four featured products on mobile and tablet viewports", () => {
    setWideViewport(false);
    render(<HomePage featuredProducts={createProducts(8)} categories={[]} />);

    expect(screen.getAllByRole("link", { name: /ver detalles de producto/i })).toHaveLength(4);
    expect(screen.queryByRole("heading", { name: "Producto 5" })).toBeNull();
  });

  it("renders at most eight featured products on desktop without hidden duplicates", () => {
    setWideViewport(true);
    render(<HomePage featuredProducts={createProducts(10)} categories={[]} />);

    expect(screen.getAllByRole("link", { name: /ver detalles de producto/i })).toHaveLength(8);
    expect(screen.queryByRole("heading", { name: "Producto 9" })).toBeNull();
  });

  it("renders every eligible category supplied by the backend without a presentation cap", () => {
    const categories = Array.from({ length: 9 }, (_, index) => ({
      slug: `categoria-${index + 1}`,
      name: `Categoría ${index + 1}`,
      productCount: index + 1,
    }));

    render(<HomePage featuredProducts={[]} categories={categories} />);

    for (const category of categories) {
      expect(
        screen.getByRole("link", { name: new RegExp(category.name, "i") }).getAttribute("href"),
      ).toBe(`/categorias/${category.slug}`);
    }
  });

  it("keeps a featured product without a current offer discoverable", () => {
    const unavailable = {
      ...product,
      slug: "destacado-sin-oferta",
      name: "Destacado sin oferta",
      commerciallyAvailable: false,
      price: null,
      currency: null,
    };

    render(<HomePage featuredProducts={[unavailable]} categories={[]} />);

    expect(screen.getByText("Oferta no disponible actualmente")).toBeTruthy();
    expect(screen.queryByText(/null|0\.00/i)).toBeNull();
    expect(
      screen.getByRole("link", { name: "Ver detalles de Destacado sin oferta" }).getAttribute("href"),
    ).toBe("/products/destacado-sin-oferta");
  });

  it("omits empty catalog sections without leaving their headings", () => {
    render(<HomePage featuredProducts={[]} categories={[]} />);

    expect(screen.queryByRole("heading", { name: /selección para empezar/i })).toBeNull();
    expect(screen.queryByRole("heading", { name: /encuentra lo que necesitas/i })).toBeNull();
    expect(screen.getByRole("heading", { name: /quieres conocer mejor un producto/i })).toBeTruthy();
  });

  it("renders categories as category destinations instead of repeated product groups", () => {
    render(<HomePage {...populatedPayload} />);

    expect(screen.getByRole("link", { name: /audio/i }).getAttribute("href")).toBe(
      "/categorias/audio",
    );
    expect(screen.getAllByRole("heading", { name: "Audífonos Studio" })).toHaveLength(1);
  });

  it("renders the approved contact action without transactional paths", () => {
    render(<HomePage {...populatedPayload} />);

    const contact = screen
      .getAllByRole("link", { name: "Hablar por WhatsApp" })
      .find((link) => link.getAttribute("href")?.startsWith("https://wa.me/"));
    expect(contact).toBeTruthy();
    if (!contact) {
      throw new Error("Expected the external WhatsApp contact link");
    }
    expect(contact.getAttribute("href")).toContain("https://wa.me/573506928681");
    expect(contact.getAttribute("target")).toBe("_blank");

    const pageText = document.body.textContent ?? "";
    expect(pageText).not.toMatch(/carrito|checkout|pago|comprar ahora/i);
  });

  it("uses semantic landmarks and a logical heading hierarchy", () => {
    render(<HomePage {...populatedPayload} />);

    expect(screen.getByRole("banner")).toBeTruthy();
    expect(screen.getByRole("main")).toBeTruthy();
    expect(screen.getByRole("contentinfo")).toBeTruthy();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("link", { name: "Ir al contenido principal" }).getAttribute("href"),
    ).toBe("#main-content");
  });

  it("keeps primary discovery actions keyboard focusable", () => {
    render(<HomePage {...populatedPayload} />);

    const controls = [
      screen.getByRole("button", { name: "Abrir navegación" }),
      screen.getByRole("link", { name: "Ver detalles de Audífonos Studio" }),
      screen.getByRole("link", { name: /audio/i }),
      screen
        .getAllByRole("link", { name: "Hablar por WhatsApp" })
        .find((link) => link.getAttribute("href")?.startsWith("https://wa.me/")),
    ].filter((control): control is HTMLElement => Boolean(control));

    for (const control of controls) {
      control.focus();
      expect(document.activeElement).toBe(control);
    }
  });

  it("provides meaningful alternatives for content images", () => {
    render(<HomePage {...populatedPayload} />);

    expect(screen.getByRole("img", { name: "Mandoquita" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Audífonos Studio" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Audio" })).toBeTruthy();
  });
});
