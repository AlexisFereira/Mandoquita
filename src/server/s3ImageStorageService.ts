import { createHash, randomUUID } from "node:crypto";

import { PutObjectCommand, S3Client, type PutObjectCommandInput } from "@aws-sdk/client-s3";
import { z } from "zod";

const storageConfigSchema = z.object({
  region: z.string().trim().min(1),
  bucket: z.string().trim().min(3).max(63),
  publicBaseUrl: z.string().url().transform((value) => value.replace(/\/+$/, "")),
  imagePrefix: z.string().trim().regex(/^[a-z0-9]+(?:[a-z0-9/_-]*[a-z0-9])?$/).default("images/products"),
  maximumBytes: z.coerce.number().int().min(1).max(20 * 1024 * 1024).default(5 * 1024 * 1024),
  kmsKeyId: z.string().trim().min(1).optional(),
});

export type S3ImageStorageConfig = z.output<typeof storageConfigSchema>;
export type ImageUploadInput = {
  body: Buffer;
  declaredContentType: string;
  originalFileName: string;
};
export type StoredImage = {
  key: string;
  url: string;
  contentType: "image/jpeg" | "image/png" | "image/webp" | "image/avif";
  size: number;
  checksumSha256: string;
};

type S3Sender = { send(command: PutObjectCommand): Promise<unknown> };

export class S3ImageConfigurationError extends Error {}
export class ImageUploadValidationError extends Error {}
export class ImageUploadTooLargeError extends Error {}

export function getS3ImageStorageConfig(
  environment: Record<string, string | undefined> = process.env,
): S3ImageStorageConfig {
  const result = storageConfigSchema.safeParse({
    region: environment.AWS_REGION,
    bucket: environment.AWS_S3_BUCKET,
    publicBaseUrl: environment.AWS_S3_PUBLIC_BASE_URL,
    imagePrefix: environment.AWS_S3_IMAGE_PREFIX || undefined,
    maximumBytes: environment.AWS_S3_IMAGE_MAX_BYTES || undefined,
    kmsKeyId: environment.AWS_S3_KMS_KEY_ID || undefined,
  });
  if (!result.success) throw new S3ImageConfigurationError("S3 image storage is not configured");
  return result.data;
}

function detectedImage(body: Buffer): { contentType: StoredImage["contentType"]; extension: string } | null {
  if (body.length >= 3 && body[0] === 0xff && body[1] === 0xd8 && body[2] === 0xff) {
    return { contentType: "image/jpeg", extension: "jpg" };
  }
  if (body.length >= 8 && body.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { contentType: "image/png", extension: "png" };
  }
  if (body.length >= 12 && body.toString("ascii", 0, 4) === "RIFF" && body.toString("ascii", 8, 12) === "WEBP") {
    return { contentType: "image/webp", extension: "webp" };
  }
  if (body.length >= 12 && body.toString("ascii", 4, 8) === "ftyp") {
    const brand = body.toString("ascii", 8, 12);
    if (brand === "avif" || brand === "avis") return { contentType: "image/avif", extension: "avif" };
  }
  return null;
}

function normalizedDeclaredType(value: string) {
  const type = value.split(";", 1)[0].trim().toLowerCase();
  return type === "image/jpg" ? "image/jpeg" : type;
}

function safeFileName(value: string, extension: string) {
  const base = value.trim().replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);
  const withoutExtension = base.replace(/\.[^.]+$/, "") || "image";
  return `${withoutExtension}.${extension}`;
}

export async function uploadImageToS3(
  input: ImageUploadInput,
  dependencies?: { config?: S3ImageStorageConfig; client?: S3Sender; now?: Date; uuid?: string },
): Promise<StoredImage> {
  const config = dependencies?.config ?? getS3ImageStorageConfig();
  if (input.body.length === 0) throw new ImageUploadValidationError("Image is empty");
  if (input.body.length > config.maximumBytes) throw new ImageUploadTooLargeError("Image exceeds maximum size");

  const image = detectedImage(input.body);
  if (!image) throw new ImageUploadValidationError("Unsupported or invalid image content");
  if (normalizedDeclaredType(input.declaredContentType) !== image.contentType) {
    throw new ImageUploadValidationError("Declared image type does not match its content");
  }

  const date = dependencies?.now ?? new Date();
  const uuid = dependencies?.uuid ?? randomUUID();
  const key = [
    config.imagePrefix,
    String(date.getUTCFullYear()),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    `${uuid}.${image.extension}`,
  ].join("/");
  const checksum = createHash("sha256").update(input.body).digest();
  const fileName = safeFileName(input.originalFileName, image.extension);
  const putInput: PutObjectCommandInput = {
    Bucket: config.bucket,
    Key: key,
    Body: input.body,
    ContentType: image.contentType,
    ContentDisposition: `inline; filename="${fileName}"`,
    CacheControl: "public, max-age=31536000, immutable",
    ChecksumSHA256: checksum.toString("base64"),
    ServerSideEncryption: config.kmsKeyId ? "aws:kms" : "AES256",
    ...(config.kmsKeyId ? { SSEKMSKeyId: config.kmsKeyId } : {}),
  };
  const client = dependencies?.client ?? new S3Client({ region: config.region });
  await client.send(new PutObjectCommand(putInput));

  return {
    key,
    url: `${config.publicBaseUrl}/${key}`,
    contentType: image.contentType,
    size: input.body.length,
    checksumSha256: checksum.toString("hex"),
  };
}
