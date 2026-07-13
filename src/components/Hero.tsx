import React, { type ReactNode } from "react";

export type HeroAlign = "left" | "center";

export type HeroProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  media?: ReactNode;
  align?: HeroAlign;
  className?: string;
};

export function Hero({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  media,
  align = "left",
  className = "",
}: HeroProps) {
  const hasMedia = Boolean(media);
  const alignmentClasses =
    align === "center" ? "mx-auto text-center" : "text-left";
  const actionAlignment =
    align === "center" ? "justify-center" : "justify-start";

  return (
    <section className={className}>
      <div
        className={[
          "grid min-w-0 gap-12",
          hasMedia
            ? "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center"
            : null,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div
          className={["min-w-0 max-w-3xl", alignmentClasses]
            .filter(Boolean)
            .join(" ")}
        >
          {eyebrow ? (
            <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted)/1)]">
              {eyebrow}
            </span>
          ) : null}

          <h1 className="text-balance text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--foreground)/1)] sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-5 text-base leading-7 text-[rgb(var(--muted)/1)] sm:text-lg">
              {description}
            </p>
          ) : null}

          {primaryAction || secondaryAction ? (
            <div
              className={["mt-8 flex flex-wrap gap-x-4 gap-y-3", actionAlignment].join(
                " ",
              )}
            >
              {primaryAction}
              {secondaryAction}
            </div>
          ) : null}
        </div>

        {media ? (
          <div className="min-w-0 overflow-hidden rounded-2xl border border-[rgb(var(--border)/1)] bg-[rgb(var(--surface)/1)] shadow-[var(--shadow-md)]">
            {media}
          </div>
        ) : null}
      </div>
    </section>
  );
}
