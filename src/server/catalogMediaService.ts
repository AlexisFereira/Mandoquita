import { createHash } from "node:crypto";

import { Prisma, type PrismaClient } from "@prisma/client";
import { z } from "zod";

import {
  prepareCatalogImage,
  storeCatalogMedia,
  deleteCatalogMediaObject,
  type CatalogMediaKind,
} from "./catalogMediaStorageService";
import { getS3ImageStorageConfig } from "./s3ImageStorageService";

const DAY_MS = 24 * 60 * 60 * 1000;
const RETENTION_MS = 7 * DAY_MS;
const genericAlternativeText = /^(?:image|imagen|photo|foto|picture|producto|product|categor[ií]a|category|sin descripci[oó]n|n\/a|test)$/i;
const idempotencyKeySchema = z.string().trim().regex(/^[A-Za-z0-9._:-]{8,100}$/);
const timestamp = z.string().datetime({ offset: true });
const alternativeText = z.string().trim().min(1).max(240).refine((value) => !genericAlternativeText.test(value), "Alternative text is too generic");

export class CatalogMediaNotFoundError extends Error {}
export class CatalogMediaConflictError extends Error {}
export class CatalogMediaRequestError extends Error {}

export type CatalogMediaMutationContext = {
  sessionId: string;
  sessionIdHash: string;
  requestId: string;
  idempotencyKey: string;
};

function sha256(value: string | Buffer) {
  return createHash("sha256").update(value).digest("hex");
}

