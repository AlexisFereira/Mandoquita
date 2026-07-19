import { randomUUID } from "node:crypto";
import type { Subcategory } from "@prisma/client";
import type {
  Db,
  SubcategoryRepository,
} from "./subcategory.repository";
import type { Prisma } from "@prisma/client";
import type {
  CreateSubcategoryInput,
  UpdateSubcategoryInput,
} from "./subcategory.types";

const subcategorySelect = {
  id: true,
  slug: true,
  name: true,
  sourceOrder: true,
  active: true,
  categoryId: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function createPrismaSubcategoryRepository(
  db: Db,
): SubcategoryRepository {
  return {
    async findById(id) {
      const found = await db.subcategory.findUnique({
        where: { id },
        select: subcategorySelect,
      });
      return found as Subcategory | null;
    },

    async findBySlug(slug) {
      const found = await db.subcategory.findUnique({
        where: { slug },
        select: subcategorySelect,
      });
      return found as Subcategory | null;
    },

    async findByCategory(categoryId) {
      const list = await db.subcategory.findMany({
        where: { categoryId },
        select: subcategorySelect,
        orderBy: [{ sourceOrder: "asc" }, { id: "asc" }],
      });
      return list as Subcategory[];
    },

    async countByCategory(categoryId) {
      return db.subcategory.count({ where: { categoryId } });
    },

    async maxSourceOrder(categoryId) {
      const agg = await db.subcategory.aggregate({
        where: { categoryId },
        _max: { sourceOrder: true },
      });
      return agg._max.sourceOrder ?? 0;
    },

    async create(input: CreateSubcategoryInput) {
      const created = await db.subcategory.create({
        data: {
          id: randomUUID(),
          slug: input.slug,
          name: input.name,
          categoryId: input.categoryId,
          sourceOrder: input.sourceOrder ?? 0,
          active: input.active ?? true,
        },
        select: subcategorySelect,
      });
      return created as Subcategory;
    },

    async update(id, input: UpdateSubcategoryInput) {
      const updated = await db.subcategory.update({
        where: { id },
        data: input,
        select: subcategorySelect,
      });
      return updated as Subcategory;
    },

    async retire(id, actorAccountId) {
      const now = new Date();
      const result = await db.subcategory.updateMany({
        where: { id },
        data: {
          active: false,
          updatedAt: now,
        },
      });
      if (!result.count) return null;
      const updated = await db.subcategory.findUnique({
        where: { id },
        select: subcategorySelect,
      });
      return updated as Subcategory;
    },

    async restore(id) {
      const result = await db.subcategory.updateMany({
        where: { id },
        data: { active: true },
      });
      if (!result.count) return null;
      const updated = await db.subcategory.findUnique({
        where: { id },
        select: subcategorySelect,
      });
      return updated as Subcategory;
    },

    async countProductTypes(subcategoryId) {
      return db.productType.count({ where: { subcategoryId } });
    },

    async countProductsBySubcategory(subcategoryId) {
      return db.product.count({ where: { productType: { subcategoryId } } });
    },

    async findManyWithFilters({ categoryId, retired, q }) { const where: Prisma.SubcategoryWhereInput = { ...(categoryId ? { categoryId } : {}), ...(retired ? { retiredAt: { not: null } } : { retiredAt: null }), ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" as const } }, { slug: { contains: q, mode: "insensitive" as const } },], } : {}), }; const list = await db.subcategory.findMany({ where, select: subcategorySelect, orderBy: [{ sourceOrder: "asc" }, { id: "asc" }], }); return list as Subcategory[]; },
  };
}
