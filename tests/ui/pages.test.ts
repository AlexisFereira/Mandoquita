import { describe, expect, it, vi } from "vitest";

import { listProducts, getProductDetail } from "../../src/server/catalogService";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeProduct(overrides: Partial<{
  id: number;
  slug: string;
  categoryId: number;
  categorySlug: string;
}> = {}) {
  const id = overrides.id ?? 1;
  const slug = overrides.slug ?? "wireless-headset-pro";
  const categoryId = overrides.categoryId ?? 1;
  const categorySlug = overrides.categorySlug ?? "audio";
  return {
    id,
    slug,
    name: "Wireless Headset Pro",
    description: "Over-ear headset with ANC.",
    price: { toString: () => "129.99" },
    currency: "USD",
    imageUrl: "https://images.example.com/wireless-headset-pro.jpg",
    active: true,
    editorialApproved: true,
    published: true,
    commerciallyAvailable: true,
    categoryId,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { id: categoryId, slug: categorySlug, name: "Audio" },
  };
}

// ---------------------------------------------------------------------------
// 9.1  UI: responsive rendering and navigation to detail
// ---------------------------------------------------------------------------

describe("catalog-to-detail navigation links", () => {
  it("product items returned by listProducts carry a slug suitable for a detail URL", async () => {
    const prisma = {
      product: {
        findMany: vi.fn().mockResolvedValue([makeProduct()]),
        count: vi.fn().mockResolvedValue(1),
      },
    } as any;

    const response = await listProducts(prisma, {});

    for (const item of response.items) {
      // Each item must expose a non-empty slug that forms a valid path segment
      expect(item.slug).toBeTruthy();
      expect(item.slug).toMatch(/^[a-z0-9-]+$/);
      // ProductCard renders: <Link href={`/products/${product.slug}`}>
      const expectedHref = `/products/${item.slug}`;
      expect(expectedHref).toMatch(/^\/products\/[a-z0-9-]+$/);
    }
  });

  it("detail page returns notFound for an unknown slug", async () => {
    const prisma = {
      product: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
    } as any;

    const result = await getProductDetail(prisma, "non-existent-slug");

    expect(result).toBeNull();
    // Next.js pages/products/[slug].tsx returns { notFound: true } when null
  });

  it("detail page returns full product data and related items for a known slug", async () => {
    const item = makeProduct({ id: 1, slug: "wireless-headset-pro", categoryId: 1 });
    const related = makeProduct({ id: 2, slug: "studio-monitors", categoryId: 1 });

    const prisma = {
      product: {
        findFirst: vi.fn().mockResolvedValue(item),
        findMany: vi.fn().mockResolvedValue([related]),
      },
    } as any;

    const result = await getProductDetail(prisma, "wireless-headset-pro");

    expect(result).not.toBeNull();
    expect(result!.item.slug).toBe("wireless-headset-pro");
    expect(result!.item.name).toBeTruthy();
    expect(result!.item.price).toBeTruthy();
    expect(result!.item.category).toBeTruthy();
    expect(result!.item.description).toBeTruthy();
    expect(Array.isArray(result!.related)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 9.2  Catalog-to-detail flow: response shapes are compatible
// ---------------------------------------------------------------------------

describe("catalog-to-detail data flow", () => {
  it("product slugs from listing are accepted by the detail service", async () => {
    const products = [
      makeProduct({ id: 1, slug: "wireless-headset-pro", categoryId: 1 }),
      makeProduct({ id: 2, slug: "mechanical-keyboard-tkl", categoryId: 2 }),
    ];

    const listPrisma = {
      product: {
        findMany: vi.fn().mockResolvedValue(products),
        count: vi.fn().mockResolvedValue(products.length),
      },
    } as any;

    const listResponse = await listProducts(listPrisma, { limit: "50" });
    expect(listResponse.items.length).toBeGreaterThan(0);

    for (const item of listResponse.items) {
      const detailPrisma = {
        product: {
          findFirst: vi.fn().mockResolvedValue(
            products.find((p) => p.slug === item.slug) ?? null
          ),
          findMany: vi.fn().mockResolvedValue([]),
        },
      } as any;

      const detail = await getProductDetail(detailPrisma, item.slug);

      expect(detail).not.toBeNull();
      expect(detail!.item.id).toBe(item.id);
      expect(detail!.item.slug).toBe(item.slug);
      expect(detail!.item.name).toBe(item.name);
      expect(detail!.item.price).toBe(item.price);
      expect(detail!.item.currency).toBe(item.currency);
    }
  });

  it("related products exclude the current product", async () => {
    const current = makeProduct({ id: 1, slug: "wireless-headset-pro", categoryId: 1 });
    const related = makeProduct({ id: 2, slug: "studio-monitors", categoryId: 1 });

    const prisma = {
      product: {
        findFirst: vi.fn().mockResolvedValue(current),
        findMany: vi.fn().mockResolvedValue([related]),
      },
    } as any;

    const result = await getProductDetail(prisma, "wireless-headset-pro");

    const relatedIds = result!.related.map((r) => r.id);
    expect(relatedIds).not.toContain(current.id);
  });
});

// ---------------------------------------------------------------------------
// 9.3  Non-goals: cart, authentication, and payments are not implemented
// ---------------------------------------------------------------------------

describe("non-goals: cart, authentication, and payments", () => {
  it("no cart API route file exists", async () => {
    const { existsSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const apiDir = resolve("pages/api");

    expect(existsSync(`${apiDir}/cart`)).toBe(false);
    expect(existsSync(`${apiDir}/cart.ts`)).toBe(false);
  });

  it("no authentication API route file exists", async () => {
    const { existsSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const apiDir = resolve("pages/api");

    expect(existsSync(`${apiDir}/auth`)).toBe(false);
    expect(existsSync(`${apiDir}/login.ts`)).toBe(false);
    expect(existsSync(`${apiDir}/register.ts`)).toBe(false);
  });

  it("no payments API route file exists", async () => {
    const { existsSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const apiDir = resolve("pages/api");

    expect(existsSync(`${apiDir}/payments`)).toBe(false);
    expect(existsSync(`${apiDir}/checkout.ts`)).toBe(false);
  });
});