export const catalogMediaOpaqueHash = (value: string) => sha256(value);

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function normalizedName(value: string) {
  return value.trim().toLowerCase().replace(/\.[^.]+$/, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function validateAltText(value: string, originalNameHash?: string) {
  const parsed = alternativeText.parse(value);
  if (originalNameHash && sha256(normalizedName(parsed)) === originalNameHash) {
    throw new CatalogMediaRequestError("Alternative text cannot be the filename");
  }
  return parsed;
}

function uploadView(upload: {
  id: string; deliveryUrl: string; contentType: string; size: number; width: number;
  height: number; checksumSha256: string; expiresAt: Date;
}) {
  return {
    id: upload.id,
    previewUrl: upload.deliveryUrl,
    contentType: upload.contentType,
    size: upload.size,
    width: upload.width,
    height: upload.height,
    checksumSha256: upload.checksumSha256,
    expiresAt: upload.expiresAt.toISOString(),
  };
}

export async function createCatalogMediaUpload(
  prisma: PrismaClient,
  input: {
    sessionId: string; kind: CatalogMediaKind; idempotencyKey: string; body: Buffer;
    declaredContentType: string; originalFileName: string; now?: Date;
  },
) {
  const key = idempotencyKeySchema.parse(input.idempotencyKey);
  const config = getS3ImageStorageConfig();
  const now = input.now ?? new Date();
  const requestHash = sha256(stable({
    kind: input.kind,
    contentType: input.declaredContentType.split(";", 1)[0].trim().toLowerCase(),
    body: sha256(input.body),
    originalName: sha256(normalizedName(input.originalFileName)),
  }));
  const idempotencyKeyHash = sha256(key);
  const existing = await prisma.catalogMediaUpload.findUnique({
    where: { sessionId_idempotencyKeyHash: { sessionId: input.sessionId, idempotencyKeyHash } },
  });
  if (existing) {
    if (existing.requestHash !== requestHash) throw new CatalogMediaConflictError("Idempotency key was reused");
    if (existing.status !== "READY" || existing.expiresAt <= now) throw new CatalogMediaConflictError("Upload is no longer reusable");
    return uploadView(existing);
  }

  const prepared = await prepareCatalogImage(input.body, input.declaredContentType, config.maximumBytes);
  const stored = await storeCatalogMedia(input.kind, prepared, { config, now });
  try {
    const upload = await prisma.catalogMediaUpload.create({ data: {
      sessionId: input.sessionId,
      kind: input.kind,
      idempotencyKeyHash,
      requestHash,
      objectKey: stored.key,
      deliveryUrl: stored.deliveryUrl,
      contentType: stored.contentType,
      size: stored.size,
      width: stored.width,
      height: stored.height,
      checksumSha256: stored.checksumSha256,
      originalNameHash: sha256(normalizedName(input.originalFileName)),
      expiresAt: new Date(now.getTime() + DAY_MS),
    } });
    return uploadView(upload);
  } catch (error) {
    await deleteCatalogMediaObject(stored.key, { config }).catch(() => undefined);
    throw error;
  }
}

export async function cancelCatalogMediaUpload(
  prisma: PrismaClient,
  sessionId: string,
  uploadId: string,
  now = new Date(),
) {
  return prisma.$transaction(async (tx) => {
    const upload = await tx.catalogMediaUpload.findFirst({ where: { id: uploadId, sessionId } });
    if (!upload) throw new CatalogMediaNotFoundError("Upload not found");
    if (upload.status === "CONSUMED") throw new CatalogMediaConflictError("Consumed upload cannot be cancelled");
    if (upload.status === "CANCELLED" || upload.status === "EXPIRED") return { cancelled: true };
    await tx.catalogMediaUpload.update({ where: { id: upload.id }, data: { status: "CANCELLED", cancelledAt: now } });
    await tx.catalogMediaObjectCleanup.upsert({
      where: { objectKey: upload.objectKey },
      create: { objectKey: upload.objectKey, deliveryUrl: upload.deliveryUrl, reason: "CANCELLED_UPLOAD", deleteAfter: now },
      update: { status: "PENDING", deleteAfter: now, reason: "CANCELLED_UPLOAD" },
    });
    return { cancelled: true };
  });
}

export async function getCatalogMediaUpload(prisma: PrismaClient, sessionId: string, uploadId: string, now = new Date()) {
  const upload = await prisma.catalogMediaUpload.findFirst({ where: { id: uploadId, sessionId } });
  if (!upload) throw new CatalogMediaNotFoundError("Upload not found");
  return {
    upload: uploadView(upload),
    status: upload.status === "READY" && upload.expiresAt <= now ? "EXPIRED" : upload.status,
    reusable: upload.status === "READY" && upload.expiresAt > now,
  };
}

function productImageView(image: {
  id: string; url: string; altText: string; position: number; isPrimary: boolean;
  contentType: string | null; width: number | null; height: number | null; size: number | null;
  checksum: string | null; updatedAt: Date; _count?: { variants: number };
}) {
  return {
    id: image.id,
    previewUrl: image.url,
    altText: image.altText,
    position: image.position,
    isPrimary: image.isPrimary,
    referencedByVariants: (image._count?.variants ?? 0) > 0,
    variantReferenceCount: image._count?.variants ?? 0,
    contentType: image.contentType,
    width: image.width,
    height: image.height,
    size: image.size,
    checksumSha256: image.checksum,
    updatedAt: image.updatedAt.toISOString(),
  };
}

const productImageInclude = { _count: { select: { variants: true } } } as const;

export async function getAdminProductMedia(prisma: PrismaClient | Prisma.TransactionClient, productId: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, slug: true, name: true, updatedAt: true, images: { include: productImageInclude, orderBy: [{ position: "asc" }, { id: "asc" }] } },
  });
  if (!product) throw new CatalogMediaNotFoundError("Product not found");
  return {
    product: { id: product.id, slug: product.slug, name: product.name, updatedAt: product.updatedAt.toISOString() },
    images: product.images.map(productImageView),
  };
}

async function readyUpload(
  tx: Prisma.TransactionClient,
  uploadId: string,
  sessionId: string,
  kind: CatalogMediaKind,
  now: Date,
) {
  const upload = await tx.catalogMediaUpload.findFirst({ where: { id: uploadId, sessionId, kind } });
  if (!upload) throw new CatalogMediaNotFoundError("Upload not found");
  if (upload.status !== "READY" || upload.expiresAt <= now) throw new CatalogMediaConflictError("Upload is unavailable");
  return upload;
}

async function consumeUpload(tx: Prisma.TransactionClient, uploadId: string, now: Date) {
  const consumed = await tx.catalogMediaUpload.updateMany({
    where: { id: uploadId, status: "READY", expiresAt: { gt: now } },
    data: { status: "CONSUMED", consumedAt: now },
  });
  if (consumed.count !== 1) throw new CatalogMediaConflictError("Upload was already consumed");
}

