import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { vi } from "vitest";

import { Button } from "../../src/components/Button";

afterEach(() => {
  cleanup();
});

describe("Button", () => {
  it("renders the primary variant by default", () => {
    render(<Button>Primary action</Button>);

    const button = screen.getByRole("button", { name: "Primary action" });

    expect(button.getAttribute("data-variant")).toBe("primary");
    expect(button.className).not.toContain("focus-visible:ring");
    expect(button.getAttribute("style") ?? "").toContain("border-style: solid");
  });

  it("supports the secondary variant", () => {
    render(<Button variant="secondary">Secondary action</Button>);

    const button = screen.getByRole("button", { name: "Secondary action" });

    expect(button.getAttribute("data-variant")).toBe("secondary");
    expect(button.className).toContain("motion-reduce:transform-none");
    expect(button.getAttribute("style") ?? "").toContain("box-shadow: var(--shadow-sm)");
  });

  it("supports the ghost variant", () => {
    render(<Button variant="ghost">Ghost action</Button>);

    const button = screen.getByRole("button", { name: "Ghost action" });

    expect(button.getAttribute("data-variant")).toBe("ghost");
    expect(button.getAttribute("style") ?? "").toContain(
      "background-color: transparent",
    );
    expect(button.getAttribute("style") ?? "").toContain(
      "border-color: transparent",
    );
  });

  it("supports the outline variant", () => {
    render(<Button variant="outline">Outline action</Button>);

    const button = screen.getByRole("button", { name: "Outline action" });

    expect(button.getAttribute("data-variant")).toBe("outline");
    expect(button.getAttribute("style") ?? "").toContain(
      "background-color: transparent",
    );
    expect(button.getAttribute("style") ?? "").toContain("border-style: solid");
  });

  it("supports the danger variant and lg size", () => {
    render(
      <Button variant="danger" size="lg">
        Delete item
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Delete item" });

    expect(button.getAttribute("data-variant")).toBe("danger");
    expect(button.className).toContain("px-8 py-4 text-base");
    expect(button.className).toContain("motion-reduce:transform-none");
  });

  it("keeps every size at the minimum 44px interaction height", () => {
    render(<Button size="sm">Compact action</Button>);

    expect(screen.getByRole("button", { name: "Compact action" }).className).toContain(
      "min-h-11",
    );
  });

  it("supports the shared inverse-surface action", () => {
    render(<Button variant="inverse">Inverse action</Button>);

    expect(screen.getByRole("button", { name: "Inverse action" }).dataset.variant).toBe(
      "inverse",
    );
  });

  it("activates links with keyboard Enter", () => {
    const onClick = vi.fn();

    render(
      <Button href="#categories" onClick={onClick}>
        Browse categories
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Browse categories" });
    link.focus();
    link.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
