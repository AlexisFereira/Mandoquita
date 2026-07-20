import type { ProductTypeRepository } from "../productType.repository";
import { ProductTypeNotFoundError } from "../productType.errors";

export async function getProductType(
  repo: ProductTypeRepository,
  name: string,
): Promise<import("@prisma/client").ProductType | null> {
  const found = await repo.findByName(name);
  if (!found) {
    throw new ProductTypeNotFoundError(name);
  }
  return found;
}

