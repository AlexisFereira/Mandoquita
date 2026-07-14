CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN');

CREATE TABLE "AdminAccount" (
  "id" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "normalizedUsername" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "AdminRole" NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
  "credentialVersion" INTEGER NOT NULL DEFAULT 1,
  "passwordChangedAt" TIMESTAMP(3),
  "lastLoginAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AdminAccount_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AdminAccount_username_check" CHECK ("username" ~ '^[A-Za-z0-9._-]{3,64}$'),
  CONSTRAINT "AdminAccount_normalized_username_check" CHECK ("normalizedUsername" = lower(btrim("username"))),
  CONSTRAINT "AdminAccount_credential_version_check" CHECK ("credentialVersion" > 0)
);

CREATE UNIQUE INDEX "AdminAccount_normalizedUsername_key" ON "AdminAccount"("normalizedUsername");
CREATE UNIQUE INDEX "AdminAccount_single_super_admin_key" ON "AdminAccount"("role") WHERE "role" = 'SUPER_ADMIN';
CREATE INDEX "AdminAccount_role_enabled_idx" ON "AdminAccount"("role", "enabled");

ALTER TABLE "ProductAdminSession"
  ADD COLUMN "adminAccountId" TEXT,
  ADD COLUMN "credentialVersion" INTEGER;
ALTER TABLE "ProductAdminSession"
  ADD CONSTRAINT "ProductAdminSession_adminAccountId_fkey"
  FOREIGN KEY ("adminAccountId") REFERENCES "AdminAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "ProductAdminSession_account_idx" ON "ProductAdminSession"("adminAccountId", "revokedAt");

-- One-way cutover: a session created for the retired shared-code credential can
-- never be upgraded into a named-account session.
UPDATE "ProductAdminSession" SET "revokedAt" = CURRENT_TIMESTAMP WHERE "revokedAt" IS NULL;

ALTER TABLE "ProductAdminThrottle" DROP CONSTRAINT "ProductAdminThrottle_scope_check";
ALTER TABLE "ProductAdminThrottle" ADD CONSTRAINT "ProductAdminThrottle_scope_check"
  CHECK ("scope" IN ('ACCOUNT', 'CLIENT', 'DEPLOYMENT'));

ALTER TABLE "ProductAdminAuditEvent"
  ADD COLUMN "actorAccountId" TEXT,
  ADD COLUMN "targetAccountId" TEXT;
CREATE INDEX "ProductAdminAuditEvent_actor_idx" ON "ProductAdminAuditEvent"("actorAccountId", "occurredAt");
CREATE INDEX "ProductAdminAuditEvent_target_account_idx" ON "ProductAdminAuditEvent"("targetAccountId", "occurredAt");

ALTER TABLE "Product"
  ADD COLUMN "retiredAt" TIMESTAMP(3),
  ADD COLUMN "retiredByAccountId" TEXT;
ALTER TABLE "Product" ADD CONSTRAINT "Product_retirement_pair_check" CHECK (
  ("retiredAt" IS NULL AND "retiredByAccountId" IS NULL) OR
  ("retiredAt" IS NOT NULL AND "retiredByAccountId" IS NOT NULL)
);
ALTER TABLE "Product" ADD CONSTRAINT "Product_retired_public_state_check" CHECK (
  "retiredAt" IS NULL OR
  ("active" = false AND "published" = false AND "commerciallyAvailable" = false AND
   "featured" = false AND "featuredOrder" IS NULL)
);
CREATE INDEX "Product_retiredAt_idx" ON "Product"("retiredAt", "updatedAt");

ALTER TABLE "Category"
  ADD COLUMN "retiredAt" TIMESTAMP(3),
  ADD COLUMN "retiredByAccountId" TEXT;
ALTER TABLE "Category" ADD CONSTRAINT "Category_retirement_pair_check" CHECK (
  ("retiredAt" IS NULL AND "retiredByAccountId" IS NULL) OR
  ("retiredAt" IS NOT NULL AND "retiredByAccountId" IS NOT NULL)
);
ALTER TABLE "Category" ADD CONSTRAINT "Category_retired_public_state_check" CHECK (
  "retiredAt" IS NULL OR ("active" = false AND "visible" = false)
);
CREATE INDEX "Category_retiredAt_idx" ON "Category"("retiredAt", "updatedAt");

CREATE TABLE "ProductSlugAlias" (
  "slug" TEXT NOT NULL,
  "productId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProductSlugAlias_pkey" PRIMARY KEY ("slug"),
  CONSTRAINT "ProductSlugAlias_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "ProductSlugAlias_productId_idx" ON "ProductSlugAlias"("productId");
CREATE UNIQUE INDEX "ProductVariant_one_base_per_product_key" ON "ProductVariant"("productId") WHERE "isBase" = true;

CREATE TABLE "CategorySlugAlias" (
  "slug" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CategorySlugAlias_pkey" PRIMARY KEY ("slug"),
  CONSTRAINT "CategorySlugAlias_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "CategorySlugAlias_categoryId_idx" ON "CategorySlugAlias"("categoryId");

CREATE FUNCTION "guard_product_slug_reservation"() RETURNS trigger AS $$
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended('product-slug:' || NEW."slug", 0));
  IF TG_TABLE_NAME = 'Product' AND EXISTS (SELECT 1 FROM "ProductSlugAlias" WHERE "slug" = NEW."slug") THEN
    RAISE EXCEPTION 'Product slug is historically reserved' USING ERRCODE = 'unique_violation';
  END IF;
  IF TG_TABLE_NAME = 'ProductSlugAlias' AND EXISTS (SELECT 1 FROM "Product" WHERE "slug" = NEW."slug") THEN
    RAISE EXCEPTION 'Product alias collides with canonical slug' USING ERRCODE = 'unique_violation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "Product_slug_reservation_guard" BEFORE INSERT OR UPDATE OF "slug" ON "Product"
  FOR EACH ROW EXECUTE FUNCTION "guard_product_slug_reservation"();
CREATE TRIGGER "ProductSlugAlias_reservation_guard" BEFORE INSERT ON "ProductSlugAlias"
  FOR EACH ROW EXECUTE FUNCTION "guard_product_slug_reservation"();

CREATE FUNCTION "guard_category_slug_reservation"() RETURNS trigger AS $$
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended('category-slug:' || NEW."slug", 0));
  IF TG_TABLE_NAME = 'Category' AND EXISTS (SELECT 1 FROM "CategorySlugAlias" WHERE "slug" = NEW."slug") THEN
    RAISE EXCEPTION 'Category slug is historically reserved' USING ERRCODE = 'unique_violation';
  END IF;
  IF TG_TABLE_NAME = 'CategorySlugAlias' AND EXISTS (SELECT 1 FROM "Category" WHERE "slug" = NEW."slug") THEN
    RAISE EXCEPTION 'Category alias collides with canonical slug' USING ERRCODE = 'unique_violation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "Category_slug_reservation_guard" BEFORE INSERT OR UPDATE OF "slug" ON "Category"
  FOR EACH ROW EXECUTE FUNCTION "guard_category_slug_reservation"();
CREATE TRIGGER "CategorySlugAlias_reservation_guard" BEFORE INSERT ON "CategorySlugAlias"
  FOR EACH ROW EXECUTE FUNCTION "guard_category_slug_reservation"();
