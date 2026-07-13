import type { NextApiRequest, NextApiResponse } from "next";

import { isAdminApiAuthorized, isAdminApiConfigured } from "../../../src/server/adminApiAuth";
import {
  getS3ImageStorageConfig,
  ImageUploadTooLargeError,
  ImageUploadValidationError,
  S3ImageConfigurationError,
  uploadImageToS3,
  type StoredImage,
} from "../../../src/server/s3ImageStorageService";

type ErrorBody = { error: string };
type ImageUploadResponse = { image: StoredImage };

type UploadDependencies = {
  writeApiKey: string | undefined;
  getConfigFn: typeof getS3ImageStorageConfig;
  uploadImageFn: typeof uploadImageToS3;
};

const defaultDependencies: UploadDependencies = {
  writeApiKey: process.env.PRODUCT_WRITE_API_KEY,
  getConfigFn: getS3ImageStorageConfig,
  uploadImageFn: uploadImageToS3,
};

function singleHeader(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function readBody(req: NextApiRequest, maximumBytes: number) {
  const contentLength = Number(singleHeader(req.headers["content-length"]));
  if (Number.isFinite(contentLength) && contentLength > maximumBytes) {
    throw new ImageUploadTooLargeError("Image exceeds maximum size");
  }

  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > maximumBytes) throw new ImageUploadTooLargeError("Image exceeds maximum size");
    chunks.push(buffer);
  }
  return Buffer.concat(chunks);
}

export async function handleImageUpload(
  req: NextApiRequest,
  res: NextApiResponse<ImageUploadResponse | ErrorBody>,
  dependencies: UploadDependencies = defaultDependencies,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!isAdminApiConfigured(dependencies.writeApiKey)) {
    return res.status(503).json({ error: "Image upload API is not configured" });
  }
  if (!isAdminApiAuthorized(req, dependencies.writeApiKey)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const config = dependencies.getConfigFn();
    const contentType = singleHeader(req.headers["content-type"]);
    const fileName = singleHeader(req.headers["x-file-name"]);
    if (!contentType || !fileName || fileName.trim().length === 0 || fileName.length > 255) {
      throw new ImageUploadValidationError("Image type and file name are required");
    }
    const body = await readBody(req, config.maximumBytes);
    const image = await dependencies.uploadImageFn({
      body,
      declaredContentType: contentType,
      originalFileName: fileName,
    }, { config });
    return res.status(201).json({ image });
  } catch (error) {
    if (error instanceof ImageUploadTooLargeError) {
      return res.status(413).json({ error: "Image exceeds the configured size limit" });
    }
    if (error instanceof ImageUploadValidationError) {
      return res.status(400).json({ error: "Invalid image upload" });
    }
    if (error instanceof S3ImageConfigurationError) {
      return res.status(503).json({ error: "Image upload API is not configured" });
    }
    return res.status(502).json({ error: "Image storage is temporarily unavailable" });
  }
}

export const config = {
  api: { bodyParser: false },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ImageUploadResponse | ErrorBody>,
) {
  return handleImageUpload(req, res);
}
