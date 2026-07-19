import type { Category } from "@prisma/client";
import type {
  CategoryRepository,
  Db,
} from "./category.repository";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.repository.types";

const categorySelect = {
  id: true,
  slug: true,
  name: true,
  description: true,
  sortOrder: true,
  active: true,
  visible: true,
  retiredAt: true,
  retiredByAccountId: true,
  versionId: true,
  imagePath: true,
  imageAltText: true,
  imageObjectKey: true,
  imageContentType: true,
  imageWidth: true,
  imageHeight: true,
  imageSize: true,
  imageChecksum: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function createPrismaCategoryRepository(db: Db): CategoryRepository {
  return {
    async findById(id) {
      const found = await db.category.findUnique({
        where: { id },
        select: categorySelect,
      });
      return found as Category | null;
    },

    async findBySlug(slug) {
      const found = await db.category.findUnique({
        where: { slug },
        select: categorySelect,
      });
      return found as Category | null;
    },

    async findByVersion(versionId) {
      const list = await db.category.findMany({
        where: { versionId },
        select: categorySelect,
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      });
      return list as Category[];
    },

    async countByVersion(versionId) {
      return db.category.count({ where: { versionId } });
    },

    async maxSortOrder(versionId) {
      const agg = await db.category.aggregate({
        where: { versionId },
        _max: { sortOrder: true },
      });
      return agg._max.sortOrder ?? 0;
    },

    async create(input: CreateCategoryInput) {
      const created = await db.category.create({
        data: {
          id: crypto.randomUUID(),
          slug: input.slug,
          name: input.name,
          description: input.description ?? null,
          versionId: input.versionId,
          sortOrder: input.sortOrder ?? 0,
          active: input.active ?? false,
          visible: input.visible ?? false,
        },
        select: categorySelect,
      });
      return created as Category;
    },

    async update(id, input: UpdateCategoryInput) {
      const updated = await db.category.update({
        where: { id },
        data: input,
        select: categorySelect,
      });
      return updated as Category;
    },

    async retire(id, actorAccountId, expectedUpdatedAt) {
      const result = await db.category.updateMany({
        where: {
          id,
          retiredAt: null,
          updatedAt: expectedUpdatedAt,
        },
        data: {
          retiredAt: new Date(),
          retiredByAccountId: actorAccountId,
          active: false,
          visible: false,
        },
      });
      if (!result.count) return null;
      const updated = await db.category.findUnique({
        where: { id },
        select: categorySelect,
      });
      return updated as Category;
    },

    async restore(id, expectedUpdatedAt) {
      const result = await db.category.updateMany({
        where: {
          id,
          retiredAt: { not: null },
          updatedAt: expectedUpdatedAt,
        },
        data: {
          retiredAt: null,
          retiredByAccountId: null,
          active: false,
          visible: false,
        },
      });
      if (!result.count) return null;
      const updated = await db.category.findUnique({
        where: { id },
        select: categorySelect,
      });
      return updated as Category;
    },

    async countDependencies(categoryId) {
      const [subcategories, productTypes, products] = await Promise.all([
        db.subcategory.count({ where: { categoryId } }),
        db.productType.count({
          where: { subcategory: { categoryId } },
        }),
        db.product.count({
          where: { productType: { subcategory: { categoryId } } },
        }),
      ]);
      return { subcategories, productTypes, products };
    },

    async findManyWithFilters({ versionId, retired, q, skip, take }) {
      const where = {
        versionId,
        ...(retired ? { retiredAt: { not: null } } : { retiredAt: null }),
        ...(q
          ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { slug: { contains: q, mode: "insensitive" as const } },
            ],
          }
          : {}),
      };
      const list = await db.category.findMany({
        where,
        skip,
        take,
        select: categorySelect,
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      });
      return list as Category[];
    },
  };
}
