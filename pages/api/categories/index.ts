import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../lib/prisma";
import { listDiscoverableTaxonomy } from "../../../src/server/taxonomyService";
import type { TaxonomyCategory } from "../../../src/types/catalog";

type ErrorBody = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TaxonomyCategory[] | ErrorBody>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    return res.status(200).json(await listDiscoverableTaxonomy(prisma));
  } catch {
    return res.status(500).json({ error: "Unexpected server error" });
  }
}
