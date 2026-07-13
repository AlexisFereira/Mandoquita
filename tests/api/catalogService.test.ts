import { describe, expect, it, vi } from "vitest";

import { getProductDetail, listProducts, parseListQuery } from "../../src/server/catalogService";

function buildPrismaMock() {
  return {
    product: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  } as any;
}

describe("parseListQuery", () => {
  it("parses default pagination", () => {
    const parsed = parseListQuery({});
    expect(parsed.page).toBe(1);
    expect(parsed.limit).toBe(12);
  });

  it("throws for invalid pagination", () => {
    expect(() => parseListQuery({ page: "0", limit: "99" })).toThrowError();
  });
});

describe("listProducts", () => {
  it("applies category and text filters", async () => {
    const prisma = buildPrismaMock();
    prisma.product.findMany.mockResolvedValue([
      {
        id: 1,
        slug: "wireless-headset-pro",
        name: "Wireless Headset Pro",
        description: "Audio headset",
        price: { toString: () => "129.99" },
        currency: "USD",
        imageUrl: "https://images.example.com/wireless-headset-pro.jpg",
        active: true,
        editorialApproved: true,
        published: true,
        commerciallyAvailable: true,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: { id: 1, slug: "audio", name: "Audio" },
      },
    ]);
    prisma.product.count.mockResolvedValue(1);

    const response = await listProducts(prisma, {
      category: "audio",
      q: "headset",
      page: "1",
      limit: "10",
    });

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          published: true,
          category: { active: true, visible: true, slug: "audio" },
          name: { contains: "headset", mode: "insensitive" },
        }),
      })
    );

    expect(response.items).toHaveLength(1);
    expect(response.metadata.totalItems).toBe(1);
    expect(response.filters).toEqual({ category: "audio", q: "headset" });
  });
});

describe("getProductDetail", () => {
  it("returns item and related products for an active slug", async () => {
    const prisma = {
      product: {
        findFirst: vi.fn().mockResolvedValue({
          id: 1,
          slug: "wireless-headset-pro",
          name: "Wireless Headset Pro",
          description: "Audio headset",
          price: { toString: () => "129.99" },
          currency: "USD",
          imageUrl: "https://images.example.com/wireless-headset-pro.jpg",
          active: true,
          editorialApproved: true,
          published: true,
          commerciallyAvailable: true,
          categoryId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 1, slug: "audio", name: "Audio" },
        }),
        findMany: vi.fn().mockResolvedValue([
          {
            id: 2,
            slug: "audio-speakers",
            name: "Audio Speakers",
            description: "Speaker pair",
            price: { toString: () => "89.99" },
            currency: "USD",
            imageUrl: "https://images.example.com/audio-speakers.jpg",
            active: true,
            editorialApproved: true,
            published: true,
            commerciallyAvailable: true,
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            category: { id: 1, slug: "audio", name: "Audio" },
          },
        ]),
      },
    } as any;

    const response = await getProductDetail(prisma, "wireless-headset-pro");

    expect(response?.item.slug).toBe("wireless-headset-pro");
    expect(response?.related).toHaveLength(1);
    expect(prisma.product.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          slug: "wireless-headset-pro",
          published: true,
          category: { active: true, visible: true },
        },
      })
    );
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          published: true,
          categoryId: 1,
          id: { not: 1 },
        }),
      })
    );
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [
          { commerciallyAvailable: "desc" },
          { updatedAt: "desc" },
          { id: "asc" },
        ],
        take: 4,
      })
    );
  });

  it("returns unavailable for a missing or unpublished product", async () => {
    const prisma = {
      product: {
        findFirst: vi.fn().mockResolvedValue(null),
        findMany: vi.fn(),
      },
    } as any;

    const response = await getProductDetail(prisma, "unpublished-product");

    expect(response).toBeNull();
    expect(prisma.product.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ published: true }),
      })
    );
    expect(prisma.product.findMany).not.toHaveBeenCalled();
  });

  it("keeps a published inactive product publicly visible", async () => {
    const prisma = {
      product: {
        findFirst: vi.fn().mockResolvedValue({
          id: 3,
          slug: "published-inactive",
          name: "Published inactive",
          description: "Published product",
          price: { toString: () => "25.00" },
          currency: "USD",
          imageUrl: "",
          active: false,
          editorialApproved: true,
          published: true,
          commerciallyAvailable: true,
          featured: false,
          featuredOrder: null,
          categoryId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 1, slug: "audio", name: "Audio" },
        }),
        findMany: vi.fn().mockResolvedValue([]),
      },
    } as any;

    const response = await getProductDetail(prisma, "published-inactive");

    expect(response?.item.published).toBe(true);
    expect(response?.item.active).toBe(false);
    expect(response?.item.price).toBe("25.00");
  });

  it("does not expose price or currency without commercial availability", async () => {
    const prisma = {
      product: {
        findFirst: vi.fn().mockResolvedValue({
          id: 4,
          slug: "commercially-unavailable",
          name: "Commercially unavailable",
          description: "Published without a current offer",
          price: { toString: () => "99.00" },
          currency: "USD",
          imageUrl: "",
          active: true,
          editorialApproved: true,
          published: true,
          commerciallyAvailable: false,
          featured: false,
          featuredOrder: null,
          categoryId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 1, slug: "audio", name: "Audio" },
        }),
        findMany: vi.fn().mockResolvedValue([]),
      },
    } as any;

    const response = await getProductDetail(prisma, "commercially-unavailable");

    expect(response?.item.commerciallyAvailable).toBe(false);
    expect(response?.item.price).toBeNull();
    expect(response?.item.currency).toBeNull();
  });
});
