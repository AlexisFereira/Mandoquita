import "@testing-library/jest-dom/vitest";

import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Icon, type IconName } from "../../src/components";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const iconNames: IconName[] = [
  "search", "menu", "close", "back", "forward", "previous", "next",
  "external-link", "contact", "information", "success", "warning", "error",
  "image-unavailable", "payment-information", "tag", "location",
];

describe("Icon", () => {
  it("renders every approved semantic name through the closed registry", () => {
    const { container } = render(
      <>{iconNames.map((name) => <Icon key={name} name={name} />)}</>,
    );

    expect(container.querySelectorAll("[data-icon]")).toHaveLength(iconNames.length);
    expect(container.querySelectorAll("svg")).toHaveLength(iconNames.length);
  });

  it("is decorative, hidden and unfocusable by default", () => {
    const { container } = render(<Icon name="search" />);
    const wrapper = container.querySelector("[data-icon='search']") as HTMLElement;
    const svg = wrapper.querySelector("svg") as SVGElement;

    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
    expect(svg).not.toHaveAttribute("role");
    expect(wrapper.className).toContain("shrink-0");
  });

  it("exposes one textual equivalent only in informative mode", () => {
    render(<Icon name="information" decorative={false} label="Información importante" />);

    const icon = screen.getByRole("img", { name: "Información importante" });
    expect(icon).not.toHaveAttribute("aria-hidden");
    expect(icon).toHaveAttribute("focusable", "false");
  });

  it("rejects an empty informative label at runtime", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => render(
      <Icon name="warning" decorative={false} label="   " />,
    )).toThrow("requires a non-empty label");
  });

  it("does not duplicate the accessible name of a labelled control", () => {
    render(<button type="button"><Icon name="search" />Buscar</button>);

    expect(screen.getByRole("button", { name: "Buscar" })).toBeTruthy();
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("uses governed semantic sizes and inherits current color", () => {
    const { container } = render(<Icon name="tag" size="lg" className="text-[rgb(var(--muted)/1)]" />);
    const wrapper = container.querySelector("[data-icon='tag']") as HTMLElement;
    const svg = wrapper.querySelector("svg") as SVGElement;

    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
    expect(svg).toHaveAttribute("stroke", "currentColor");
    expect(svg).toHaveAttribute("fill", "none");
    expect(wrapper.className).toContain("text-[rgb(var(--muted)/1)]");
  });

  it("uses a neutral information glyph for payment information", () => {
    const { container } = render(<Icon name="payment-information" />);
    const svg = container.querySelector("[data-icon='payment-information'] svg") as SVGElement;

    expect(svg).toHaveClass("lucide-info");
    expect(svg).not.toHaveClass("lucide-credit-card");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
