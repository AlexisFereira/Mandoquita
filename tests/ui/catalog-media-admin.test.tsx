import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import AdminPage from "../../pages/admin";

const session = { authorized: true, idleExpiresAt: "2026-07-13T20:00:00.000Z", absoluteExpiresAt: "2026-07-14T02:00:00.000Z", csrfToken: "csrf-media", account: { id: "admin-1", username: "catalogo", role: "ADMIN", mustChangePassword: false } };
const product = { id: 1, slug: "reloj-clasico", name: "Reloj clásico", price: "100.00", currency: "USD", active: true, editorialApproved: true, published: true, commerciallyAvailable: true, featured: false, featuredOrder: null, productType: null, subcategory: null, category: null, updatedAt: "2026-07-13T18:00:00.000Z" };
const imageOne = { id: "cmg123456789012345678901", previewUrl: "/images/one.webp", altText: "Vista frontal del reloj", position: 0, isPrimary: true, referencedByVariants: true, variantReferenceCount: 1, contentType: "image/webp", width: 800, height: 800, size: 1000, checksumSha256: "abc", updatedAt: "2026-07-13T18:00:00.000Z" };
const imageTwo = { ...imageOne, id: "cmg223456789012345678901", previewUrl: "/images/two.webp", altText: "Vista lateral del reloj", position: 1, isPrimary: false, referencedByVariants: false, variantReferenceCount: 0 };
const productMedia = { product: { id: 1, slug: product.slug, name: product.name, updatedAt: product.updatedAt }, images: [imageOne, imageTwo] };
const category = { id: "cat-audio", slug: "audio", name: "Audio", active: true, visible: true, image: { previewUrl: "/images/audio.webp", altText: "Audífonos sobre una mesa", contentType: "image/webp", width: 800, height: 800, size: 1000, checksumSha256: "def" }, updatedAt: product.updatedAt };

