import React, { type ElementType, type PropsWithChildren } from "react";

const cardElevationClasses = {
  none: "shadow-none",
  sm: "shadow-[var(--shadow-sm)]",
  md: "shadow-[var(--shadow-md)]",
  lg: "shadow-[var(--shadow-lg)]",
} as const;

const cardPaddingClasses = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

export type CardElevation = keyof typeof cardElevationClasses;
export type CardPadding = keyof typeof cardPaddingClasses;

export type CardProps<T extends ElementType = "div"> = PropsWithChildren<{
  as?: T;
  elevation?: CardElevation;
  padding?: CardPadding;
  interactive?: boolean;
  className?: string;
}> &
  Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Card<T extends ElementType = "div">({
  as,
  elevation = "sm",
  padding = "md",
  interactive = false,
  className = "",
  children,
  ...rest
}: CardProps<T>) {
  const Component = (as ?? "div") as ElementType;
  const classes = [
    "rounded-lg border border-[rgb(var(--border)/1)] bg-[rgb(var(--surface)/1)] transition duration-200",
    cardElevationClasses[elevation],
    cardPaddingClasses[padding],
    interactive
      ? "hover:-translate-y-0.5 motion-reduce:transform-none hover:shadow-[var(--shadow-md)]"
      : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
}
