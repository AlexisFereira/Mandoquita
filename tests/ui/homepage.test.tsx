import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import HomePage, { selectVisibleFeaturedProducts } from "../../pages/index";
import { PaymentInformation } from "../../src/features/homepage/payment-information";
import type { HomepagePayload, ProductItem } from "../../src/types/catalog";

const product: ProductItem = {
  id: 1,
  slug: "audifonos-studio",
  name: "Audífonos Studio",
  description: "Audio claro para acompañar tu día.",
  price: "120.00",
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
  category: { id: "cat_audio", slug: "audio", name: "Audio" },
  subcategory: { id: "sub_audio", slug: "audio", name: "Audio" },
  productType: { name: "Audífonos" },
};

const populatedPayload: HomepagePayload = {
  featuredProducts: [product],
  categories: [
    {
      id: "cat_audio",
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

function setViewportWidth(width: number) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: width >= Number(query.match(/min-width:\s*(\d+)px/)?.[1] ?? Infinity),
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

    expect(selectVisibleFeaturedProducts(products, 2)).toEqual([1, 2]);
    expect(selectVisibleFeaturedProducts(products, 6)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("renders a single row of two featured products on mobile", () => {
    setViewportWidth(390);
    render(<HomePage featuredProducts={createProducts(8)} categories={[]} />);

    expect(screen.getAllByRole("link", { name: /ver detalles de producto/i })).toHaveLength(2);
    expect(screen.queryByRole("heading", { name: "Producto 3" })).toBeNull();
  });

  it("renders a single row of six featured products and a real continuation on wide desktop", () => {
    setViewportWidth(1440);
    render(<HomePage featuredProducts={createProducts(10)} categories={[]} />);

    expect(screen.getAllByRole("link", { name: /ver detalles de producto/i })).toHaveLength(6);
    expect(screen.queryByRole("heading", { name: "Producto 7" })).toBeNull();
    expect(screen.getByRole("link", { name: "Ver más destacados" }).getAttribute("href")).toBe(
      "/destacados",
    );
  });

  it("renders every eligible category supplied by the backend without a presentation cap", () => {
    const categories = Array.from({ length: 9 }, (_, index) => ({
      id: `cat_${index + 1}`,
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
    expect(screen.getByRole("link", { name: "Ver todas" }).getAttribute("href")).toBe(
      "/categorias",
    );
    expect(screen.getByRole("link", { name: "Categoría 2" }).closest("li")?.className).toContain(
      "hidden min-[400px]:block",
    );
    expect(screen.getByRole("link", { name: "Categoría 3" }).closest("li")?.className).toContain(
      "hidden sm:block",
    );
    expect(screen.getByRole("link", { name: "Categoría 8" }).closest("li")?.className).toContain(
      "hidden",
    );
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

    const categoryLink = screen.getByRole("link", { name: "Audio" });
    expect(categoryLink.getAttribute("href")).toBe("/categorias/audio");
    expect(categoryLink.textContent).toBe("Audio");
    expect(categoryLink.querySelector("span")?.className).toContain("h-[100px]");
    expect(categoryLink.querySelector("span")?.className).toContain("rounded-full");
    expect(categoryLink.querySelector("h3")?.className).toContain("text-center");
    expect(categoryLink.closest("ul")?.className).toContain("gap-[30px]");
    expect(categoryLink.closest("ul")?.className).toContain("xl:justify-start");
    expect(categoryLink.closest("ul")?.parentElement?.className).toContain("xl:justify-between");
    expect(categoryLink.closest("ul")?.parentElement?.className).toContain("xl:items-center");
    expect(screen.getByText("Explora el catálogo según tus intereses.").className).toContain(
      "xl:whitespace-nowrap",
    );
    expect(categoryLink.className).not.toMatch(/border|shadow|bg-/);
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
    const contactSection = document.getElementById("contacto");
    const contactImage = contactSection?.querySelector("img");
    expect(contactImage?.getAttribute("src")).toBe("/images/whatsapp-contact.png");
    expect(contactImage?.getAttribute("alt")).toBe("");
    expect(contactImage?.className).toContain("object-cover");
    expect(contactImage?.closest("div")?.parentElement?.className).toContain(
      "lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]",
    );

    const pageText = document.body.textContent ?? "";
    expect(pageText).not.toMatch(
      /carrito|checkout|comprar ahora|finalizar compra|procesar pago/i,
    );
  });

  it("renders approved payment information as static content before contact", () => {
    render(<HomePage {...populatedPayload} />);

    const paymentSection = screen.getByRole("region", { name: "Medios de pago" });
    const contactHeading = screen.getByRole("heading", {
      name: /quieres conocer mejor un producto/i,
    });
    const contactSection = contactHeading.closest("section");

    expect(paymentSection?.id).toBe("medios-de-pago");
    expect(
      screen.getByText(/Elige la opción que te resulte más cómoda: aceptamos Binance/i),
    ).toBeTruthy();
    const paymentBanner = paymentSection.querySelector("img");
    expect(paymentBanner?.getAttribute("alt")).toBe("");
    expect(paymentBanner?.className).toContain("xl:h-[350px]");
    expect(screen.getByRole("heading", { name: "Medios de pago" }).parentElement?.className).toContain(
      "absolute",
    );
    expect(
      paymentSection && contactSection
        ? paymentSection.compareDocumentPosition(contactSection) & Node.DOCUMENT_POSITION_FOLLOWING
        : 0,
    ).toBeTruthy();

    expect(paymentSection?.querySelectorAll("a, button, input, select")).toHaveLength(0);
    expect(paymentSection?.querySelectorAll("[data-icon]"))?.toHaveLength(0);
  });

  it("uses the canonical Banner, Categories, Featured, Payment, selected Category and Contact order", () => {
    setViewportWidth(1440);
    render(<HomePage {...populatedPayload} selectedCategoryProducts={{ category: populatedPayload.categories[0], products: [product], businessDate: "2026-07-14" }} />);

    const main = screen.getByRole("main");
    const slider = screen.getByLabelText("Contenido destacado");
    expect(slider.className).toContain("w-full");
    const sliderContentContainers = Array.from(slider.querySelectorAll("div")).filter((node) =>
      node.className.includes("max-w-[1400px]"),
    );
    expect(sliderContentContainers.length).toBeGreaterThanOrEqual(2);
    expect(sliderContentContainers.every((node) => node.className.includes("px-6"))).toBe(true);
    const ordered = [
      screen.getByLabelText("Contenido destacado"),
      document.getElementById("categorias"),
      document.getElementById("destacados"),
      document.getElementById("medios-de-pago"),
      document.getElementById("seleccion-categoria"),
      document.getElementById("contacto"),
    ].filter((node): node is HTMLElement => Boolean(node));
    expect(ordered).toHaveLength(6);
    expect(ordered.every((node) => main.contains(node))).toBe(true);
    for (let index = 0; index < ordered.length - 1; index += 1) {
      expect(ordered[index].compareDocumentPosition(ordered[index + 1]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
    expect(screen.getByRole("link", { name: "Ver categoría Audio" }).getAttribute("href")).toBe("/categorias/audio");
  });

  it("omits the complete selected-Category region when the server projection is absent or empty", () => {
    const { rerender } = render(<HomePage {...populatedPayload} selectedCategoryProducts={null} />);
    expect(document.getElementById("seleccion-categoria")).toBeNull();
    rerender(<HomePage {...populatedPayload} selectedCategoryProducts={{ category: populatedPayload.categories[0], products: [], businessDate: "2026-07-14" }} />);
    expect(document.getElementById("seleccion-categoria")).toBeNull();
  });

  it("keeps payment information readable and non-transactional without a contact URL", () => {
    render(<PaymentInformation />);

    const section = screen.getByRole("region", { name: "Medios de pago" });
    expect(section.querySelectorAll("li")).toHaveLength(0);
    expect(section.querySelector("img")?.getAttribute("alt")).toBe("");
    expect(section?.querySelectorAll("a, button, input, select")).toHaveLength(0);
    expect(screen.queryByRole("link", { name: "Consultar por WhatsApp" })).toBeNull();
    expect(document.body.textContent).not.toMatch(/checkout|pagar ahora|orden|transacción/i);
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
