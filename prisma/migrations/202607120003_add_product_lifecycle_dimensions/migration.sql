ALTER TABLE "Product"
ADD COLUMN "editorialApproved" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "commerciallyAvailable" BOOLEAN NOT NULL DEFAULT true;

UPDATE "Product"
SET "published" = "active";

CREATE INDEX "Product_published_categoryId_idx"
ON "Product"("published", "categoryId");
