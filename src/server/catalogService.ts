import type { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

import type {
  ProductDetailResponse,
  ProductItem,
  ProductListResponse,
  ProductVariantAttributeItem,
  ProductVariantSelection,
} from "@/types/catalog";

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
            include: {},
          },
        },
      },
    },
  },
  images: { orderBy: { position: "asc" as const } },
  tags: { orderBy: { value: "asc" as const } },
  variants: {
    where: { active: true },
    orderBy: { id: "asc" as const },
    include: { attributes: true },
  },
} as const;

type ClassifiedProduct = Prisma.ProductGetPayload<{
  include: typeof classificationInclude;
}>;
const { variants: _relatedVariants, ...relatedProductInclude } = classificationInclude;
type PublicProduct = Omit<ClassifiedProduct, "variants"> & {
  variants?: ClassifiedProduct["variants"];
};
const productTypesByCategory = new WeakMap<object, Map<string, Promise<string[]>>>();

function getCategoryProductTypes(prisma: PrismaClient, categoryId: string, fallback: string[] = []) {
  let cache = productTypesByCategory.get(prisma);
  if (!cache) {
    cache = new Map();
    productTypesByCategory.set(prisma, cache);
  }
  let value = cache.get(categoryId);
  if (!value) {
    value = fallback.length > 0 ? Promise.resolve(fallback) : prisma.productType.findMany({
      where: { active: true, subcategory: { active: true, categoryId } },
      orderBy: { name: "asc" },
      select: { name: true },
    }).then((items) => items.map(({ name }) => name));
    cache.set(categoryId, value);
  }
  return value;
}

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

function mapProduct(product: PublicProduct): ProductItem {
  if (!product.productType) {
    throw new Error("Published product is missing its approved Product Type");
  }

  const { subcategory } = product.productType;
  const images = product.images ?? [];
  const tags = product.tags ?? [];
  const primaryImage = images.find((image) => image.isPrimary) ?? images[0];
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    shortDescription: product.shortDescription ?? null,
    price: product.commerciallyAvailable ? product.price.toString() : null,
    currency: product.commerciallyAvailable ? product.currency : null,
    imageUrl: primaryImage?.url ?? "",
    images: images.map(({ id, url, altText, position, isPrimary }) => ({
      id,
      url,
      altText,
      position,
      isPrimary,
    })),
    brand: product.brand ?? null,
    collection: product.collection ?? null,
    genderApplicability: product.genderApplicability
      ? product.genderApplicability.toLowerCase() as NonNullable<ProductItem["genderApplicability"]>
      : null,
    tags: tags.map(({ value }) => value),
    seo: { title: product.seoTitle ?? null, description: product.seoDescription ?? null },
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

const attributeLabels = {
  TALLA: "Talla",
  COLOR: "Color",
  MATERIAL: "Material",
  CAPACIDAD: "Capacidad",
  PRESENTACION: "Presentación",
} as const;
const attributeOrder = Object.keys(attributeLabels) as Array<keyof typeof attributeLabels>;

function mapAttribute(
  attribute: ClassifiedProduct["variants"][number]["attributes"][number]
): ProductVariantAttributeItem {
  const value = attribute.valueType === "TEXT"
    ? attribute.textValue!
    : attribute.valueType === "NUMBER"
      ? Number(attribute.numberValue)
      : attribute.booleanValue!;
  return { name: attributeLabels[attribute.name], value };
}

function mapVariantSelection(product: ClassifiedProduct): ProductVariantSelection {
  const sourceVariants = product.variants ?? [];
  const variants = sourceVariants.map((variant) => ({
    id: variant.id,
    imageId: variant.imageId,
    attributes: [...variant.attributes]
      .sort((left, right) => attributeOrder.indexOf(left.name) - attributeOrder.indexOf(right.name))
      .map(mapAttribute),
  }));

  if (variants.length === 0) return { mode: "content_correction", variants: [] };
  if (variants.length === 1) {
    return sourceVariants[0].isBase || variants[0].attributes.length === 0
      ? { mode: "none", variants: [] }
      : { mode: "read_only", variants };
  }

  const signatures = variants.map(({ attributes }) => JSON.stringify(attributes));
  const distinguishable = variants.every(({ attributes }) => attributes.length > 0) &&
    new Set(signatures).size === variants.length;
  return distinguishable
    ? { mode: "selectable", variants }
    : { mode: "content_correction", variants: [] };
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
      variants: { some: {} },
      productType: publicClassificationWhere(),
    },
    take: limit,
    include: relatedProductInclude,
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
    variants: { some: {} },
    productType: publicClassificationWhere(query.category, query.subcategory),
    ...(query.q ? { name: { contains: query.q, mode: "insensitive" as const } } : {}),
  };
  const [items, totalItems] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: relatedProductInclude,
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
      variants: { some: {} },
      productType: publicClassificationWhere(),
    },
    include: classificationInclude,
  });
  if (!item?.productType) return null;

  const categoryProductTypes = await getCategoryProductTypes(
    prisma,
    item.productType.subcategory.category.id,
    ((item.productType.subcategory.category as unknown as {
      subcategories?: Array<{ productTypes: Array<{ name: string }> }>;
    }).subcategories ?? []).flatMap(({ productTypes }) => productTypes.map(({ name }) => name)),
  );
  const related = await prisma.product.findMany({
    where: {
      published: true,
      variants: { some: {} },
      id: { not: item.id },
      productTypeId: { in: categoryProductTypes },
    },
    include: relatedProductInclude,
    orderBy: [
      { commerciallyAvailable: "desc" },
      { updatedAt: "desc" },
      { id: "asc" },
    ],
    take: 4,
  });

  return {
    item: mapProduct(item),
    variantSelection: mapVariantSelection(item),
    related: related.map(mapProduct),
  };
}
