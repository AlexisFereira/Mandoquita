import type { SubcategoryRepository } from "../subcategory.repository";
import type { ListSubcategoriesInput } from "../schemas/list-subcategories.schema";
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
  // Normalizar arrays a string (query params pueden venir como array)
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (Array.isArray(value)) {
      throw new Error(`Scalar query required for "${key}"`);
    }
    if (value !== undefined) normalized[key] = value;
  }

  const input = listSubcategoriesSchema.parse(normalized);

  // Listar todas las subcategorías que coincidan con los filtros base
  const all = await repo.findManyWithFilters({
    categoryId: input.categoryId,
    retired: input.retired,
    q: input.q,
  });

  const totalItems = all.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / input.limit));
  const page = Math.min(input.page, totalPages);
  const skip = (page - 1) * input.limit;
  const items = all.slice(skip, skip + input.limit);

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