async function withIdempotency<T extends object>(
  prisma: PrismaClient,
  context: CatalogMediaMutationContext,
  operation: string,
  request: unknown,
  work: (tx: Prisma.TransactionClient, now: Date) => Promise<T>,
): Promise<T> {
  const keyHash = sha256(idempotencyKeySchema.parse(context.idempotencyKey));
  const requestHash = sha256(stable({ operation, request }));
  const existing = await prisma.catalogMediaIdempotency.findUnique({ where: { sessionId_keyHash: { sessionId: context.sessionId, keyHash } } });
  if (existing) {
    if (existing.requestHash !== requestHash || existing.operation !== operation) throw new CatalogMediaConflictError("Idempotency key was reused");
    return existing.response as T;
  }
  return prisma.$transaction(async (tx) => {
    const now = new Date();
    const response = await work(tx, now);
    await tx.catalogMediaIdempotency.create({ data: {
      sessionId: context.sessionId, keyHash, requestHash, operation,
      response: response as Prisma.InputJsonValue,
      expiresAt: new Date(now.getTime() + DAY_MS),
    } });
    return response;
  });
}

async function touchProduct(tx: Prisma.TransactionClient, productId: number, expected: string, now: Date) {
  const result = await tx.product.updateMany({ where: { id: productId, updatedAt: new Date(expected) }, data: { updatedAt: now } });
  if (result.count !== 1) {
    const exists = await tx.product.count({ where: { id: productId } });
    if (!exists) throw new CatalogMediaNotFoundError("Product not found");
    throw new CatalogMediaConflictError("Product changed since it was read");
  }
}

async function scheduleCleanup(
  tx: Prisma.TransactionClient,
  media: { objectKey: string | null; url: string },
  reason: "SUPERSEDED" | "REMOVED",
  restoreMetadata: Prisma.InputJsonValue,
  now: Date,
) {
  if (!media.objectKey) return;
  await tx.catalogMediaObjectCleanup.upsert({
    where: { objectKey: media.objectKey },
    create: { objectKey: media.objectKey, deliveryUrl: media.url, reason, restoreMetadata, deleteAfter: new Date(now.getTime() + RETENTION_MS) },
    update: { reason, restoreMetadata, status: "PENDING", deleteAfter: new Date(now.getTime() + RETENTION_MS) },
  });
}

function auditData(context: CatalogMediaMutationContext, data: {
  event: string; productId?: number; categoryId?: string; mediaId?: string; uploadId?: string;
  changedFields?: string[]; contentType?: string; size?: number; checksum?: string;
}) {
  return {
    requestId: context.requestId,
    event: data.event,
    outcome: "SUCCESS",
    sessionIdHash: context.sessionIdHash,
    productId: data.productId,
    categoryId: data.categoryId,
    mediaId: data.mediaId,
    mediaUploadHash: data.uploadId ? sha256(data.uploadId) : undefined,
    detectedType: data.contentType,
    encodedSize: data.size,
    checksumPrefix: data.checksum?.slice(0, 12),
    changedFields: data.changedFields,
  };
}

export const addProductImageSchema = z.object({
  expectedProductUpdatedAt: timestamp,
  uploadId: z.string().cuid(),
  altText: alternativeText,
  position: z.number().int().min(0),
  isPrimary: z.boolean().default(false),
}).strict();

