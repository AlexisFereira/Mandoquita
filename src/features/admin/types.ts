export type AdminSession = {
  authorized: true;
  idleExpiresAt: string;
  absoluteExpiresAt: string;
  csrfToken: string;
  account: {
    id: string;
    username: string;
    role: "SUPER_ADMIN" | "ADMIN";
    mustChangePassword: boolean;
  };
};

export type AdminAccount = {
  id: string; username: string; role: "SUPER_ADMIN" | "ADMIN"; enabled: boolean;
  mustChangePassword: boolean; lastLoginAt: string | null; createdAt: string; updatedAt: string;
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
  retiredAt?: string | null;
  baseVariant?: { id: string; sku: string; active: boolean } | null;
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
  baseVariant?: { id: string; sku: string; active: boolean } | null;
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
  retired: "false" | "true";
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

export type AdminMediaUpload = {
  id: string;
  previewUrl: string;
  contentType: string;
  size: number;
  width: number;
  height: number;
  checksumSha256: string;
  expiresAt: string;
};

export type AdminProductImage = {
  id: string;
  previewUrl: string;
  altText: string;
  position: number;
  isPrimary: boolean;
  referencedByVariants: boolean;
  variantReferenceCount: number;
  contentType: string | null;
  width: number | null;
  height: number | null;
  size: number | null;
  checksumSha256: string | null;
  updatedAt: string;
};

export type AdminProductMedia = {
  product: { id: number; slug: string; name: string; updatedAt: string };
  images: AdminProductImage[];
};

export type AdminCategoryMedia = {
  id: string;
  slug: string;
  name: string;
  active: boolean;
  visible: boolean;
  image: null | {
    previewUrl: string;
    altText: string | null;
    contentType: string | null;
    width: number | null;
    height: number | null;
    size: number | null;
    checksumSha256: string | null;
  };
  updatedAt: string;
};

export type AdminCategory = AdminCategoryMedia & {
  description: string | null; sortOrder: number; retiredAt: string | null;
  dependencies: { subcategories: number; productTypes: number; products: number };
  createdAt: string;
};

export type AdminCategoryList = {
  items: AdminCategory[];
  metadata: { page: number; limit: number; totalItems: number; totalPages: number };
  filters: { q: string | null; retired: boolean };
};
