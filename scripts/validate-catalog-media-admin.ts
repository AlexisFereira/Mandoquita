import { randomBytes } from "node:crypto";

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";

import {
  addCategoryImage,
  addProductImage,
  CatalogMediaConflictError,
  changeProductImage,
  cleanupCatalogMedia,
  createCatalogMediaUpload,
  getAdminProductMedia,
  removeCategoryImage,
  removeProductImage,
  reorderProductImages,
  updateCategoryImage,
} from "../src/server/catalogMediaService";
import { deleteCatalogMediaObject } from "../src/server/catalogMediaStorageService";

const prisma = new PrismaClient();
const runId = `cma-${Date.now()}`;
const objectKeys = new Set<string>();
const sessionId = `${runId}-session`;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function p95(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.ceil(sorted.length * 0.95) - 1];
}

function context(operation: string) {
  return {
    sessionId,
    sessionIdHash: randomBytes(32).toString("hex"),
    requestId: `${runId}-${operation}`,
    idempotencyKey: `${runId}-${operation}`,
  };
}

async function upload(kind: "PRODUCT" | "CATEGORY", suffix: string, color: string) {
  const body = await sharp({ create: { width: 24, height: 16, channels: 3, background: color } })
    .jpeg()
    .withMetadata({ orientation: 6 })
    .toBuffer();
  const result = await createCatalogMediaUpload(prisma, {
    sessionId,
    kind,
    idempotencyKey: `${runId}-upload-${suffix}`,
    body,
    declaredContentType: "image/jpeg",
    originalFileName: `${suffix}.jpg`,
  });
  const record = await prisma.catalogMediaUpload.findUniqueOrThrow({ where: { id: result.id } });
  objectKeys.add(record.objectKey);
  assert(result.width === 16 && result.height === 24, "Orientation normalization/dimensions failed");
  return result;
}

