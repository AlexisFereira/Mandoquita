import type { PrismaClient, Product } from "@prisma/client";
import { z } from "zod";

import type { ProductDetailResponse, ProductItem, ProductListResponse } from "@/types/catalog";

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  category: z.string().trim().min(1).max(64).optional(),
  q: z.string().trim().min(1).max(120).optional(),
});

type ListQueryInput = {
  page?: string | string[];
  limit?: string | string[];
  category?: string | string[];
  q?: string | string[];
};

function toSingleValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function mapProduct(product: Product & { category: { id: number; slug: string; name: string } }): ProductItem {
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
      id: product.category.id,
      slug: product.category.slug,
      name: product.category.name,
    },
  };
}

export async function listFeaturedProducts(
  prisma: PrismaClient,
  limit: number
): Promise<ProductItem[]> {
  const products = await prisma.product.findMany({
    where: {
      active: true,
      published: true,
      featured: true,
      category: {
        active: true,
        visible: true,
      },
    },
    take: limit,
    include: { category: true },
    orderBy: [
      { featuredOrder: { sort: "asc", nulls: "last" } },
      { createdAt: "desc" },
      { id: "asc" },
    ],
  });

  return products.map(mapProduct);
}

export function parseListQuery(input: ListQueryInput) {
  return listQuerySchema.parse({
    page: toSingleValue(input.page),
    limit: toSingleValue(input.limit),
    category: toSingleValue(input.category),
    q: toSingleValue(input.q),
  });
}

export async function listProducts(prisma: PrismaClient, rawQuery: ListQueryInput): Promise<ProductListResponse> {
  const query = parseListQuery(rawQuery);
  const skip = (query.page - 1) * query.limit;

  const where = {
    published: true,
    category: {
      active: true,
      visible: true,
      ...(query.category ? { slug: query.category } : {}),
    },
    ...(query.q
      ? {
        name: {
          contains: query.q,
          mode: "insensitive" as const,
        },
      }
      : {}),
  };

  const [items, totalItems] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: query.limit,
      include: { category: true },
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
      q: query.q ?? null,
    },
  };
}

export async function getProductDetail(prisma: PrismaClient, slug: string): Promise<ProductDetailResponse | null> {
  const item = await prisma.product.findFirst({
    where: {
      slug,
      published: true,
      category: {
        active: true,
        visible: true,
      },
    },
    include: { category: true },
  });

  if (!item) {
    return null;
  }

  const related = await prisma.product.findMany({
    where: {
      published: true,
      categoryId: item.categoryId,
      id: { not: item.id },
    },
    orderBy: [
      { commerciallyAvailable: "desc" },
      { updatedAt: "desc" },
      { id: "asc" },
    ],
    take: 4,
  });

  return {
    item: mapProduct(item),
    related: related.map((product) =>
      mapProduct({
        ...product,
        category: item.category,
      })
    ),
  };
}
