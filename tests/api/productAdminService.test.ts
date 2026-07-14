import { describe, expect, it, vi } from "vitest";

import {
  ProductUpdateConflictError,
  updateProductById,
} from "../../src/server/productAdminService";

const now = new Date("2026-07-13T12:00:00.000Z");

function selectedProduct(overrides: Record<string, unknown> = {}) {
  return {
    id: 200000,
    slug: "camiseta-acid-wash-oversize-cw",
    name: "Camiseta Acid Wash Oversize",
    description: "Descripción",
    shortDescription: null,
    brand: null,
    collection: null,
    genderApplicability: "UNISEX",
    seoTitle: null,
    seoDescription: null,
    price: { toString: () => "16.47" },
    currency: "USD",
    active: true,
    editorialApproved: true,
    published: true,
    commerciallyAvailable: true,
    featured: true,
    featuredOrder: 1,
    productTypeId: "Camiseta oversize",
    retiredAt: null,
    updatedAt: now,
    ...overrides,
  };
}

function currentProduct(overrides: Record<string, unknown> = {}) {
  return {
    editorialApproved: true,
    slug: "camiseta-acid-wash-oversize-cw",
    retiredAt: null,
    published: true,
    productTypeId: "Camiseta oversize",
    featured: true,
    featuredOrder: 1,
    updatedAt: now,
    productType: {
      active: true,
      subcategory: { active: true, category: { active: true, visible: true, version: { status: "ACTIVE" } } },
    },
    _count: { variants: 1 },
    ...overrides,
  };
}

describe("updateProductById", () => {
  it("accepts and normalizes every approved editable scalar field", async () => {
    const final = selectedProduct({
      slug: "camiseta-editada", name: "Camiseta editada", description: null,
      shortDescription: "Resumen", brand: "Marca", collection: "Colección",
      genderApplicability: "MUJER", seoTitle: "SEO", seoDescription: "SEO descripción",
      price: { toString: () => "19.99" }, currency: "COP", active: false,
      commerciallyAvailable: false, featured: true, featuredOrder: 2,
      productTypeId: "Camiseta", updatedAt: new Date("2026-07-13T12:05:00.000Z"),
    });
    const prisma = {
      product: {
        findUnique: vi.fn().mockResolvedValueOnce(currentProduct()).mockResolvedValueOnce(final),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
      productType: { findFirst: vi.fn().mockResolvedValue({ name: "Camiseta" }) },
      productSlugAlias: {
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({ slug: "camiseta-acid-wash-oversize-cw" }),
      },
    } as any;

    await updateProductById(prisma, 200000, {
      expectedUpdatedAt: now.toISOString(),
      slug: "camiseta-editada", name: "  Camiseta editada  ", description: null,
      shortDescription: "  Resumen  ", brand: "Marca", collection: "Colección",
      genderApplicability: "mujer", seoTitle: "SEO", seoDescription: "SEO descripción",
      price: "19.99", currency: "COP", active: false, editorialApproved: true,
      published: true, commerciallyAvailable: false, featured: true,
      featuredOrder: 2, productTypeId: "Camiseta",
    });

    expect(prisma.product.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 200000, updatedAt: now },
      data: {
        slug: "camiseta-editada", name: "Camiseta editada", description: null,
        shortDescription: "Resumen", brand: "Marca", collection: "Colección",
        genderApplicability: "MUJER", seoTitle: "SEO", seoDescription: "SEO descripción",
        price: "19.99", currency: "COP", active: false, editorialApproved: true,
        published: true, commerciallyAvailable: false, featured: true,
        featuredOrder: 2, productTypeId: "Camiseta",
      },
    }));
  });

  it("updates whitelisted fields and returns the administrative representation", async () => {
    const prisma = {
      product: {
        findUnique: vi.fn()
          .mockResolvedValueOnce(currentProduct())
          .mockResolvedValueOnce(selectedProduct({ name: "Nombre corregido", price: { toString: () => "18.00" } })),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
    } as any;

    const result = await updateProductById(prisma, 200000, {
      expectedUpdatedAt: now.toISOString(),
      name: "  Nombre corregido  ",
      price: 18,
      currency: "USD",
    });

    expect(prisma.product.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 200000, updatedAt: now },
      data: expect.objectContaining({ name: "Nombre corregido", price: "18.00", currency: "USD" }),
    }));
    expect(result).toMatchObject({
      id: 200000,
      name: "Nombre corregido",
      price: "18.00",
      genderApplicability: "unisex",
      updatedAt: now.toISOString(),
    });
  });

  it("rejects internal or relational fields outside the whitelist", async () => {
    const prisma = { product: { findUnique: vi.fn(), updateMany: vi.fn() } } as any;
    await expect(updateProductById(prisma, 200000, { expectedUpdatedAt: now.toISOString(), sku: "FORBIDDEN" } as any)).rejects.toThrow();
    expect(prisma.product.findUnique).not.toHaveBeenCalled();
  });

  it("prevents removing approval from a Product that remains published", async () => {
    const prisma = {
      product: {
        findUnique: vi.fn().mockResolvedValue(currentProduct()),
        updateMany: vi.fn(),
      },
    } as any;

    await expect(updateProductById(prisma, 200000, { expectedUpdatedAt: now.toISOString(), editorialApproved: false }))
      .rejects.toBeInstanceOf(ProductUpdateConflictError);
    expect(prisma.product.updateMany).not.toHaveBeenCalled();
  });

  it("clears editorial order when Featured is disabled", async () => {
    const prisma = {
      product: {
        findUnique: vi.fn()
          .mockResolvedValueOnce(currentProduct())
          .mockResolvedValueOnce(selectedProduct({ featured: false, featuredOrder: null })),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
    } as any;

    await updateProductById(prisma, 200000, { expectedUpdatedAt: now.toISOString(), featured: false });
    expect(prisma.product.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ featured: false, featuredOrder: null }),
    }));
  });

  it("prevents assigning editorial order without Featured status", async () => {
    const prisma = {
      product: {
        findUnique: vi.fn().mockResolvedValue(currentProduct({ featured: false, featuredOrder: null })),
        updateMany: vi.fn(),
      },
    } as any;

    await expect(updateProductById(prisma, 200000, { expectedUpdatedAt: now.toISOString(), featuredOrder: 2 }))
      .rejects.toBeInstanceOf(ProductUpdateConflictError);
    expect(prisma.product.updateMany).not.toHaveBeenCalled();
  });

  it("returns a conflict when optimistic concurrency no longer matches", async () => {
    const prisma = {
      product: {
        findUnique: vi.fn().mockResolvedValue(currentProduct()),
        updateMany: vi.fn().mockResolvedValue({ count: 0 }),
      },
    } as any;

    await expect(updateProductById(prisma, 200000, {
      name: "Cambio",
      expectedUpdatedAt: "2026-07-13T11:00:00.000Z",
    })).rejects.toBeInstanceOf(ProductUpdateConflictError);
    expect(prisma.product.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 200000, updatedAt: new Date("2026-07-13T11:00:00.000Z") },
    }));
  });
});
