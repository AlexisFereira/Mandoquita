import type { SubcategoryRepository } from "../subcategory.repository";
import { createSubcategorySchema, type CreateSubcategoryInput } from "../schemas/create-subcategory.schema";
import {
  SubcategoryAdminConflictError,
  SubcategoryNotFoundError,
} from "../subcategory.errors";

export async function createSubcategory(
  repo: SubcategoryRepository,
  raw: unknown,
): Promise<import("@prisma/client").Subcategory> {
  const input: CreateSubcategoryInput = createSubcategorySchema.parse(raw);

  // Validar que la categoría destino existe
  const category = await repo.findCategoryById(input.categoryId);
  if (!category) {
    throw new SubcategoryNotFoundError(input.categoryId);
  }

  // Validar que el slug no esté en uso
  const existing = await repo.findBySlug(input.slug);
  if (existing) {
    throw new SubcategoryAdminConflictError(
      `Subcategory with slug "${input.slug}" already exists`,
    );
  }

  // Calcular sourceOrder si no se proveyó
  const sourceOrder =
    input.sourceOrder ?? (await repo.maxSourceOrder(input.categoryId)) + 1;

  return repo.create({
    slug: input.slug,
    name: input.name,
    categoryId: input.categoryId,
    sourceOrder,
    active: input.active ?? true,
  });
}
