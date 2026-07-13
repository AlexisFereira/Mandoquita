ALTER TABLE "Product"
ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "featuredOrder" INTEGER;

ALTER TABLE "Product"
ADD CONSTRAINT "Product_featuredOrder_positive_check"
CHECK ("featuredOrder" IS NULL OR "featuredOrder" > 0);

CREATE INDEX "Product_active_featured_featuredOrder_idx"
ON "Product"("active", "featured", "featuredOrder");
