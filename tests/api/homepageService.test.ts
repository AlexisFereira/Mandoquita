import { describe, expect, it, vi } from "vitest";

import { getHomepagePayload } from "../../src/server/homepageService";

function makeProduct(
  id: number,
  category: { id: number; slug: string; name: string },
  overrides: Partial<{
    active: boolean;
    featured: boolean;
    featuredOrder: number | null;
    description: string;
    imageUrl: string;
  }> = {}
) {
  return {
    id,
    slug: `product-${id}`,
    name: `Product ${id}`,
    description: overrides.description ?? "Description",
    price: { toString: () => "10.00" },
    currency: "USD",
    imageUrl: overrides.imageUrl ?? `https://images.example.com/product-${id}.jpg`,
    active: overrides.active ?? true,
    editorialApproved: true,
    published: true,
    commerciallyAvailable: true,
    featured: overrides.featured ?? true,
    featuredOrder: overrides.featuredOrder ?? id,
    categoryId: category.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    category,
  };
}

function buildPrismaMock(products: ReturnType<typeof makeProduct>[]) {
  const categories = Array.from(
    new Map(products.map((product) => [product.category.slug, product.category])).values()
  ).map((category) => {
    const categoryProducts = products.filter(
      (product) => product.category.slug === category.slug && product.active
    );

    return {
      ...category,
      active: true,
      visible: true,
      products: categoryProducts.slice(0, 1).map(({ imageUrl }) => ({ imageUrl })),
      _count: { products: categoryProducts.length },
    };
  });

  return {
    product: {
      findMany: vi.fn().mockResolvedValue(products),
      count: vi.fn().mockResolvedValue(products.length),
    },
    category: {
      findMany: vi.fn().mockResolvedValue(categories),
    },
  } as any;
}

describe("getHomepagePayload", () => {
  it("delegates product eligibility to the published catalog query", async () => {
    const prisma = buildPrismaMock([]);

    await getHomepagePayload(prisma);

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          active: true,
          published: true,
          category: { active: true, visible: true },
        }),
      })
    );
  });

  it("loads at most eight published featured products in curated order", async () => {
    const prisma = buildPrismaMock([]);

    await getHomepagePayload(prisma);

    expect(prisma.product.findMany).toHaveBeenCalledWith({
      where: {
        active: true,
        published: true,
        featured: true,
        category: { active: true, visible: true },
      },
      take: 8,
      include: { category: true },
      orderBy: [
        { featuredOrder: { sort: "asc", nulls: "last" } },
        { createdAt: "desc" },
        { id: "asc" },
      ],
    });
  });

  it("returns an empty, serializable payload when no eligible content exists", async () => {
    const payload = await getHomepagePayload(buildPrismaMock([]));

    expect(payload).toEqual({ featuredProducts: [], categories: [] });
    expect(() => JSON.stringify(payload)).not.toThrow();
  });

  it("exposes only existing category presentation fields and active-product counts", async () => {
    const audio = { id: 1, slug: "audio", name: "Audio" };
    const computing = { id: 2, slug: "computing", name: "Computing" };
    const products = [
      makeProduct(1, audio),
      makeProduct(2, audio),
      makeProduct(3, computing),
    ];

    const payload = await getHomepagePayload(buildPrismaMock(products));

    expect(payload.categories).toEqual([
      {
        slug: "audio",
        name: "Audio",
        imageUrl: "https://images.example.com/product-1.jpg",
        productCount: 2,
      },
      {
        slug: "computing",
        name: "Computing",
        imageUrl: "https://images.example.com/product-3.jpg",
        productCount: 1,
      },
    ]);
    expect(Object.keys(payload.categories[0]).sort()).toEqual([
      "imageUrl",
      "name",
      "productCount",
      "slug",
    ]);
  });

  it("loads every active, visible category that contains a published product", async () => {
    const prisma = buildPrismaMock([]);

    await getHomepagePayload(prisma);

    expect(prisma.category.findMany).toHaveBeenCalledWith({
      where: {
        active: true,
        visible: true,
        products: { some: { published: true } },
      },
      orderBy: [{ name: "asc" }, { id: "asc" }],
      include: {
        products: {
          where: { published: true },
          orderBy: [{ createdAt: "desc" }, { id: "asc" }],
          take: 1,
          select: { imageUrl: true },
        },
        _count: {
          select: { products: { where: { published: true } } },
        },
      },
    });
  });

  it("degrades safely when optional presentation text or category media is empty", async () => {
    const category = { id: 1, slug: "audio", name: "Audio" };
    const product = makeProduct(1, category, { description: "", imageUrl: "" });

    const payload = await getHomepagePayload(buildPrismaMock([product]));

    expect(payload.featuredProducts[0].description).toBe("");
    expect(payload.categories[0]).toEqual({
      slug: "audio",
      name: "Audio",
      imageUrl: undefined,
      productCount: 1,
    });
    expect(() => JSON.stringify(payload)).not.toThrow();
  });
});
