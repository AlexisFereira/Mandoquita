import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../lib/prisma";
import { auditCatalogMediaFailure, authorizeCatalogMediaMutation, respondCatalogMediaError } from "../../../../src/server/catalogMediaApi";
import { cancelCatalogMediaUpload, catalogMediaOpaqueHash, CatalogMediaRequestError, getCatalogMediaUpload } from "../../../../src/server/catalogMediaService";
import { requireProductAdmin } from "../../../../src/server/productAdminApi";
import { applyProductAdminHeaders, productAdminRequestId } from "../../../../src/server/productAdminSecurity";

export async function handleCatalogMediaUploadItem(req: NextApiRequest, res: NextApiResponse) {
  applyProductAdminHeaders(res);
  if (!req.method || !["GET", "DELETE"].includes(req.method)) {
    res.setHeader("Allow", "GET, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const requestId = productAdminRequestId(req);
  let sessionIdHash: string | undefined;
  try {
    if (!id) throw new CatalogMediaRequestError("Invalid upload ID");
    if (req.method === "GET") {
      const authorized = await requireProductAdmin(prisma, req, res);
      sessionIdHash = authorized.sessionIdHash;
      return res.status(200).json(await getCatalogMediaUpload(prisma, authorized.session.id, id));
    }
    const context = await authorizeCatalogMediaMutation(prisma, req, res);
    sessionIdHash = context.sessionIdHash;
    const result = await cancelCatalogMediaUpload(prisma, context.sessionId, id);
    await prisma.productAdminAuditEvent.create({ data: { requestId: context.requestId, event: "MEDIA_UPLOAD_CANCEL", outcome: "SUCCESS", sessionIdHash, mediaUploadHash: catalogMediaOpaqueHash(id) } });
    return res.status(200).json(result);
  } catch (error) {
    await auditCatalogMediaFailure(prisma, { requestId, event: "MEDIA_UPLOAD_ACCESS", error, sessionIdHash }).catch(() => undefined);
    return respondCatalogMediaError(res, error);
  }
}

export default handleCatalogMediaUploadItem;
