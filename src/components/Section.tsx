import React, {
  type ElementType,
  type PropsWithChildren,
  type ReactNode,
} from "react";

const sectionSpacingClasses = {
  compact: "py-8",
  regular: "py-12",
  spacious: "py-16",
} as const;

const sectionContentGapClasses = {
  compact: "gap-4",
  regular: "gap-6",
  spacious: "gap-8",
} as const;

const sectionToneClasses = {
  default: "bg-transparent",
  muted: "bg-[rgb(var(--background)/1)]",
  surface: "bg-[rgb(var(--surface)/1)] border-y border-[rgb(var(--border)/1)]",
} as const;

export type SectionSpacing = keyof typeof sectionSpacingClasses;
export type SectionTone = keyof typeof sectionToneClasses;
export type SectionAlign = "start" | "center";

export type SectionProps<T extends ElementType = "section"> = PropsWithChildren<{
  as?: T;
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: SectionAlign;
  spacing?: SectionSpacing;
  tone?: SectionTone;
  divider?: boolean;
  className?: string;
}> &
  Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Section<T extends ElementType = "section">({
  as,
  eyebrow,
  title,
  description,
  action,
  align = "start",
  spacing = "regular",
  tone = "default",
  divider = false,
  className = "",
  children,
  ...rest
}: SectionProps<T>) {
  const Component = (as ?? "section") as ElementType;
  const headerAlignment =
    align === "center" ? "items-center text-center" : "items-start text-left";
  const headerActionAlignment =
    align === "center" ? "justify-center" : "justify-between";
  const classes = [
    "flex flex-col",
    sectionToneClasses[tone],
    sectionSpacingClasses[spacing],
    sectionContentGapClasses[spacing],
    divider ? "border-t border-[rgb(var(--border)/1)]" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...rest}>
      {(eyebrow || title || description || action) && (
        <div className={`flex flex-col gap-3 ${headerAlignment}`}>
          {(eyebrow || action) && (
            <div
              className={`flex w-full flex-wrap gap-3 ${headerActionAlignment} ${align === "center" ? "flex-col" : "sm:flex-row"}`}
            >
              {eyebrow ? (
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted)/1)]">
                  {eyebrow}
                </span>
              ) : null}
              {action ? <div>{action}</div> : null}
            </div>
          )}

          {title ? (
            <h2 className="text-balance text-2xl font-semibold tracking-[-0.02em] text-[rgb(var(--foreground)/1)] sm:text-3xl">
              {title}
            </h2>
          ) : null}

          {description ? (
            <p className="max-w-2xl text-sm leading-6 text-[rgb(var(--muted)/1)] sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
      )}

      {children}
    </Component>
  );
}
