import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Footer } from "../../src/components/Footer";

afterEach(() => cleanup());

describe("Footer", () => {
  it("contains only supported discovery destinations", () => {
    render(<Footer />);

    const destinations = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));

    expect(destinations).toEqual([
      "/",
      "/#destacados",
      "/#categorias",
      "/#contacto",
    ]);
    expect(document.body.textContent).not.toMatch(/shipping|checkout|carrito|comprar/i);
  });
});
