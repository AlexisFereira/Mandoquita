import { describe, expect, it, vi } from "vitest";

import {
  getS3ImageStorageConfig,
  ImageUploadTooLargeError,
  ImageUploadValidationError,
  S3ImageConfigurationError,
  uploadImageToS3,
  type S3ImageStorageConfig,
} from "../../src/server/s3ImageStorageService";

const config: S3ImageStorageConfig = {
  region: "us-east-1",
  bucket: "mandoquita-images",
  publicBaseUrl: "https://cdn.example.com",
  imagePrefix: "images/products",
  maximumBytes: 1024,
};

const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]);

describe("S3 image storage", () => {
  it("loads required configuration and default limits from environment", () => {
    expect(getS3ImageStorageConfig({
      AWS_REGION: "us-east-1",
      AWS_S3_BUCKET: "mandoquita-images",
      AWS_S3_PUBLIC_BASE_URL: "https://cdn.example.com/",
    })).toEqual({
      region: "us-east-1",
      bucket: "mandoquita-images",
      publicBaseUrl: "https://cdn.example.com",
      imagePrefix: "images/products",
      maximumBytes: 5 * 1024 * 1024,
    });
    expect(() => getS3ImageStorageConfig({}))
      .toThrow(S3ImageConfigurationError);
  });

  it("uploads a validated image with unique key, checksum, caching and encryption", async () => {
    const client = { send: vi.fn().mockResolvedValue({}) };
    const result = await uploadImageToS3({
      body: png,
      declaredContentType: "image/png",
      originalFileName: "Camiseta ácida.png",
    }, {
      config,
      client,
      now: new Date("2026-07-13T12:00:00.000Z"),
      uuid: "11111111-2222-4333-8444-555555555555",
    });

    expect(result).toMatchObject({
      key: "images/products/2026/07/11111111-2222-4333-8444-555555555555.png",
      url: "https://cdn.example.com/images/products/2026/07/11111111-2222-4333-8444-555555555555.png",
      contentType: "image/png",
      size: png.length,
    });
    expect(result.checksumSha256).toMatch(/^[a-f0-9]{64}$/);
    const command = client.send.mock.calls[0][0];
    expect(command.input).toMatchObject({
      Bucket: "mandoquita-images",
      Key: result.key,
      ContentType: "image/png",
      CacheControl: "public, max-age=31536000, immutable",
      ServerSideEncryption: "AES256",
    });
    expect(command.input.ChecksumSHA256).toBeTypeOf("string");
  });

  it("uses KMS when a key is configured", async () => {
    const client = { send: vi.fn().mockResolvedValue({}) };
    await uploadImageToS3({ body: png, declaredContentType: "image/png", originalFileName: "image.png" }, {
      config: { ...config, kmsKeyId: "alias/mandoquita-images" },
      client,
      uuid: "11111111-2222-4333-8444-555555555555",
    });
    expect(client.send.mock.calls[0][0].input).toMatchObject({
      ServerSideEncryption: "aws:kms",
      SSEKMSKeyId: "alias/mandoquita-images",
    });
  });

  it("rejects spoofed, unsupported and oversized files before S3 access", async () => {
    const client = { send: vi.fn() };
    await expect(uploadImageToS3({
      body: png,
      declaredContentType: "image/jpeg",
      originalFileName: "spoof.jpg",
    }, { config, client })).rejects.toBeInstanceOf(ImageUploadValidationError);
    await expect(uploadImageToS3({
      body: Buffer.from("<svg></svg>"),
      declaredContentType: "image/svg+xml",
      originalFileName: "unsafe.svg",
    }, { config, client })).rejects.toBeInstanceOf(ImageUploadValidationError);
    await expect(uploadImageToS3({
      body: Buffer.alloc(1025, 1),
      declaredContentType: "image/png",
      originalFileName: "large.png",
    }, { config, client })).rejects.toBeInstanceOf(ImageUploadTooLargeError);
    expect(client.send).not.toHaveBeenCalled();
  });
});
