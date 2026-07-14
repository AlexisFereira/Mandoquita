import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../../../lib/prisma";
import { auditCatalogMediaFailure, authorizeCatalogMediaMutation, respondCatalogMediaError } from "../../../../../../src/server/catalogMediaApi";
import { CatalogMediaRequestError, changeProductImage, removeProductImage } from "../../../../../../src/server/catalogMediaService";
import { parseProductId } from "../../../../../../src/server/productAdminService";
import { applyProductAdminHeaders, productAdminRequestId } from "../../../../../../src/server/productAdminSecurity";

export async function handleAdminProductImage(req: NextApiRequest, res: NextApiResponse) {
  applyProductAdminHeaders(res);
  if (!req.method || !["PATCH", "DELETE"].includes(req.method)) {
    res.setHeader("Allow", "PATCH, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const requestId = productAdminRequestId(req);
  let productId: number | undefined;
  let imageId: string | undefined;
  let sessionIdHash: string | undefined;
  try {
    productId = parseProductId(req.query.id);
    imageId = Array.isArray(req.query.imageId) ? req.query.imageId[0] : req.query.imageId;
    if (!imageId) throw new CatalogMediaRequestError("Invalid Product Image ID");
    const context = await authorizeCatalogMediaMutation(prisma, req, res);
    sessionIdHash = context.sessionIdHash;
    const result = req.method === "PATCH"
      ? await changeProductImage(prisma, productId, imageId, req.body, context)
      : await removeProductImage(prisma, productId, imageId, req.body, context);
    return res.status(200).json(result);
  } catch (error) {
    await auditCatalogMediaFailure(prisma, { requestId, event: "PRODUCT_IMAGE_CHANGE", error, sessionIdHash, productId, mediaId: imageId }).catch(() => undefined);
    return respondCatalogMediaError(res, error);
  }
}

export default handleAdminProductImage;
