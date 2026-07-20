import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../lib/prisma";
import {
  createProductType,
  listProductTypes,
} from "../../../../src/server/modules/productTypes";
import {
  createPrismaProductTypeRepository,
} from "../../../../src/server/modules/productTypes/prisma-productType.repository";
import {
  createPrismaSubcategoryRepository,
} from "../../../../src/server/modules/subcategories/prisma-subcategory.repository";
import {
  requireProductAdmin,
  respondProductAdminError,
} from "../../../../src/server/productAdminApi";
import {
  applyProductAdminHeaders,
  productAdminRequestId,
} from "../../../../src/server/productAdminSecurity";
import { mapAdminErrorToHttp } from "../../../../src/server/modules/shared/admin-error-mapper";

export async function handleAdminProductTypes(
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

    const productTypeRepo = createPrismaProductTypeRepository(prisma);
    const subcategoryRepo = createPrismaSubcategoryRepository(prisma);

    if (req.method === "GET") {
      const result = await listProductTypes(productTypeRepo, req.query);
      return res.status(200).json(result);
    }

    // POST: crear
    const created = await prisma.$transaction(async (tx) => {
      const txProductTypeRepo = createPrismaProductTypeRepository(tx);
      const txSubcategoryRepo = createPrismaSubcategoryRepository(tx);

      const created = await createProductType(
        txProductTypeRepo,
        { findById: (id) => txSubcategoryRepo.findById(id) },
        req.body,
      );

      await tx.productAdminAuditEvent.create({
        data: {
          requestId: productAdminRequestId(req),
          event: "PRODUCT_TYPE_CREATE",
          outcome: "SUCCESS",
          actorAccountId: authorized.account.id,
          sessionIdHash: authorized.sessionIdHash,
          categoryId: created.subcategoryId, // podríamos guardar el subcategoryId en otro campo
          changedFields: ["productType"],
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

export default handleAdminProductTypes;
