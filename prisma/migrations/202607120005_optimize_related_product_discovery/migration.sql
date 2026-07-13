DROP INDEX IF EXISTS "Product_related_discovery_idx";

CREATE INDEX "Product_related_discovery_idx"
ON "Product"(
  "categoryId",
  "published",
  "commerciallyAvailable" DESC,
  "updatedAt" DESC,
  "id" ASC
);
