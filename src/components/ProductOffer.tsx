import React from "react";

import type { ProductItem } from "../types/catalog";

export type ProductOfferProps = {
  product: Pick<ProductItem, "commerciallyAvailable" | "currency" | "price">;
  emphasis?: "card" | "detail";
};

export const NO_CURRENT_OFFER_MESSAGE = "Oferta no disponible actualmente";

export function hasCurrentOffer(
  product: ProductOfferProps["product"],
): product is ProductOfferProps["product"] & {
  currency: string;
  price: string;
} {
  return Boolean(
    product.commerciallyAvailable &&
    product.currency?.trim() &&
    product.price?.trim(),
  );
}

export function ProductOffer({
  product,
  emphasis = "card",
}: ProductOfferProps) {
  const availableClassName =
    emphasis === "detail"
      ? "text-2xl font-semibold text-[rgb(var(--primary)/1)] sm:text-3xl"
      : "text-sm font-semibold text-[rgb(var(--foreground)/1)]";
  const unavailableClassName =
    emphasis === "detail"
      ? "text-lg font-semibold text-[rgb(var(--muted)/1)]"
      : "text-sm font-semibold text-[rgb(var(--muted)/1)]";

  function applyPercentageChange(value: number, percentage: number): number {
    const percentageAsDecimal = percentage / 100;
    return value + value * percentageAsDecimal;
  }

  if (!hasCurrentOffer(product)) {
    return (
      <span className={unavailableClassName}>{NO_CURRENT_OFFER_MESSAGE}</span>
    );
  }

  const FinalPrice = applyPercentageChange(parseFloat(product.price), 20); // Example: applying a 10% increase

  return (
    <strong className={availableClassName}>
      ${FinalPrice.toFixed(2)} {product.currency.trim()}
    </strong>
  );
}
