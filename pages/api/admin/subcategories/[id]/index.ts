import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../../lib/prisma";
import {
  getSubcategory,
  updateSubcategory,
} from "../../../../../src/server/modules/subcategories";
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

export async function handleAdminSubcategoryById(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  applyProductAdminHeaders(res);

  const id = String(req.query.id ?? "");
  if (!id) {
    return res.status(400).json({ error: "Subcategory id is required" });
  }

  if (!req.method || !["GET", "PUT"].includes(req.method)) {
    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await requireProductAdmin(prisma, req, res, { csrf: req.method === "PUT" });
    const repo = createPrismaSubcategoryRepository(prisma);

    if (req.method === "GET") {
      const item = await getSubcategory(repo, id);
      if (!item) return res.status(404).json({ error: "Subcategory not found" });
      return res.status(200).json({ item });
    }

    // PUT: actualizar
    const updated = await updateSubcategory(repo, id, req.body);
    return res.status(200).json({ item: updated });
  } catch (error) {
    if (mapAdminErrorToHttp(res, error)) return;
    return respondProductAdminError(res, error);
  }
}

export default handleAdminSubcategoryById;
