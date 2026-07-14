import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import AdminPage from "../../pages/admin";

const account = { id: "super-1", username: "superadmin", role: "SUPER_ADMIN", mustChangePassword: false };
const session = { authorized: true, idleExpiresAt: "2026-07-13T20:00:00.000Z", absoluteExpiresAt: "2026-07-14T02:00:00.000Z", csrfToken: "csrf-v2", account };
const product = { id: 1, slug: "reloj-clasico", name: "Reloj clásico", price: "100.00", currency: "USD", active: true, editorialApproved: true, published: true, commerciallyAvailable: true, featured: false, featuredOrder: null, productType: null, subcategory: null, category: null, retiredAt: null, baseVariant: { id: "base", sku: "RELOJ-BASE", active: true }, updatedAt: "2026-07-13T18:00:00.000Z" };
const list = { items: [product], metadata: { page: 1, limit: 20, totalItems: 1, totalPages: 1 }, filters: {} };
function json(body: unknown, status = 200) { return Promise.resolve(new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } })); }
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("Admin Catalog Management V2", () => {
  it("uses named credentials and never sends them in the URL", async () => {
    const fetch = vi.fn((input: string | URL | Request, init?: RequestInit) => {
      const url = String(input); if (url === "/api/admin/session" && init?.method === "POST") return json(session);
      if (url === "/api/admin/session") return json({ error: "Unauthorized" }, 401);
      if (url.startsWith("/api/admin/products?")) return json(list); throw new Error(`Unexpected ${url}`);
    }); vi.stubGlobal("fetch", fetch); render(<AdminPage />);
    fireEvent.change(await screen.findByLabelText("Usuario"), { target: { value: "superadmin" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "Una contraseña temporal 2026" } });
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(await screen.findByRole("heading", { name: "Productos" })).toBeTruthy();
    const call = fetch.mock.calls.find(([, init]) => init?.method === "POST");
    expect(call?.[1]?.body).toBe(JSON.stringify({ username: "superadmin", password: "Una contraseña temporal 2026" }));
    expect(String(call?.[0])).not.toContain("superadmin");
  });

  it("restricts a temporary session to mandatory password replacement", async () => {
    vi.stubGlobal("fetch", vi.fn(() => json({ ...session, account: { ...account, mustChangePassword: true } })));
    render(<AdminPage />); expect(await screen.findByRole("heading", { name: "Reemplaza tu contraseña" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Productos" })).toBeNull();
    expect(screen.getByLabelText("Contraseña temporal").getAttribute("autocomplete")).toBe("current-password");
  });

  it("renders one semantic Product table and row-bound actions", async () => {
    vi.stubGlobal("fetch", vi.fn((input: string | URL | Request) => String(input).startsWith("/api/admin/products?") ? json(list) : json(session)));
    render(<AdminPage />); const table = await screen.findByRole("table", { name: /Productos vigentes/ });
    expect(table.querySelectorAll("th[scope=row]")).toHaveLength(1);
    expect(screen.getByText("RELOJ-BASE")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Editar Reloj clásico" })).toBeTruthy();
  });

  it("omits account management for a regular Administrator", async () => {
    const adminSession = { ...session, account: { ...account, id: "admin-1", role: "ADMIN", username: "catalogo" } };
    vi.stubGlobal("fetch", vi.fn((input: string | URL | Request) => String(input).startsWith("/api/admin/products?") ? json(list) : json(adminSession)));
    render(<AdminPage />); await screen.findByRole("heading", { name: "Productos" });
    expect(screen.queryByRole("button", { name: "Cuentas de administradores" })).toBeNull();
  });

  it("shows the protected Superadministrator and Administrator lifecycle actions", async () => {
    const administrator = { id: "admin-1", username: "catalogo", role: "ADMIN", enabled: true, mustChangePassword: false, lastLoginAt: null, createdAt: "2026-07-13T18:00:00.000Z", updatedAt: "2026-07-13T18:00:00.000Z" };
    const superRow = { ...administrator, id: "super-1", username: "superadmin", role: "SUPER_ADMIN" };
    vi.stubGlobal("fetch", vi.fn((input: string | URL | Request) => { const url=String(input); if(url==="/api/admin/accounts")return json({items:[superRow,administrator]}); if(url.startsWith("/api/admin/products?"))return json(list); return json(session); }));
    render(<AdminPage />); fireEvent.click(await screen.findByRole("button", { name: "Cuentas de administradores" }));
    expect(await screen.findByText("Cuenta protegida")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Restablecer contraseña de catalogo" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /superadmin/ })).toBeNull();
  });

  it("removes protected content when the session expires", async () => {
    vi.stubGlobal("fetch", vi.fn((input: string | URL | Request) => String(input).startsWith("/api/admin/products?") ? json({ error: "Unauthorized" }, 401) : json(session)));
    render(<AdminPage />); expect(await screen.findByText("Tu sesión administrativa terminó. Ingresa nuevamente.")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Productos" })).toBeNull();
  });
});
