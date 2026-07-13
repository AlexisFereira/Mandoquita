import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";

import { prisma } from "../../../lib/prisma";
import { listProducts } from "../../../src/server/catalogService";
import type { ProductListResponse } from "../../../src/types/catalog";

type ErrorBody = { error: string };

type ListDependencies = {
  prismaClient: typeof prisma;
  listProductsFn: typeof listProducts;
};

const defaultDependencies: ListDependencies = {
  prismaClient: prisma,
  listProductsFn: listProducts,
};

export async function handleProductsList(
  req: NextApiRequest,
  res: NextApiResponse<ProductListResponse | ErrorBody>,
  dependencies: ListDependencies = defaultDependencies
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = await dependencies.listProductsFn(dependencies.prismaClient, req.query);
    return res.status(200).json(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: "Invalid query parameters" });
    }

    return res.status(500).json({ error: "Unexpected server error" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProductListResponse | ErrorBody>
) {
  return handleProductsList(req, res);
}
