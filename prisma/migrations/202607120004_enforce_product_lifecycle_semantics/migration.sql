ALTER TABLE "Product"
ADD CONSTRAINT "Product_published_requires_editorial_approval_check"
CHECK (NOT "published" OR "editorialApproved");

CREATE INDEX "Product_related_discovery_idx"
ON "Product"("published", "categoryId", "commerciallyAvailable", "updatedAt");