export async function addProductImage(prisma: PrismaClient, productId: number, raw: unknown, context: CatalogMediaMutationContext) {
  const input = addProductImageSchema.parse(raw);
  return withIdempotency(prisma, context, "PRODUCT_IMAGE_ADD", { productId, ...input }, async (tx, now) => {
    const upload = await readyUpload(tx, input.uploadId, context.sessionId, "PRODUCT", now);
    const altText = validateAltText(input.altText, upload.originalNameHash);
    const current = await tx.product.findUnique({ where: { id: productId }, select: { updatedAt: true, images: { orderBy: { position: "asc" }, select: { id: true } } } });
    if (!current) throw new CatalogMediaNotFoundError("Product not found");
    if (current.updatedAt.toISOString() !== input.expectedProductUpdatedAt || input.position > current.images.length) {
      throw new CatalogMediaConflictError("Product media baseline conflicts");
    }
    await touchProduct(tx, productId, input.expectedProductUpdatedAt, now);
    await tx.$executeRaw`UPDATE "ProductImage" SET "position" = "position" + 1000000 WHERE "productId" = ${productId}`;
    if (input.isPrimary) await tx.productImage.updateMany({ where: { productId }, data: { isPrimary: false } });
    const image = await tx.productImage.create({ data: {
      productId, url: upload.deliveryUrl, objectKey: upload.objectKey, altText, position: input.position,
      isPrimary: input.isPrimary, contentType: upload.contentType, width: upload.width, height: upload.height,
      size: upload.size, checksum: upload.checksumSha256,
    } });
    for (let index = 0; index < current.images.length; index += 1) {
      const position = index >= input.position ? index + 1 : index;
      await tx.productImage.update({ where: { id: current.images[index].id }, data: { position } });
    }
    await consumeUpload(tx, upload.id, now);
    await tx.productAdminAuditEvent.create({ data: auditData(context, {
      event: "PRODUCT_IMAGE_ADD", productId, mediaId: image.id, uploadId: upload.id,
      changedFields: ["images"], contentType: upload.contentType, size: upload.size, checksum: upload.checksumSha256,
    }) });
    return getAdminProductMedia(tx, productId);
  });
}

const productImageChangeSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("metadata"), expectedProductUpdatedAt: timestamp, expectedImageUpdatedAt: timestamp, altText: alternativeText }).strict(),
  z.object({ action: z.literal("replace"), expectedProductUpdatedAt: timestamp, expectedImageUpdatedAt: timestamp, uploadId: z.string().cuid(), altText: alternativeText }).strict(),
]);

export async function changeProductImage(
  prisma: PrismaClient, productId: number, imageId: string, raw: unknown, context: CatalogMediaMutationContext,
) {
  const input = productImageChangeSchema.parse(raw);
  return withIdempotency(prisma, context, `PRODUCT_IMAGE_${input.action.toUpperCase()}`, { productId, imageId, ...input }, async (tx, now) => {
    const image = await tx.productImage.findFirst({ where: { id: imageId, productId }, include: productImageInclude });
    if (!image) throw new CatalogMediaNotFoundError("Product Image not found");
    await touchProduct(tx, productId, input.expectedProductUpdatedAt, now);
    let upload: Awaited<ReturnType<typeof readyUpload>> | undefined;
    let data: Prisma.ProductImageUpdateInput;
    if (input.action === "replace") {
      upload = await readyUpload(tx, input.uploadId, context.sessionId, "PRODUCT", now);
      data = {
        url: upload.deliveryUrl, objectKey: upload.objectKey, altText: validateAltText(input.altText, upload.originalNameHash),
        contentType: upload.contentType, width: upload.width, height: upload.height, size: upload.size, checksum: upload.checksumSha256,
      };
    } else data = { altText: validateAltText(input.altText) };
    const updated = await tx.productImage.updateMany({ where: { id: imageId, productId, updatedAt: new Date(input.expectedImageUpdatedAt) }, data });
    if (updated.count !== 1) throw new CatalogMediaConflictError("Product Image changed since it was read");
    if (upload) {
      await consumeUpload(tx, upload.id, now);
      await scheduleCleanup(tx, image, "SUPERSEDED", { kind: "PRODUCT", productId, imageId, ...productImageView(image) }, now);
    }
    await tx.productAdminAuditEvent.create({ data: auditData(context, {
      event: input.action === "replace" ? "PRODUCT_IMAGE_REPLACE" : "PRODUCT_IMAGE_METADATA",
      productId, mediaId: imageId, uploadId: upload?.id, changedFields: input.action === "replace" ? ["media", "altText"] : ["altText"],
      contentType: upload?.contentType, size: upload?.size, checksum: upload?.checksumSha256,
    }) });
    return getAdminProductMedia(tx, productId);
  });
}

