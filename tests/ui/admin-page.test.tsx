import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import AdminPage from "../../pages/admin";
import { changedEditorValues, productToEditorValues, validateAdminProduct } from "../../src/features/admin/validation";
import type { AdminProduct } from "../../src/features/admin/types";

const session = { authorized: true as const, idleExpiresAt: "2026-07-13T18:30:00.000Z", absoluteExpiresAt: "2026-07-14T02:00:00.000Z", csrfToken: "csrf-test" };
const product: AdminProduct = {
  id: 1, slug: "audifonos-studio", name: "Audífonos Studio", shortDescription: "Audio claro.", description: "Descripción", brand: "Mandoquita", collection: null,
  genderApplicability: "unisex", seoTitle: null, seoDescription: null, price: "120.00", currency: "USD", active: true, editorialApproved: true,
  published: true, commerciallyAvailable: true, featured: false, featuredOrder: null, productType: { name: "Audífonos" },
  subcategory: { id: 2, slug: "audio", name: "Audio" }, category: { id: 3, slug: "tecnologia", name: "Tecnología" }, hasVariant: true,
  updatedAt: "2026-07-13T18:00:00.000Z",
};
const types = { items: [{ name: "Audífonos", subcategory: product.subcategory, category: product.category }] };
const list = { items: [product], metadata: { page: 1, limit: 20, totalItems: 1, totalPages: 1 }, filters: { q: null, published: null, commerciallyAvailable: null, featured: null, active: null, category: null, productType: null } };

