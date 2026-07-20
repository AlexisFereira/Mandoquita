import type { SubcategoryRepository } from "../subcategory.repository";
import {
  listSubcategoriesSchema,
  type ListSubcategoriesInput,
} from "../schemas/list-subcategories.schema";
import type { Subcategory } from "@prisma/client";

export type ListSubcategoriesResult = {
  items: Subcategory[];
  metadata: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  filters: ListSubcategoriesInput;
};

export async function listSubcategories(
  repo: SubcategoryRepository,
  raw: Record<string, string | string[] | undefined>,
): Promise<ListSubcategoriesResult> {
  // Normalizar query params: si vienen como array, fallar.
  // Next.js query params pueden ser string | string[] | undefined.
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (Array.isArray(value)) {
      throw new Error(`Scalar query required for "${key}"`);
    }
    if (value !== undefined) normalized[key] = value;
  }

  const input = listSubcategoriesSchema.parse(normalized);

  // Calcular skip antes de la query
  const skip = (input.page - 1) * input.limit;

  // Pedimos al repo la página + el total en una sola operación
  const { items, totalItems } = await repo.findManyWithFiltersPaginated({
    categoryId: input.categoryId,
    retired: input.retired,
    q: input.q,
    skip,
    take: input.limit,
  });

  // Calcular paginación final con el total real
  const totalPages = Math.max(1, Math.ceil(totalItems / input.limit));
  const page = Math.min(input.page, totalPages);

  return {
    items,
    metadata: {
      page,
      limit: input.limit,
      totalItems,
      totalPages,
    },
    filters: input,
  };
}