const reorderProductImagesSchema = z.object({
  expectedProductUpdatedAt: timestamp,
  imageIds: z.array(z.string().cuid()),
  primaryImageId: z.string().cuid().nullable(),
}).strict().superRefine((value, context) => {
  if (new Set(value.imageIds).size !== value.imageIds.length) context.addIssue({ code: z.ZodIssueCode.custom, path: ["imageIds"], message: "Image IDs must be unique" });
  if (value.primaryImageId && !value.imageIds.includes(value.primaryImageId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["primaryImageId"], message: "Primary must be in the complete order" });
});

export async function reorderProductImages(prisma: PrismaClient, productId: number, raw: unknown, context: CatalogMediaMutationContext) {
  const input = reorderProductImagesSchema.parse(raw);
  return withIdempotency(prisma, context, "PRODUCT_IMAGES_ORDER_PRIMARY", { productId, ...input }, async (tx, now) => {
    const current = await tx.product.findUnique({ where: { id: productId }, select: { updatedAt: true, images: { select: { id: true } } } });
    if (!current) throw new CatalogMediaNotFoundError("Product not found");
    const actual = current.images.map(({ id }) => id).sort();
    const intended = [...input.imageIds].sort();
    if (actual.length !== intended.length || actual.some((id, index) => id !== intended[index])) throw new CatalogMediaConflictError("Complete Image order is stale");
    await touchProduct(tx, productId, input.expectedProductUpdatedAt, now);
    await tx.$executeRaw`UPDATE "ProductImage" SET "position" = "position" + 1000000, "isPrimary" = false WHERE "productId" = ${productId}`;
    for (let position = 0; position < input.imageIds.length; position += 1) {
      await tx.productImage.update({ where: { id: input.imageIds[position] }, data: { position, isPrimary: input.imageIds[position] === input.primaryImageId } });
    }
    await tx.productAdminAuditEvent.create({ data: auditData(context, {
      event: "PRODUCT_IMAGES_ORDER_PRIMARY", productId, changedFields: ["position", "isPrimary"],
    }) });
    return getAdminProductMedia(tx, productId);
  });
}

const removeProductImageSchema = z.object({ expectedProductUpdatedAt: timestamp, expectedImageUpdatedAt: timestamp }).strict();

export async function removeProductImage(
  prisma: PrismaClient, productId: number, imageId: string, raw: unknown, context: CatalogMediaMutationContext,
) {
  const input = removeProductImageSchema.parse(raw);
  return withIdempotency(prisma, context, "PRODUCT_IMAGE_REMOVE", { productId, imageId, ...input }, async (tx, now) => {
    const image = await tx.productImage.findFirst({ where: { id: imageId, productId }, include: productImageInclude });
    if (!image) throw new CatalogMediaNotFoundError("Product Image not found");
    if (image._count.variants > 0) throw new CatalogMediaConflictError("Product Image is referenced by a Variant");
    if (image.updatedAt.toISOString() !== input.expectedImageUpdatedAt) throw new CatalogMediaConflictError("Product Image changed since it was read");
    await touchProduct(tx, productId, input.expectedProductUpdatedAt, now);
    await tx.productImage.delete({ where: { id: imageId } });
    const remaining = await tx.productImage.findMany({ where: { productId }, orderBy: [{ position: "asc" }, { id: "asc" }], select: { id: true } });
    await tx.$executeRaw`UPDATE "ProductImage" SET "position" = "position" + 1000000 WHERE "productId" = ${productId}`;
    for (let position = 0; position < remaining.length; position += 1) {
      await tx.productImage.update({ where: { id: remaining[position].id }, data: { position } });
    }
    await scheduleCleanup(tx, image, "REMOVED", { kind: "PRODUCT", productId, imageId, ...productImageView(image) }, now);
    await tx.productAdminAuditEvent.create({ data: auditData(context, { event: "PRODUCT_IMAGE_REMOVE", productId, mediaId: imageId, changedFields: ["images"] }) });
    return getAdminProductMedia(tx, productId);
  });
}

