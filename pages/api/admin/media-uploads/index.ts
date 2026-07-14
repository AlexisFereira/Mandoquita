import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../lib/prisma";
import {
  auditCatalogMediaFailure,
  authorizeCatalogMediaMutation,
  readCatalogMediaBody,
  respondCatalogMediaError,
  singleRequestHeader,
} from "../../../../src/server/catalogMediaApi";
import { catalogMediaOpaqueHash, CatalogMediaRequestError, createCatalogMediaUpload } from "../../../../src/server/catalogMediaService";
import { applyProductAdminHeaders } from "../../../../src/server/productAdminSecurity";
import { getS3ImageStorageConfig } from "../../../../src/server/s3ImageStorageService";

export async function handleCatalogMediaUpload(req: NextApiRequest, res: NextApiResponse) {
  applyProductAdminHeaders(res);
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  let context: Awaited<ReturnType<typeof authorizeCatalogMediaMutation>> | undefined;
  try {
    context = await authorizeCatalogMediaMutation(prisma, req, res, "upload");
    const rawKind = Array.isArray(req.query.kind) ? req.query.kind[0] : req.query.kind;
    const kind = rawKind === "product" ? "PRODUCT" : rawKind === "category" ? "CATEGORY" : null;
    const contentType = singleRequestHeader(req.headers["content-type"]);
    const originalFileName = singleRequestHeader(req.headers["x-file-name"]);
    if (!kind || !contentType || !originalFileName || originalFileName.length > 255) throw new CatalogMediaRequestError("Invalid upload headers");
    const config = getS3ImageStorageConfig();
    const body = await readCatalogMediaBody(req, config.maximumBytes);
    const upload = await createCatalogMediaUpload(prisma, {
      sessionId: context.sessionId,
      kind,
      idempotencyKey: context.idempotencyKey,
      body,
      declaredContentType: contentType,
      originalFileName,
    });
    await prisma.productAdminAuditEvent.create({ data: {
      requestId: context.requestId, event: "MEDIA_UPLOAD_CREATE", outcome: "SUCCESS",
      sessionIdHash: context.sessionIdHash, mediaUploadHash: catalogMediaOpaqueHash(upload.id),
      detectedType: upload.contentType, encodedSize: upload.size, checksumPrefix: upload.checksumSha256.slice(0, 12),
    } });
    return res.status(201).json({ upload });
  } catch (error) {
    if (context) await auditCatalogMediaFailure(prisma, { requestId: context.requestId, event: "MEDIA_UPLOAD_CREATE", error, sessionIdHash: context.sessionIdHash }).catch(() => undefined);
    return respondCatalogMediaError(res, error);
  }
}

export const config = { api: { bodyParser: false } };
export default handleCatalogMediaUpload;
