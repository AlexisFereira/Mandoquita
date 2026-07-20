import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../lib/prisma";
import { requireProductAdmin, respondProductAdminError } from "../../../src/server/productAdminApi";
import { listAdminProductTypes } from "../../../src/server/productAdminCatalogService";
import { applyProductAdminHeaders } from "../../../src/server/productAdminSecurity";

export async function handleAdminProductTypes(req: NextApiRequest, res: NextApiResponse) {
  applyProductAdminHeaders(res);
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    await requireProductAdmin(prisma, req, res);
    return res.status(200).json(await listAdminProductTypes(prisma));
  } catch (error) {
    return respondProductAdminError(res, error);
  }
}

export default handleAdminProductTypes;
