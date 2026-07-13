import { describe, expect, it, vi } from "vitest";

import { getHomepagePayload } from "../../src/server/homepageService";

describe("getHomepagePayload", () => {
  it("returns no discovery content when the active taxonomy has no published products", async () => {
    const prisma = {
      product: { findMany: vi.fn().mockResolvedValue([]) },
      category: { findMany: vi.fn().mockResolvedValue([]) },
    } as any;

    await expect(getHomepagePayload(prisma)).resolves.toEqual({
      featuredProducts: [],
      categories: [],
    });
  });

  it("queries featured products through the active hierarchy", async () => {
    const prisma = {
      product: { findMany: vi.fn().mockResolvedValue([]) },
      category: { findMany: vi.fn().mockResolvedValue([]) },
    } as any;

    await getHomepagePayload(prisma);

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          active: true,
          published: true,
          featured: true,
          productType: expect.objectContaining({ is: expect.any(Object) }),
        }),
        take: 8,
      })
    );
  });
});
