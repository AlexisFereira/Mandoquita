import { describe, expect, it, vi } from "vitest";

import {
  createProductWithBaseVariant,
  restoreProduct,
  retireProduct,
} from "../../src/server/productAdminService";
import {
  CategoryDependenciesError,
  createCategory,
  retireCategory,
} from "../../src/server/categoryAdminService";

describe("Admin Catalog Management V2 aggregates", () => {
  it("creates one safe Product draft with the explicit Base SKU atomically", async () => {
    const createdAt = new Date("2026-07-13T12:00:00.000Z");
    const create = vi.fn(async ({ data }) => ({
      id: 501, slug: data.slug, name: data.name, description: null, shortDescription: null,
      brand: null, collection: null, genderApplicability: null, seoTitle: null, seoDescription: null,
      price: { toString: () => "39.90" }, currency: data.currency, productTypeId: null,
      active: data.active, editorialApproved: data.editorialApproved, published: data.published,
      commerciallyAvailable: data.commerciallyAvailable, featured: data.featured,
      featuredOrder: data.featuredOrder, retiredAt: null, updatedAt: createdAt,
    }));
    const db = {
      product: { findUnique: vi.fn().mockResolvedValue(null), create },
      productSlugAlias: { findUnique: vi.fn().mockResolvedValue(null) },
    } as any;
    const result = await createProductWithBaseVariant(db, {
      slug: "producto-v2", name: "Producto V2", price: "39.90", currency: "USD", baseSku: "V2-BASE-001",
    });
    expect(result).toMatchObject({
      active: false, editorialApproved: false, published: false,
      commerciallyAvailable: false, featured: false, featuredOrder: null,
    });
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({
      variants: { create: { sku: "V2-BASE-001", isBase: true, active: true } },
    }) }));
  });

  it("retires and restores a Product with safe public-state outcomes", async () => {
    const baseline = "2026-07-13T12:00:00.000Z";
    const product = {
      id: 501, slug: "producto-v2", name: "Producto V2", description: null, shortDescription: null,
      brand: null, collection: null, genderApplicability: null, seoTitle: null, seoDescription: null,
      price: { toString: () => "39.90" }, currency: "USD", productTypeId: null,
      active: false, editorialApproved: false, published: false, commerciallyAvailable: false,
      featured: false, featuredOrder: null, retiredAt: new Date(), updatedAt: new Date(),
    };
    const updateMany = vi.fn().mockResolvedValue({ count: 1 });
    const db = { product: { updateMany, findUnique: vi.fn().mockResolvedValue(product) } } as any;
    await retireProduct(db, 501, { expectedUpdatedAt: baseline }, "account-1");
    expect(updateMany).toHaveBeenLastCalledWith(expect.objectContaining({ data: expect.objectContaining({
      active: false, published: false, commerciallyAvailable: false, featured: false, featuredOrder: null,
      retiredByAccountId: "account-1",
    }) }));
    await restoreProduct(db, 501, { expectedUpdatedAt: baseline });
    expect(updateMany).toHaveBeenLastCalledWith(expect.objectContaining({ data: expect.objectContaining({
      retiredAt: null, active: false, editorialApproved: false, published: false,
      commerciallyAvailable: false, featured: false,
    }) }));
  });

  it("appends a new Category to the only active taxonomy as inactive and invisible", async () => {
    const create = vi.fn(async ({ data }) => ({
      ...data, imagePath: null, imageAltText: null, imageContentType: null, imageWidth: null,
      imageHeight: null, imageSize: null, imageChecksum: null, retiredAt: null,
      createdAt: new Date(), updatedAt: new Date(),
    }));
    const db = {
      category: { findFirst: vi.fn().mockResolvedValue(null), aggregate: vi.fn().mockResolvedValue({ _max: { sortOrder: 7 } }), create },
      categorySlugAlias: { findUnique: vi.fn().mockResolvedValue(null) },
      taxonomyVersion: { findMany: vi.fn().mockResolvedValue([{ id: "taxonomy-active" }]) },
    } as any;
    const result = await createCategory(db, { slug: "nueva-categoria", name: "Nueva categoría" });
    expect(result).toMatchObject({ sortOrder: 8, active: false, visible: false });
  });

  it("blocks Category retirement and reports every protected dependency", async () => {
    const db = {
      category: { findUnique: vi.fn().mockResolvedValue({ id: "category-1" }) },
      subcategory: { count: vi.fn().mockResolvedValue(2) },
      productType: { count: vi.fn().mockResolvedValue(4) },
      product: { count: vi.fn().mockResolvedValue(9) },
    } as any;
    await expect(retireCategory(db, "category-1", {
      expectedUpdatedAt: "2026-07-13T12:00:00.000Z",
    }, "account-1")).rejects.toMatchObject({
      dependencies: { subcategories: 2, productTypes: 4, products: 9 },
    } satisfies Partial<CategoryDependenciesError>);
  });
});
