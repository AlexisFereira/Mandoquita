import type { PrismaClient } from "@prisma/client";

import { listFeaturedProducts } from "@/server/catalogService";
import type { HomepageCategory, HomepagePayload } from "@/types/catalog";

const HOMEPAGE_FEATURED_PRODUCT_LIMIT = 8;

async function listHomepageCategories(prisma: PrismaClient): Promise<HomepageCategory[]> {
  const categories = await prisma.category.findMany({
    where: {
      active: true,
      visible: true,
      products: { some: { published: true } },
    },
    orderBy: [{ name: "asc" }, { id: "asc" }],
    include: {
      products: {
          where: { published: true },
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        take: 1,
        select: { imageUrl: true },
      },
      _count: {
          select: { products: { where: { published: true } } },
      },
    },
  });

  return categories.map((category) => ({
    slug: category.slug,
    name: category.name,
    imageUrl: category.products[0]?.imageUrl.trim() || undefined,
    productCount: category._count.products,
  }));
}

/**
 * Builds the homepage SSR payload from the existing public catalog contract.
 * Catalog and featured-product eligibility remain centralized in backend
 * services so the SSR layer does not reproduce business rules.
 */
export async function getHomepagePayload(prisma: PrismaClient): Promise<HomepagePayload> {
  const [featuredProducts, categories] = await Promise.all([
    listFeaturedProducts(prisma, HOMEPAGE_FEATURED_PRODUCT_LIMIT),
    listHomepageCategories(prisma),
  ]);

  return {
    featuredProducts,
    categories,
  };
}
