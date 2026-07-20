import type { SubcategoryRepository } from "../subcategory.repository";
import { createSubcategorySchema } from "../schemas/create-subcategory.schema";
import {
  SubcategoryAdminConflictError,
  SubcategoryNotFoundError,
} from "../subcategory.errors";

/**
 * Servicio para crear subcategorías. Necesita el repositorio de categorías
 * para validar que la categoría destino exista.
 */
export async function createSubcategory(
  repo: SubcategoryRepository,
  raw: unknown,
  categoryLookup: {
    findById: (id: string) => Promise<unknown>;
  },
): Promise<import("@prisma/client").Subcategory> {
  const input = createSubcategorySchema.parse(raw);

  const category = await categoryLookup.findById(input.categoryId);
  if (!category) {
    throw new SubcategoryNotFoundError(`Category ${input.categoryId}`);
  }

  const existing = await repo.findBySlug(input.slug);
  if (existing) {
    throw new SubcategoryAdminConflictError(
      `Subcategory with slug "${input.slug}" already exists`,
    );
  }

  const sourceOrder = (await repo.maxSourceOrder(input.categoryId)) + 1;

  return repo.create({
    slug: input.slug,
    name: input.name,
    categoryId: input.categoryId,
    sourceOrder,
    active: input.active ?? true,
  });
}
