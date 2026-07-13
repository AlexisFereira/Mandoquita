export type AdminSession = {
  authorized: true;
  idleExpiresAt: string;
  absoluteExpiresAt: string;
  csrfToken: string;
};

export type TaxonomyContext = {
  name: string;
};

export type TaxonomyNode = {
  id: number;
  slug: string;
  name: string;
};

export type AdminProductSummary = {
  id: number;
  slug: string;
  name: string;
  price: string;
  currency: string;
  active: boolean;
  editorialApproved: boolean;
  published: boolean;
  commerciallyAvailable: boolean;
  featured: boolean;
  featuredOrder: number | null;
  productType: TaxonomyContext | null;
  subcategory: TaxonomyNode | null;
  category: TaxonomyNode | null;
  updatedAt: string;
};

export type AdminProduct = AdminProductSummary & {
  description: string | null;
  shortDescription: string | null;
  brand: string | null;
  collection: string | null;
  genderApplicability: "mujer" | "hombre" | "unisex" | "no_aplica" | null;
  seoTitle: string | null;
  seoDescription: string | null;
  hasVariant: boolean;
};

export type AdminProductType = {
  name: string;
  subcategory: TaxonomyNode;
  category: TaxonomyNode;
};

export type AdminFilters = {
  q: string;
  published: "" | "true" | "false";
  commerciallyAvailable: "" | "true" | "false";
  featured: "" | "true" | "false";
  active: "" | "true" | "false";
  category: string;
  productType: string;
};

export type AdminProductList = {
  items: AdminProductSummary[];
  metadata: { page: number; limit: number; totalItems: number; totalPages: number };
  filters: Record<keyof AdminFilters, string | boolean | null>;
};

export type AdminEditorValues = {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  brand: string;
  collection: string;
  genderApplicability: "" | "mujer" | "hombre" | "unisex" | "no_aplica";
  price: string;
  currency: string;
  commerciallyAvailable: boolean;
  active: boolean;
  editorialApproved: boolean;
  published: boolean;
  featured: boolean;
  featuredOrder: string;
  productTypeId: string;
  seoTitle: string;
  seoDescription: string;
};

export type AdminFieldErrors = Partial<Record<keyof AdminEditorValues, string>>;
