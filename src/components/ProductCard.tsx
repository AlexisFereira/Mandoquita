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
  const cardImage =
    product.images.find((image) => image.isPrimary) ?? product.images[0];

  return (
    <Card
      as="article"
      padding="none"
      elevation="none"
      className="@container h-full overflow-hidden !rounded-[8px]"
    >
      <Link
        href={`/products/${product.slug}`}
        aria-label={`Ver detalles de ${product.name}`}
        className="group grid h-full"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[rgb(var(--background)/1)]">
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
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transition-none"
            />
          ) : (
            <span className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-sm text-[rgb(var(--muted)/1)]">
              <Icon name="image-unavailable" />
              <span>Sin imagen</span>
            </span>
          )}
        </div>

        <div className="flex h-full flex-col p-1 md:p-4">
          <div className="flex flex-wrap items-center">
            <Badge variant="neutral" className="max-w-full min-w-0">
              <span className="block truncate" title={product.category.name}>
                {product.category.name}
              </span>
            </Badge>
            <span className="hidden text-xs text-[rgb(var(--muted)/1)] @min-[280px]:inline">
              {product.subcategory.name} · {product.productType.name}
            </span>
          </div>
          <div className="py-2">
            <h3 className="md:text-xl font-semibold tracking-[-0.02em] text-[rgb(var(--foreground)/1)]">
              {product.name}
            </h3>
          </div>
          <div className="mt-auto">
            <ProductOffer product={product} />
          </div>
          <div
            data-product-card-offer-row="true"
            className="mt-auto text-primary flex gap-1 justify-center pt-3 pb-2"
          >
            <span className="text-sm font-semibold align-center items-center underline decoration-transparent underline-offset-4 transition group-hover:decoration-current">
              Ver Detalles
            </span>
            <Icon name="chevronRight" />
          </div>
        </div>
      </Link>
    </Card>
  );
}
