import { describe, expect, it, vi } from "vitest";

import { listAdminProducts, parseAdminProductListQuery } from "../../src/server/productAdminCatalogService";

const now = new Date("2026-07-13T12:00:00.000Z");
function product() {
  return {
    id: 200000,
    slug: "camiseta-acid-wash",
    name: "Camiseta Acid Wash",
    price: { toString: () => "16.47" },
    currency: "USD",
    active: true,
    editorialApproved: true,
    published: true,
    commerciallyAvailable: true,
    featured: true,
    featuredOrder: 1,
    updatedAt: now,
    _count: { variants: 1 },
    productType: {
      name: "Camiseta oversize",
      subcategory: {
        id: "sub_camisetas", slug: "camisetas", name: "Camisetas",
        category: { id: "cat_ropa", slug: "ropa-y-moda", name: "Ropa y moda" },
      },
    },
  };
}

describe("Product Admin collection", () => {
  it("rejects empty searches and repeated scalar filters", () => {
    expect(() => parseAdminProductListQuery({ q: "   " })).toThrow();
    expect(() => parseAdminProductListQuery({ published: ["true", "false"] })).toThrow();
  });

  it("searches name/slug only and combines approved filters", async () => {
    const prisma = { product: {
      findMany: vi.fn().mockResolvedValue([product()]),
      count: vi.fn().mockResolvedValue(1),
    } } as any;
    const result = await listAdminProducts(prisma, {
      q: "  acid  ", published: "true", active: "true", category: "ropa-y-moda",
    });
    const query = prisma.product.findMany.mock.calls[0][0];
    expect(query.where.OR).toEqual([
      { name: { contains: "acid", mode: "insensitive" } },
      { slug: { contains: "acid", mode: "insensitive" } },
    ]);
    expect(query.where).toMatchObject({ published: true, active: true });
    expect(JSON.stringify(query.where).toLowerCase()).not.toMatch(/sku|barcode|reference|image|tag|inventory|supplier|cost/);
    expect(query.orderBy).toEqual([{ name: "asc" }, { id: "asc" }]);
    expect(result.items[0]).toMatchObject({
      id: 200000,
      category: { slug: "ropa-y-moda" },
      productType: { name: "Camiseta oversize" },
    });
  });

  it("recovers an out-of-range page", async () => {
    const prisma = { product: {
      findMany: vi.fn().mockResolvedValueOnce([]).mockResolvedValueOnce([product()]),
      count: vi.fn().mockResolvedValue(21),
    } } as any;
    const result = await listAdminProducts(prisma, { page: "99", limit: "20" });
    expect(result.metadata).toEqual({ page: 2, limit: 20, totalItems: 21, totalPages: 2 });
    expect(prisma.product.findMany).toHaveBeenNthCalledWith(2, expect.objectContaining({ skip: 20 }));
  });
});
