import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";

import { prisma } from "../../../../../lib/prisma";
import { requireProductAdmin, respondProductAdminError } from "../../../../../src/server/productAdminApi";
import {
  parseProductId, ProductNotFoundError, ProductUpdateConflictError, restoreProduct,
} from "../../../../../src/server/productAdminService";
import { applyProductAdminHeaders, productAdminRequestId } from "../../../../../src/server/productAdminSecurity";

export async function handleProductRestore(req: NextApiRequest, res: NextApiResponse) {
  applyProductAdminHeaders(res);
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const authorized = await requireProductAdmin(prisma, req, res, { csrf: true });
    const productId = parseProductId(req.query.id);
    const item = await prisma.$transaction(async (tx) => {
      const result = await restoreProduct(tx, productId, req.body);
      await tx.productAdminAuditEvent.create({ data: {
        requestId: productAdminRequestId(req), event: "PRODUCT_RESTORE", outcome: "SUCCESS",
        actorAccountId: authorized.account.id, sessionIdHash: authorized.sessionIdHash,
        productId, expectedUpdatedAt: new Date(req.body.expectedUpdatedAt), currentUpdatedAt: new Date(result.updatedAt),
      } });
      return result;
    });
    return res.status(200).json({ item });
  } catch (error) {
    if (error instanceof ProductNotFoundError) return res.status(404).json({ error: "Product not found" });
    if (error instanceof ProductUpdateConflictError ||
        (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")) {
      return res.status(409).json({ error: "Product restore conflicts with current state" });
    }
    return respondProductAdminError(res, error);
  }
}

export default handleProductRestore;
