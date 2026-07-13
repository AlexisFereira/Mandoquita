CREATE TABLE "ProductAdminSession" (
  "id" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "csrfHash" TEXT NOT NULL,
  "credentialFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "idleExpiresAt" TIMESTAMP(3) NOT NULL,
  "absoluteExpiresAt" TIMESTAMP(3) NOT NULL,
  "revokedAt" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProductAdminSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProductAdminThrottle" (
  "scope" TEXT NOT NULL,
  "keyHash" TEXT NOT NULL,
  "windowStartedAt" TIMESTAMP(3) NOT NULL,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "lockedUntil" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProductAdminThrottle_pkey" PRIMARY KEY ("scope", "keyHash"),
  CONSTRAINT "ProductAdminThrottle_failure_count_check" CHECK ("failureCount" >= 0),
  CONSTRAINT "ProductAdminThrottle_scope_check" CHECK ("scope" IN ('CLIENT', 'DEPLOYMENT'))
);

CREATE TABLE "ProductAdminAuditEvent" (
  "id" BIGSERIAL NOT NULL,
  "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "requestId" TEXT NOT NULL,
  "event" TEXT NOT NULL,
  "outcome" TEXT NOT NULL,
  "reason" TEXT,
  "sessionIdHash" TEXT,
  "productId" INTEGER,
  "expectedUpdatedAt" TIMESTAMP(3),
  "currentUpdatedAt" TIMESTAMP(3),
  "changedFields" JSONB,
  CONSTRAINT "ProductAdminAuditEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProductAdminSession_tokenHash_key" ON "ProductAdminSession"("tokenHash");
CREATE INDEX "ProductAdminSession_expiry_idx" ON "ProductAdminSession"("idleExpiresAt", "absoluteExpiresAt", "revokedAt");
CREATE INDEX "ProductAdminSession_cleanup_idx" ON "ProductAdminSession"("createdAt");
CREATE INDEX "ProductAdminThrottle_lock_idx" ON "ProductAdminThrottle"("lockedUntil");
CREATE INDEX "ProductAdminThrottle_cleanup_idx" ON "ProductAdminThrottle"("updatedAt");
CREATE INDEX "ProductAdminAuditEvent_retention_idx" ON "ProductAdminAuditEvent"("occurredAt");
CREATE INDEX "ProductAdminAuditEvent_product_idx" ON "ProductAdminAuditEvent"("productId", "occurredAt");
