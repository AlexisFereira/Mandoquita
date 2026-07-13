import React, { type ReactNode } from "react";

export type SectionHeaderAlign = "start" | "center";

export type SectionHeaderProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: SectionHeaderAlign;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "start",
  className = "",
}: SectionHeaderProps) {
  const alignmentClasses =
    align === "center" ? "items-center text-center" : "items-start text-left";
  const rowClasses = align === "center" ? "justify-center" : "justify-between";

  return (
    <div
      className={["flex flex-col gap-4", alignmentClasses, className]
        .filter(Boolean)
        .join(" ")}
    >
      {(eyebrow || action) && (
        <div
          className={[
            "flex w-full flex-wrap gap-4",
            rowClasses,
            align === "center" ? "flex-col" : "sm:flex-row sm:items-center",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {eyebrow ? (
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted)/1)]">
              {eyebrow}
            </span>
          ) : null}
          {action ? <div>{action}</div> : null}
        </div>
      )}

      <h2 className="text-balance text-2xl font-semibold tracking-[-0.02em] text-[rgb(var(--foreground)/1)] sm:text-3xl">
        {title}
      </h2>

      {description ? (
        <p className="max-w-2xl text-sm leading-6 text-[rgb(var(--muted)/1)] sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
