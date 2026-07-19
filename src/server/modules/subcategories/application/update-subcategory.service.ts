import type { SubcategoryRepository } from "../subcategory.repository";
import { updateSubcategorySchema } from "../schemas/update-subcategory.schema";
import {
  SubcategoryAdminConflictError,
  SubcategoryNotFoundError,
} from "../subcategory.errors";

export async function updateSubcategory(
  repo: SubcategoryRepository,
  id: string,
  raw: unknown,
): Promise<import("@prisma/client").Subcategory> {
  const input = updateSubcategorySchema.parse(raw);

  const current = await repo.findById(id);
  if (!current) {
    throw new SubcategoryNotFoundError(id);
  }

  if (current.retiredAt) {
    throw new SubcategoryAdminConflictError(
      "Subcategory must be restored before editing",
    );
  }

  if (
    current.updatedAt.getTime() !== new Date(input.expectedUpdatedAt).getTime()
  ) {
    throw new SubcategoryAdminConflictError(
      "Subcategory changed since it was read",
    );
  }

  // Validar nuevo slug si cambió
  if (input.slug && input.slug !== current.slug) {
    const existing = await repo.findBySlug(input.slug);
    if (existing && existing.id !== id) {
      throw new SubcategoryAdminConflictError(
        `Subcategory with slug "${input.slug}" already exists`,
      );
    }
  }

  const { expectedUpdatedAt, ...changes } = input;
  return repo.update(id, changes);
}
