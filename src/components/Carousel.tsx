import React, { useEffect, useMemo, useState } from "react";

import { Button } from "./Button";
import { Container } from "./Container";
import { Icon } from "./Icon";
import { PoliteStatus } from "./PoliteStatus";

export type CarouselSlide = {
  title: string;
  description?: string;
  imageUrl?: string;
  action?: { label: string; href: string };
};

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  thumbnailSrc?: string;
  controlLabel?: string;
};

export type PromotionalCarouselProps = {
  mode?: "promotional";
  slides: CarouselSlide[];
  items?: never;
  activeItemId?: never;
  defaultActiveItemId?: never;
  onActiveItemChange?: never;
};

export type GalleryCarouselProps = {
  mode: "gallery";
  items: GalleryItem[];
  slides?: never;
  activeItemId?: string;
  defaultActiveItemId?: string;
  onActiveItemChange?: (itemId: string) => void;
  "aria-label"?: string;
  missingMediaMessage?: string;
  failedMediaMessage?: string;
  showThumbnails?: boolean;
};

export type CarouselProps = PromotionalCarouselProps | GalleryCarouselProps;

function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener?.("change", updatePreference);
    return () => mediaQuery.removeEventListener?.("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

function PromotionalCarousel({ slides }: PromotionalCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState<Record<number, boolean>>({});
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusedWithin, setIsFocusedWithin] = useState(false);
  const prefersReducedMotion = useReducedMotion();
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
    if (computedSlides.length <= 1 || isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % computedSlides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [computedSlides.length, isPaused]);

  useEffect(() => {
    if (activeIndex > computedSlides.length - 1) setActiveIndex(0);
  }, [activeIndex, computedSlides.length]);

  function goToSlide(nextIndex: number) {
    if (computedSlides.length === 0) return;
    setActiveIndex(
      ((nextIndex % computedSlides.length) + computedSlides.length) %
        computedSlides.length,
    );
  }

  if (computedSlides.length === 0) return null;

  return (
    <section
      aria-label="Contenido destacado"
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocusedWithin(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setIsFocusedWithin(false);
      }}
    >
      <div className="relative h-[70dvh]  w-full sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[480px]">
        {computedSlides.map((slide, index) => (
          <article
            key={slide.title}
            aria-hidden={activeIndex !== index}
            className={`absolute inset-0 ${activeIndex === index ? "pointer-events-auto" : "pointer-events-none"}`}
            style={{
              opacity: activeIndex === index ? 1 : 0,
              zIndex: activeIndex === index ? 1 : 0,
              transition: prefersReducedMotion ? "none" : "opacity 320ms ease",
            }}
          >
            <div className="relative h-full w-full overflow-hidden">
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
                alt=""
                width="1280"
                height="720"
                sizes="(min-width: 1024px) 45vw, 100vw"
                loading={index === 0 ? "eager" : "lazy"}
                onLoad={() =>
                  setLoadedSlides((previous) => ({
                    ...previous,
                    [index]: true,
                  }))
                }
                className="absolute inset-0 h-full w-full object-cover object-[right] transition-opacity duration-200 motion-reduce:transition-none"
                style={{ opacity: loadedSlides[index] ? 1 : 0 }}
              />
              <div className="absolute inset-x-0 bottom-0 z-10 pb-16 pt-6 sm:pb-20 sm:pt-12 lg:pt-16 bg-gradient-to-t from-black/50 to-transparent">
                <Container size="wide" padding="lg">
                  <h2 className="max-w-xl text-5xl text-white font-semibold tracking-[-0.03em] sm:text-2xl lg:text-5xl">
                    {slide.title}
                  </h2>
                  {slide.description ? (
                    <p className="mt-1 max-w-xl text-xs leading-5  text-white sm:mt-2 sm:text-sm sm:leading-6 lg:text-base">
                      {slide.description}
                    </p>
                  ) : null}
                  {slide.action ? (
                    <Button
                      href={slide.action.href}
                      size="sm"
                      tabIndex={activeIndex === index ? undefined : -1}
                      className="mt-2 sm:mt-3"
                    >
                      {slide.action.label}
                    </Button>
                  ) : null}
                </Container>
              </div>
            </div>
          </article>
        ))}
      </div>

      {computedSlides.length > 1 ? (
        <div className="absolute inset-x-0 bottom-0 z-20  py-3">
          <Container
            size="wide"
            padding="lg"
            className="flex flex-wrap items-center justify-between gap-3"
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
            <div className="flex gap-2 hidden">
              <button
                type="button"
                onClick={() => goToSlide(activeIndex - 1)}
                aria-label="Diapositiva anterior"
                className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-inverse-border bg-inverse-surface/75 px-3 text-inverse-foreground"
              >
                <Icon name="previous" />
                <span className="sr-only sm:not-sr-only sm:ml-1">Anterior</span>
              </button>
              <button
                type="button"
                onClick={() => goToSlide(activeIndex + 1)}
                aria-label="Diapositiva siguiente"
                className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-inverse-border bg-inverse-surface/75 px-3 text-inverse-foreground"
              >
                <span className="sr-only sm:not-sr-only sm:mr-1">
                  Siguiente
                </span>
                <Icon name="next" />
              </button>
            </div>
          </Container>
        </div>
      ) : null}
    </section>
  );
}

