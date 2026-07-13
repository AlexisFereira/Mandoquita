import type { PrismaClient } from "@prisma/client";

import { listFeaturedProducts } from "@/server/catalogService";
import { listDiscoverableTaxonomy } from "@/server/taxonomyService";
import type { HomepageCategory, HomepagePayload } from "@/types/catalog";

const HOMEPAGE_FEATURED_PRODUCT_LIMIT = 8;

/**
 * Builds the homepage SSR payload from the existing public catalog contract.
 * Catalog and featured-product eligibility remain centralized in backend
 * services so the SSR layer does not reproduce business rules.
 */
export async function getHomepagePayload(prisma: PrismaClient): Promise<HomepagePayload> {
  const [featuredProducts, categories] = await Promise.all([
    listFeaturedProducts(prisma, HOMEPAGE_FEATURED_PRODUCT_LIMIT),
    listDiscoverableTaxonomy(prisma),
  ]);

  return {
    featuredProducts,
    categories: categories.map(({ subcategories: _subcategories, ...category }) => category),
  };
}
