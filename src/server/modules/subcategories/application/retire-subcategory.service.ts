import type { SubcategoryRepository } from "../subcategory.repository";
import { z } from "zod";
import {
  SubcategoryAdminConflictError,
  SubcategoryDependenciesError,
  SubcategoryNotFoundError,
} from "../subcategory.errors";

const retireSchema = z
  .object({
    expectedUpdatedAt: z.string().datetime({ offset: true }),
  })
  .strict();

export async function retireSubcategory(
  repo: SubcategoryRepository,
  id: string,
  raw: unknown,
  actorAccountId: string,
): Promise<import("@prisma/client").Subcategory> {
  const input = retireSchema.parse(raw);

  const current = await repo.findById(id);
  if (!current) {
    throw new SubcategoryNotFoundError(id);
  }


  const productTypesCount = await repo.countProductTypes(id);
  const productsCount = await repo.countProductsBySubcategory(id);

  if (productTypesCount > 0 || productsCount > 0) {
    throw new SubcategoryDependenciesError({
      productTypes: productTypesCount,
      products: productsCount,
    });
  }

  if (
    current.updatedAt.getTime() !== new Date(input.expectedUpdatedAt).getTime()
  ) {
    throw new SubcategoryAdminConflictError(
      "Subcategory changed since it was read",
    );
  }

  const retired = await repo.retire(id, actorAccountId);
  if (!retired) {
    throw new SubcategoryAdminConflictError(
      "Subcategory could not be retired",
    );
  }
  return retired;
}
