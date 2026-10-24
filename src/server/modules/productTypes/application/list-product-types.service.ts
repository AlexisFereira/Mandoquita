import type { ProductTypeRepository } from "../productType.repository";
import { listProductTypesSchema } from "../schemas/list-product-types.schema";
import type { ProductType } from "@prisma/client";

export type ListProductTypesResult = {
  items: ProductType[];
  metadata: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

export async function listProductTypes(
  repo: ProductTypeRepository,
  raw: Record<string, string | string[] | undefined>,
): Promise<ListProductTypesResult> {

  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (Array.isArray(value)) {
      throw new Error(`Scalar query required for "${key}"`);
    }
    if (value !== undefined) normalized[key] = value;
  }

  const input = listProductTypesSchema.parse(normalized);

  const all = await repo.findManyWithFilters({
    subcategoryId: input.subcategoryId,
    retired: input.retired,
    q: input.q,
  });

  const totalItems = all.length;

  console.log({ totalItems })
  console.log(input.limit)

  // Sin limit: devolvemos todo sin paginar
  if (input.limit === undefined) {
    return {
      items: all,
      metadata: { page: 1, limit: totalItems, totalItems, totalPages: 1 },
    };
  }


  const totalPages = Math.max(1, Math.ceil(totalItems / input.limit));
  const page = Math.min(input.page, totalPages);
  const skip = (page - 1) * input.limit;
  const items = all.slice(skip, skip + input.limit);

  return {
    items,
    metadata: { page, limit: input.limit, totalItems, totalPages },
  };
}
