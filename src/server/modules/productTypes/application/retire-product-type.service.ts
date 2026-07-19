import type { ProductTypeRepository } from "../productType.repository";
import { z } from "zod";
import {
  ProductTypeAdminConflictError,
  ProductTypeDependenciesError,
  ProductTypeNotFoundError,
} from "../productType.errors";

const retireSchema = z
  .object({
    expectedUpdatedAt: z.string().datetime({ offset: true }),
  })
  .strict();

export async function retireProductType(
  repo: ProductTypeRepository,
  name: string,
  raw: unknown,
  actorAccountId: string,
): Promise<import("@prisma/client").ProductType> {
  const input = retireSchema.parse(raw);

  const current = await repo.findByName(name);
  if (!current) {
    throw new ProductTypeNotFoundError(name);
  }

  const productCount = await repo.countProducts(name);
  if (productCount > 0) {
    throw new ProductTypeDependenciesError(productCount);
  }

  if (
    current.updatedAt.getTime() !== new Date(input.expectedUpdatedAt).getTime()
  ) {
    throw new ProductTypeAdminConflictError(
      "ProductType changed since it was read",
    );
  }

  const retired = await repo.setActive(name, false);
  // Actualizar retiredAt + retiredByAccountId
  if (!retired) {
    throw new ProductTypeAdminConflictError(
      "ProductType could not be retired",
    );
  }

  return repo.updateWithRetiredAt(name, new Date(), actorAccountId);
}