function GalleryCarousel({
  items,
  activeItemId,
  defaultActiveItemId,
  onActiveItemChange,
  "aria-label": ariaLabel = "Galería de imágenes",
  missingMediaMessage = "No hay imágenes disponibles.",
  failedMediaMessage = "No pudimos mostrar esta imagen.",
  showThumbnails = true,
}: GalleryCarouselProps) {
  const [uncontrolledId, setUncontrolledId] = useState(
    defaultActiveItemId ?? items[0]?.id,
  );
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});
  const [loadedIds, setLoadedIds] = useState<Record<string, boolean>>({});
  const isControlled = activeItemId !== undefined;
  const requestedId = isControlled ? activeItemId : uncontrolledId;
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === requestedId),
  );
  const activeItem = items[activeIndex];

  useEffect(() => {
    if (
      !isControlled &&
      items.length > 0 &&
      !items.some((item) => item.id === uncontrolledId)
    ) {
      setUncontrolledId(items[0].id);
    }
  }, [isControlled, items, uncontrolledId]);

  function selectItem(itemId: string) {
    if (!isControlled) setUncontrolledId(itemId);
    if (itemId !== requestedId) onActiveItemChange?.(itemId);
  }

  if (items.length === 0) {
    return (
      <section aria-label={ariaLabel} className="w-full">
        <div className="flex aspect-square items-center justify-center rounded-lg border border-[rgb(var(--border)/1)] bg-[rgb(var(--surface-muted)/1)] p-6 text-center text-[rgb(var(--muted)/1)]">
          <p>{missingMediaMessage}</p>
        </div>
      </section>
    );
  }

  const failed = Boolean(failedIds[activeItem.id]);
  return (
    <section aria-label={ariaLabel} className="w-full space-y-4">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-[rgb(var(--border)/1)] bg-[rgb(var(--surface-muted)/1)]">
        {!loadedIds[activeItem.id] && !failed ? (
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-pulse bg-[rgb(var(--muted)/0.12)] motion-reduce:animate-none"
          />
        ) : null}
        {failed ? (
          <p className="p-6 text-center text-[rgb(var(--muted)/1)]">
            {failedMediaMessage}
          </p>
        ) : (
          <img
            key={activeItem.id}
            src={activeItem.src}
            alt={activeItem.alt}
            width="900"
            height="900"
            className="h-full w-full object-contain transition-opacity duration-200 motion-reduce:transition-none"
            style={{ opacity: loadedIds[activeItem.id] ? 1 : 0 }}
            onLoad={() =>
              setLoadedIds((previous) => ({
                ...previous,
                [activeItem.id]: true,
              }))
            }
            onError={() =>
              setFailedIds((previous) => ({
                ...previous,
                [activeItem.id]: true,
              }))
            }
          />
        )}
      </div>

      {items.length > 1 ? (
        <>
          <p
            className="text-sm text-[rgb(var(--muted)/1)]"
            aria-live="polite"
            aria-atomic="true"
          >
            Imagen {activeIndex + 1} de {items.length}.
          </p>
          <div
            role="group"
            className="flex flex-wrap gap-2"
            aria-label="Seleccionar imagen"
          >
            {items.map((item, index) => {
              const selected = item.id === activeItem.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectItem(item.id)}
                  aria-label={
                    item.controlLabel ??
                    `Mostrar imagen ${index + 1} de ${items.length}`
                  }
                  aria-pressed={selected}
                  className="relative inline-flex min-h-11 min-w-11 max-w-full items-center justify-center overflow-hidden rounded-md border bg-[rgb(var(--surface)/1)] p-1 text-sm font-semibold text-[rgb(var(--foreground)/1)] transition motion-reduce:transition-none"
                  style={{
                    borderColor: selected
                      ? "rgb(var(--primary) / 1)"
                      : "rgb(var(--border) / 1)",
                    borderWidth: selected ? "3px" : "1px",
                  }}
                >
                  {showThumbnails ? (
                    <img
                      src={item.thumbnailSrc ?? item.src}
                      alt=""
                      aria-hidden="true"
                      width="56"
                      height="56"
                      className="h-12 w-12 object-contain"
                    />
                  ) : (
                    <span className="px-2">{index + 1}</span>
                  )}
                  {selected ? (
                    <span className="sr-only">Imagen actual</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </>
      ) : null}
      <PoliteStatus>{failed ? failedMediaMessage : ""}</PoliteStatus>
    </section>
  );
}

export function Carousel(props: CarouselProps) {
  return props.mode === "gallery" ? (
    <GalleryCarousel {...props} />
  ) : (
    <PromotionalCarousel {...props} />
  );
}
