import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Badge, Card, Chip } from "../../src/components";

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
