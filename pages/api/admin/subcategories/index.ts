import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../lib/prisma";
import {
  createSubcategory,
  listSubcategories,
} from "../../../../src/server/modules/subcategories";
import {
  createPrismaSubcategoryRepository,
} from "../../../../src/server/modules/subcategories/prisma-subcategory.repository";
import {
  createPrismaCategoryRepository,
} from "../../../../src/server/modules/categories/prisma-category.repository";
import {
  requireProductAdmin,
  respondProductAdminError,
} from "../../../../src/server/productAdminApi";
import {
  applyProductAdminHeaders,
  productAdminRequestId,
} from "../../../../src/server/productAdminSecurity";
import { mapAdminErrorToHttp } from "../../../../src/server/modules/shared/admin-error-mapper";

export async function handleAdminSubcategories(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  applyProductAdminHeaders(res);

  if (!req.method || !["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authorized = await requireProductAdmin(prisma, req, res, {
      csrf: req.method === "POST",
    });

    const subcategoryRepo = createPrismaSubcategoryRepository(prisma);
    const categoryRepo = createPrismaCategoryRepository(prisma);

    if (req.method === "GET") {
      const result = await listSubcategories(subcategoryRepo, req.query);
      return res.status(200).json(result);
    }

    // POST: crear
    const created = await prisma.$transaction(async (tx) => {
      const txSubcategoryRepo = createPrismaSubcategoryRepository(tx);
      const txCategoryRepo = createPrismaCategoryRepository(tx);

      const created = await createSubcategory(txSubcategoryRepo, req.body, {
        findById: (id) => txCategoryRepo.findById(id),
      });

      await tx.productAdminAuditEvent.create({
        data: {
          requestId: productAdminRequestId(req),
          event: "SUBCATEGORY_CREATE",
          outcome: "SUCCESS",
          actorAccountId: authorized.account.id,
          sessionIdHash: authorized.sessionIdHash,
          categoryId: created.categoryId,
          changedFields: ["subcategory"],
        },
      });
      return created;
    });

    return res.status(201).json({ item: created });
  } catch (error) {
    if (mapAdminErrorToHttp(res, error)) return;
    return respondProductAdminError(res, error);
  }
}

export default handleAdminSubcategories;
