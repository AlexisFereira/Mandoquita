import { describe, expect, it, vi } from "vitest";

import { handleImageUpload } from "../../pages/api/internal/images";
import type { S3ImageStorageConfig } from "../../src/server/s3ImageStorageService";

const apiKey = "test-product-write-api-key-32-characters";
const storageConfig: S3ImageStorageConfig = {
  region: "us-east-1",
  bucket: "mandoquita-images",
  publicBaseUrl: "https://cdn.example.com",
  imagePrefix: "images/products",
  maximumBytes: 1024,
};
const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function createRes() {
  return {
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: undefined as unknown,
    status(code: number) { this.statusCode = code; return this; },
    json(payload: unknown) { this.body = payload; return this; },
    setHeader(name: string, value: string) { this.headers[name] = value; return this; },
  } as any;
}

function request(body = png, overrides: Record<string, unknown> = {}) {
  return {
    method: "POST",
    headers: {
      "x-admin-api-key": apiKey,
      "content-type": "image/png",
      "content-length": String(body.length),
      "x-file-name": "product.png",
    },
    async *[Symbol.asyncIterator]() { yield body; },
    ...overrides,
  } as any;
}

function dependencies(uploadImageFn = vi.fn().mockResolvedValue({
  key: "images/products/image.png",
  url: "https://cdn.example.com/images/products/image.png",
  contentType: "image/png",
  size: png.length,
  checksumSha256: "a".repeat(64),
})) {
  return {
    writeApiKey: apiKey,
    getConfigFn: vi.fn().mockReturnValue(storageConfig),
    uploadImageFn: uploadImageFn as any,
  };
}

describe("POST /api/internal/images", () => {
  it("uploads a raw authenticated image and returns 201", async () => {
    const upload = vi.fn().mockResolvedValue({ key: "key.png", url: "https://cdn/key.png" });
    const res = createRes();
    await handleImageUpload(request(), res, dependencies(upload));
    expect(res.statusCode).toBe(201);
    expect(upload).toHaveBeenCalledWith({
      body: png,
      declaredContentType: "image/png",
      originalFileName: "product.png",
    }, { config: storageConfig });
  });

  it("rejects unauthorized upload before reading configuration or body", async () => {
    const deps = dependencies();
    const res = createRes();
    await handleImageUpload(request(png, { headers: {} }), res, deps);
    expect(res.statusCode).toBe(401);
    expect(deps.getConfigFn).not.toHaveBeenCalled();
    expect(deps.uploadImageFn).not.toHaveBeenCalled();
  });

  it("returns 413 when content length exceeds the configured limit", async () => {
    const deps = dependencies();
    const res = createRes();
    await handleImageUpload(request(png, {
      headers: {
        "x-admin-api-key": apiKey,
        "content-type": "image/png",
        "content-length": "1025",
        "x-file-name": "large.png",
      },
    }), res, deps);
    expect(res.statusCode).toBe(413);
    expect(deps.uploadImageFn).not.toHaveBeenCalled();
  });

  it("requires content type and original file name", async () => {
    const deps = dependencies();
    const res = createRes();
    await handleImageUpload(request(png, {
      headers: { "x-admin-api-key": apiKey, "content-length": String(png.length) },
    }), res, deps);
    expect(res.statusCode).toBe(400);
    expect(deps.uploadImageFn).not.toHaveBeenCalled();
  });

  it("allows POST only", async () => {
    const res = createRes();
    await handleImageUpload(request(png, { method: "GET" }), res, dependencies());
    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe("POST");
  });
});
