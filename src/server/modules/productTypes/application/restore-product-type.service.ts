import type { ProductTypeRepository } from "../productType.repository";
import { z } from "zod";
import {
  ProductTypeAdminConflictError,
  ProductTypeNotFoundError,
} from "../productType.errors";

const restoreSchema = z
  .object({
    expectedUpdatedAt: z.string().datetime({ offset: true }),
  })
  .strict();

export async function restoreProductType(
  repo: ProductTypeRepository,
  name: string,
  raw: unknown,
): Promise<import("@prisma/client").ProductType | null> {
  const input = restoreSchema.parse(raw);

  const current = await repo.findByName(name);
  if (!current) {
    throw new ProductTypeNotFoundError(name);
  }

  if (!current.retiredAt) {
    throw new ProductTypeAdminConflictError(
      "ProductType is not retired",
    );
  }

  if (
    current.updatedAt.getTime() !== new Date(input.expectedUpdatedAt).getTime()
  ) {
    throw new ProductTypeAdminConflictError(
      "ProductType changed since it was read",
    );
  }

  return repo.updateWithRetiredAt(name, null, null);
}
