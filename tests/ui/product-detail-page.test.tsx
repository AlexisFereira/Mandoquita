import "@testing-library/jest-dom/vitest";

import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

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

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(navigator, "share");
  Reflect.deleteProperty(navigator, "clipboard");
  vi.restoreAllMocks();
});

function setBrowserCapability(name: "share" | "clipboard", value: unknown) {
  Object.defineProperty(navigator, name, { configurable: true, value });
}

describe("Product detail commercial availability", () => {
  it("shows a deterministic unavailable offer while preserving published detail", () => {
    const { container } = render(
      <ProductDetailPage
        item={unavailableProduct}
        variantSelection={{ mode: "none", variants: [] }}
        related={[]}
        canonicalUrl={null}
        whatsappUrl={null}
      />,
    );

    expect(screen.getByRole("heading", { name: unavailableProduct.name })).toBeTruthy();
    expect(screen.getByRole("main").firstElementChild?.className).toContain("max-w-[1400px]");
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

    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(breadcrumb.className).toContain("overflow-hidden");
    expect(breadcrumb.querySelector("ol")?.className).toContain("flex-nowrap");
    expect(breadcrumb.querySelector('[aria-current="page"]')?.className).toContain("text-ellipsis");
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
        canonicalUrl={null}
        whatsappUrl={null}
      />,
    );

    expect(screen.getByRole("region", { name: `Imágenes de ${item.name}` })).toBeTruthy();
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
        canonicalUrl={null}
        whatsappUrl={null}
      />,
    );

    expect(screen.getByRole("heading", { name: "Características" })).toBeTruthy();
    expect(screen.getByText("Algodón")).toBeTruthy();
    expect(screen.queryByRole("radio")).toBeNull();
    expect(screen.getByText("No hay imágenes disponibles para este producto.")).toBeTruthy();
  });

  it("uses the server-approved WhatsApp destination and exact native Share payload", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    setBrowserCapability("share", share);
    const canonicalUrl = "https://mandoquita.example/products/producto-sin-oferta";
    const whatsappUrl = "https://wa.me/573506928681?text=mensaje%20aprobado";

    render(
      <ProductDetailPage
        item={unavailableProduct}
        variantSelection={{ mode: "none", variants: [] }}
        related={[]}
        canonicalUrl={canonicalUrl}
        whatsappUrl={whatsappUrl}
      />,
    );

    const contact = screen.getByRole("link", { name: /Preguntar por este producto/ });
    expect(contact).toHaveAttribute("href", whatsappUrl);
    expect(contact).toHaveAttribute("target", "_blank");
    expect(contact).toHaveAttribute("rel", "noopener noreferrer");
    expect(contact).toHaveAttribute("referrerpolicy", "no-referrer");
    expect(
      screen.getByText(
        "Abriremos WhatsApp con el nombre y el enlace del producto listos para enviar.",
      ),
    ).toBeTruthy();

    const shareButton = screen.getByRole("button", { name: "Compartir producto" });
    fireEvent.click(shareButton);
    await waitFor(() => expect(share).toHaveBeenCalledWith({
      title: `${unavailableProduct.name} | Mandoquita`,
      text: `Mira “${unavailableProduct.name}” en Mandoquita.`,
      url: canonicalUrl,
    }));
    await waitFor(() => expect(shareButton).toHaveFocus());
    expect(screen.queryByRole("heading", { name: "Compartir enlace" })).toBeNull();
  });

  it("omits WhatsApp when absent and copies only the canonical fallback URL", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setBrowserCapability("clipboard", { writeText });
    const canonicalUrl = "https://mandoquita.example/products/producto-sin-oferta";

    render(
      <ProductDetailPage
        item={unavailableProduct}
        variantSelection={{ mode: "none", variants: [] }}
        related={[]}
        canonicalUrl={canonicalUrl}
        whatsappUrl={null}
      />,
    );

    expect(screen.queryByRole("link", { name: /WhatsApp/ })).toBeNull();
    expect(screen.queryByText(/WhatsApp se abrirá/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Compartir producto" }));
    expect(screen.getByRole("heading", { name: "Compartir enlace" })).toBeTruthy();
    expect(screen.getByRole("link", { name: `Enlace canónico de ${unavailableProduct.name}` })).toHaveAttribute("href", canonicalUrl);

    const copy = screen.getByRole("button", { name: "Copiar enlace" });
    fireEvent.click(copy);
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(canonicalUrl));
    expect(screen.getByRole("status")).toHaveTextContent("Enlace copiado");
    await waitFor(() => expect(copy).toHaveFocus());
  });

  it("keeps Share cancellation neutral and recovers from Share and Clipboard failure", async () => {
    const cancellation = Object.assign(new Error("cancelled"), { name: "AbortError" });
    const share = vi.fn().mockRejectedValueOnce(cancellation).mockRejectedValueOnce(new Error("share failed"));
    setBrowserCapability("share", share);
    setBrowserCapability("clipboard", { writeText: vi.fn().mockRejectedValue(new Error("denied")) });
    const canonicalUrl = "https://mandoquita.example/products/producto-sin-oferta";

    render(
      <ProductDetailPage
        item={unavailableProduct}
        variantSelection={{ mode: "none", variants: [] }}
        related={[]}
        canonicalUrl={canonicalUrl}
        whatsappUrl={null}
      />,
    );

    const shareButton = screen.getByRole("button", { name: "Compartir producto" });
    fireEvent.click(shareButton);
    await waitFor(() => expect(share).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("heading", { name: "Compartir enlace" })).toBeNull();
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    await waitFor(() => expect(shareButton).toHaveFocus());

    fireEvent.click(shareButton);
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("No pudimos abrir las opciones para compartir."));
    fireEvent.click(screen.getByRole("button", { name: "Copiar enlace" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("No pudimos copiar el enlace. Selecciónalo para copiarlo manualmente."));
    expect(screen.getByRole("link", { name: `Enlace canónico de ${unavailableProduct.name}` })).toHaveAttribute("href", canonicalUrl);
  });

  it("fails closed when canonical configuration is absent", () => {
    render(
      <ProductDetailPage
        item={unavailableProduct}
        variantSelection={{ mode: "none", variants: [] }}
        related={[]}
        canonicalUrl={null}
        whatsappUrl={null}
      />,
    );

    expect(screen.queryByRole("button", { name: "Compartir producto" })).toBeNull();
    expect(screen.queryByRole("link", { name: /WhatsApp/ })).toBeNull();
    expect(screen.getByText("Las opciones para contactar y compartir no están disponibles en este momento.")).toBeTruthy();
  });
});
