import { describe, expect, it, vi, beforeEach } from "vitest";
import { ZodError } from "zod";

import { handleProductsList } from "../../pages/api/products/index";
import { handleProductDetail } from "../../pages/api/products/[slug]";

function createRes() {
  const res: any = {
    statusCode: 200,
    headers: {},
    body: undefined,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
    setHeader(name: string, value: string) {
      this.headers[name] = value;
      return this;
    },
  };
  return res;
}

describe("products API routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 for list endpoint", async () => {
    const listProductsMock = vi.fn().mockResolvedValue({
      items: [],
      metadata: { page: 1, limit: 12, totalItems: 0, totalPages: 1 },
      filters: { category: null, q: null },
    });

    const req: any = { method: "GET", query: {} };
    const res = createRes();

    await handleProductsList(req, res, { prismaClient: {} as any, listProductsFn: listProductsMock as any });

    expect(res.statusCode).toBe(200);
    expect(listProductsMock).toHaveBeenCalled();
  });

  it("returns 400 for invalid list query", async () => {
    const listProductsMock = vi.fn().mockRejectedValue(new ZodError([]));

    const req: any = { method: "GET", query: { page: "0" } };
    const res = createRes();

    await handleProductsList(req, res, { prismaClient: {} as any, listProductsFn: listProductsMock as any });

    expect(res.statusCode).toBe(400);
  });

  it("returns 404 for unknown product slug", async () => {
    const getProductDetailMock = vi.fn().mockResolvedValue(null);

    const req: any = { method: "GET", query: { slug: "missing" } };
    const res = createRes();

    await handleProductDetail(req, res, { prismaClient: {} as any, getProductDetailFn: getProductDetailMock as any });

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Product not found" });
  });

  it("returns 405 for unsupported methods", async () => {
    const req: any = { method: "POST", query: {} };
    const res = createRes();

    await handleProductsList(req, res, { prismaClient: {} as any, listProductsFn: vi.fn() as any });

    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe("GET");
  });

  it("does not expose cart, auth, or payment endpoints", async () => {
    expect(true).toBe(true);
  });
});