async function main() {
  const now = new Date();
  await prisma.productAdminSession.create({ data: {
    id: sessionId,
    tokenHash: randomBytes(32).toString("hex"),
    csrfHash: randomBytes(32).toString("hex"),
    credentialFingerprint: randomBytes(32).toString("hex"),
    idleExpiresAt: new Date(now.getTime() + 30 * 60_000),
    absoluteExpiresAt: new Date(now.getTime() + 8 * 60 * 60_000),
  } });
  const version = await prisma.taxonomyVersion.create({ data: {
    id: `${runId}-version`, version: runId, locale: "es-CO", status: "PROPOSED",
  } });
  const category = await prisma.category.create({ data: {
    id: `${runId}-category`, slug: `${runId}-category`, name: `${runId} Category`,
    sortOrder: 1, versionId: version.id,
  } });
  const product = await prisma.product.create({ data: {
    slug: `${runId}-product`, name: `${runId} Product`, price: 10,
    active: false, editorialApproved: false, published: false,
  } });

  const upload1 = await upload("PRODUCT", "product-one", "#b45309");
  let gallery = await addProductImage(prisma, product.id, {
    expectedProductUpdatedAt: product.updatedAt.toISOString(), uploadId: upload1.id,
    altText: "Vista frontal del producto de validación", position: 0, isPrimary: false,
  }, context("product-add-one"));
  const firstImageId = gallery.images[0].id;
  const repeated = await addProductImage(prisma, product.id, {
    expectedProductUpdatedAt: product.updatedAt.toISOString(), uploadId: upload1.id,
    altText: "Vista frontal del producto de validación", position: 0, isPrimary: false,
  }, context("product-add-one"));
  assert(repeated.images.length === 1, "Idempotent Product association duplicated an Image");

  const upload2 = await upload("PRODUCT", "product-two", "#2563eb");
  gallery = await addProductImage(prisma, product.id, {
    expectedProductUpdatedAt: gallery.product.updatedAt, uploadId: upload2.id,
    altText: "Vista posterior del producto de validación", position: 1, isPrimary: true,
  }, context("product-add-two"));
  const secondImageId = gallery.images.find((item) => item.id !== firstImageId)!.id;

  let staleRejected = false;
  try {
    await reorderProductImages(prisma, product.id, {
      expectedProductUpdatedAt: product.updatedAt.toISOString(),
      imageIds: [firstImageId, secondImageId], primaryImageId: null,
    }, context("stale-order"));
  } catch (error) { staleRejected = error instanceof CatalogMediaConflictError; }
  assert(staleRejected, "Stale Product media change was accepted");

  gallery = await reorderProductImages(prisma, product.id, {
    expectedProductUpdatedAt: gallery.product.updatedAt,
    imageIds: [secondImageId, firstImageId], primaryImageId: firstImageId,
  }, context("order-primary"));
  assert(gallery.images[0].id === secondImageId && gallery.images[1].isPrimary, "Atomic order/Primary failed");

  const upload3 = await upload("PRODUCT", "product-replacement", "#15803d");
  const beforeReplacement = gallery.images.find((item) => item.id === firstImageId)!;
  gallery = await changeProductImage(prisma, product.id, firstImageId, {
    action: "replace", expectedProductUpdatedAt: gallery.product.updatedAt,
    expectedImageUpdatedAt: beforeReplacement.updatedAt, uploadId: upload3.id,
    altText: "Nueva vista frontal del producto de validación",
  }, context("replace"));
  const afterReplacement = gallery.images.find((item) => item.id === firstImageId)!;
  assert(afterReplacement.id === firstImageId && afterReplacement.position === beforeReplacement.position && afterReplacement.isPrimary, "Replacement changed stable Product Image identity/state");

  const variant = await prisma.productVariant.create({ data: {
    productId: product.id, sku: `${runId}-sku`, active: true, isBase: true, imageId: firstImageId,
  } });
  let referencedRemovalRejected = false;
  try {
    await removeProductImage(prisma, product.id, firstImageId, {
      expectedProductUpdatedAt: gallery.product.updatedAt,
      expectedImageUpdatedAt: afterReplacement.updatedAt,
    }, context("referenced-remove"));
  } catch (error) { referencedRemovalRejected = error instanceof CatalogMediaConflictError; }
  assert(referencedRemovalRejected, "Variant-referenced Product Image removal was accepted");

  const second = gallery.images.find((item) => item.id === secondImageId)!;
  gallery = await removeProductImage(prisma, product.id, secondImageId, {
    expectedProductUpdatedAt: gallery.product.updatedAt, expectedImageUpdatedAt: second.updatedAt,
  }, context("remove-second"));
  await prisma.productVariant.delete({ where: { id: variant.id } });
  const first = gallery.images[0];
  gallery = await removeProductImage(prisma, product.id, firstImageId, {
    expectedProductUpdatedAt: gallery.product.updatedAt, expectedImageUpdatedAt: first.updatedAt,
  }, context("remove-first"));
  assert(gallery.images.length === 0, "Product Image removal/position normalization failed");

  const categoryUpload1 = await upload("CATEGORY", "category-one", "#7c3aed");
  let categoryMedia = await addCategoryImage(prisma, category.id, {
    expectedCategoryUpdatedAt: category.updatedAt.toISOString(), uploadId: categoryUpload1.id,
    altText: "Colección representativa de la categoría de validación",
  }, context("category-add"));
  const categoryUpload2 = await upload("CATEGORY", "category-two", "#be123c");
  categoryMedia = await updateCategoryImage(prisma, category.id, {
    action: "replace", expectedCategoryUpdatedAt: categoryMedia.category.updatedAt,
    uploadId: categoryUpload2.id, altText: "Nueva colección representativa de la categoría",
  }, context("category-replace"));
  categoryMedia = await updateCategoryImage(prisma, category.id, {
    action: "metadata", expectedCategoryUpdatedAt: categoryMedia.category.updatedAt,
    altText: "Selección representativa de la categoría actualizada",
  }, context("category-metadata"));
  categoryMedia = await removeCategoryImage(prisma, category.id, {
    expectedCategoryUpdatedAt: categoryMedia.category.updatedAt,
  }, context("category-remove"));
  assert(categoryMedia.category.image === null && categoryMedia.category.active && categoryMedia.category.visible, "Category removal changed taxonomy state");

  const durations: number[] = [];
  for (let offset = 0; offset < 100; offset += 10) {
    durations.push(...await Promise.all(Array.from({ length: 10 }, async () => {
      const started = performance.now();
      await getAdminProductMedia(prisma, product.id);
      return performance.now() - started;
    })));
  }
  const measured = p95(durations);
  assert(measured <= 750, `Product media read p95 ${measured.toFixed(2)} ms exceeded remote limit`);

  const cleanup = await cleanupCatalogMedia(prisma, new Date(Date.now() + 8 * DAY_MS), 100);
  assert(cleanup.deleted >= objectKeys.size, "Retained objects were not cleaned");
  console.log(`Catalog Media Admin validation passed; ${objectKeys.size} immutable objects uploaded/cleaned, Product/Category invariants protected, p95 ${measured.toFixed(2)} ms`);
}

const DAY_MS = 24 * 60 * 60 * 1000;

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  for (const key of objectKeys) await deleteCatalogMediaObject(key).catch(() => undefined);
  await prisma.product.deleteMany({ where: { slug: `${runId}-product` } });
  await prisma.category.deleteMany({ where: { id: `${runId}-category` } });
  await prisma.taxonomyVersion.deleteMany({ where: { id: `${runId}-version` } });
  await prisma.catalogMediaObjectCleanup.deleteMany({ where: { objectKey: { in: [...objectKeys] } } });
  await prisma.catalogMediaIdempotency.deleteMany({ where: { sessionId } });
  await prisma.catalogMediaUpload.deleteMany({ where: { sessionId } });
  await prisma.catalogMediaRateLimit.deleteMany({ where: { sessionId } });
  await prisma.productAdminAuditEvent.deleteMany({ where: { requestId: { startsWith: runId } } });
  await prisma.productAdminSession.deleteMany({ where: { id: sessionId } });
  await prisma.$disconnect();
});
