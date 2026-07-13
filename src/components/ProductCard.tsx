import React from "react";
import Link from "next/link";

import type { ProductItem } from "../types/catalog";
import { Badge } from "./Badge";
import { Card } from "./Card";
import { ProductOffer } from "./ProductOffer";
import { Icon } from "./Icon";

export type ProductCardProps = {
  product: ProductItem;
  featured?: boolean;
};

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const cardImage = product.images.find((image) => image.isPrimary) ?? product.images[0];
  const summary = product.shortDescription ?? product.description;

  return (
    <Card
      as="article"
      padding="none"
      elevation="none"
      className="h-full"
    >
      <Link
        href={`/products/${product.slug}`}
        aria-label={`Ver detalles de ${product.name}`}
        className="group grid h-full"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-[rgb(var(--background)/1)]">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={cardImage?.altText ?? product.name}
              width="800"
              height="600"
              sizes="(min-width: 1280px) 280px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              loading="lazy"
              onError={(event) => {
                event.currentTarget.src = "/images/banners/default-banner.svg";
              }}
              className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transition-none"
            />
          ) : (
            <span className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-sm text-[rgb(var(--muted)/1)]">
              <Icon name="image-unavailable" />
              <span>Sin imagen</span>
            </span>
          )}
        </div>

        <div className="flex h-full flex-col gap-4 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral">{product.category.name}</Badge>
            <span className="text-xs text-[rgb(var(--muted)/1)]">
              {product.subcategory.name} · {product.productType.name}
            </span>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-semibold tracking-[-0.02em] text-[rgb(var(--foreground)/1)]">
              {product.name}
            </h3>
            {summary ? (
              <p className="line-clamp-2 text-sm leading-6 text-[rgb(var(--muted)/1)]">
                {summary}
              </p>
            ) : null}
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 pt-2">
            <ProductOffer product={product} />
            <span className="text-sm font-semibold text-[rgb(var(--foreground)/1)] underline decoration-transparent underline-offset-4 transition group-hover:decoration-current">
              Ver detalles
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
