import React, { useEffect, useMemo, useState } from "react";

import { Button } from "./Button";

type CarouselSlide = {
  title: string;
  description?: string;
  imageUrl?: string;
  action?: {
    label: string;
    href: string;
  };
};

export type CarouselProps = {
  slides: CarouselSlide[];
};

export function Carousel({ slides }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState<Record<number, boolean>>({});
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusedWithin, setIsFocusedWithin] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const computedSlides = useMemo(
    () =>
      slides.map((slide) => ({
        ...slide,
        imageUrl: slide.imageUrl ?? "/images/banners/default-banner.svg",
      })),
    [slides],
  );

  const isPaused = isHovered || isFocusedWithin || prefersReducedMotion;

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener?.("change", updatePreference);

    return () => mediaQuery.removeEventListener?.("change", updatePreference);
  }, []);

  useEffect(() => {
    if (computedSlides.length <= 1 || isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % computedSlides.length);
    }, 6000);

    return () => {
      window.clearInterval(timer);
    };
  }, [computedSlides.length, isPaused]);

  useEffect(() => {
    if (activeIndex <= computedSlides.length - 1) {
      return;
    }
    setActiveIndex(0);
  }, [activeIndex, computedSlides.length]);

  function goToSlide(nextIndex: number) {
    if (computedSlides.length === 0) {
      return;
    }

    const normalized =
      ((nextIndex % computedSlides.length) + computedSlides.length) %
      computedSlides.length;
    setActiveIndex(normalized);
  }

  if (computedSlides.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Contenido destacado"
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocusedWithin(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsFocusedWithin(false);
        }
      }}
    >
      <div
        className="flex"
        style={{
          width: `${computedSlides.length * 100}%`,
          transform: `translateX(-${activeIndex * (100 / computedSlides.length)}%)`,
          transition: prefersReducedMotion ? "none" : "transform 320ms ease",
        }}
      >
        {computedSlides.map((slide, index) => (
          <article
            key={slide.title}
            className="relative"
            style={{
              width: `${100 / computedSlides.length}%`,
              flex: `0 0 ${100 / computedSlides.length}%`,
            }}
          >
            <div className="relative h-[clamp(220px,44vw,520px)] w-full overflow-hidden">
              <img
                src="/images/banners/default-banner.svg"
                alt=""
                aria-hidden="true"
                width="1280"
                height="720"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <img
                src={slide.imageUrl}
                alt={slide.title}
                width="1280"
                height="720"
                sizes="(min-width: 1024px) 45vw, 100vw"
                loading={index === 0 ? "eager" : "lazy"}
                onLoad={() => {
                  setLoadedSlides((prev) => ({ ...prev, [index]: true }));
                }}
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-200 motion-reduce:transition-none"
                style={{ opacity: loadedSlides[index] ? 1 : 0 }}
              />
              <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/60 to-transparent px-5 pb-20 pt-24 text-inverse-foreground sm:px-7">
                <h2 className="max-w-xl text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                  {slide.title}
                </h2>
                {slide.description ? (
                  <p className="mt-2 max-w-xl text-sm leading-6 text-inverse-muted sm:text-base">
                    {slide.description}
                  </p>
                ) : null}
                {slide.action ? (
                  <Button
                    href={slide.action.href}
                    size="sm"
                    className="mt-4"
                  >
                    {slide.action.label}
                  </Button>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      {computedSlides.length > 1 && (
        <div
          className="absolute inset-x-0 bottom-0 z-20 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-b from-transparent to-inverse-surface/45 px-4 py-3"
        >
          <div className="flex gap-1">
            {computedSlides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Ir a la diapositiva ${index + 1}`}
                aria-current={activeIndex === index ? "true" : "false"}
                className="h-11 w-11 cursor-pointer rounded-full border-0"
                style={{
                  background:
                    activeIndex === index
                      ? "radial-gradient(circle, rgb(var(--inverse-foreground) / 1) 0 5px, transparent 6px)"
                      : "radial-gradient(circle, rgb(var(--inverse-muted) / 1) 0 4px, transparent 5px)",
                }}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => goToSlide(activeIndex - 1)}
              aria-label="Diapositiva anterior"
              className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-inverse-border bg-inverse-surface/75 px-3 text-inverse-foreground"
            >
              <span aria-hidden="true">‹</span>
              <span className="sr-only sm:not-sr-only sm:ml-1">Anterior</span>
            </button>
            <button
              type="button"
              onClick={() => goToSlide(activeIndex + 1)}
              aria-label="Diapositiva siguiente"
              className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-inverse-border bg-inverse-surface/75 px-3 text-inverse-foreground"
            >
              <span className="sr-only sm:not-sr-only sm:mr-1">Siguiente</span>
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
