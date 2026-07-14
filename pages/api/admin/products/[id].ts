import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

import { prisma } from "../../../../lib/prisma";
import { requireProductAdmin, respondProductAdminError } from "../../../../src/server/productAdminApi";
import { getAdminProductById } from "../../../../src/server/productAdminCatalogService";
import {
  parseProductId,
  ProductNotFoundError,
  ProductUpdateConflictError,
  productUpdateSchema,
  updateProductById,
} from "../../../../src/server/productAdminService";
import {
  applyProductAdminHeaders,
  auditProductAdminEvent,
  productAdminRequestId,
} from "../../../../src/server/productAdminSecurity";

export async function handleAdminProduct(req: NextApiRequest, res: NextApiResponse) {
  applyProductAdminHeaders(res);
  if (!req.method || !["GET", "PATCH"].includes(req.method)) {
    res.setHeader("Allow", "GET, PATCH");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const requestId = productAdminRequestId(req);
  let productId: number | undefined;
  let sessionIdHash: string | undefined;

  try {
    const authorized = await requireProductAdmin(prisma, req, res, { csrf: req.method === "PATCH" });
    sessionIdHash = authorized.sessionIdHash;
    productId = parseProductId(req.query.id);

    if (req.method === "GET") {
      const item = await getAdminProductById(prisma, productId);
      if (!item) return res.status(404).json({ error: "Product not found" });
      return res.status(200).json({ item });
    }

    const parsed = productUpdateSchema.parse(req.body);
    const expectedUpdatedAt = new Date(parsed.expectedUpdatedAt);
    const changedFields = Object.keys(parsed).filter((field) => field !== "expectedUpdatedAt").sort();
    const item = await prisma.$transaction(async (tx) => {
      await updateProductById(tx, productId!, parsed);
      const updated = await getAdminProductById(tx as typeof prisma, productId!);
      if (!updated) throw new ProductNotFoundError("Product not found");
      await auditProductAdminEvent(tx as typeof prisma, {
        requestId,
        event: "PRODUCT_UPDATE",
        outcome: "SUCCESS",
        sessionIdHash,
        productId,
        expectedUpdatedAt,
        currentUpdatedAt: new Date(updated.updatedAt),
        changedFields,
        actorAccountId: authorized.account.id,
      });
      return updated;
    });
    return res.status(200).json({ item });
  } catch (error) {
    if (error instanceof ZodError) {
      try {
        await auditProductAdminEvent(prisma, {
          requestId, event: "PRODUCT_UPDATE", outcome: "INVALID", reason: "VALIDATION",
          sessionIdHash, productId,
          actorAccountId: undefined,
        });
      } catch { return res.status(503).json({ error: "Product Admin is unavailable" }); }
      return res.status(400).json({ error: "Invalid Product update" });
    }

    if (error instanceof ProductNotFoundError) {
      try {
        await auditProductAdminEvent(prisma, {
          requestId, event: "PRODUCT_UPDATE", outcome: "MISSING", reason: "PRODUCT_NOT_FOUND",
          sessionIdHash, productId,
        });
      } catch { return res.status(503).json({ error: "Product Admin is unavailable" }); }
      return res.status(404).json({ error: "Product not found" });
    }

    if (error instanceof ProductUpdateConflictError ||
      (error instanceof Prisma.PrismaClientKnownRequestError && ["P2002", "P2003", "P2025"].includes(error.code))) {
      const expected = typeof req.body?.expectedUpdatedAt === "string" ? new Date(req.body.expectedUpdatedAt) : undefined;
      const current = productId ? await prisma.product.findUnique({ where: { id: productId }, select: { updatedAt: true } }) : null;
      try {
        await auditProductAdminEvent(prisma, {
          requestId, event: "PRODUCT_UPDATE", outcome: "CONFLICT", reason: "STATE_OR_VERSION",
          sessionIdHash, productId, expectedUpdatedAt: expected && !Number.isNaN(expected.getTime()) ? expected : undefined,
          currentUpdatedAt: current?.updatedAt,
        });
      } catch { return res.status(503).json({ error: "Product Admin is unavailable" }); }
      console.warn("[CONFLICT]", { productId, reason: error instanceof Error ? error.message : "Unknown conflict", expectedUpdatedAt: req.body?.expectedUpdatedAt, currentUpdatedAt: current?.updatedAt });
      return res.status(409).json({ error: "Product update conflicts with current state", reason: error instanceof Error ? error.message : "Unknown conflict", });
    }
    return respondProductAdminError(res, error);
  }
}

export default handleAdminProduct;
