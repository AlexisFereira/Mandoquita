import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../../lib/prisma";
import {
  getProductType,
  updateProductType,
} from "../../../../../src/server/modules/productTypes";
import {
  createPrismaProductTypeRepository,
} from "../../../../../src/server/modules/productTypes/prisma-productType.repository";
import {
  requireProductAdmin,
  respondProductAdminError,
} from "../../../../../src/server/productAdminApi";
import {
  applyProductAdminHeaders,
} from "../../../../../src/server/productAdminSecurity";
import { mapAdminErrorToHttp } from "../../../../../src/server/modules/shared/admin-error-mapper";

export async function handleAdminProductTypeByName(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  applyProductAdminHeaders(res);

  const name = String(req.query.name ?? "");
  if (!name) {
    return res.status(400).json({ error: "ProductType name is required" });
  }

  if (!req.method || !["GET", "PUT"].includes(req.method)) {
    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await requireProductAdmin(prisma, req, res, { csrf: req.method === "PUT" });
    const repo = createPrismaProductTypeRepository(prisma);

    if (req.method === "GET") {
      const item = await getProductType(repo, name);
      if (!item) return res.status(404).json({ error: "ProductType not found" });
      return res.status(200).json({ item });
    }

    const updated = await updateProductType(repo, name, req.body);
    return res.status(200).json({ item: updated });
  } catch (error) {
    if (mapAdminErrorToHttp(res, error)) return;
    return respondProductAdminError(res, error);
  }
}

export default handleAdminProductTypeByName;
