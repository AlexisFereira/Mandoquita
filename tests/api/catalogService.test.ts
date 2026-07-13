import { describe, expect, it, vi } from "vitest";

import { getProductDetail, listProducts, parseListQuery } from "../../src/server/catalogService";

function makeProduct(overrides: Record<string, unknown> = {}) {
  const now = new Date();
  return {
    id: 1,
    slug: "camiseta-basica",
    name: "Camiseta básica",
    description: "Camiseta de uso diario",
    price: { toString: () => "25.00" },
    currency: "USD",
    imageUrl: "",
    active: true,
    editorialApproved: true,
    published: true,
    commerciallyAvailable: true,
    featured: false,
    featuredOrder: null,
    productTypeId: "Camiseta básica",
    createdAt: now,
    updatedAt: now,
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
