import Link from "next/link";
import React from "react";

import { Badge } from "./Badge";
import { Card } from "./Card";

export type CategoryCardProps = {
  title: string;
  href: string;
  description?: string;
  imageUrl?: string;
  count?: number;
  compact?: boolean;
  className?: string;
};

export function CategoryCard({
  title,
  href,
  description,
  imageUrl,
  count,
  compact = false,
  className = "",
}: CategoryCardProps) {
  return (
    <Card
      as={Link}
      href={href}
      interactive
      padding={compact ? "sm" : "md"}
      elevation="sm"
      className={["group block overflow-hidden no-underline", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="space-y-4">
        {imageUrl ? (
          <div className="overflow-hidden rounded-md bg-[rgb(var(--background)/1)]">
            <div className={compact ? "aspect-[4/3]" : "aspect-[16/10]"}>
              <img
                src={imageUrl}
                alt={title}
                width="800"
                height="500"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src = "/images/banners/default-banner.svg";
                }}
                className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.02] motion-reduce:transform-none"
              />
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-[rgb(var(--foreground)/1)]">
              {title}
            </h3>
            {typeof count === "number" ? (
              <Badge variant="neutral">{count}</Badge>
            ) : null}
          </div>

          {description ? (
            <p className="text-sm leading-6 text-[rgb(var(--muted)/1)]">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
