import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../lib/prisma";
import { respondCatalogMediaError } from "../../../../src/server/catalogMediaApi";
import { CatalogMediaRequestError, listAdminCategoryMedia } from "../../../../src/server/catalogMediaService";
import { requireProductAdmin } from "../../../../src/server/productAdminApi";
import { applyProductAdminHeaders } from "../../../../src/server/productAdminSecurity";

export async function handleAdminCategoryMediaList(req: NextApiRequest, res: NextApiResponse) {
  applyProductAdminHeaders(res);
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    await requireProductAdmin(prisma, req, res);
    const q = Array.isArray(req.query.q) ? req.query.q[0] : req.query.q;
    if (Object.keys(req.query).some((key) => key !== "q")) throw new CatalogMediaRequestError("Unknown Category query");
    return res.status(200).json(await listAdminCategoryMedia(prisma, q));
  } catch (error) {
    return respondCatalogMediaError(res, error);
  }
}

export default handleAdminCategoryMediaList;
