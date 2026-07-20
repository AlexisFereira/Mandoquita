import type { SubcategoryRepository } from "../subcategory.repository";
import { SubcategoryNotFoundError } from "../subcategory.errors";

export async function getSubcategory(
  repo: SubcategoryRepository,
  id: string,
): Promise<import("@prisma/client").Subcategory | null> {
  const found = await repo.findById(id);
  if (!found) {
    throw new SubcategoryNotFoundError(id);
  }
  return found;
}
