import { randomUUID } from "node:crypto";

import type { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

type Db = PrismaClient | Prisma.TransactionClient;
const slug = z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(160);
const optionalDescription = z.string().trim().min(1).max(2_000).nullable();

export const categoryCreateSchema = z.object({
  slug,
  name: z.string().trim().min(1).max(160),
  description: optionalDescription.optional(),
}).strict();

export const categoryUpdateSchema = z.object({
  expectedUpdatedAt: z.string().datetime({ offset: true }),
  slug: slug.optional(),
  name: z.string().trim().min(1).max(160).optional(),
  description: optionalDescription.optional(),
  sortOrder: z.number().int().min(1).optional(),
  active: z.boolean().optional(),
  visible: z.boolean().optional(),
}).strict().refine((value) => Object.keys(value).some((key) => key !== "expectedUpdatedAt"), {
  message: "At least one update field is required",
});

export const categoryLifecycleSchema = z.object({
  expectedUpdatedAt: z.string().datetime({ offset: true }),
}).strict();

export class CategoryAdminNotFoundError extends Error { }
export class CategoryAdminConflictError extends Error { }
export class CategoryDependenciesError extends Error {
  constructor(public dependencies: { subcategories: number; productTypes: number; products: number }) {
    super("Category has protected dependencies");
  }
}

const categorySelect = {
  id: true, slug: true, name: true, description: true, sortOrder: true,
  active: true, visible: true, retiredAt: true, versionId: true,
  imagePath: true, imageAltText: true, imageContentType: true, imageWidth: true,
  imageHeight: true, imageSize: true, imageChecksum: true,
  createdAt: true, updatedAt: true,
} as const;
type SelectedCategory = Prisma.CategoryGetPayload<{ select: typeof categorySelect }>;

function mapCategory(category: SelectedCategory, dependencies?: Awaited<ReturnType<typeof categoryDependencies>>) {
  return {
    id: category.id, slug: category.slug, name: category.name, description: category.description,
    sortOrder: category.sortOrder, active: category.active, visible: category.visible,
    retiredAt: category.retiredAt?.toISOString() ?? null,
    image: category.imagePath ? {
      previewUrl: category.imagePath, altText: category.imageAltText, contentType: category.imageContentType,
      width: category.imageWidth, height: category.imageHeight, size: category.imageSize,
      checksumSha256: category.imageChecksum,
    } : null,
    dependencies: dependencies ?? undefined,
    createdAt: category.createdAt.toISOString(), updatedAt: category.updatedAt.toISOString(),
  };
}

async function assertCategorySlugAvailable(db: Db, value: string, currentId?: string) {
  const [canonical, alias] = await Promise.all([
    db.category.findFirst({ where: { slug: value, ...(currentId ? { id: { not: currentId } } : {}) }, select: { id: true } }),
    db.categorySlugAlias.findUnique({ where: { slug: value }, select: { slug: true } }),
  ]);
  if (canonical || alias) throw new CategoryAdminConflictError("Category slug is reserved");
}

export async function categoryDependencies(db: Db, categoryId: string) {
  const [subcategories, productTypes, products] = await Promise.all([
    db.subcategory.count({ where: { categoryId, active: true } }),
    db.productType.count({ where: { subcategory: { categoryId }, active: true } }),
    db.product.count({ where: { productType: { subcategory: { categoryId } } } }),
  ]);
  return { subcategories, productTypes, products };
}

export async function listAdminCategories(db: Db, raw: Record<string, string | string[] | undefined>) {
  const query = z.object({
    q: z.string().trim().min(1).max(160).optional(),
    retired: z.enum(["true", "false"]).transform((value) => value === "true").default("false"),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
  }).strict().parse(Object.fromEntries(Object.entries(raw).map(([key, value]) => {
    if (Array.isArray(value)) throw new CategoryAdminConflictError("Scalar query required");
    return [key, value];
  })));
  const where: Prisma.CategoryWhereInput = {
    version: { status: "ACTIVE" },
    ...(query.retired ? { retiredAt: { not: null } } : { retiredAt: null }),
    ...(query.q ? {
      OR: [
        { name: { contains: query.q, mode: "insensitive" } },
        { slug: { contains: query.q, mode: "insensitive" } },
      ]
    } : {}),
  };
  const totalItems = await db.category.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalItems / query.limit));
  const page = Math.min(query.page, totalPages);
  const categories = await db.category.findMany({
    where, skip: (page - 1) * query.limit, take: query.limit,
    select: categorySelect, orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });
  const categoryIds = categories.map(({ id }) => id);
  const branches = categoryIds.length ? await db.subcategory.findMany({
    where: { categoryId: { in: categoryIds } },
    select: { categoryId: true, productTypes: { select: { _count: { select: { products: true } } } } },
  }) : [];
  const counts = new Map(categoryIds.map((id) => [id, { subcategories: 0, productTypes: 0, products: 0 }]));
  for (const branch of branches) {
    const count = counts.get(branch.categoryId)!;
    count.subcategories += 1;
    count.productTypes += branch.productTypes.length;
    count.products += branch.productTypes.reduce((sum, leaf) => sum + leaf._count.products, 0);
  }
  return {
    items: categories.map((category) => mapCategory(category, counts.get(category.id))),
    metadata: { page, limit: query.limit, totalItems, totalPages },
    filters: { q: query.q ?? null, retired: query.retired },
  };
}

