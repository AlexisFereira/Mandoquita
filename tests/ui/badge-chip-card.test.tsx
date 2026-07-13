import "@testing-library/jest-dom/vitest";

import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Badge, Card, Chip, PoliteStatus } from "../../src/components";

afterEach(() => {
  cleanup();
});

describe("Badge", () => {
  it("renders semantic variants", () => {
    const { container } = render(<Badge variant="success">Available</Badge>);

    const element = container.firstElementChild as HTMLElement;

    expect(element.className).toContain("text-[rgb(var(--success)/1)]");
    expect(screen.getByText("Available")).toBeTruthy();
  });
});

describe("Chip", () => {
  it("renders a removable chip as a button", () => {
    const onRemove = vi.fn();

    render(
      <Chip removable onRemove={onRemove} selected>
        Women
      </Chip>,
    );

    const chip = screen.getByRole("button", { name: "Remove Women" });

    expect(chip.className).toContain("border-[rgb(var(--primary)/0.22)]");
    expect(chip.className).toContain("min-h-11");
    fireEvent.click(chip);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("supports the explicit removable discriminant", () => {
    const onRemove = vi.fn();
    render(<Chip mode="removable" onRemove={onRemove}>Material</Chip>);

    fireEvent.click(screen.getByRole("button", { name: "Remove Material" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("acts as a controlled, labelled single-selection option", () => {
    const onSelect = vi.fn();
    render(
      <fieldset>
        <legend>Color</legend>
        <Chip mode="option" value="azul" selected onSelect={onSelect}>Azul</Chip>
        <Chip mode="option" value="verde" selected={false} onSelect={onSelect}>Verde bosque</Chip>
      </fieldset>,
    );

    const selected = screen.getByRole("radio", { name: "Azul" });
    const next = screen.getByRole("radio", { name: "Verde bosque" });
    expect(selected).toHaveAttribute("aria-checked", "true");
    expect(selected.className).toContain("min-h-11");
    fireEvent.click(next);
    expect(onSelect).toHaveBeenCalledWith("verde");
  });

  it("keeps an unavailable option understandable without inventory language", () => {
    const onSelect = vi.fn();
    render(
      <Chip mode="option" value="grande" selected={false} unavailable unavailableText="Esta combinación no está disponible." onSelect={onSelect}>
        Grande
      </Chip>,
    );

    const option = screen.getByRole("radio", { name: "Grande" });
    expect(option).toHaveAttribute("aria-disabled", "true");
    expect(option).toHaveAccessibleDescription("Esta combinación no está disponible.");
    expect(option.className).toContain("border-dashed");
    expect(option.className).not.toMatch(/(?:^|\s)opacity-/);
    fireEvent.click(option);
    expect(onSelect).not.toHaveBeenCalled();
    expect(option.textContent).not.toMatch(/stock|agotado/i);
  });
});

describe("PoliteStatus", () => {
  it("announces meaningful updates without moving focus", () => {
    render(<PoliteStatus>Color seleccionado: Azul.</PoliteStatus>);
    expect(screen.getByRole("status")).toHaveTextContent("Color seleccionado: Azul.");
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });
});

describe("Card", () => {
  it("applies elevation and interactive treatment", () => {
    const { container } = render(
      <Card elevation="lg" interactive>
        Card body
      </Card>,
    );

    const element = container.firstElementChild as HTMLElement;

    expect(element.className).toContain("shadow-[var(--shadow-lg)]");
    expect(element.className).toContain("hover:-translate-y-0.5");
    expect(screen.getByText("Card body")).toBeTruthy();
  });
});
