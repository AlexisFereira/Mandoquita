ALTER TABLE "Category"
ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "visible" BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX "Category_active_visible_idx"
ON "Category"("active", "visible");