export async function getAdminCategory(db: Db, id: string) {
  const category = await db.category.findUnique({ where: { id }, select: categorySelect });
  return category ? mapCategory(category, await categoryDependencies(db, id)) : null;
}

export async function createCategory(db: Db, raw: unknown) {
  const input = categoryCreateSchema.parse(raw);
  await assertCategorySlugAvailable(db, input.slug);
  const versions = await db.taxonomyVersion.findMany({ where: { status: "ACTIVE" }, select: { id: true } });
  if (versions.length !== 1) throw new CategoryAdminConflictError("Exactly one active taxonomy is required");
  const aggregate = await db.category.aggregate({ where: { versionId: versions[0].id }, _max: { sortOrder: true } });
  const category = await db.category.create({
    data: {
      id: randomUUID(), versionId: versions[0].id, slug: input.slug, name: input.name,
      description: input.description ?? null, sortOrder: (aggregate._max.sortOrder ?? 0) + 1,
      active: false, visible: false,
    }, select: categorySelect
  });
  return mapCategory(category, { subcategories: 0, productTypes: 0, products: 0 });
}

async function reorderCategory(db: Db, category: SelectedCategory, target: number) {
  const siblings = await db.category.findMany({
    where: { versionId: category.versionId }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: { id: true },
  });
  if (target > siblings.length) throw new CategoryAdminConflictError("Category order is out of range");
  const ordered = siblings.filter(({ id }) => id !== category.id);
  ordered.splice(target - 1, 0, { id: category.id });
  await db.$executeRaw`UPDATE "Category" SET "sortOrder" = "sortOrder" + 1000000 WHERE "versionId" = ${category.versionId}`;
  for (let index = 0; index < ordered.length; index += 1) {
    await db.category.update({ where: { id: ordered[index].id }, data: { sortOrder: index + 1 } });
  }
}

export async function updateCategory(db: Db, id: string, raw: unknown) {
  const { expectedUpdatedAt, sortOrder, ...input } = categoryUpdateSchema.parse(raw);
  const current = await db.category.findUnique({ where: { id }, select: categorySelect });
  if (!current) throw new CategoryAdminNotFoundError("Category not found");
  if (current.retiredAt) throw new CategoryAdminConflictError("Retired Category must be restored before editing");
  if (current.updatedAt.getTime() !== new Date(expectedUpdatedAt).getTime()) {
    throw new CategoryAdminConflictError("Category changed since it was read");
  }
  if (input.slug && input.slug !== current.slug) await assertCategorySlugAvailable(db, input.slug, id);
  if (sortOrder !== undefined && sortOrder !== current.sortOrder) await reorderCategory(db, current, sortOrder);
  const updated = await db.category.update({ where: { id }, data: input, select: categorySelect });
  if (input.slug && input.slug !== current.slug) {
    await db.categorySlugAlias.create({ data: { slug: current.slug, categoryId: id } });
  }
  return mapCategory(updated, await categoryDependencies(db, id));
}

export async function retireCategory(db: Db, id: string, raw: unknown, actorAccountId: string) {
  const input = categoryLifecycleSchema.parse(raw);
  const current = await db.category.findUnique({ where: { id }, select: categorySelect });

  if (!current) throw new CategoryAdminNotFoundError("Category not found");
  const dependencies = await categoryDependencies(db, id);

  if (Object.values(dependencies).some((count) => count > 0))
    throw new CategoryDependenciesError(dependencies);

  const result = await db.category.updateMany({
    where: { id, retiredAt: null, updatedAt: new Date(input.expectedUpdatedAt) },
    data: { retiredAt: new Date(), retiredByAccountId: actorAccountId, active: false, visible: false },
  });

  if (!result.count)
    throw new CategoryAdminConflictError("Category changed or is already retired");
  return getAdminCategory(db, id);
}

export async function restoreCategory(db: Db, id: string, raw: unknown) {
  const input = categoryLifecycleSchema.parse(raw);
  const result = await db.category.updateMany({
    where: { id, retiredAt: { not: null }, updatedAt: new Date(input.expectedUpdatedAt) },
    data: { retiredAt: null, retiredByAccountId: null, active: false, visible: false },
  });
  if (!result.count) {
    const exists = await db.category.findUnique({ where: { id }, select: { id: true } });
    if (!exists) throw new CategoryAdminNotFoundError("Category not found");
    throw new CategoryAdminConflictError("Category changed or is not retired");
  }
  return getAdminCategory(db, id);
}
