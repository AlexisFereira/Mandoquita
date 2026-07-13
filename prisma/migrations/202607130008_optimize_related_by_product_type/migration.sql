-- Related discovery uses inherited Category to resolve a small Product Type set,
-- then orders eligible Products deterministically within those leaves.
CREATE INDEX "Product_related_by_type_idx"
ON "Product"(
  "productTypeId",
  "published",
  "commerciallyAvailable" DESC,
  "updatedAt" DESC,
  "id" ASC
);
