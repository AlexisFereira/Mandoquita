import type { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

const nullableText = (maximum: number) => z.string().trim().min(1).max(maximum).nullable();
const numericPrice = z.number().positive().max(99_999_999.99).refine(
  (value) => Number.isInteger(value * 100),
  "Price supports at most two decimal places",
).transform((value) => value.toFixed(2));
const stringPrice = z.string().regex(/^(?:0|[1-9]\d{0,7})\.\d{2}$/).refine(
  (value) => Number(value) > 0,
  "Price must be positive",
);

export const productUpdateSchema = z.object({
  expectedUpdatedAt: z.string().datetime({ offset: true }),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(160).optional(),
  name: z.string().trim().min(1).max(200).optional(),
  description: nullableText(5_000).optional(),
  shortDescription: nullableText(500).optional(),
  brand: nullableText(160).optional(),
  collection: nullableText(160).optional(),
  genderApplicability: z.enum(["mujer", "hombre", "unisex", "no_aplica"])
    .transform((value) => value.toUpperCase() as "MUJER" | "HOMBRE" | "UNISEX" | "NO_APLICA")
    .nullable()
    .optional(),
  seoTitle: nullableText(200).optional(),
  seoDescription: nullableText(500).optional(),
  price: z.union([stringPrice, numericPrice]).optional(),
  currency: z.string().trim().regex(/^[A-Z]{3}$/).optional(),
  active: z.boolean().optional(),
  editorialApproved: z.boolean().optional(),
  published: z.boolean().optional(),
  commerciallyAvailable: z.boolean().optional(),
  featured: z.boolean().optional(),
  featuredOrder: z.number().int().positive().nullable().optional(),
  productTypeId: nullableText(200).optional(),
}).strict().superRefine((value, context) => {
  const updateFieldCount = Object.keys(value).filter((key) => key !== "expectedUpdatedAt").length;
  if (updateFieldCount === 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "At least one update field is required" });
  }
  if (value.featured === false && value.featuredOrder != null) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["featuredOrder"],
      message: "A non-featured Product cannot have featuredOrder",
    });
  }
});

export type ProductUpdateInput = z.input<typeof productUpdateSchema>;

export type AdminProductItem = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  shortDescription: string | null;
  brand: string | null;
  collection: string | null;
  genderApplicability: "mujer" | "hombre" | "unisex" | "no_aplica" | null;
  seoTitle: string | null;
  seoDescription: string | null;
  price: string;
  currency: string;
  active: boolean;
  editorialApproved: boolean;
  published: boolean;
  commerciallyAvailable: boolean;
  featured: boolean;
  featuredOrder: number | null;
  productTypeId: string | null;
  updatedAt: string;
};

export class ProductNotFoundError extends Error {}
export class ProductUpdateConflictError extends Error {}

const adminProductSelect = {
  id: true,
  slug: true,
  name: true,
  description: true,
  shortDescription: true,
  brand: true,
  collection: true,
  genderApplicability: true,
  seoTitle: true,
  seoDescription: true,
  price: true,
  currency: true,
  active: true,
  editorialApproved: true,
  published: true,
  commerciallyAvailable: true,
  featured: true,
  featuredOrder: true,
  productTypeId: true,
  updatedAt: true,
} as const;

type SelectedAdminProduct = Prisma.ProductGetPayload<{ select: typeof adminProductSelect }>;

function mapAdminProduct(product: SelectedAdminProduct): AdminProductItem {
  return {
    ...product,
    price: product.price.toString(),
    genderApplicability: product.genderApplicability
      ? product.genderApplicability.toLowerCase() as AdminProductItem["genderApplicability"]
      : null,
    updatedAt: product.updatedAt.toISOString(),
  };
}

export function parseProductId(rawId: string | string[] | undefined): number {
  const value = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!value || !/^[1-9]\d*$/.test(value)) throw new z.ZodError([{
    code: z.ZodIssueCode.custom,
    path: ["id"],
    message: "Invalid Product ID",
  }]);
  const id = Number(value);
  if (!Number.isSafeInteger(id)) throw new z.ZodError([{
    code: z.ZodIssueCode.custom,
    path: ["id"],
    message: "Invalid Product ID",
  }]);
  return id;
}

export async function updateProductById(
  prisma: PrismaClient | Prisma.TransactionClient,
  id: number,
  rawInput: unknown,
): Promise<AdminProductItem> {
  const { expectedUpdatedAt, ...input } = productUpdateSchema.parse(rawInput);
  const current = await prisma.product.findUnique({
    where: { id },
    select: {
      editorialApproved: true,
      published: true,
      productTypeId: true,
      featured: true,
      featuredOrder: true,
      updatedAt: true,
      productType: {
        select: {
          active: true,
          subcategory: { select: { active: true, category: { select: { active: true, visible: true, version: { select: { status: true } } } } } },
        },
      },
      _count: { select: { variants: true } },
    },
  });
  if (!current) throw new ProductNotFoundError("Product not found");

  const published = input.published ?? current.published;
  const editorialApproved = input.editorialApproved ?? current.editorialApproved;
  const productTypeId = input.productTypeId === undefined ? current.productTypeId : input.productTypeId;
  if (published && !editorialApproved) {
    throw new ProductUpdateConflictError("Published Product requires editorial approval");
  }
  if (published && !productTypeId) {
    throw new ProductUpdateConflictError("Published Product requires Product Type");
  }
  if (published && current._count.variants === 0) {
    throw new ProductUpdateConflictError("Published Product requires a Variant");
  }
  let approvedProductType = input.productTypeId === undefined
    ? current.productType
    : input.productTypeId === null
      ? null
      : await prisma.productType.findFirst({
          where: {
            name: input.productTypeId,
            active: true,
            subcategory: { active: true, category: { active: true, visible: true, version: { status: "ACTIVE" } } },
          },
          select: { name: true },
        });
  if (input.productTypeId != null && !approvedProductType) {
    throw new ProductUpdateConflictError("Product Type must be an approved active taxonomy leaf");
  }
  if (published && (!approvedProductType ||
      ("active" in approvedProductType && (!approvedProductType.active ||
        !approvedProductType.subcategory.active || !approvedProductType.subcategory.category.active ||
        !approvedProductType.subcategory.category.visible ||
        approvedProductType.subcategory.category.version.status !== "ACTIVE")))) {
    throw new ProductUpdateConflictError("Published Product requires an approved Product Type");
  }
  const featured = input.featured ?? current.featured;
  const featuredOrder = input.featured === false
    ? null
    : input.featuredOrder === undefined
      ? current.featuredOrder
      : input.featuredOrder;
  if (!featured && featuredOrder != null) {
    throw new ProductUpdateConflictError("A non-featured Product cannot have featuredOrder");
  }

  const data: Prisma.ProductUpdateManyMutationInput = {
    ...input,
    ...(input.featured === false ? { featuredOrder: null } : {}),
  };
  const result = await prisma.product.updateMany({
    where: {
      id,
      ...(expectedUpdatedAt ? { updatedAt: new Date(expectedUpdatedAt) } : {}),
    },
    data,
  });
  if (result.count === 0) {
    throw new ProductUpdateConflictError("Product changed since it was read");
  }

  const updated = await prisma.product.findUnique({ where: { id }, select: adminProductSelect });
  if (!updated) throw new ProductNotFoundError("Product not found");
  return mapAdminProduct(updated);
}
