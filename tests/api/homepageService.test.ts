import { describe, expect, it, vi } from "vitest";

import {
  bogotaBusinessDate,
  getHomepagePayload,
  selectDailyHomepageCategory,
} from "../../src/server/homepageService";

function transactional<T extends object>(db: T) {
  return {
    ...db,
    $transaction: vi.fn(async (operation: (tx: T) => unknown) => operation(db)),
  } as any;
}

describe("Homepage server composition", () => {
  it("uses the Bogotá date at the UTC boundary", () => {
    expect(bogotaBusinessDate(new Date("2026-07-14T04:59:59.999Z"))).toBe("2026-07-13");
    expect(bogotaBusinessDate(new Date("2026-07-14T05:00:00.000Z"))).toBe("2026-07-14");
  });

  it("is stable for one day and never immediately repeats with unchanged candidates", () => {
    const candidates = [{ id: "cat-c" }, { id: "cat-a" }, { id: "cat-b" }];
    const today = new Date("2026-07-14T15:00:00.000Z");
    const laterToday = new Date("2026-07-15T04:59:59.000Z");
    const tomorrow = new Date("2026-07-15T05:00:00.000Z");
    expect(selectDailyHomepageCategory(candidates, today)?.id)
      .toBe(selectDailyHomepageCategory([...candidates].reverse(), laterToday)?.id);
    expect(selectDailyHomepageCategory(candidates, tomorrow)?.id)
      .not.toBe(selectDailyHomepageCategory(candidates, today)?.id);
  });

  it("returns no discovery content when the active taxonomy has no published products", async () => {
    const db = {
      product: { findMany: vi.fn().mockResolvedValue([]) },
      category: { findMany: vi.fn().mockResolvedValue([]) },
    };
    await expect(getHomepagePayload(transactional(db), new Date("2026-07-14T15:00:00Z"))).resolves.toEqual({
      featuredProducts: [], categories: [], selectedCategoryProducts: null,
    });
  });

  it("preserves Featured eligibility/order and its released maximum", async () => {
    const db = {
      product: { findMany: vi.fn().mockResolvedValue([]) },
      category: { findMany: vi.fn().mockResolvedValue([]) },
    };
    await getHomepagePayload(transactional(db), new Date("2026-07-14T15:00:00Z"));
    expect(db.product.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        active: true, published: true, featured: true,
        productType: expect.objectContaining({ is: expect.any(Object) }),
      }),
      orderBy: [
        { featuredOrder: { sort: "asc", nulls: "last" } },
        { createdAt: "desc" },
        { id: "asc" },
      ],
      take: 8,
    }));
  });

  it("allows the composed repeatable-read payload enough time to finish", async () => {
    const db = {
      product: { findMany: vi.fn().mockResolvedValue([]) },
      category: { findMany: vi.fn().mockResolvedValue([]) },
    };
    const client = transactional(db);
    await getHomepagePayload(client, new Date("2026-07-14T15:00:00Z"));
    expect(client.$transaction).toHaveBeenCalledWith(expect.any(Function), {
      isolationLevel: "RepeatableRead",
      timeout: 15_000,
    });
  });

  it("projects at most six Products in canonical public order from the server-selected Category", async () => {
    const now = new Date("2026-07-14T15:00:00Z");
    const category = {
      id: "category-a", slug: "categoria-a", name: "Categoría A", description: null,
      imagePath: null, imageAltText: null, sortOrder: 1, active: true, visible: true,
      versionId: "taxonomy-active", createdAt: now, updatedAt: now,
      subcategories: [{
        id: "subcategory-a", slug: "subcategoria-a", name: "Subcategoría A",
        sourceOrder: 1, active: true, categoryId: "category-a", createdAt: now, updatedAt: now,
      }],
    };
    const product = {
      id: 10, slug: "producto-a", name: "Producto A", description: null, shortDescription: null,
      brand: null, collection: null, genderApplicability: null, seoTitle: null, seoDescription: null,
      price: { toString: () => "20.00" }, currency: "USD", active: true,
      editorialApproved: true, published: true, commerciallyAvailable: true,
      featured: false, featuredOrder: null, productTypeId: "Tipo A", createdAt: now, updatedAt: now,
      images: [], tags: [],
      productType: {
        name: "Tipo A",
        subcategory: { ...category.subcategories[0], category },
      },
    };
    const db = {
      product: {
        findMany: vi.fn().mockResolvedValueOnce([]).mockResolvedValueOnce([product]),
        count: vi.fn().mockResolvedValue(1),
      },
      category: { findMany: vi.fn().mockResolvedValue([category]) },
    };
    const payload = await getHomepagePayload(transactional(db), now);
    expect(payload.selectedCategoryProducts).toMatchObject({
      category: { id: "category-a", slug: "categoria-a" },
      products: [{ id: 10, slug: "producto-a" }],
      businessDate: "2026-07-14",
    });
    expect(db.product.findMany).toHaveBeenNthCalledWith(2, expect.objectContaining({
      take: 6,
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      where: expect.objectContaining({ published: true }),
    }));
  });
});
