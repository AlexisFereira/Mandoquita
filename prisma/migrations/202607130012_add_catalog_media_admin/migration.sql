ALTER TABLE "Category"
  ADD COLUMN "imageObjectKey" TEXT,
  ADD COLUMN "imageContentType" TEXT,
  ADD COLUMN "imageWidth" INTEGER,
  ADD COLUMN "imageHeight" INTEGER,
  ADD COLUMN "imageSize" INTEGER,
  ADD COLUMN "imageChecksum" TEXT;

ALTER TABLE "Category" DROP CONSTRAINT "Category_media_pair_check";
ALTER TABLE "Category" ADD CONSTRAINT "Category_media_pair_check" CHECK (
  ("imagePath" IS NULL AND "imageAltText" IS NULL) OR
  ("imagePath" IS NOT NULL AND btrim("imagePath") <> '' AND
   ("imageAltText" IS NULL OR btrim("imageAltText") <> ''))
);
ALTER TABLE "Category" ADD CONSTRAINT "Category_media_metadata_check" CHECK (
  ("imageObjectKey" IS NULL AND "imageContentType" IS NULL AND "imageWidth" IS NULL AND
   "imageHeight" IS NULL AND "imageSize" IS NULL AND "imageChecksum" IS NULL) OR
  ("imageObjectKey" IS NOT NULL AND "imageContentType" IN ('image/jpeg', 'image/png', 'image/webp', 'image/avif') AND
   "imageWidth" > 0 AND "imageHeight" > 0 AND "imageSize" > 0 AND
   "imageChecksum" ~ '^[a-f0-9]{64}$')
);

ALTER TABLE "ProductImage"
  ADD COLUMN "objectKey" TEXT,
  ADD COLUMN "contentType" TEXT,
  ADD COLUMN "width" INTEGER,
  ADD COLUMN "height" INTEGER,
  ADD COLUMN "size" INTEGER,
  ADD COLUMN "checksum" TEXT;
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_media_metadata_check" CHECK (
  ("objectKey" IS NULL AND "contentType" IS NULL AND "width" IS NULL AND
   "height" IS NULL AND "size" IS NULL AND "checksum" IS NULL) OR
  ("objectKey" IS NOT NULL AND "contentType" IN ('image/jpeg', 'image/png', 'image/webp', 'image/avif') AND
   "width" > 0 AND "height" > 0 AND "size" > 0 AND "checksum" ~ '^[a-f0-9]{64}$')
);

ALTER TABLE "ProductAdminAuditEvent"
  ADD COLUMN "categoryId" TEXT,
  ADD COLUMN "mediaId" TEXT,
  ADD COLUMN "mediaUploadHash" TEXT,
  ADD COLUMN "detectedType" TEXT,
  ADD COLUMN "encodedSize" INTEGER,
  ADD COLUMN "checksumPrefix" TEXT;

CREATE TABLE "CatalogMediaUpload" (
  "id" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "kind" TEXT NOT NULL,
  "idempotencyKeyHash" TEXT NOT NULL,
  "requestHash" TEXT NOT NULL,
  "objectKey" TEXT NOT NULL,
  "deliveryUrl" TEXT NOT NULL,
  "contentType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "width" INTEGER NOT NULL,
  "height" INTEGER NOT NULL,
  "checksumSha256" TEXT NOT NULL,
  "originalNameHash" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'READY',
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "consumedAt" TIMESTAMP(3),
  "cancelledAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CatalogMediaUpload_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CatalogMediaUpload_session_fkey" FOREIGN KEY ("sessionId") REFERENCES "ProductAdminSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "CatalogMediaUpload_kind_check" CHECK ("kind" IN ('PRODUCT', 'CATEGORY')),
  CONSTRAINT "CatalogMediaUpload_status_check" CHECK ("status" IN ('READY', 'CONSUMED', 'CANCELLED', 'EXPIRED')),
  CONSTRAINT "CatalogMediaUpload_metadata_check" CHECK (
    "contentType" IN ('image/jpeg', 'image/png', 'image/webp', 'image/avif') AND
    "size" > 0 AND "width" > 0 AND "height" > 0 AND "checksumSha256" ~ '^[a-f0-9]{64}$'
  )
);

CREATE TABLE "CatalogMediaIdempotency" (
  "id" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "keyHash" TEXT NOT NULL,
  "requestHash" TEXT NOT NULL,
  "operation" TEXT NOT NULL,
  "response" JSONB NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CatalogMediaIdempotency_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CatalogMediaIdempotency_session_fkey" FOREIGN KEY ("sessionId") REFERENCES "ProductAdminSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "CatalogMediaObjectCleanup" (
  "id" TEXT NOT NULL,
  "objectKey" TEXT NOT NULL,
  "deliveryUrl" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "restoreMetadata" JSONB,
  "deleteAfter" TIMESTAMP(3) NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "lastErrorCode" TEXT,
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CatalogMediaObjectCleanup_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CatalogMediaObjectCleanup_reason_check" CHECK ("reason" IN ('EXPIRED_UPLOAD', 'CANCELLED_UPLOAD', 'SUPERSEDED', 'REMOVED')),
  CONSTRAINT "CatalogMediaObjectCleanup_status_check" CHECK ("status" IN ('PENDING', 'DELETED', 'FAILED')),
  CONSTRAINT "CatalogMediaObjectCleanup_attempts_check" CHECK ("attempts" >= 0)
);

CREATE TABLE "CatalogMediaRateLimit" (
  "sessionId" TEXT NOT NULL,
  "windowStartedAt" TIMESTAMP(3) NOT NULL,
  "uploadCount" INTEGER NOT NULL DEFAULT 0,
  "mutationCount" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CatalogMediaRateLimit_pkey" PRIMARY KEY ("sessionId"),
  CONSTRAINT "CatalogMediaRateLimit_session_fkey" FOREIGN KEY ("sessionId") REFERENCES "ProductAdminSession"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "CatalogMediaRateLimit_counts_check" CHECK ("uploadCount" >= 0 AND "mutationCount" >= 0)
);

CREATE UNIQUE INDEX "CatalogMediaUpload_objectKey_key" ON "CatalogMediaUpload"("objectKey");
CREATE UNIQUE INDEX "CatalogMediaUpload_session_idempotency_key" ON "CatalogMediaUpload"("sessionId", "idempotencyKeyHash");
CREATE INDEX "CatalogMediaUpload_expiry_idx" ON "CatalogMediaUpload"("status", "expiresAt");
CREATE UNIQUE INDEX "CatalogMediaIdempotency_session_key" ON "CatalogMediaIdempotency"("sessionId", "keyHash");
CREATE INDEX "CatalogMediaIdempotency_expiry_idx" ON "CatalogMediaIdempotency"("expiresAt");
CREATE UNIQUE INDEX "CatalogMediaObjectCleanup_objectKey_key" ON "CatalogMediaObjectCleanup"("objectKey");
CREATE INDEX "CatalogMediaObjectCleanup_due_idx" ON "CatalogMediaObjectCleanup"("status", "deleteAfter");
CREATE INDEX "ProductAdminAuditEvent_category_idx" ON "ProductAdminAuditEvent"("categoryId", "occurredAt");
