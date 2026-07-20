import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../../lib/prisma";
import { retireProductType } from "../../../../../src/server/modules/productTypes";
import {
  createPrismaProductTypeRepository,
} from "../../../../../src/server/modules/productTypes/prisma-productType.repository";
import {
  requireProductAdmin,
  respondProductAdminError,
} from "../../../../../src/server/productAdminApi";
import {
  applyProductAdminHeaders,
  productAdminRequestId,
} from "../../../../../src/server/productAdminSecurity";
import { mapAdminErrorToHttp } from "../../../../../src/server/modules/shared/admin-error-mapper";

export async function handleAdminProductTypeRetire(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  applyProductAdminHeaders(res);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const name = String(req.query.name ?? "");
  if (!name) {
    return res.status(400).json({ error: "ProductType name is required" });
  }

  try {
    const authorized = await requireProductAdmin(prisma, req, res, { csrf: true });

    const result = await prisma.$transaction(async (tx) => {
      const txRepo = createPrismaProductTypeRepository(tx);
      const item = await retireProductType(
        txRepo,
        name,
        req.body,
        authorized.account.id,
      );
      await tx.productAdminAuditEvent.create({
        data: {
          requestId: productAdminRequestId(req),
          event: "PRODUCT_TYPE_RETIRE",
          outcome: "SUCCESS",
          actorAccountId: authorized.account.id,
          sessionIdHash: authorized.sessionIdHash,
          categoryId: item?.subcategoryId,
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

export default handleAdminProductTypeRetire;
