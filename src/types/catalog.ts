export type ProductItem = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  shortDescription: string | null;
  price: string | null;
  currency: string | null;
  imageUrl: string;
  images: ProductImageItem[];
  brand: string | null;
  collection: string | null;
  genderApplicability: "mujer" | "hombre" | "unisex" | "no_aplica" | null;
  tags: string[];
  seo: {
    title: string | null;
    description: string | null;
  };
  active: boolean;
  editorialApproved: boolean;
  published: boolean;
  commerciallyAvailable: boolean;
  featured: boolean;
  featuredOrder: number | null;
  category: {
    id: string;
    slug: string;
    name: string;
  };
  subcategory: {
    id: string;
    slug: string;
    name: string;
  };
  productType: {
    name: string;
  };
};

export type ProductImageItem = {
  id: string;
  url: string;
  altText: string;
  position: number;
  isPrimary: boolean;
};

export type ProductVariantAttributeItem = {
  name: "Talla" | "Color" | "Material" | "Capacidad" | "Presentación";
  value: string | number | boolean;
};

export type PublicProductVariantItem = {
  id: string;
  imageId: string | null;
  attributes: ProductVariantAttributeItem[];
};

export type ProductVariantSelection = {
  mode: "none" | "read_only" | "selectable" | "content_correction";
  variants: PublicProductVariantItem[];
};

export type ProductListResponse = {
  items: ProductItem[];
  metadata: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  filters: {
    category: string | null;
    subcategory: string | null;
    q: string | null;
  };
};

export type ProductDetailResponse = {
  item: ProductItem;
  variantSelection: ProductVariantSelection;
  related: ProductItem[];
};

export type HomepageCategory = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  imageUrl?: string;
  productCount: number;
};

export type TaxonomySubcategory = {
  id: string;
  slug: string;
  name: string;
  productCount: number;
};

export type TaxonomyCategory = HomepageCategory & {
  subcategories: TaxonomySubcategory[];
};

export type HomepagePayload = {
  featuredProducts: ProductItem[];
  categories: HomepageCategory[];
};
