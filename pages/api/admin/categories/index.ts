import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../lib/prisma";
import { CategoryAdminConflictError, createCategory, listAdminCategories } from "../../../../src/server/categoryAdminService";
import { requireProductAdmin, respondProductAdminError } from "../../../../src/server/productAdminApi";
import { applyProductAdminHeaders, productAdminRequestId } from "../../../../src/server/productAdminSecurity";

export async function handleAdminCategories(req: NextApiRequest, res: NextApiResponse) {
  applyProductAdminHeaders(res);
  if (!req.method || !["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const authorized = await requireProductAdmin(prisma, req, res, { csrf: req.method === "POST" });
    if (req.method === "GET") return res.status(200).json(await listAdminCategories(prisma, req.query));
    const item = await prisma.$transaction(async (tx) => {
      const created = await createCategory(tx, req.body);
      await tx.productAdminAuditEvent.create({ data: {
        requestId: productAdminRequestId(req), event: "CATEGORY_CREATE", outcome: "SUCCESS",
        actorAccountId: authorized.account.id, sessionIdHash: authorized.sessionIdHash,
        categoryId: created.id, changedFields: ["category"],
      } });
      return created;
    });
    return res.status(201).json({ item });
  } catch (error) {
    if (error instanceof CategoryAdminConflictError ||
        (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")) {
      return res.status(409).json({ error: "Category identity or taxonomy conflicts with current state" });
    }
    return respondProductAdminError(res, error);
  }
}

export default handleAdminCategories;
