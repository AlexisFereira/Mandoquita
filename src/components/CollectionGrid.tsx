import React, { type ElementType, type PropsWithChildren } from "react";

export type CollectionGridProps<T extends ElementType = "div"> =
  PropsWithChildren<{
    as?: T;
    className?: string;
  }> &
    Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/**
 * Domain-neutral layout for ordered Card collections. It never inspects,
 * limits, clones, hides or reorders its children.
 */
export function CollectionGrid<T extends ElementType = "div">({
  as,
  className = "",
  children,
  ...rest
}: CollectionGridProps<T>) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component
      className={`collection-grid grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 ${className}`.trim()}
      {...rest}
    >
      {children}
    </Component>
  );
}
