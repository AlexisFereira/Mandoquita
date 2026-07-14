import { createHash, randomUUID } from "node:crypto";

import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

import {
  createS3Client,
  getS3ImageStorageConfig,
  type S3ImageStorageConfig,
} from "./s3ImageStorageService";

const MAX_PIXELS = 40_000_000;
const MAX_EDGE = 12_000;
const MIME_BY_FORMAT = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
} as const;

export type CatalogMediaKind = "PRODUCT" | "CATEGORY";
export type PreparedCatalogImage = {
  body: Buffer;
  contentType: (typeof MIME_BY_FORMAT)[keyof typeof MIME_BY_FORMAT];
  extension: "jpg" | "png" | "webp" | "avif";
  width: number;
  height: number;
  size: number;
  checksumSha256: string;
};
export type StoredCatalogMedia = PreparedCatalogImage & { key: string; deliveryUrl: string };

type StorageSender = { send(command: PutObjectCommand | DeleteObjectCommand): Promise<unknown> };

export class CatalogMediaValidationError extends Error {}
export class CatalogMediaTooLargeError extends Error {}

function declaredMime(value: string) {
  const normalized = value.split(";", 1)[0].trim().toLowerCase();
  return normalized === "image/jpg" ? "image/jpeg" : normalized;
}

export async function prepareCatalogImage(
  body: Buffer,
  declaredContentType: string,
  maximumBytes: number,
): Promise<PreparedCatalogImage> {
  if (body.length === 0) throw new CatalogMediaValidationError("Image is empty");
  if (body.length > maximumBytes) throw new CatalogMediaTooLargeError("Image exceeds maximum size");
  try {
    const decoder = sharp(body, { animated: false, limitInputPixels: MAX_PIXELS, failOn: "warning" });
    const metadata = await decoder.metadata();
    const format = metadata.format as keyof typeof MIME_BY_FORMAT | undefined;
    const contentType = format ? MIME_BY_FORMAT[format] : undefined;
    if (!format || !contentType) throw new CatalogMediaValidationError("Unsupported raster format");
    if (declaredMime(declaredContentType) !== contentType) {
      throw new CatalogMediaValidationError("Declared image type does not match decoded content");
    }
    if ((metadata.pages ?? 1) !== 1) throw new CatalogMediaValidationError("Animated images are not supported");

    const pipeline = decoder.rotate();
    const output = format === "jpeg" ? pipeline.jpeg({ quality: 90, mozjpeg: true })
      : format === "png" ? pipeline.png({ compressionLevel: 9 })
      : format === "webp" ? pipeline.webp({ quality: 90 })
      : pipeline.avif({ quality: 80 });
    const result = await output.toBuffer({ resolveWithObject: true });
    const { width, height } = result.info;
    if (!width || !height || width > MAX_EDGE || height > MAX_EDGE || width * height > MAX_PIXELS) {
      throw new CatalogMediaValidationError("Image dimensions exceed the approved limit");
    }
    if (result.data.length > maximumBytes) throw new CatalogMediaTooLargeError("Processed image exceeds maximum size");
    return {
      body: result.data,
      contentType,
      extension: format === "jpeg" ? "jpg" : format,
      width,
      height,
      size: result.data.length,
      checksumSha256: createHash("sha256").update(result.data).digest("hex"),
    };
  } catch (error) {
    if (error instanceof CatalogMediaValidationError || error instanceof CatalogMediaTooLargeError) throw error;
    throw new CatalogMediaValidationError("Image cannot be decoded safely");
  }
}

export async function storeCatalogMedia(
  kind: CatalogMediaKind,
  image: PreparedCatalogImage,
  dependencies: {
    config?: S3ImageStorageConfig;
    client?: StorageSender;
    now?: Date;
    uuid?: string;
    categoryPrefix?: string;
  } = {},
): Promise<StoredCatalogMedia> {
  const config = dependencies.config ?? getS3ImageStorageConfig();
  const now = dependencies.now ?? new Date();
  const prefix = kind === "PRODUCT"
    ? config.imagePrefix
    : dependencies.categoryPrefix ?? process.env.AWS_S3_CATEGORY_IMAGE_PREFIX ?? "images/categories";
  if (!/^[a-z0-9]+(?:[a-z0-9/_-]*[a-z0-9])?$/.test(prefix)) {
    throw new CatalogMediaValidationError("Invalid storage namespace");
  }
  const key = `${prefix}/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${dependencies.uuid ?? randomUUID()}.${image.extension}`;
  const client = dependencies.client ?? createS3Client(config);
  await client.send(new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    Body: image.body,
    ContentType: image.contentType,
    ContentDisposition: "inline",
    CacheControl: "public, max-age=31536000, immutable",
    ChecksumSHA256: Buffer.from(image.checksumSha256, "hex").toString("base64"),
    ServerSideEncryption: config.kmsKeyId ? "aws:kms" : "AES256",
    ...(config.kmsKeyId ? { SSEKMSKeyId: config.kmsKeyId } : {}),
  }));
  return { ...image, key, deliveryUrl: `${config.publicBaseUrl}/${key}` };
}

export async function deleteCatalogMediaObject(
  objectKey: string,
  dependencies: { config?: S3ImageStorageConfig; client?: StorageSender } = {},
) {
  const config = dependencies.config ?? getS3ImageStorageConfig();
  const allowed = [config.imagePrefix, process.env.AWS_S3_CATEGORY_IMAGE_PREFIX ?? "images/categories"];
  if (!allowed.some((prefix) => objectKey.startsWith(`${prefix}/`))) {
    throw new CatalogMediaValidationError("Object is outside approved namespaces");
  }
  const client = dependencies.client ?? createS3Client(config);
  await client.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: objectKey }));
}
