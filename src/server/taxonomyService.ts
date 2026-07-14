import type { Prisma, PrismaClient } from "@prisma/client";

import type { TaxonomyCategory, TaxonomySubcategory } from "@/types/catalog";

function publishedBranchWhere(categoryId: string, subcategoryId?: string) {
  return {
    published: true,
    variants: { some: {} },
    productType: {
      is: {
        active: true,
        subcategory: {
          active: true,
          ...(subcategoryId ? { id: subcategoryId } : {}),
          category: {
            id: categoryId,
            active: true,
            visible: true,
            version: { status: "ACTIVE" as const },
          },
        },
      },
    },
  };
}

export async function listDiscoverableTaxonomy(prisma: PrismaClient | Prisma.TransactionClient): Promise<TaxonomyCategory[]> {
  const categories = await prisma.category.findMany({
    where: {
      active: true,
      visible: true,
      version: { status: "ACTIVE" },
      subcategories: {
        some: {
          active: true,
          productTypes: { some: { active: true, products: { some: { published: true } } } },
        },
      },
    },
    include: {
      subcategories: {
        where: {
          active: true,
          productTypes: { some: { active: true, products: { some: { published: true } } } },
        },
        orderBy: [{ sourceOrder: "asc" }, { id: "asc" }],
      },
    },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  return Promise.all(
    categories.map(async (category) => {
      const productCount = await prisma.product.count({
        where: publishedBranchWhere(category.id),
      });
      const subcategories: TaxonomySubcategory[] = await Promise.all(
        category.subcategories.map(async (subcategory) => ({
          id: subcategory.id,
          slug: subcategory.slug,
          name: subcategory.name,
          productCount: await prisma.product.count({
            where: publishedBranchWhere(category.id, subcategory.id),
          }),
        }))
      );
      const description = category.description?.trim();
      const imageUrl = category.imagePath?.trim();
      const imageAltText = category.imageAltText?.trim();
      return {
        id: category.id,
        slug: category.slug,
        name: category.name,
        ...(description ? { description } : {}),
        ...(imageUrl ? { imageUrl } : {}),
        ...(imageAltText ? { imageAltText } : {}),
        productCount,
        subcategories,
      };
    })
  );
}

export async function getDiscoverableCategory(prisma: PrismaClient, slug: string) {
  const categories = await listDiscoverableTaxonomy(prisma);
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function resolveCategorySlug(prisma: PrismaClient, slug: string) {
  const canonical = await prisma.category.findUnique({ where: { slug }, select: { slug: true } });
  if (canonical) return { slug: canonical.slug, redirected: false };
  const alias = await prisma.categorySlugAlias.findUnique({
    where: { slug }, select: { category: { select: { slug: true } } },
  });
  return alias ? { slug: alias.category.slug, redirected: true } : null;
}
