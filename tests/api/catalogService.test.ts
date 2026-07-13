import { describe, expect, it, vi } from "vitest";

import { getProductDetail, listProducts, parseListQuery } from "../../src/server/catalogService";

function makeProduct(overrides: Record<string, unknown> = {}) {
  const now = new Date();
  return {
    id: 1,
    slug: "camiseta-basica",
    name: "Camiseta básica",
    description: "Camiseta de uso diario",
    shortDescription: null,
    brand: null,
    collection: null,
    genderApplicability: null,
    seoTitle: null,
    seoDescription: null,
    price: { toString: () => "25.00" },
    currency: "USD",
    active: true,
    editorialApproved: true,
    published: true,
    commerciallyAvailable: true,
    featured: false,
    featuredOrder: null,
    productTypeId: "Camiseta básica",
    createdAt: now,
    updatedAt: now,
    images: [],
    tags: [],
    variants: [{
      id: "variant-1",
      productId: 1,
      sku: "SKU-1",
      reference: null,
      barcode: null,
      active: true,
      isBase: true,
      imageId: null,
      createdAt: now,
      updatedAt: now,
      attributes: [],
    }],
    productType: {
      name: "Camiseta básica",
      active: true,
      sourceOrder: 3,
      subcategoryId: "sub_camisetas",
      createdAt: now,
      updatedAt: now,
      subcategory: {
        id: "sub_camisetas",
        slug: "camisetas",
        name: "Camisetas",
        sourceOrder: 1,
        active: true,
        categoryId: "cat_ropa_moda",
        createdAt: now,
        updatedAt: now,
        category: {
          id: "cat_ropa_moda",
          slug: "ropa-y-moda",
          name: "Ropa y moda",
          description: null,
          sortOrder: 1,
          active: true,
          visible: true,
          versionId: "taxonomy_es_1_0_0",
          createdAt: now,
          updatedAt: now,
          subcategories: [
            {
              id: "sub_camisetas",
              productTypes: [{ name: "Camiseta básica" }, { name: "Camiseta oversize" }],
            },
          ],
        },
      },
    },
    ...overrides,
  };
}

describe("parseListQuery", () => {
  it("parses taxonomy filters and validates pagination", () => {
    expect(parseListQuery({ category: "ropa-y-moda", subcategory: "camisetas" }))
      .toMatchObject({ category: "ropa-y-moda", subcategory: "camisetas" });
    expect(() => parseListQuery({ page: "0" })).toThrow();
  });

  it("normalizes surrounding whitespace and rejects empty or overlong searches", () => {
    expect(parseListQuery({ q: "  CaFé  " }).q).toBe("CaFé");
    expect(() => parseListQuery({ q: "   " })).toThrow();
    expect(() => parseListQuery({ q: "x".repeat(121) })).toThrow();
  });
});

describe("listProducts", () => {
  it("filters only published products inside the selected taxonomy branch", async () => {
    const prisma = {
      product: {
        findMany: vi.fn().mockResolvedValue([makeProduct()]),
        count: vi.fn().mockResolvedValue(1),
      },
    } as any;
    const response = await listProducts(prisma, {
      category: "ropa-y-moda",
      subcategory: "camisetas",
    });

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          published: true,
          productType: expect.objectContaining({ is: expect.any(Object) }),
        }),
      })
    );
    expect(response.items[0]).toMatchObject({
      category: { id: "cat_ropa_moda", slug: "ropa-y-moda" },
      subcategory: { id: "sub_camisetas", slug: "camisetas" },
      productType: { name: "Camiseta básica" },
    });
    expect(response.filters.subcategory).toBe("camisetas");
  });

  it("matches only the six approved public fields and orders ties deterministically", async () => {
    const prisma = {
      product: {
        count: vi.fn().mockResolvedValue(1),
        findMany: vi.fn().mockResolvedValue([makeProduct()]),
      },
    } as any;

    await listProducts(prisma, { q: "  verano  " });

    const call = prisma.product.findMany.mock.calls[0][0];
    expect(call.where.OR).toEqual([
      { name: { contains: "verano", mode: "insensitive" } },
      { shortDescription: { contains: "verano", mode: "insensitive" } },
      { description: { contains: "verano", mode: "insensitive" } },
      { brand: { contains: "verano", mode: "insensitive" } },
      { collection: { contains: "verano", mode: "insensitive" } },
      { tags: { some: { value: { contains: "verano", mode: "insensitive" } } } },
    ]);
    expect(JSON.stringify(call.where).toLowerCase()).not.toMatch(
      /sku|barcode|reference|inventory|supplier|cost|warehouse|logistics/
    );
    expect(call.orderBy).toEqual([{ name: "asc" }, { id: "asc" }]);
  });

  it("does not query PostgreSQL for an empty search", async () => {
    const prisma = {
      product: { count: vi.fn(), findMany: vi.fn() },
    } as any;

    await expect(listProducts(prisma, { q: "   " })).rejects.toThrow();
    expect(prisma.product.count).not.toHaveBeenCalled();
    expect(prisma.product.findMany).not.toHaveBeenCalled();
  });

  it("recovers an out-of-range page to the nearest valid page", async () => {
    const prisma = {
      product: {
        count: vi.fn().mockResolvedValue(13),
        findMany: vi.fn().mockResolvedValue([makeProduct()]),
      },
    } as any;

    const response = await listProducts(prisma, { q: "camiseta", page: "99", limit: "12" });

    expect(response.metadata).toEqual({ page: 2, limit: 12, totalItems: 13, totalPages: 2 });
    expect(prisma.product.findMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ skip: 1176, take: 12 })
    );
    expect(prisma.product.findMany).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ skip: 12, take: 12 })
    );
  });

  it("keeps commercially unavailable matches but suppresses price and currency", async () => {
    const prisma = {
      product: {
        count: vi.fn().mockResolvedValue(1),
        findMany: vi.fn().mockResolvedValue([
          makeProduct({ commerciallyAvailable: false }),
        ]),
      },
    } as any;

    const response = await listProducts(prisma, { q: "camiseta" });

    expect(response.items[0]).toMatchObject({
      commerciallyAvailable: false,
      price: null,
      currency: null,
    });
  });
});

describe("getProductDetail", () => {
  it("returns inherited taxonomy and at most four related products", async () => {
    const item = makeProduct();
    const related = makeProduct({ id: 2, slug: "camiseta-oversize" });
    const prisma = {
      product: {
        findFirst: vi.fn().mockResolvedValue(item),
        findMany: vi.fn().mockResolvedValue([related]),
      },
    } as any;

    const response = await getProductDetail(prisma, "camiseta-basica");

    expect(response?.item.productType.name).toBe("Camiseta básica");
    expect(response?.related).toHaveLength(1);
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 4, include: expect.any(Object) })
    );
  });

  it("returns unavailable when no published classified product exists", async () => {
    const prisma = {
      product: { findFirst: vi.fn().mockResolvedValue(null), findMany: vi.fn() },
    } as any;
    expect(await getProductDetail(prisma, "retired-demo")).toBeNull();
    expect(prisma.product.findMany).not.toHaveBeenCalled();
  });

  it("suppresses historical price without commercial availability", async () => {
    const prisma = {
      product: {
        findFirst: vi.fn().mockResolvedValue(
          makeProduct({ commerciallyAvailable: false })
        ),
        findMany: vi.fn().mockResolvedValue([]),
      },
    } as any;
    const response = await getProductDetail(prisma, "camiseta-basica");
    expect(response?.item.price).toBeNull();
    expect(response?.item.currency).toBeNull();
  });
});