function json(body: unknown, status = 200, headers?: Record<string, string>) {
  return Promise.resolve(new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } }));
}

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("Product Admin page", () => {
  it("renders an isolated access gate and validates six numeric digits locally", async () => {
    const fetch = vi.fn(() => json({ error: "Unauthorized" }, 401));
    vi.stubGlobal("fetch", fetch);
    render(<AdminPage />);

    expect(await screen.findByRole("heading", { name: "Acceso administrativo" })).toBeTruthy();
    expect(screen.queryByRole("banner")).toBeNull();
    const code = screen.getByLabelText("Código de acceso");
    fireEvent.change(code, { target: { value: "12ab" } });
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(await screen.findByText("Ingresa los seis dígitos.")).toBeTruthy();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("submits the credential only in the request body and opens the authorized list", async () => {
    const fetch = vi.fn((input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/admin/session" && init?.method === "POST") return json(session);
      if (url === "/api/admin/session") return json({ error: "Unauthorized" }, 401);
      if (url.startsWith("/api/admin/products?")) return json(list);
      if (url === "/api/admin/product-types") return json(types);
      throw new Error(`Unexpected request ${url}`);
    });
    vi.stubGlobal("fetch", fetch);
    render(<AdminPage />);
    const code = await screen.findByLabelText("Código de acceso");
    fireEvent.change(code, { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(await screen.findByRole("heading", { name: "Productos" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Editar Audífonos Studio" })).toBeTruthy();
    const loginCall = fetch.mock.calls.find(([, init]) => init?.method === "POST");
    expect(loginCall?.[0]).toBe("/api/admin/session");
    expect(loginCall?.[1]?.body).toBe(JSON.stringify({ code: "123456" }));
    expect(String(loginCall?.[0])).not.toContain("123456");
  });

  it("loads the grouped editor and blocks an invalid publication state", async () => {
    const fetch = vi.fn((input: string | URL | Request, _init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/admin/session") return json(session);
      if (url.startsWith("/api/admin/products?")) return json(list);
      if (url === "/api/admin/product-types") return json(types);
      if (url === "/api/admin/products/1") return json({ item: product });
      throw new Error(`Unexpected request ${url}`);
    });
    vi.stubGlobal("fetch", fetch);
    render(<AdminPage />);
    fireEvent.click(await screen.findByRole("button", { name: "Editar Audífonos Studio" }));
    expect(await screen.findByRole("heading", { name: "Audífonos Studio" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Clasificación" })).toBeTruthy();

    fireEvent.click(screen.getByLabelText("Aprobación editorial"));
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(await screen.findAllByText("Para publicar, activa la aprobación editorial.")).toHaveLength(2);
    expect(screen.getByLabelText("Publicado").getAttribute("aria-describedby")).toContain("admin-published-error");
    expect(fetch.mock.calls.filter(([, init]) => init?.method === "PATCH")).toHaveLength(0);
  });

  it("maps, validates and diffs the exact editable baseline", () => {
    const baseline = productToEditorValues(product);
    expect(validateAdminProduct(baseline, true)).toEqual({});
    const invalid = { ...baseline, price: "12.345", currency: "usd", slug: "Slug incorrecto" };
    expect(validateAdminProduct(invalid, true)).toMatchObject({ price: expect.any(String), currency: expect.any(String), slug: expect.any(String) });
    expect(changedEditorValues(baseline, { ...baseline, name: "Nuevo nombre" })).toEqual({ name: "Nuevo nombre" });
  });

  it("applies combinable search and publication filters to the authorized request", async () => {
    const fetch = vi.fn((input: string | URL | Request) => {
      const url = String(input);
      if (url === "/api/admin/session") return json(session);
      if (url.startsWith("/api/admin/products?")) return json(list);
      if (url === "/api/admin/product-types") return json(types);
      throw new Error(`Unexpected request ${url}`);
    });
    vi.stubGlobal("fetch", fetch);
    render(<AdminPage />);
    fireEvent.change(await screen.findByLabelText("Nombre o slug"), { target: { value: "  audífonos  " } });
    fireEvent.change(screen.getByLabelText("Publicación"), { target: { value: "false" } });
    fireEvent.click(screen.getByRole("button", { name: "Aplicar filtros" }));

    await waitFor(() => expect(fetch.mock.calls.some(([input]) => {
      const url = String(input);
      return url.includes("q=aud%C3%ADfonos") && url.includes("published=false");
    })).toBe(true));
    expect(screen.getByRole("button", { name: "Quitar Publicación: No" })).toBeTruthy();
  });

  it("sends only changed fields with CSRF and presents server-confirmed success", async () => {
    const fetch = vi.fn((input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/admin/session") return json(session);
      if (url.startsWith("/api/admin/products?")) return json(list);
      if (url === "/api/admin/product-types") return json(types);
      if (url === "/api/admin/products/1" && init?.method === "PATCH") return json({ item: { ...product, name: "Audífonos Pro", updatedAt: "2026-07-13T18:10:00.000Z" } });
      if (url === "/api/admin/products/1") return json({ item: product });
      throw new Error(`Unexpected request ${url}`);
    });
    vi.stubGlobal("fetch", fetch);
    render(<AdminPage />);
    fireEvent.click(await screen.findByRole("button", { name: "Editar Audífonos Studio" }));
    fireEvent.change(await screen.findByLabelText("Nombre"), { target: { value: "Audífonos Pro" } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(await screen.findByText("Cambios guardados correctamente.")).toBeTruthy();
    const patchCall = fetch.mock.calls.find(([, init]) => init?.method === "PATCH");
    expect(patchCall?.[1]?.headers).toEqual(expect.objectContaining({ "x-csrf-token": "csrf-test" }));
    expect(JSON.parse(String(patchCall?.[1]?.body))).toEqual({ expectedUpdatedAt: product.updatedAt, name: "Audífonos Pro" });
  });

  it("offers a safe reload after an optimistic concurrency conflict", async () => {
    const fetch = vi.fn((input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/admin/session") return json(session);
      if (url.startsWith("/api/admin/products?")) return json(list);
      if (url === "/api/admin/product-types") return json(types);
      if (url === "/api/admin/products/1" && init?.method === "PATCH") return json({ error: "Conflict" }, 409);
      if (url === "/api/admin/products/1") return json({ item: product });
      throw new Error(`Unexpected request ${url}`);
    });
    vi.stubGlobal("fetch", fetch);
    render(<AdminPage />);
    fireEvent.click(await screen.findByRole("button", { name: "Editar Audífonos Studio" }));
    fireEvent.change(await screen.findByLabelText("Nombre"), { target: { value: "Cambio concurrente" } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(await screen.findByRole("button", { name: "Recargar información actual" })).toBeTruthy();
  });

  it("removes authorized content and recovers at the gate when the session expires", async () => {
    const fetch = vi.fn((input: string | URL | Request) => {
      const url = String(input);
      if (url === "/api/admin/session") return json(session);
      if (url.startsWith("/api/admin/products?")) return json({ error: "Unauthorized" }, 401);
      if (url === "/api/admin/product-types") return json(types);
      throw new Error(`Unexpected request ${url}`);
    });
    vi.stubGlobal("fetch", fetch);
    render(<AdminPage />);
    expect(await screen.findByText("Tu sesión terminó. Ingresa el código para continuar.")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Acceso administrativo" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Productos" })).toBeNull();
  });

  it("revokes the session with CSRF and returns to the gate", async () => {
    const fetch = vi.fn((input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/admin/session" && init?.method === "DELETE") return Promise.resolve(new Response(null, { status: 204 }));
      if (url === "/api/admin/session") return json(session);
      if (url.startsWith("/api/admin/products?")) return json(list);
      if (url === "/api/admin/product-types") return json(types);
      throw new Error(`Unexpected request ${url}`);
    });
    vi.stubGlobal("fetch", fetch);
    render(<AdminPage />);
    fireEvent.click(await screen.findByRole("button", { name: "Salir" }));
    expect(await screen.findByRole("heading", { name: "Acceso administrativo" })).toBeTruthy();
    await waitFor(() => expect(fetch).toHaveBeenCalledWith("/api/admin/session", expect.objectContaining({ method: "DELETE", headers: { "x-csrf-token": "csrf-test" } })));
  });
});
