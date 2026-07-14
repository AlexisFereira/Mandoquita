import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../lib/prisma";
import { getProductDetail, resolveProductSlug } from "../../../src/server/catalogService";
import type { ProductDetailResponse } from "../../../src/types/catalog";

type ErrorBody = { error: string };

type DetailDependencies = {
  prismaClient: typeof prisma;
  getProductDetailFn: typeof getProductDetail;
  resolveProductSlugFn?: typeof resolveProductSlug;
};

const defaultDependencies: DetailDependencies = {
  prismaClient: prisma,
  getProductDetailFn: getProductDetail,
  resolveProductSlugFn: resolveProductSlug,
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

  const resolved = dependencies.resolveProductSlugFn
    ? await dependencies.resolveProductSlugFn(dependencies.prismaClient, slug)
    : { slug, redirected: false };
  const payload = resolved ? await dependencies.getProductDetailFn(dependencies.prismaClient, resolved.slug) : null;
  if (!payload) {
    return res.status(404).json({ error: "Product not found" });
  }
  if (resolved?.redirected) {
    res.setHeader("Location", `/api/products/${encodeURIComponent(resolved.slug)}`);
    return res.status(308).end();
  }

  return res.status(200).json(payload);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProductDetailResponse | ErrorBody>
) {
  return handleProductDetail(req, res);
}
