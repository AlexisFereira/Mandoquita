import type { SubcategoryRepository } from "../subcategory.repository";
import { z } from "zod";
import {
  SubcategoryAdminConflictError,
  SubcategoryNotFoundError,
} from "../subcategory.errors";

const restoreSchema = z
  .object({
    expectedUpdatedAt: z.string().datetime({ offset: true }),
  })
  .strict();

export async function restoreSubcategory(
  repo: SubcategoryRepository,
  id: string,
  raw: unknown,
): Promise<import("@prisma/client").Subcategory> {
  const input = restoreSchema.parse(raw);

  const current = await repo.findById(id);
  if (!current) {
    throw new SubcategoryNotFoundError(id);
  }

  if (!current.retiredAt) {
    throw new SubcategoryAdminConflictError(
      "Subcategory is not retired",
    );
  }

  if (
    current.updatedAt.getTime() !== new Date(input.expectedUpdatedAt).getTime()
  ) {
    throw new SubcategoryAdminConflictError(
      "Subcategory changed since it was read",
    );
  }

  const restored = await repo.restore(id);
  if (!restored) {
    throw new SubcategoryAdminConflictError(
      "Subcategory could not be restored",
    );
  }
  return restored;
}
