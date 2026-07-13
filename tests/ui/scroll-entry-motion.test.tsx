import React from "react";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ScrollEntryMotion } from "../../src/components/ScrollEntryMotion";

let intersectionCallback: IntersectionObserverCallback | undefined;
let mediaChangeListener: ((event: MediaQueryListEvent) => void) | undefined;
const observe = vi.fn();
const unobserve = vi.fn();
const disconnect = vi.fn();

function setReducedMotion(matches: boolean) {
  vi.stubGlobal("matchMedia", () => ({
    matches,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addEventListener: vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => {
      mediaChangeListener = listener;
    }),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

beforeEach(() => {
  intersectionCallback = undefined;
  mediaChangeListener = undefined;
  observe.mockReset();
  unobserve.mockReset();
  disconnect.mockReset();
  setReducedMotion(false);
  vi.stubGlobal("IntersectionObserver", class {
    root = null;
    rootMargin = "0px";
    thresholds = [0.15];
    constructor(callback: IntersectionObserverCallback) {
      intersectionCallback = callback;
    }
    observe = observe;
    unobserve = unobserve;
    disconnect = disconnect;
    takeRecords = () => [];
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  window.location.hash = "";
});

describe("ScrollEntryMotion", () => {
  it("keeps server-rendered content visible by default", () => {
    const html = renderToString(<ScrollEntryMotion>Contenido</ScrollEntryMotion>);

    expect(html).toContain('data-motion-state="final"');
    expect(html).toContain("Contenido");
    expect(html).not.toContain('data-motion-state="prepared"');
  });

  it("observes only confirmed below-viewport content and reveals it once", async () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      top: 1000, bottom: 1100, left: 0, right: 100, width: 100, height: 100,
      x: 0, y: 1000, toJSON: () => ({}),
    });
    const { container } = render(<ScrollEntryMotion>Contenido</ScrollEntryMotion>);
    const wrapper = container.firstElementChild as HTMLElement;

    await waitFor(() => expect(wrapper.dataset.motionState).toBe("prepared"));
    expect(observe).toHaveBeenCalledWith(wrapper);

    intersectionCallback?.([
      { target: wrapper, isIntersecting: true, intersectionRatio: 0.2 } as unknown as IntersectionObserverEntry,
    ], {} as IntersectionObserver);
    await waitFor(() => expect(wrapper.dataset.motionState).toBe("entering"));
    fireEvent.transitionEnd(wrapper);
    expect(wrapper.dataset.motionState).toBe("final");

    intersectionCallback?.([
      { target: wrapper, isIntersecting: true, intersectionRatio: 1 } as unknown as IntersectionObserverEntry,
    ], {} as IntersectionObserver);
    expect(wrapper.dataset.motionState).toBe("final");
  });

  it("bypasses preparation for initial viewport, reduced motion, and unsupported observers", async () => {
    const rect = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect");
    rect.mockReturnValue({
      top: 0, bottom: 100, left: 0, right: 100, width: 100, height: 100,
      x: 0, y: 0, toJSON: () => ({}),
    });
    const initial = render(<ScrollEntryMotion>Inicial</ScrollEntryMotion>);
    await waitFor(() => expect(initial.container.firstElementChild?.getAttribute("data-motion-state")).toBe("final"));
    expect(observe).not.toHaveBeenCalled();
    initial.unmount();

    rect.mockReturnValue({
      top: 1000, bottom: 1100, left: 0, right: 100, width: 100, height: 100,
      x: 0, y: 1000, toJSON: () => ({}),
    });
    setReducedMotion(true);
    const reduced = render(<ScrollEntryMotion>Reducido</ScrollEntryMotion>);
    await waitFor(() => expect(reduced.container.firstElementChild?.getAttribute("data-motion-state")).toBe("final"));
    reduced.unmount();

    setReducedMotion(false);
    vi.stubGlobal("IntersectionObserver", undefined);
    const unsupported = render(<ScrollEntryMotion>Compatible</ScrollEntryMotion>);
    await waitFor(() => expect(unsupported.container.firstElementChild?.getAttribute("data-motion-state")).toBe("final"));
  });

  it("resolves prepared content immediately when focus enters", async () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      top: 1000, bottom: 1100, left: 0, right: 100, width: 100, height: 100,
      x: 0, y: 1000, toJSON: () => ({}),
    });
    const { container, getByRole } = render(
      <ScrollEntryMotion><button type="button">Acción</button></ScrollEntryMotion>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    await waitFor(() => expect(wrapper.dataset.motionState).toBe("prepared"));

    getByRole("button").focus();
    await waitFor(() => expect(wrapper.dataset.motionState).toBe("final"));
    expect(unobserve).toHaveBeenCalledWith(wrapper);
  });

  it("resolves prepared content when reduced-motion preference changes", async () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      top: 1000, bottom: 1100, left: 0, right: 100, width: 100, height: 100,
      x: 0, y: 1000, toJSON: () => ({}),
    });
    const { container } = render(<ScrollEntryMotion>Contenido</ScrollEntryMotion>);
    const wrapper = container.firstElementChild as HTMLElement;
    await waitFor(() => expect(wrapper.dataset.motionState).toBe("prepared"));

    mediaChangeListener?.({ matches: true } as MediaQueryListEvent);
    await waitFor(() => expect(wrapper.dataset.motionState).toBe("final"));
    expect(unobserve).toHaveBeenCalledWith(wrapper);
  });

  it("keeps content visible beyond the 50-element observation guard", async () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      top: 1000, bottom: 1100, left: 0, right: 100, width: 100, height: 100,
      x: 0, y: 1000, toJSON: () => ({}),
    });
    const { container } = render(
      <>{Array.from({ length: 51 }, (_, index) => (
        <ScrollEntryMotion key={index}>Grupo {index + 1}</ScrollEntryMotion>
      ))}</>,
    );
    await waitFor(() => expect(container.querySelectorAll('[data-motion-state="prepared"]')).toHaveLength(50));
    expect(container.querySelectorAll('[data-motion-state="final"]')).toHaveLength(1);
    expect(observe).toHaveBeenCalledTimes(50);
  });
});
