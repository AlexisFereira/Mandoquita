-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_versionId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_productTypeId_fkey";

-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductTag" DROP CONSTRAINT "ProductTag_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductType" DROP CONSTRAINT "ProductType_subcategoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_productId_fkey";

-- DropForeignKey
ALTER TABLE "Subcategory" DROP CONSTRAINT "Subcategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "VariantAttribute" DROP CONSTRAINT "VariantAttribute_variantId_fkey";

-- DropIndex
DROP INDEX "Category_retiredAt_idx";

-- DropIndex
DROP INDEX "Product_retiredAt_idx";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ProductImage" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ProductType" ADD COLUMN     "retiredAt" TIMESTAMP(3),
ADD COLUMN     "retiredByAccountId" TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ProductVariant" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Subcategory" ADD COLUMN     "retiredAt" TIMESTAMP(3),
ADD COLUMN     "retiredByAccountId" TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "TaxonomyVersion" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "VariantAttribute" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "ProductType_retiredAt_idx" ON "ProductType"("retiredAt");

-- CreateIndex
CREATE INDEX "Subcategory_retiredAt_idx" ON "Subcategory"("retiredAt");

-- RenameForeignKey
ALTER TABLE "CatalogMediaIdempotency" RENAME CONSTRAINT "CatalogMediaIdempotency_session_fkey" TO "CatalogMediaIdempotency_sessionId_fkey";

-- RenameForeignKey
ALTER TABLE "CatalogMediaRateLimit" RENAME CONSTRAINT "CatalogMediaRateLimit_session_fkey" TO "CatalogMediaRateLimit_sessionId_fkey";

-- RenameForeignKey
ALTER TABLE "CatalogMediaUpload" RENAME CONSTRAINT "CatalogMediaUpload_session_fkey" TO "CatalogMediaUpload_sessionId_fkey";

-- RenameForeignKey
ALTER TABLE "ProductVariant" RENAME CONSTRAINT "ProductVariant_image_product_fkey" TO "ProductVariant_imageId_productId_fkey";

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "TaxonomyVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductType" ADD CONSTRAINT "ProductType_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "ProductType"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantAttribute" ADD CONSTRAINT "VariantAttribute_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTag" ADD CONSTRAINT "ProductTag_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Category_version_active_visible_order_idx" RENAME TO "Category_versionId_active_visible_sortOrder_idx";

-- RenameIndex
ALTER INDEX "ProductImage_product_primary_position_idx" RENAME TO "ProductImage_productId_isPrimary_position_idx";

-- RenameIndex
ALTER INDEX "ProductType_subcategory_active_order_idx" RENAME TO "ProductType_subcategoryId_active_sourceOrder_idx";

-- RenameIndex
ALTER INDEX "ProductVariant_image_product_idx" RENAME TO "ProductVariant_imageId_productId_idx";

-- RenameIndex
ALTER INDEX "ProductVariant_product_active_idx" RENAME TO "ProductVariant_productId_active_idx";

-- RenameIndex
ALTER INDEX "Subcategory_category_active_order_idx" RENAME TO "Subcategory_categoryId_active_sourceOrder_idx";
