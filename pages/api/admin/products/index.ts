import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../lib/prisma";
import { requireProductAdmin, respondProductAdminError } from "../../../../src/server/productAdminApi";
import { listAdminProducts } from "../../../../src/server/productAdminCatalogService";
import { createProductWithBaseVariant, ProductUpdateConflictError } from "../../../../src/server/productAdminService";
import { applyProductAdminHeaders, productAdminRequestId } from "../../../../src/server/productAdminSecurity";
import { Prisma } from "@prisma/client";

export async function handleAdminProductList(req: NextApiRequest, res: NextApiResponse) {
  applyProductAdminHeaders(res);
  if (!req.method || !["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const authorized = await requireProductAdmin(prisma, req, res, { csrf: req.method === "POST" });
    if (req.method === "GET") return res.status(200).json(await listAdminProducts(prisma, req.query));
    const item = await prisma.$transaction(async (tx) => {
      const created = await createProductWithBaseVariant(tx, req.body);
      await tx.productAdminAuditEvent.create({ data: {
        requestId: productAdminRequestId(req), event: "PRODUCT_CREATE", outcome: "SUCCESS",
        actorAccountId: authorized.account.id, sessionIdHash: authorized.sessionIdHash,
        productId: created.id, changedFields: ["product", "baseVariant"],
      } });
      return created;
    });
    return res.status(201).json({ item });
  } catch (error) {
    if (error instanceof ProductUpdateConflictError ||
        (error instanceof Prisma.PrismaClientKnownRequestError && ["P2002", "P2003"].includes(error.code))) {
      return res.status(409).json({ error: "Product identity or taxonomy conflicts with current state" });
    }
    return respondProductAdminError(res, error);
  }
}

export default handleAdminProductList;
