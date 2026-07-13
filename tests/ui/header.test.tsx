import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Header } from "../../src/components/Header";

describe("Header", () => {
  afterEach(() => cleanup());

  it("renders the approved identity and Spanish navigation", () => {
    render(<Header />);

    expect(screen.getByRole("banner").className).toContain("sticky");
    expect(screen.getByRole("banner").className).toContain("site-header");
    const logo = screen.getByRole("img", { name: "Mandoquita" });
    expect(logo.getAttribute("src")).toBe("/images/logo.png");
    expect(logo.getAttribute("width")).toBe("1024");
    expect(logo.getAttribute("height")).toBe("672");
    expect(logo.className).toContain("h-[50px]");
    expect(logo.className).toContain("w-auto");

    const navigation = screen.getByRole("navigation", {
      name: "Navegación principal",
    });
    expect(navigation.textContent).toContain("Inicio");
    expect(navigation.textContent).toContain("Destacados");
    expect(navigation.textContent).toContain("Categorías");
    expect(navigation.textContent).toContain("Contacto");
  });

  it("contains only valid catalog destinations", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: "Inicio" }).getAttribute("href")).toBe("/");
    expect(screen.getByRole("link", { name: "Destacados" }).getAttribute("href")).toBe(
      "/#destacados",
    );
    expect(screen.getByRole("link", { name: "Categorías" }).getAttribute("href")).toBe(
      "/#categorias",
    );
    expect(screen.queryByText(/carrito|checkout|comprar/i)).toBeNull();
  });

  it("opens and closes the accessible mobile navigation", () => {
    render(<Header />);

    const toggle = screen.getByRole("button", { name: "Abrir navegación" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(toggle);
    expect(
      screen.getByRole("button", { name: "Cerrar navegación" }).getAttribute("aria-expanded"),
    ).toBe("true");
    expect(screen.getByRole("navigation", { name: "Navegación móvil" })).toBeTruthy();
  });
});