function json(body: unknown, status = 200) { return Promise.resolve(new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } })); }
function baseFetch(input: string | URL | Request, init?: RequestInit) {
  const url = String(input);
  if (url === "/api/admin/session") return json(session);
  if (url.startsWith("/api/admin/products?")) return json({ items: [product], metadata: { page: 1, limit: 20, totalItems: 1, totalPages: 1 }, filters: {} });
  if (url === "/api/admin/product-types") return json({ items: [] });
  if (url === "/api/admin/products/1/images" && !init?.method) return json(productMedia);
  throw new Error(`Unexpected request ${url} ${init?.method ?? "GET"}`);
}

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("Catalog Media Admin", () => {
  it("renders one ordered gallery with Primary and Variant-reference context", async () => {
    vi.stubGlobal("fetch", vi.fn(baseFetch));
    render(<AdminPage />);
    fireEvent.click(await screen.findByRole("button", { name: "Administrar imágenes de Reloj clásico" }));

    expect(await screen.findByRole("heading", { name: "Galería del producto" })).toBeTruthy();
    expect(screen.getByRole("list").querySelectorAll("li")).toHaveLength(2);
    expect(screen.getByText("Usada por variantes (1)")).toBeTruthy();
    expect(screen.getByText("No puedes eliminar esta imagen porque está usada por variantes.")).toBeTruthy();
    expect(screen.getAllByRole("button", { name: "Reemplazar imagen" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Eliminar imagen" })).toHaveLength(1);
  });

  it("supports keyboard-operable complete reorder and explicit Primary selection", async () => {
    const fetch = vi.fn((input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/admin/products/1/images" && init?.method === "PATCH") {
        const body = JSON.parse(String(init.body));
        return json({ ...productMedia, images: body.imageIds[0] === imageTwo.id ? [imageTwo, imageOne] : productMedia.images });
      }
      return baseFetch(input, init);
    });
    vi.stubGlobal("fetch", fetch);
    render(<AdminPage />);
    fireEvent.click(await screen.findByRole("button", { name: "Administrar imágenes de Reloj clásico" }));
    fireEvent.click(await screen.findByRole("button", { name: "Reordenar galería" }));
    fireEvent.click(screen.getByRole("button", { name: "Mover antes imagen 2" }));
    expect(screen.getByText("Imagen movida a la posición 1 de 2. Orden sin guardar.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Guardar orden" }));
    expect(await screen.findByText("Orden de galería guardado")).toBeTruthy();
    const patch = fetch.mock.calls.find(([, init]) => init?.method === "PATCH");
    expect(JSON.parse(String(patch?.[1]?.body)).imageIds).toEqual([imageTwo.id, imageOne.id]);
    expect(patch?.[1]?.headers).toEqual(expect.objectContaining({ "x-csrf-token": "csrf-media", "Idempotency-Key": expect.any(String) }));
  });

  it("keeps temporary upload distinct from confirmed Product association", async () => {
    const upload = { id: "cmupload123456789012345", previewUrl: "/images/upload.webp", contentType: "image/webp", size: 900, width: 600, height: 600, checksumSha256: "hash", expiresAt: "2026-07-14T18:00:00.000Z" };
    const fetch = vi.fn((input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/admin/media-uploads?kind=product" && init?.method === "POST") return json({ upload }, 201);
      if (url === "/api/admin/products/1/images" && init?.method === "POST") return json({ ...productMedia, images: [...productMedia.images, { ...imageTwo, id: "cmg323456789012345678901", altText: "Detalle de la corona", position: 2 }] }, 201);
      return baseFetch(input, init);
    });
    vi.stubGlobal("fetch", fetch);
    vi.stubGlobal("URL", { ...URL, createObjectURL: vi.fn(() => "blob:preview"), revokeObjectURL: vi.fn() });
    render(<AdminPage />);
    fireEvent.click(await screen.findByRole("button", { name: "Administrar imágenes de Reloj clásico" }));
    fireEvent.click(await screen.findByRole("button", { name: "Agregar imagen" }));
    fireEvent.change(screen.getByLabelText("Archivo de imagen"), { target: { files: [new File(["image"], "reloj.webp", { type: "image/webp" })] } });
    fireEvent.change(screen.getByLabelText("Texto alternativo"), { target: { value: "Detalle de la corona" } });
    fireEvent.click(screen.getByRole("button", { name: "Subir imagen" }));
    expect(await screen.findByText("Carga lista para guardar.")).toBeTruthy();
    expect(screen.getByText("La imagen todavía no forma parte del catálogo.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Agregar a la galería" }));
    expect(await screen.findByText("Imagen agregada a la galería")).toBeTruthy();
  });

  it("keeps Category media separate and confirms optional removal", async () => {
    const fetch = vi.fn((input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      if (url.startsWith("/api/admin/categories?")) return json({ items: [{ ...category, description: null, sortOrder: 1, retiredAt: null, dependencies: { subcategories: 0, productTypes: 0, products: 0 }, createdAt: product.updatedAt }], metadata: { page: 1, limit: 20, totalItems: 1, totalPages: 1 }, filters: {} });
      if (url === "/api/admin/categories/cat-audio/image" && init?.method === "DELETE") return json({ category: { ...category, image: null, updatedAt: "2026-07-13T18:05:00.000Z" } });
      return baseFetch(input, init);
    });
    vi.stubGlobal("fetch", fetch);
    render(<AdminPage />);
    fireEvent.click(await screen.findByRole("button", { name: "Categorías" }));
    fireEvent.click(await screen.findByRole("button", { name: "Administrar imágenes" }));
    fireEvent.click(await screen.findByRole("button", { name: "Administrar imagen de Audio" }));
    expect(screen.getByRole("heading", { name: "Imagen de la categoría" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Reordenar galería" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Solicitar eliminar imagen de Audio" }));
    expect(screen.getByText("La categoría seguirá siendo válida sin imagen. Esta acción no ofrece deshacer.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Eliminar imagen" }));
    expect(await screen.findByText("Imagen de categoría eliminada")).toBeTruthy();
    expect(screen.getByText("Esta categoría no tiene imagen. La imagen es opcional.")).toBeTruthy();
  });

  it("removes stale authorized media content when the session expires", async () => {
    const fetch = vi.fn((input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/admin/products/1/images") return json({ error: "Unauthorized" }, 401);
      return baseFetch(input, init);
    });
    vi.stubGlobal("fetch", fetch);
    render(<AdminPage />);
    fireEvent.click(await screen.findByRole("button", { name: "Administrar imágenes de Reloj clásico" }));
    expect(await screen.findByText("Tu sesión administrativa terminó. Ingresa nuevamente.")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Acceso administrativo" })).toBeTruthy();
    await waitFor(() => expect(screen.queryByRole("heading", { name: "Galería del producto" })).toBeNull());
  });
});
