import type { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

import type { ProductDetailResponse, ProductItem, ProductListResponse } from "@/types/catalog";

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  category: z.string().trim().min(1).max(64).optional(),
  subcategory: z.string().trim().min(1).max(64).optional(),
  q: z.string().trim().min(1).max(120).optional(),
});

type ListQueryInput = {
  page?: string | string[];
  limit?: string | string[];
  category?: string | string[];
  subcategory?: string | string[];
  q?: string | string[];
};

const classificationInclude = {
  productType: {
    include: {
      subcategory: {
        include: {
          category: {
            include: {
              subcategories: {
                where: { active: true },
                include: {
                  productTypes: { where: { active: true }, select: { name: true } },
                },
              },
            },
          },
        },
      },
    },
  },
} as const;

type ClassifiedProduct = Prisma.ProductGetPayload<{
  include: typeof classificationInclude;
}>;

function toSingleValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function publicClassificationWhere(category?: string, subcategory?: string) {
  return {
    is: {
      active: true,
      subcategory: {
        active: true,
        ...(subcategory ? { slug: subcategory } : {}),
        category: {
          active: true,
          visible: true,
          ...(category ? { slug: category } : {}),
          version: { status: "ACTIVE" as const },
        },
      },
    },
  };
}

function mapProduct(product: ClassifiedProduct): ProductItem {
  if (!product.productType) {
    throw new Error("Published product is missing its approved Product Type");
  }

  const { subcategory } = product.productType;
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.commerciallyAvailable ? product.price.toString() : null,
    currency: product.commerciallyAvailable ? product.currency : null,
    imageUrl: product.imageUrl,
    active: product.active,
    editorialApproved: product.editorialApproved,
    published: product.published,
    commerciallyAvailable: product.commerciallyAvailable,
    featured: product.featured,
    featuredOrder: product.featuredOrder,
    category: {
      id: subcategory.category.id,
      slug: subcategory.category.slug,
      name: subcategory.category.name,
    },
    subcategory: {
      id: subcategory.id,
      slug: subcategory.slug,
      name: subcategory.name,
    },
    productType: { name: product.productType.name },
  };
}

export function parseListQuery(input: ListQueryInput) {
  return listQuerySchema.parse({
    page: toSingleValue(input.page),
    limit: toSingleValue(input.limit),
    category: toSingleValue(input.category),
    subcategory: toSingleValue(input.subcategory),
    q: toSingleValue(input.q),
  });
}

export async function listFeaturedProducts(prisma: PrismaClient, limit: number) {
  const products = await prisma.product.findMany({
    where: {
      active: true,
      published: true,
      featured: true,
      productType: publicClassificationWhere(),
    },
    take: limit,
    include: classificationInclude,
    orderBy: [
      { featuredOrder: { sort: "asc", nulls: "last" } },
      { createdAt: "desc" },
      { id: "asc" },
    ],
  });
  return products.map(mapProduct);
}

export async function listProducts(prisma: PrismaClient, rawQuery: ListQueryInput): Promise<ProductListResponse> {
  const query = parseListQuery(rawQuery);
  const where = {
    published: true,
    productType: publicClassificationWhere(query.category, query.subcategory),
    ...(query.q ? { name: { contains: query.q, mode: "insensitive" as const } } : {}),
  };
  const [items, totalItems] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: classificationInclude,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);
  return {
    items: items.map(mapProduct),
    metadata: {
      page: query.page,
      limit: query.limit,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / query.limit)),
    },
    filters: {
      category: query.category ?? null,
      subcategory: query.subcategory ?? null,
      q: query.q ?? null,
    },
  };
}

export async function getProductDetail(prisma: PrismaClient, slug: string): Promise<ProductDetailResponse | null> {
  const item = await prisma.product.findFirst({
    where: {
      slug,
      published: true,
      productType: publicClassificationWhere(),
    },
    include: classificationInclude,
  });
  if (!item?.productType) return null;

  const categoryProductTypes = item.productType.subcategory.category.subcategories
    .flatMap((subcategory) => subcategory.productTypes.map((productType) => productType.name));
  const related = await prisma.product.findMany({
    where: {
      published: true,
      id: { not: item.id },
      productTypeId: { in: categoryProductTypes },
    },
    include: classificationInclude,
    orderBy: [
      { commerciallyAvailable: "desc" },
      { updatedAt: "desc" },
      { id: "asc" },
    ],
    take: 4,
  });

  return { item: mapProduct(item), related: related.map(mapProduct) };
}
