import type { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";

import {
  CatalogMediaConflictError,
  CatalogMediaNotFoundError,
  CatalogMediaRequestError,
  type CatalogMediaMutationContext,
} from "./catalogMediaService";
import {
  CatalogMediaTooLargeError,
  CatalogMediaValidationError,
} from "./catalogMediaStorageService";
import { requireProductAdmin, respondProductAdminError } from "./productAdminApi";
import { productAdminRequestId } from "./productAdminSecurity";
import { ProductAdminHttpError } from "./productAdminSecurity";
import { S3ImageConfigurationError } from "./s3ImageStorageService";

export function singleRequestHeader(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function authorizeCatalogMediaMutation(
  prisma: PrismaClient,
  req: NextApiRequest,
  res: NextApiResponse,
  rateKind: "upload" | "mutation" = "mutation",
): Promise<CatalogMediaMutationContext> {
  const authorized = await requireProductAdmin(prisma, req, res, { csrf: true });
  const idempotencyKey = singleRequestHeader(req.headers["idempotency-key"]);
  if (!idempotencyKey) throw new CatalogMediaRequestError("Idempotency-Key is required");
  const now = new Date();
  const cutoff = new Date(now.getTime() - 60 * 60 * 1000);
  const row = await prisma.$transaction(async (tx) => {
    await tx.catalogMediaRateLimit.updateMany({
      where: { sessionId: authorized.session.id, windowStartedAt: { lt: cutoff } },
      data: { windowStartedAt: now, uploadCount: 0, mutationCount: 0 },
    });
    return tx.catalogMediaRateLimit.upsert({
      where: { sessionId: authorized.session.id },
      create: {
        sessionId: authorized.session.id, windowStartedAt: now,
        uploadCount: rateKind === "upload" ? 1 : 0,
        mutationCount: rateKind === "mutation" ? 1 : 0,
      },
      update: rateKind === "upload" ? { uploadCount: { increment: 1 } } : { mutationCount: { increment: 1 } },
    });
  });
  if ((rateKind === "upload" && row.uploadCount > 30) || (rateKind === "mutation" && row.mutationCount > 300)) {
    const retryAfter = Math.max(1, Math.ceil((row.windowStartedAt.getTime() + 60 * 60 * 1000 - now.getTime()) / 1000));
    throw new ProductAdminHttpError(429, "MEDIA_RATE_LIMIT", retryAfter);
  }
  return {
    sessionId: authorized.session.id,
    sessionIdHash: authorized.sessionIdHash,
    actorAccountId: authorized.account.id,
    requestId: productAdminRequestId(req),
    idempotencyKey,
  };
}

export async function readCatalogMediaBody(req: NextApiRequest, maximumBytes: number) {
  const length = Number(singleRequestHeader(req.headers["content-length"]));
  if (Number.isFinite(length) && length > maximumBytes) throw new CatalogMediaTooLargeError("Image exceeds maximum size");
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > maximumBytes) throw new CatalogMediaTooLargeError("Image exceeds maximum size");
    chunks.push(buffer);
  }
  return Buffer.concat(chunks);
}

export function respondCatalogMediaError(res: NextApiResponse, error: unknown) {
  if (error instanceof ZodError || error instanceof CatalogMediaRequestError || error instanceof CatalogMediaValidationError) {
    return res.status(400).json({ error: "Invalid media request" });
  }
  if (error instanceof CatalogMediaTooLargeError) return res.status(413).json({ error: "Image exceeds the configured size limit" });
  if (error instanceof CatalogMediaNotFoundError) return res.status(404).json({ error: "Media resource not found" });
  if (error instanceof CatalogMediaConflictError) return res.status(409).json({ error: "Media change conflicts with current state" });
  if (error instanceof S3ImageConfigurationError) return res.status(503).json({ error: "Media administration is unavailable" });
  if (error && typeof error === "object" && "$metadata" in error) return res.status(502).json({ error: "Media storage is temporarily unavailable" });
  return respondProductAdminError(res, error);
}

export async function auditCatalogMediaFailure(
  prisma: PrismaClient,
  input: {
    requestId: string; event: string; error: unknown; sessionIdHash?: string;
    productId?: number; categoryId?: string; mediaId?: string;
  },
) {
  const outcome = input.error instanceof CatalogMediaConflictError ? "CONFLICT"
    : input.error instanceof CatalogMediaNotFoundError ? "MISSING"
    : input.error instanceof ZodError || input.error instanceof CatalogMediaRequestError ||
      input.error instanceof CatalogMediaValidationError || input.error instanceof CatalogMediaTooLargeError ? "INVALID"
    : "FAILED";
  await prisma.productAdminAuditEvent.create({ data: {
    requestId: input.requestId,
    event: input.event,
    outcome,
    reason: outcome === "CONFLICT" ? "STATE_OR_VERSION" : outcome === "MISSING" ? "NOT_FOUND" : outcome === "INVALID" ? "VALIDATION" : "UNAVAILABLE",
    sessionIdHash: input.sessionIdHash,
    productId: input.productId,
    categoryId: input.categoryId,
    mediaId: input.mediaId,
  } });
}