function categoryView(category: {
  id: string; slug: string; name: string; active: boolean; visible: boolean; imagePath: string | null;
  imageAltText: string | null; imageContentType: string | null; imageWidth: number | null; imageHeight: number | null;
  imageSize: number | null; imageChecksum: string | null; updatedAt: Date;
}) {
  return {
    id: category.id, slug: category.slug, name: category.name, active: category.active, visible: category.visible,
    image: category.imagePath ? {
      previewUrl: category.imagePath, altText: category.imageAltText, contentType: category.imageContentType,
      width: category.imageWidth, height: category.imageHeight, size: category.imageSize,
      checksumSha256: category.imageChecksum,
    } : null,
    updatedAt: category.updatedAt.toISOString(),
  };
}

const categoryMediaSelect = {
  id: true, slug: true, name: true, active: true, visible: true, imagePath: true, imageAltText: true,
  imageObjectKey: true, imageContentType: true, imageWidth: true, imageHeight: true, imageSize: true,
  imageChecksum: true, updatedAt: true,
} as const;

export async function listAdminCategoryMedia(prisma: PrismaClient, q?: string) {
  const query = q?.trim();
  if (query && query.length > 160) throw new CatalogMediaRequestError("Search is too long");
  const items = await prisma.category.findMany({
    where: query ? { OR: [{ name: { contains: query, mode: "insensitive" } }, { slug: { contains: query, mode: "insensitive" } }] } : undefined,
    select: categoryMediaSelect,
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });
  return { items: items.map(categoryView) };
}

export async function getAdminCategoryMedia(prisma: PrismaClient | Prisma.TransactionClient, categoryId: string) {
  const category = await prisma.category.findUnique({ where: { id: categoryId }, select: categoryMediaSelect });
  if (!category) throw new CatalogMediaNotFoundError("Category not found");
  return { category: categoryView(category) };
}

const categoryAddSchema = z.object({ expectedCategoryUpdatedAt: timestamp, uploadId: z.string().cuid(), altText: alternativeText }).strict();
const categoryChangeSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("metadata"), expectedCategoryUpdatedAt: timestamp, altText: alternativeText }).strict(),
  z.object({ action: z.literal("replace"), expectedCategoryUpdatedAt: timestamp, uploadId: z.string().cuid(), altText: alternativeText }).strict(),
]);
const categoryRemoveSchema = z.object({ expectedCategoryUpdatedAt: timestamp }).strict();

async function changeCategoryMedia(
  prisma: PrismaClient,
  categoryId: string,
  raw: unknown,
  context: CatalogMediaMutationContext,
  operation: "add" | "change" | "remove",
) {
  const input = operation === "add" ? categoryAddSchema.parse(raw)
    : operation === "change" ? categoryChangeSchema.parse(raw)
    : categoryRemoveSchema.parse(raw);
  return withIdempotency(prisma, context, `CATEGORY_IMAGE_${operation.toUpperCase()}`, { categoryId, ...input }, async (tx, now) => {
    const category = await tx.category.findUnique({ where: { id: categoryId }, select: categoryMediaSelect });
    if (!category) throw new CatalogMediaNotFoundError("Category not found");
    const expected = input.expectedCategoryUpdatedAt;
    if (category.updatedAt.toISOString() !== expected) throw new CatalogMediaConflictError("Category changed since it was read");
    if (operation === "add" && category.imagePath) throw new CatalogMediaConflictError("Category already has an Image");
    if ((operation === "change" || operation === "remove") && !category.imagePath) throw new CatalogMediaConflictError("Category has no Image");

    let upload: Awaited<ReturnType<typeof readyUpload>> | undefined;
    let data: Prisma.CategoryUpdateManyMutationInput;
    if (operation === "remove") {
      data = { imagePath: null, imageAltText: null, imageObjectKey: null, imageContentType: null, imageWidth: null, imageHeight: null, imageSize: null, imageChecksum: null };
    } else if ("uploadId" in input && typeof input.uploadId === "string" && "altText" in input && typeof input.altText === "string") {
      upload = await readyUpload(tx, input.uploadId, context.sessionId, "CATEGORY", now);
      data = {
        imagePath: upload.deliveryUrl, imageAltText: validateAltText(input.altText, upload.originalNameHash), imageObjectKey: upload.objectKey,
        imageContentType: upload.contentType, imageWidth: upload.width, imageHeight: upload.height,
        imageSize: upload.size, imageChecksum: upload.checksumSha256,
      };
    } else if ("altText" in input && typeof input.altText === "string") {
      data = { imageAltText: validateAltText(input.altText) };
    } else {
      throw new CatalogMediaRequestError("Invalid Category media change");
    }
    const updated = await tx.category.updateMany({ where: { id: categoryId, updatedAt: new Date(expected) }, data });
    if (updated.count !== 1) throw new CatalogMediaConflictError("Category changed since it was read");
    if (upload) await consumeUpload(tx, upload.id, now);
    if (category.imagePath && (operation === "remove" || upload)) {
      await scheduleCleanup(tx, { objectKey: category.imageObjectKey, url: category.imagePath }, operation === "remove" ? "REMOVED" : "SUPERSEDED", {
        kind: "CATEGORY", categoryId, image: categoryView(category).image,
      }, now);
    }
    await tx.productAdminAuditEvent.create({ data: auditData(context, {
      event: `CATEGORY_IMAGE_${operation.toUpperCase()}`, categoryId, mediaId: categoryId, uploadId: upload?.id,
      changedFields: operation === "remove" ? ["image"] : upload ? ["image", "altText"] : ["altText"],
      contentType: upload?.contentType, size: upload?.size, checksum: upload?.checksumSha256,
    }) });
    return getAdminCategoryMedia(tx, categoryId);
  });
}

