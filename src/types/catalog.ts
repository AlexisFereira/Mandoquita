export type ProductItem = {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: string | null;
  currency: string | null;
  imageUrl: string;
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
