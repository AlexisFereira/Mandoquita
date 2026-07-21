import { z } from "zod";
/** * Cada payload es independiente. El discriminador (kind) vive en el modal, * NO en el body — porque el body siempre es "lo que crea un modal X". */
const createCategoryBodySchema = z.object({ name: z.string().trim().min(2).max(120), slug: z.string().trim().regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones").optional(), });
type CreateCategoryBody = z.infer<typeof createCategoryBodySchema>;
const createSubcategoryBodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/).optional(),
  categoryId: z.string().min(1),
});
type CreateSubcategoryBody = {
  name: string;
  slug: string;
  categoryId: string;
  active?: boolean;
};

type CreateProductTypeBody = {
  name: string;
  subcategoryId: string;
  sourceOrder?: number
};

export type TaxonomyCreatePayload =
  | { kind: "category"; body: CreateCategoryBody }
  | { kind: "subcategory"; body: CreateSubcategoryBody }
  | { kind: "productType"; body: CreateProductTypeBody };


export const isCategoryPayload = (p: TaxonomyCreatePayload,): p is Extract<TaxonomyCreatePayload, { kind: "category" }> => p.kind === "category";
export const isSubcategoryPayload = (p: TaxonomyCreatePayload,): p is Extract<TaxonomyCreatePayload, { kind: "subcategory" }> => p.kind === "subcategory";
export const isProductTypePayload = (p: TaxonomyCreatePayload,): p is Extract<TaxonomyCreatePayload, { kind: "productType" }> => p.kind === "productType";
