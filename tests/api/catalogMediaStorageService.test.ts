import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { describe, expect, it, vi } from "vitest";

import {
  CatalogMediaValidationError,
  deleteCatalogMediaObject,
  prepareCatalogImage,
  storeCatalogMedia,
} from "../../src/server/catalogMediaStorageService";

const config = {
  region: "us-east-1",
  bucket: "catalog-media-test",
  publicBaseUrl: "https://assets.example.test",
  imagePrefix: "images/products",
  maximumBytes: 5 * 1024 * 1024,
};

describe("Catalog media storage", () => {
  it("decodes, normalizes and strips metadata from an approved raster", async () => {
    const source = await sharp({ create: { width: 30, height: 20, channels: 3, background: "#d97706" } })
      .jpeg()
      .withMetadata({ orientation: 6 })
      .toBuffer();
    const prepared = await prepareCatalogImage(source, "image/jpeg", config.maximumBytes);
    const metadata = await sharp(prepared.body).metadata();

    expect(prepared).toMatchObject({ contentType: "image/jpeg", extension: "jpg", width: 20, height: 30 });
    expect(metadata.exif).toBeUndefined();
    expect(prepared.checksumSha256).toMatch(/^[a-f0-9]{64}$/);
  });

  it("rejects a declared type that disagrees with decoded content", async () => {
    const png = await sharp({ create: { width: 2, height: 2, channels: 4, background: "#0000" } }).png().toBuffer();
    await expect(prepareCatalogImage(png, "image/jpeg", config.maximumBytes)).rejects.toBeInstanceOf(CatalogMediaValidationError);
  });

  it("uses immutable non-overwriting Product and Category namespaces", async () => {
    const send = vi.fn().mockResolvedValue({});
    const image = await prepareCatalogImage(
      await sharp({ create: { width: 2, height: 2, channels: 3, background: "#fff" } }).png().toBuffer(),
      "image/png",
      config.maximumBytes,
    );
    const product = await storeCatalogMedia("PRODUCT", image, {
      config, client: { send }, now: new Date("2026-07-13T00:00:00Z"), uuid: "product-uuid",
    });
    const category = await storeCatalogMedia("CATEGORY", image, {
      config, client: { send }, now: new Date("2026-07-13T00:00:00Z"), uuid: "category-uuid",
    });

    expect(product.key).toBe("images/products/2026/07/product-uuid.png");
    expect(category.key).toBe("images/categories/2026/07/category-uuid.png");
    expect(send.mock.calls[0][0]).toBeInstanceOf(PutObjectCommand);
    expect(send.mock.calls[0][0].input).toMatchObject({ CacheControl: "public, max-age=31536000, immutable", ContentType: "image/png" });
  });

  it("deletes only objects inside approved namespaces", async () => {
    const send = vi.fn().mockResolvedValue({});
    await deleteCatalogMediaObject("images/products/2026/07/test.png", { config, client: { send } });
    expect(send.mock.calls[0][0]).toBeInstanceOf(DeleteObjectCommand);
    await expect(deleteCatalogMediaObject("private/test.png", { config, client: { send } })).rejects.toBeInstanceOf(CatalogMediaValidationError);
  });
});
