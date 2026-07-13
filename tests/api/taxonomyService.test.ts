import { describe, expect, it, vi } from "vitest";

import {
  getDiscoverableCategory,
  listDiscoverableTaxonomy,
} from "../../src/server/taxonomyService";

const category = {
  id: "cat_ropa_moda",
  slug: "ropa-y-moda",
  name: "Ropa y moda",
  description: "Prendas de vestir.",
  sortOrder: 1,
  subcategories: [
    {
      id: "sub_camisetas",
      slug: "camisetas",
      name: "Camisetas",
      sourceOrder: 1,
    },
  ],
};

function prismaWith(categories = [category]) {
  return {
    category: { findMany: vi.fn().mockResolvedValue(categories) },
    product: {
      count: vi.fn().mockResolvedValue(1),
      findFirst: vi.fn().mockResolvedValue({ imageUrl: "/camiseta.svg" }),
    },
  } as any;
}

describe("taxonomy discovery service", () => {
  it("requests only active, visible, non-empty branches in deterministic order", async () => {
    const prisma = prismaWith();

    const result = await listDiscoverableTaxonomy(prisma);

    expect(prisma.category.findMany).toHaveBeenCalledWith({
      where: {
        active: true,
        visible: true,
        version: { status: "ACTIVE" },
        subcategories: {
          some: {
            active: true,
            productTypes: {
              some: { active: true, products: { some: { published: true } } },
            },
          },
        },
      },
      include: {
        subcategories: {
          where: {
            active: true,
            productTypes: {
              some: { active: true, products: { some: { published: true } } },
            },
          },
          orderBy: [{ sourceOrder: "asc" }, { id: "asc" }],
        },
      },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });
    expect(result[0]).toMatchObject({
      id: "cat_ropa_moda",
      productCount: 1,
      subcategories: [{ id: "sub_camisetas", productCount: 1 }],
    });
  });

  it("does not fabricate empty or inactive branches returned as no eligible data", async () => {
    const prisma = prismaWith([]);
    await expect(listDiscoverableTaxonomy(prisma)).resolves.toEqual([]);
    expect(prisma.product.count).not.toHaveBeenCalled();
  });

  it("returns null for an invalid or unavailable category identifier", async () => {
    const prisma = prismaWith();
    await expect(getDiscoverableCategory(prisma, "categoria-inexistente")).resolves.toBeNull();
  });
});
