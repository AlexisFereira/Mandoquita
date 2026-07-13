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
    id: number;
    slug: string;
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
    q: string | null;
  };
};

export type ProductDetailResponse = {
  item: ProductItem;
  related: ProductItem[];
};

export type HomepageCategory = {
  slug: string;
  name: string;
  imageUrl?: string;
  productCount: number;
};

export type HomepagePayload = {
  featuredProducts: ProductItem[];
  categories: HomepageCategory[];
};
