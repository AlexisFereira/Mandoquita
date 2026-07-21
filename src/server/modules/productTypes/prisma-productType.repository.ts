import type { ProductType } from "@prisma/client";
import type { PrismaClient, Prisma } from "@prisma/client";
import type {
  Db,
  ProductTypeRepository,
} from "./productType.repository";
import type {
  CreateProductTypeInput,
  UpdateProductTypeInput,
} from "./productType.types";

const productTypeSelect = {
  name: true,
  subcategoryId: true,
  sourceOrder: true,
  active: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function createPrismaProductTypeRepository(
  db: Db,
): ProductTypeRepository {
  return {
    async findByName(name) {
      const found = await db.productType.findUnique({
        where: { name },
        select: productTypeSelect,
      });
      return found as ProductType | null;
    },

    async findBySubcategory(subcategoryId) {
      const list = await db.productType.findMany({
        where: { subcategoryId },
        select: productTypeSelect,
        orderBy: [{ sourceOrder: "asc" }, { name: "asc" }],
      });
      return list as ProductType[];
    },

    async countBySubcategory(subcategoryId) {
      return db.productType.count({ where: { subcategoryId } });
    },

    async maxSourceOrder(subcategoryId) {
      const agg = await db.productType.aggregate({
        where: { subcategoryId },
        _max: { sourceOrder: true },
      });
      return agg._max.sourceOrder ?? 0;
    },

    async create(input: CreateProductTypeInput) {
      const created = await db.productType.create({
        data: {
          name: input.name,
          subcategoryId: input.subcategoryId,
          sourceOrder: input.sourceOrder ?? 0,
          active: input.active ?? true,
        },
        select: productTypeSelect,
      });
      return created as ProductType;
    },

    async update(name, input: UpdateProductTypeInput) {
      const updated = await db.productType.update({
        where: { name },
        data: input,
        select: productTypeSelect,
      });
      return updated as ProductType;
    },

    async setActive(name, active) {
      const result = await db.productType.updateMany({
        where: { name },
        data: { active },
      });
      if (!result.count) return null;
      const updated = await db.productType.findUnique({
        where: { name },
        select: productTypeSelect,
      });
      return updated as ProductType;
    },

    async countProducts(name) {
      return db.product.count({ where: { productType: { name, active: true } } });
    },

    async findManyWithFilters({ subcategoryId, retired, q }) {
      const where: Prisma.ProductTypeWhereInput = {
        ...(subcategoryId ? { subcategoryId } : {}),
        ...(retired ? { retiredAt: { not: null } } : { retiredAt: null }),
        ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
      };
      const list = await db.productType.findMany({
        where,
        select: productTypeSelect,
        orderBy: [{ sourceOrder: "asc" }, { name: "asc" }],
      });
      return list as ProductType[];
    },

    async updateWithRetiredAt(name, retiredAt, retiredByAccountId) {
      const result = await db.productType.updateMany({
        where: { name },
        data: { retiredAt, retiredByAccountId, active: false },
      });
      if (!result.count) return null;
      const updated = await db.productType.findUnique({
        where: { name },
        select: productTypeSelect,
      });
      return updated as ProductType;
    },

  };
}



