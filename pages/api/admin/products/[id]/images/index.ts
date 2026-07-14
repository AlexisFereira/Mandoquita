import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../../../lib/prisma";
import { auditCatalogMediaFailure, authorizeCatalogMediaMutation, respondCatalogMediaError } from "../../../../../../src/server/catalogMediaApi";
import { addProductImage, getAdminProductMedia, reorderProductImages } from "../../../../../../src/server/catalogMediaService";
import { requireProductAdmin } from "../../../../../../src/server/productAdminApi";
import { parseProductId } from "../../../../../../src/server/productAdminService";
import { applyProductAdminHeaders, productAdminRequestId } from "../../../../../../src/server/productAdminSecurity";

export async function handleAdminProductImages(req: NextApiRequest, res: NextApiResponse) {
  applyProductAdminHeaders(res);
  if (!req.method || !["GET", "POST", "PATCH"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST, PATCH");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const requestId = productAdminRequestId(req);
  let productId: number | undefined;
  let sessionIdHash: string | undefined;
  try {
    productId = parseProductId(req.query.id);
    if (req.method === "GET") {
      const authorized = await requireProductAdmin(prisma, req, res);
      sessionIdHash = authorized.sessionIdHash;
      return res.status(200).json(await getAdminProductMedia(prisma, productId));
    }
    const context = await authorizeCatalogMediaMutation(prisma, req, res);
    sessionIdHash = context.sessionIdHash;
    const result = req.method === "POST"
      ? await addProductImage(prisma, productId, req.body, context)
      : await reorderProductImages(prisma, productId, req.body, context);
    return res.status(req.method === "POST" ? 201 : 200).json(result);
  } catch (error) {
    await auditCatalogMediaFailure(prisma, { requestId, event: "PRODUCT_MEDIA_COLLECTION", error, sessionIdHash, productId }).catch(() => undefined);
    return respondCatalogMediaError(res, error);
  }
}

export default handleAdminProductImages;
