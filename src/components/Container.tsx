import React, { type ElementType, type PropsWithChildren } from "react";

const containerSizeClasses = {
  sm: "max-w-[640px]",
  md: "max-w-[768px]",
  lg: "max-w-[1120px]",
  xl: "max-w-[1280px]",
} as const;

const containerPaddingClasses = {
  none: "px-0",
  sm: "px-3",
  md: "px-4",
  lg: "px-6",
} as const;

export type ContainerSize = keyof typeof containerSizeClasses;
export type ContainerPadding = keyof typeof containerPaddingClasses;

export type ContainerProps<T extends ElementType = "div"> = PropsWithChildren<{
  as?: T;
  size?: ContainerSize;
  padding?: ContainerPadding;
  centered?: boolean;
  className?: string;
}> &
  Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Container<T extends ElementType = "div">({
  as,
  size = "lg",
  padding = "md",
  centered = true,
  className = "",
  children,
  ...rest
}: ContainerProps<T>) {
  const Component = (as ?? "div") as ElementType;
  const classes = [
    "w-full box-border",
    centered ? "mx-auto" : null,
    containerSizeClasses[size],
    containerPaddingClasses[padding],
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
