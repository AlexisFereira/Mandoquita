import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../../lib/prisma";
import {
  CategoryAdminConflictError, CategoryAdminNotFoundError, restoreCategory,
} from "../../../../../src/server/categoryAdminService";
import { requireProductAdmin, respondProductAdminError } from "../../../../../src/server/productAdminApi";
import { applyProductAdminHeaders, productAdminRequestId } from "../../../../../src/server/productAdminSecurity";

export async function handleCategoryRestore(req: NextApiRequest, res: NextApiResponse) {
  applyProductAdminHeaders(res);
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const authorized = await requireProductAdmin(prisma, req, res, { csrf: true });
    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    if (!id) return res.status(400).json({ error: "Invalid Category ID" });
    const item = await prisma.$transaction(async (tx) => {
      const restored = await restoreCategory(tx, id, req.body);
      await tx.productAdminAuditEvent.create({ data: {
        requestId: productAdminRequestId(req), event: "CATEGORY_RESTORE", outcome: "SUCCESS",
        actorAccountId: authorized.account.id, sessionIdHash: authorized.sessionIdHash, categoryId: id,
        expectedUpdatedAt: new Date(req.body.expectedUpdatedAt), currentUpdatedAt: restored ? new Date(restored.updatedAt) : undefined,
      } });
      return restored;
    });
    return res.status(200).json({ item });
  } catch (error) {
    if (error instanceof CategoryAdminNotFoundError) return res.status(404).json({ error: "Category not found" });
    if (error instanceof CategoryAdminConflictError) return res.status(409).json({ error: "Category restore conflicts with current state" });
    return respondProductAdminError(res, error);
  }
}

export default handleCategoryRestore;
