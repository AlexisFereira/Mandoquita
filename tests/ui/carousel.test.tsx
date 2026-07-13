/** @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";

import React from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Carousel } from "../../src/components/Carousel";

const slides = [
  {
    title: "Slide 1",
    description: "First",
    imageUrl: "/images/banners/banner-1.svg",
  },
  {
    title: "Slide 2",
    description: "Second",
    imageUrl: "/images/banners/banner-2.svg",
  },
  {
    title: "Slide 3",
    description: "Third",
    imageUrl: "/images/banners/banner-3.svg",
  },
];

const galleryItems = [
  { id: "front", src: "/front.jpg", alt: "Vista frontal", controlLabel: "Mostrar vista frontal" },
  { id: "side", src: "/side.jpg", alt: "Vista lateral", controlLabel: "Mostrar vista lateral" },
];

function getTrackElement() {
  const section = screen.getByLabelText("Contenido destacado");
  return section.querySelector(":scope > div") as HTMLDivElement;
}

describe("Carousel", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("auto-advances slide every 6 seconds", () => {
    vi.useFakeTimers();

    render(<Carousel slides={slides} />);

    const first = screen.getByLabelText("Ir a la diapositiva 1");
    const second = screen.getByLabelText("Ir a la diapositiva 2");

    expect(first).toHaveAttribute("aria-current", "true");

    act(() => {
      vi.advanceTimersByTime(6100);
    });

    expect(second).toHaveAttribute("aria-current", "true");
  });

  it("pauses autoplay on hover and resumes after hover leaves", () => {
    vi.useFakeTimers();

    render(<Carousel slides={slides} />);

    const section = screen.getByLabelText("Contenido destacado");
    const first = screen.getByLabelText("Ir a la diapositiva 1");
    const second = screen.getByLabelText("Ir a la diapositiva 2");

    fireEvent.mouseEnter(section);

    act(() => {
      vi.advanceTimersByTime(7000);
    });

    expect(first).toHaveAttribute("aria-current", "true");
    expect(second).toHaveAttribute("aria-current", "false");

    fireEvent.mouseLeave(section);

    act(() => {
      vi.advanceTimersByTime(6100);
    });

    expect(second).toHaveAttribute("aria-current", "true");
  });

  it("supports manual navigation and keeps controls functional", () => {
    render(<Carousel slides={slides} />);

    const next = screen.getByLabelText("Diapositiva siguiente");
    const prev = screen.getByLabelText("Diapositiva anterior");

    fireEvent.click(next);
    expect(screen.getByLabelText("Ir a la diapositiva 2")).toHaveAttribute(
      "aria-current",
      "true",
    );

    fireEvent.click(prev);
    expect(screen.getByLabelText("Ir a la diapositiva 1")).toHaveAttribute(
      "aria-current",
      "true",
    );

    fireEvent.click(screen.getByLabelText("Ir a la diapositiva 3"));
    expect(screen.getByLabelText("Ir a la diapositiva 3")).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("renders slide titles, descriptions, and supported actions", () => {
    render(
      <Carousel
        slides={[
          {
            title: "Explora con claridad",
            description: "Encuentra productos fácilmente.",
            imageUrl: "/images/banners/banner-1.svg",
            action: { label: "Ver productos", href: "#destacados" },
          },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Explora con claridad" })).toBeTruthy();
    expect(screen.getByText("Encuentra productos fácilmente.")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Ver productos" }).getAttribute("href")).toBe(
      "#destacados",
    );
  });

  it("renders nothing when no slides are available", () => {
    const { container } = render(<Carousel slides={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("disables autoplay controls when there is a single slide", () => {
    vi.useFakeTimers();

    render(
      <Carousel
        slides={[{ title: "Single", imageUrl: "/images/banners/banner-1.svg" }]}
      />,
    );

    expect(screen.queryByLabelText("Diapositiva siguiente")).toBeNull();
    expect(screen.queryByLabelText("Diapositiva anterior")).toBeNull();

    const track = getTrackElement();
    expect(track.style.transform).toContain("0%");

    act(() => {
      vi.advanceTimersByTime(7000);
    });

    expect(track.style.transform).toContain("0%");
  });

  it("disables autoplay and transitions when reduced motion is requested", () => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", () => ({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<Carousel slides={slides} />);
    const track = getTrackElement();

    act(() => {
      vi.advanceTimersByTime(7000);
    });

    expect(screen.getByLabelText("Ir a la diapositiva 1")).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(track.style.transition).toBe("none");
  });

  it("preserves slider structure for mobile, tablet, and desktop widths", () => {
    const viewportWidths = [390, 834, 1440];

    for (const width of viewportWidths) {
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        writable: true,
        value: width,
      });
      window.dispatchEvent(new Event("resize"));

      const { unmount } = render(<Carousel slides={slides} />);

      const section = screen.getByLabelText("Contenido destacado");
      const track = getTrackElement();
      const mediaFrame = section.querySelector(
        "article > div",
      ) as HTMLDivElement;

      expect(section).toBeInTheDocument();
      expect(section.className).toContain("w-full");
      expect(track.style.width).toBe("300%");
      expect(mediaFrame.className).toContain("w-full");
      expect(mediaFrame.className).toContain("overflow-hidden");

      unmount();
    }
  });

  it("supports uncontrolled direct gallery selection without autoplay", () => {
    vi.useFakeTimers();
    render(<Carousel mode="gallery" items={galleryItems} aria-label="Imágenes del producto" />);

    const front = screen.getByRole("button", { name: /mostrar vista frontal/i });
    const side = screen.getByRole("button", { name: /mostrar vista lateral/i });
    expect(front).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Imagen 1 de 2.")).toBeTruthy();

    side.focus();
    fireEvent.click(side);
    expect(side).toHaveAttribute("aria-pressed", "true");
    expect(document.activeElement).toBe(side);
    expect(screen.getByText("Imagen 2 de 2.")).toBeTruthy();

    act(() => vi.advanceTimersByTime(12000));
    expect(side).toHaveAttribute("aria-pressed", "true");
  });

  it("supports controlled gallery selection without reciprocal changes", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Carousel mode="gallery" items={galleryItems} activeItemId="front" onActiveItemChange={onChange} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /mostrar vista lateral/i }));
    expect(onChange).toHaveBeenCalledWith("side");
    expect(screen.getByRole("button", { name: /mostrar vista frontal/i })).toHaveAttribute("aria-pressed", "true");

    rerender(<Carousel mode="gallery" items={galleryItems} activeItemId="side" onActiveItemChange={onChange} />);
    expect(screen.getByRole("button", { name: /mostrar vista lateral/i })).toHaveAttribute("aria-pressed", "true");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("preserves a stable non-interactive frame for missing gallery media", () => {
    render(<Carousel mode="gallery" items={[]} missingMediaMessage="Producto sin imágenes" />);

    expect(screen.getByLabelText("Galería de imágenes")).toBeTruthy();
    expect(screen.getByText("Producto sin imágenes")).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("keeps navigation available and announces a failed gallery item politely", () => {
    render(<Carousel mode="gallery" items={galleryItems} />);

    fireEvent.error(screen.getByRole("img", { name: "Vista frontal" }));
    expect(screen.getAllByText("No pudimos mostrar esta imagen.")).toHaveLength(2);
    expect(screen.getByRole("status")).toHaveTextContent("No pudimos mostrar esta imagen.");
    expect(screen.getByRole("button", { name: /mostrar vista lateral/i })).toBeTruthy();
  });
});
