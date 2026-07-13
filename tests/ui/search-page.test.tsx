import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const router = vi.hoisted(() => ({
  push: vi.fn().mockResolvedValue(true),
  replace: vi.fn().mockResolvedValue(true),
}));

vi.mock("next/router", () => ({ useRouter: () => router }));

import SearchPage from "../../pages/buscar";
import type { ProductItem, ProductListResponse } from "../../src/types/catalog";

const product: ProductItem = {
  id: 1, slug: "audifonos-studio", name: "Audífonos Studio",
  description: "Audio claro.", shortDescription: null, price: "120.00", currency: "USD",
  imageUrl: "", images: [], brand: null, collection: null, genderApplicability: null,
  tags: [], seo: { title: null, description: null }, active: true, editorialApproved: true,
  published: true, commerciallyAvailable: true, featured: false, featuredOrder: null,
  category: { id: "cat_audio", slug: "audio", name: "Audio" },
  subcategory: { id: "sub_audio", slug: "audio", name: "Audio" },
  productType: { name: "Audífonos" },
};

function response(overrides: Partial<ProductListResponse["metadata"]> = {}): ProductListResponse {
  return {
    items: [product],
    metadata: { page: 1, limit: 12, totalItems: 1, totalPages: 1, ...overrides },
    filters: { category: null, subcategory: null, q: "audio" },
  };
}

afterEach(() => {
  cleanup();
  router.push.mockClear();
  router.replace.mockClear();
});

describe("Search page", () => {
  it("renders an initial labelled search without fabricated results", () => {
    render(<SearchPage query="" outcome="initial" response={null} />);

    expect(screen.getByRole("heading", { level: 1, name: "Buscar productos" })).toBeTruthy();
    expect(screen.getByRole("search")).toBeTruthy();
    expect(screen.getByLabelText("Buscar productos")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Buscar" }).className).toContain("sm:mb-7");
    expect(screen.queryByText(/productos encontrados/i)).toBeNull();
  });

  it("rejects whitespace without navigation and keeps focus for correction", async () => {
    render(<SearchPage query="" outcome="initial" response={null} />);
    const input = screen.getByLabelText("Buscar productos");
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.submit(screen.getByRole("search"));

    expect(await screen.findByText("Escribe un término para buscar productos.")).toBeTruthy();
    expect(document.activeElement).toBe(input);
    expect(router.push).not.toHaveBeenCalled();
  });

  it("presents canonical Product results and preserves query in pagination", () => {
    render(<SearchPage query="audio" outcome="results" response={response({ totalItems: 13, totalPages: 2 })} />);

    expect(screen.getByRole("heading", { name: "Resultados para “audio”" })).toBeTruthy();
    expect(screen.getByText("13 productos encontrados")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Ver detalles de Audífonos Studio" })).toBeTruthy();
    expect(screen.getByRole("link", { name: /siguiente/i }).getAttribute("href")).toBe(
      "/buscar?q=audio&page=2",
    );
  });

  it("treats no matches as a successful empty collection with recovery", () => {
    const empty = { ...response(), items: [], metadata: { page: 1, limit: 12, totalItems: 0, totalPages: 1 } };
    render(<SearchPage query="inexistente" outcome="results" response={empty} />);

    expect(screen.getByRole("heading", { name: "No encontramos productos para “inexistente”." })).toBeTruthy();
    expect(screen.getByRole("link", { name: /explorar categorías/i })).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("clears without executing an empty search", async () => {
    render(<SearchPage query="audio" outcome="results" response={response()} />);
    fireEvent.click(screen.getByRole("button", { name: "Limpiar búsqueda" }));

    await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/buscar", undefined, { scroll: false }));
    expect(router.push).not.toHaveBeenCalled();
  });
});
