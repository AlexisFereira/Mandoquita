import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../../lib/prisma";
import {
  CategoryAdminConflictError, CategoryAdminNotFoundError, getAdminCategory, updateCategory,
} from "../../../../../src/server/categoryAdminService";
import { requireProductAdmin, respondProductAdminError } from "../../../../../src/server/productAdminApi";
import { applyProductAdminHeaders, productAdminRequestId } from "../../../../../src/server/productAdminSecurity";

export async function handleAdminCategory(req: NextApiRequest, res: NextApiResponse) {
  applyProductAdminHeaders(res);
  if (!req.method || !["GET", "PATCH"].includes(req.method)) {
    res.setHeader("Allow", "GET, PATCH");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const authorized = await requireProductAdmin(prisma, req, res, { csrf: req.method === "PATCH" });
    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    if (!id) return res.status(400).json({ error: "Invalid Category ID" });
    if (req.method === "GET") {
      const item = await getAdminCategory(prisma, id);
      return item ? res.status(200).json({ item }) : res.status(404).json({ error: "Category not found" });
    }
    const item = await prisma.$transaction(async (tx) => {
      const updated = await updateCategory(tx, id, req.body);
      await tx.productAdminAuditEvent.create({ data: {
        requestId: productAdminRequestId(req), event: "CATEGORY_UPDATE", outcome: "SUCCESS",
        actorAccountId: authorized.account.id, sessionIdHash: authorized.sessionIdHash, categoryId: id,
        expectedUpdatedAt: new Date(req.body.expectedUpdatedAt), currentUpdatedAt: new Date(updated.updatedAt),
        changedFields: Object.keys(req.body).filter((field) => field !== "expectedUpdatedAt").sort(),
      } });
      return updated;
    });
    return res.status(200).json({ item });
  } catch (error) {
    if (error instanceof CategoryAdminNotFoundError) return res.status(404).json({ error: "Category not found" });
    if (error instanceof CategoryAdminConflictError ||
        (error instanceof Prisma.PrismaClientKnownRequestError && ["P2002", "P2025"].includes(error.code))) {
      return res.status(409).json({ error: "Category update conflicts with current state" });
    }
    return respondProductAdminError(res, error);
  }
}

export default handleAdminCategory;
