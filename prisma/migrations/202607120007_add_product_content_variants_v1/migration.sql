-- Product Requirements approved an empty business migration inventory. Refuse to
-- invent identifiers for any data that appears outside that approved inventory.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "Product") THEN
    RAISE EXCEPTION 'PCV V1 activation blocked: existing Products require approved migration SKUs and media dispositions';
  END IF;
END $$;

CREATE TYPE "GenderApplicability" AS ENUM ('MUJER', 'HOMBRE', 'UNISEX', 'NO_APLICA');
CREATE TYPE "VariantAttributeName" AS ENUM ('TALLA', 'COLOR', 'MATERIAL', 'CAPACIDAD', 'PRESENTACION');
CREATE TYPE "VariantAttributeValueType" AS ENUM ('TEXT', 'NUMBER', 'BOOLEAN');

ALTER TABLE "Product"
  ALTER COLUMN "description" DROP NOT NULL,
  DROP COLUMN "imageUrl",
  ADD COLUMN "shortDescription" TEXT,
  ADD COLUMN "brand" TEXT,
  ADD COLUMN "collection" TEXT,
  ADD COLUMN "genderApplicability" "GenderApplicability",
  ADD COLUMN "seoTitle" TEXT,
  ADD COLUMN "seoDescription" TEXT;

CREATE TABLE "ProductImage" (
  "id" TEXT PRIMARY KEY,
  "productId" INTEGER NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "url" TEXT NOT NULL,
  "altText" TEXT NOT NULL,
  "position" INTEGER NOT NULL,
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProductImage_id_productId_key" UNIQUE ("id", "productId"),
  CONSTRAINT "ProductImage_productId_position_key" UNIQUE ("productId", "position"),
  CONSTRAINT "ProductImage_position_nonnegative_check" CHECK ("position" >= 0),
  CONSTRAINT "ProductImage_url_nonempty_check" CHECK (btrim("url") <> ''),
  CONSTRAINT "ProductImage_altText_nonempty_check" CHECK (btrim("altText") <> '')
);

CREATE UNIQUE INDEX "ProductImage_one_primary_per_product_key"
  ON "ProductImage"("productId") WHERE "isPrimary";
CREATE INDEX "ProductImage_product_primary_position_idx"
  ON "ProductImage"("productId", "isPrimary", "position");

CREATE TABLE "ProductVariant" (
  "id" TEXT PRIMARY KEY,
  "productId" INTEGER NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "sku" TEXT NOT NULL UNIQUE,
  "reference" TEXT,
  "barcode" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "isBase" BOOLEAN NOT NULL DEFAULT false,
  "imageId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProductVariant_image_product_fkey"
    FOREIGN KEY ("imageId", "productId") REFERENCES "ProductImage"("id", "productId")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "ProductVariant_sku_nonempty_check" CHECK (btrim("sku") <> ''),
  CONSTRAINT "ProductVariant_reference_nonempty_check" CHECK ("reference" IS NULL OR btrim("reference") <> ''),
  CONSTRAINT "ProductVariant_barcode_nonempty_check" CHECK ("barcode" IS NULL OR btrim("barcode") <> '')
);

CREATE INDEX "ProductVariant_product_active_idx" ON "ProductVariant"("productId", "active");
CREATE INDEX "ProductVariant_image_product_idx" ON "ProductVariant"("imageId", "productId");

CREATE TABLE "VariantAttribute" (
  "id" TEXT PRIMARY KEY,
  "variantId" TEXT NOT NULL REFERENCES "ProductVariant"("id") ON DELETE CASCADE,
  "name" "VariantAttributeName" NOT NULL,
  "valueType" "VariantAttributeValueType" NOT NULL,
  "textValue" TEXT,
  "numberValue" DECIMAL(18,4),
  "booleanValue" BOOLEAN,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "VariantAttribute_variantId_name_key" UNIQUE ("variantId", "name"),
  CONSTRAINT "VariantAttribute_exact_value_check" CHECK (
    ("valueType" = 'TEXT' AND "textValue" IS NOT NULL AND btrim("textValue") <> '' AND "numberValue" IS NULL AND "booleanValue" IS NULL) OR
    ("valueType" = 'NUMBER' AND "textValue" IS NULL AND "numberValue" IS NOT NULL AND "booleanValue" IS NULL) OR
    ("valueType" = 'BOOLEAN' AND "textValue" IS NULL AND "numberValue" IS NULL AND "booleanValue" IS NOT NULL)
  )
);

CREATE INDEX "VariantAttribute_name_idx" ON "VariantAttribute"("name");

CREATE TABLE "ProductTag" (
  "productId" INTEGER NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "value" TEXT NOT NULL,
  CONSTRAINT "ProductTag_pkey" PRIMARY KEY ("productId", "value"),
  CONSTRAINT "ProductTag_normalized_check" CHECK (
    "value" <> '' AND "value" = lower(regexp_replace(btrim("value"), '\\s+', ' ', 'g'))
  )
);

CREATE INDEX "ProductTag_value_idx" ON "ProductTag"("value");

-- Publication eligibility is cross-row integrity, so use deferred constraint
-- triggers: nested Product + Variant writes can succeed atomically, while a
-- committed Published Product can never remain without a Variant.
CREATE FUNCTION "pcv_assert_product_has_variant"() RETURNS trigger AS $$
DECLARE target_product_id INTEGER;
BEGIN
  target_product_id := CASE WHEN TG_OP = 'DELETE' THEN OLD."productId" ELSE NEW."productId" END;
  IF EXISTS (SELECT 1 FROM "Product" WHERE "id" = target_product_id AND "published")
     AND NOT EXISTS (SELECT 1 FROM "ProductVariant" WHERE "productId" = target_product_id) THEN
    RAISE EXCEPTION 'Published Product % requires at least one Product Variant', target_product_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION "pcv_assert_published_product_has_variant"() RETURNS trigger AS $$
BEGIN
  IF NEW."published"
     AND NOT EXISTS (SELECT 1 FROM "ProductVariant" WHERE "productId" = NEW."id") THEN
    RAISE EXCEPTION 'Published Product % requires at least one Product Variant', NEW."id";
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER "Product_published_requires_variant"
AFTER INSERT OR UPDATE OF "published" ON "Product"
DEFERRABLE INITIALLY DEFERRED FOR EACH ROW
EXECUTE FUNCTION "pcv_assert_published_product_has_variant"();

CREATE CONSTRAINT TRIGGER "ProductVariant_preserves_published_product"
AFTER INSERT OR UPDATE OR DELETE ON "ProductVariant"
DEFERRABLE INITIALLY DEFERRED FOR EACH ROW
EXECUTE FUNCTION "pcv_assert_product_has_variant"();
