import type { ProductTypeRepository } from "../productType.repository";
import { updateProductTypeSchema } from "../schemas/update-product-type.schema";
import {
  ProductTypeAdminConflictError,
  ProductTypeNotFoundError,
} from "../productType.errors";

export async function updateProductType(
  repo: ProductTypeRepository,
  name: string,
  raw: unknown,
): Promise<import("@prisma/client").ProductType> {
  const input = updateProductTypeSchema.parse(raw);

  const current = await repo.findByName(name);
  if (!current) {
    throw new ProductTypeNotFoundError(name);
  }

  if (current.retiredAt) {
    throw new ProductTypeAdminConflictError(
      "ProductType must be restored before editing",
    );
  }

  if (
    current.updatedAt.getTime() !== new Date(input.expectedUpdatedAt).getTime()
  ) {
    throw new ProductTypeAdminConflictError(
      "ProductType changed since it was read",
    );
  }

  const { expectedUpdatedAt, ...changes } = input;
  return repo.update(name, changes);
}
