import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../lib/prisma";
import { getProductDetail } from "../../../src/server/catalogService";
import type { ProductDetailResponse } from "../../../src/types/catalog";

type ErrorBody = { error: string };

type DetailDependencies = {
  prismaClient: typeof prisma;
  getProductDetailFn: typeof getProductDetail;
};

const defaultDependencies: DetailDependencies = {
  prismaClient: prisma,
  getProductDetailFn: getProductDetail,
};

export async function handleProductDetail(
  req: NextApiRequest,
  res: NextApiResponse<ProductDetailResponse | ErrorBody>,
  dependencies: DetailDependencies = defaultDependencies
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawSlug = req.query.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  if (!slug) {
    return res.status(400).json({ error: "Missing slug" });
  }

  const payload = await dependencies.getProductDetailFn(dependencies.prismaClient, slug);
  if (!payload) {
    return res.status(404).json({ error: "Product not found" });
  }

  return res.status(200).json(payload);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProductDetailResponse | ErrorBody>
) {
  return handleProductDetail(req, res);
}
