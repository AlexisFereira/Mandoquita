import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../../lib/prisma";
import { auditCatalogMediaFailure, authorizeCatalogMediaMutation, respondCatalogMediaError } from "../../../../../src/server/catalogMediaApi";
import {
  addCategoryImage,
  CatalogMediaRequestError,
  getAdminCategoryMedia,
  removeCategoryImage,
  updateCategoryImage,
} from "../../../../../src/server/catalogMediaService";
import { requireProductAdmin } from "../../../../../src/server/productAdminApi";
import { applyProductAdminHeaders, productAdminRequestId } from "../../../../../src/server/productAdminSecurity";

export async function handleAdminCategoryImage(req: NextApiRequest, res: NextApiResponse) {
  applyProductAdminHeaders(res);
  if (!req.method || !["GET", "POST", "PATCH", "DELETE"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST, PATCH, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const requestId = productAdminRequestId(req);
  let categoryId: string | undefined;
  let sessionIdHash: string | undefined;
  try {
    categoryId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    if (!categoryId || categoryId.length > 160) throw new CatalogMediaRequestError("Invalid Category ID");
    if (req.method === "GET") {
      const authorized = await requireProductAdmin(prisma, req, res);
      sessionIdHash = authorized.sessionIdHash;
      return res.status(200).json(await getAdminCategoryMedia(prisma, categoryId));
    }
    const context = await authorizeCatalogMediaMutation(prisma, req, res);
    sessionIdHash = context.sessionIdHash;
    const result = req.method === "POST" ? await addCategoryImage(prisma, categoryId, req.body, context)
      : req.method === "PATCH" ? await updateCategoryImage(prisma, categoryId, req.body, context)
      : await removeCategoryImage(prisma, categoryId, req.body, context);
    return res.status(req.method === "POST" ? 201 : 200).json(result);
  } catch (error) {
    await auditCatalogMediaFailure(prisma, { requestId, event: "CATEGORY_IMAGE_CHANGE", error, sessionIdHash, categoryId }).catch(() => undefined);
    return respondCatalogMediaError(res, error);
  }
}

export default handleAdminCategoryImage;
