import type { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

const optionalScalar = z.union([z.string(), z.undefined()]);
const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  q: z.string().trim().min(1).max(160).optional(),
  published: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
  commerciallyAvailable: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
  featured: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
  active: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
  category: z.string().trim().min(1).max(160).optional(),
  productType: z.string().trim().min(1).max(200).optional(),
}).strict();

type RawAdminListQuery = Record<string, string | string[] | undefined>;

const taxonomyInclude = {
  productType: {
    include: {
      subcategory: { include: { category: true } },
    },
  },
} as const;

const adminDetailInclude = {
  ...taxonomyInclude,
  _count: { select: { variants: true } },
} as const;

type AdminProduct = Prisma.ProductGetPayload<{ include: typeof adminDetailInclude }>;

const adminListSelect = {
  id: true,
  slug: true,
  name: true,
  price: true,
  currency: true,
  active: true,
  editorialApproved: true,
  published: true,
  commerciallyAvailable: true,
  featured: true,
  featuredOrder: true,
  updatedAt: true,
  productType: {
    select: {
      name: true,
      subcategory: {
        select: {
          id: true,
          slug: true,
          name: true,
          category: { select: { id: true, slug: true, name: true } },
        },
      },
    },
  },
} as const;

type AdminListProduct = Prisma.ProductGetPayload<{ select: typeof adminListSelect }>;

function taxonomy(product: AdminProduct | AdminListProduct) {
  if (!product.productType) return { productType: null, subcategory: null, category: null };
  return {
    productType: { name: product.productType.name },
    subcategory: {
      id: product.productType.subcategory.id,
      slug: product.productType.subcategory.slug,
      name: product.productType.subcategory.name,
    },
    category: {
      id: product.productType.subcategory.category.id,
      slug: product.productType.subcategory.category.slug,
      name: product.productType.subcategory.category.name,
    },
  };
}

function scalarQuery(raw: RawAdminListQuery) {
  const result: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (Array.isArray(value)) throw new z.ZodError([{ code: z.ZodIssueCode.custom, path: [key], message: "Scalar required" }]);
    result[key] = optionalScalar.parse(value);
  }
  return result;
}

export function parseAdminProductListQuery(raw: RawAdminListQuery) {
  return querySchema.parse(scalarQuery(raw));
}

export async function listAdminProducts(prisma: PrismaClient, raw: RawAdminListQuery) {
  const query = parseAdminProductListQuery(raw);
  const where: Prisma.ProductWhereInput = {
    ...(query.q ? { OR: [
      { name: { contains: query.q, mode: "insensitive" } },
      { slug: { contains: query.q, mode: "insensitive" } },
    ] } : {}),
    ...(query.published !== undefined ? { published: query.published } : {}),
    ...(query.commerciallyAvailable !== undefined ? { commerciallyAvailable: query.commerciallyAvailable } : {}),
    ...(query.featured !== undefined ? { featured: query.featured } : {}),
    ...(query.active !== undefined ? { active: query.active } : {}),
    ...(query.productType ? { productTypeId: query.productType } : {}),
    ...(query.category ? { productType: { is: { subcategory: { category: { slug: query.category } } } } } : {}),
  };
  const [requestedItems, totalItems] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      select: adminListSelect,
      orderBy: [{ name: "asc" }, { id: "asc" }],
    }),
    prisma.product.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalItems / query.limit));
  const page = Math.min(query.page, totalPages);
  const items = page === query.page ? requestedItems : await prisma.product.findMany({
    where,
    skip: (page - 1) * query.limit,
    take: query.limit,
    select: adminListSelect,
    orderBy: [{ name: "asc" }, { id: "asc" }],
  });
  return {
    items: items.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price.toString(),
      currency: product.currency,
      active: product.active,
      editorialApproved: product.editorialApproved,
      published: product.published,
      commerciallyAvailable: product.commerciallyAvailable,
      featured: product.featured,
      featuredOrder: product.featuredOrder,
      ...taxonomy(product),
      updatedAt: product.updatedAt.toISOString(),
    })),
    metadata: { page, limit: query.limit, totalItems, totalPages },
    filters: {
      q: query.q ?? null,
      published: query.published ?? null,
      commerciallyAvailable: query.commerciallyAvailable ?? null,
      featured: query.featured ?? null,
      active: query.active ?? null,
      category: query.category ?? null,
      productType: query.productType ?? null,
    },
  };
}

export async function getAdminProductById(prisma: PrismaClient, id: number) {
  const product = await prisma.product.findUnique({ where: { id }, include: adminDetailInclude });
  if (!product) return null;
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    shortDescription: product.shortDescription,
    brand: product.brand,
    collection: product.collection,
    genderApplicability: product.genderApplicability?.toLowerCase() ?? null,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    price: product.price.toString(),
    currency: product.currency,
    active: product.active,
    editorialApproved: product.editorialApproved,
    published: product.published,
    commerciallyAvailable: product.commerciallyAvailable,
    featured: product.featured,
    featuredOrder: product.featuredOrder,
    ...taxonomy(product),
    hasVariant: product._count.variants > 0,
    updatedAt: product.updatedAt.toISOString(),
  };
}

export async function listAdminProductTypes(prisma: PrismaClient) {
  const items = await prisma.productType.findMany({
    where: {
      active: true,
      subcategory: { active: true, category: { active: true, visible: true, version: { status: "ACTIVE" } } },
    },
    include: { subcategory: { include: { category: true } } },
    orderBy: [
      { subcategory: { category: { sortOrder: "asc" } } },
      { subcategory: { sourceOrder: "asc" } },
      { sourceOrder: "asc" },
      { name: "asc" },
    ],
  });
  return { items: items.map((item) => ({
    name: item.name,
    subcategory: { id: item.subcategory.id, slug: item.subcategory.slug, name: item.subcategory.name },
    category: { id: item.subcategory.category.id, slug: item.subcategory.category.slug, name: item.subcategory.category.name },
  })) };
}
