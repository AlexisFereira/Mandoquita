import type { ProductTypeRepository } from "../productType.repository";
import { createProductTypeSchema } from "../schemas/create-product-type.schema";
import {
  ProductTypeAdminConflictError,
  ProductTypeNotFoundError,
} from "../productType.errors";

export async function createProductType(
  repo: ProductTypeRepository,
  subcategoryRepo: { findById: (id: string) => Promise<unknown> },
  raw: unknown,
): Promise<import("@prisma/client").ProductType> {
  const input = createProductTypeSchema.parse(raw);

  // Validar que la subcategoría existe
  const subcategory = await subcategoryRepo.findById(input.subcategoryId);
  if (!subcategory) {
    throw new ProductTypeNotFoundError(input.subcategoryId);
  }

  // Validar que el name no exista (es PK)
  const existing = await repo.findByName(input.name);
  if (existing) {
    throw new ProductTypeAdminConflictError(
      `ProductType with name "${input.name}" already exists`,
    );
  }

  // Calcular sourceOrder
  const sourceOrder =
    (await repo.maxSourceOrder(input.subcategoryId)) + 1;

  return repo.create({
    name: input.name,
    subcategoryId: input.subcategoryId,
    sourceOrder,
    active: input.active ?? true,
  });
}