export const addCategoryImage = (prisma: PrismaClient, categoryId: string, raw: unknown, context: CatalogMediaMutationContext) =>
  changeCategoryMedia(prisma, categoryId, raw, context, "add");
export const updateCategoryImage = (prisma: PrismaClient, categoryId: string, raw: unknown, context: CatalogMediaMutationContext) =>
  changeCategoryMedia(prisma, categoryId, raw, context, "change");
export const removeCategoryImage = (prisma: PrismaClient, categoryId: string, raw: unknown, context: CatalogMediaMutationContext) =>
  changeCategoryMedia(prisma, categoryId, raw, context, "remove");

export async function cleanupCatalogMedia(prisma: PrismaClient, now = new Date(), limit = 100) {
  let expiredUploadCount = 0;
  await prisma.$transaction(async (tx) => {
    const expired = await tx.catalogMediaUpload.findMany({ where: { status: "READY", expiresAt: { lte: now } }, take: limit });
    expiredUploadCount = expired.length;
    for (const upload of expired) {
      await tx.catalogMediaUpload.update({ where: { id: upload.id }, data: { status: "EXPIRED" } });
      await tx.catalogMediaObjectCleanup.upsert({
        where: { objectKey: upload.objectKey },
        create: { objectKey: upload.objectKey, deliveryUrl: upload.deliveryUrl, reason: "EXPIRED_UPLOAD", deleteAfter: now },
        update: { reason: "EXPIRED_UPLOAD", status: "PENDING", deleteAfter: now },
      });
    }
  });
  const due = await prisma.catalogMediaObjectCleanup.findMany({ where: { status: { in: ["PENDING", "FAILED"] }, deleteAfter: { lte: now } }, orderBy: { deleteAfter: "asc" }, take: limit });
  let deleted = 0;
  for (const item of due) {
    try {
      await deleteCatalogMediaObject(item.objectKey);
      await prisma.catalogMediaObjectCleanup.update({ where: { id: item.id }, data: { status: "DELETED", deletedAt: now, attempts: { increment: 1 }, lastErrorCode: null } });
      deleted += 1;
    } catch (error) {
      const code = typeof (error as { name?: unknown }).name === "string" ? (error as { name: string }).name.slice(0, 100) : "STORAGE_ERROR";
      await prisma.catalogMediaObjectCleanup.update({ where: { id: item.id }, data: { status: "FAILED", attempts: { increment: 1 }, lastErrorCode: code } });
    }
  }
  await prisma.catalogMediaIdempotency.deleteMany({ where: { expiresAt: { lte: now } } });
  return { expiredUploads: expiredUploadCount, deleted };
}
