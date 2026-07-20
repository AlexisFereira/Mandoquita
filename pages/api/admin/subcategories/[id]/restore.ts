import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../../lib/prisma";
import { restoreSubcategory } from "../../../../../src/server/modules/subcategories";
import {
  createPrismaSubcategoryRepository,
} from "../../../../../src/server/modules/subcategories/prisma-subcategory.repository";
import {
  requireProductAdmin,
  respondProductAdminError,
} from "../../../../../src/server/productAdminApi";
import {
  applyProductAdminHeaders,
  productAdminRequestId,
} from "../../../../../src/server/productAdminSecurity";
import { mapAdminErrorToHttp } from "../../../../../src/server/modules/shared/admin-error-mapper";

export async function handleAdminSubcategoryRestore(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  applyProductAdminHeaders(res);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const id = String(req.query.id ?? "");
  if (!id) {
    return res.status(400).json({ error: "Subcategory id is required" });
  }

  try {
    const authorized = await requireProductAdmin(prisma, req, res, { csrf: true });

    const result = await prisma.$transaction(async (tx) => {
      const txRepo = createPrismaSubcategoryRepository(tx);
      const item = await restoreSubcategory(txRepo, id, req.body);
      await tx.productAdminAuditEvent.create({
        data: {
          requestId: productAdminRequestId(req),
          event: "SUBCATEGORY_RESTORE",
          outcome: "SUCCESS",
          actorAccountId: authorized.account.id,
          sessionIdHash: authorized.sessionIdHash,
          categoryId: item.categoryId,
        },
      });
      return item;
    });

    return res.status(200).json({ item: result });
  } catch (error) {
    if (mapAdminErrorToHttp(res, error)) return;
    return respondProductAdminError(res, error);
  }
}

export default handleAdminSubcategoryRestore;
