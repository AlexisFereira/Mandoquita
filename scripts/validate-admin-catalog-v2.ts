import "dotenv/config";

import { PrismaClient } from "@prisma/client";

import { hashAdminPassword } from "../src/server/adminAccountService";
import { createCategory, restoreCategory, retireCategory, updateCategory } from "../src/server/categoryAdminService";
import { listAdminProducts } from "../src/server/productAdminCatalogService";
import {
  createProductWithBaseVariant, restoreProduct, retireProduct, updateProductById,
} from "../src/server/productAdminService";

const prisma = new PrismaClient();
const runId = `acm-v2-${Date.now()}`;
let productId: number | undefined;
let categoryId: string | undefined;
let accountId: string | undefined;

function assert(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

async function main() {
  const superCount = await prisma.adminAccount.count({ where: { role: "SUPER_ADMIN" } });
  assert(superCount <= 1, "Database permits more than one Superadministrator");
  const account = await prisma.adminAccount.create({ data: {
    username: runId, normalizedUsername: runId,
    passwordHash: await hashAdminPassword(`${runId} secure temporary credential`),
    role: "ADMIN", enabled: true, mustChangePassword: true,
  } });
  accountId = account.id;

  let product = await prisma.$transaction((tx) => createProductWithBaseVariant(tx, {
    name: "ACM V2 validation Product", slug: `${runId}-product`, price: "19.95",
    currency: "USD", baseSku: `${runId}-base`,
  }));
  productId = product.id;
  const variants = await prisma.productVariant.findMany({ where: { productId } });
  assert(variants.length === 1 && variants[0].isBase && variants[0].sku === `${runId}-base`, "Atomic Base Variant invariant failed");
  assert(!product.active && !product.published && !product.commerciallyAvailable && !product.featured, "Safe Product defaults failed");

  product = await prisma.$transaction((tx) => updateProductById(tx, productId!, {
    expectedUpdatedAt: product.updatedAt, slug: `${runId}-product-current`,
  }));
  const productAlias = await prisma.productSlugAlias.findUnique({ where: { slug: `${runId}-product` } });
  assert(productAlias?.productId === productId, "Product historical slug was not retained");
  product = await prisma.$transaction((tx) => retireProduct(tx, productId!, { expectedUpdatedAt: product.updatedAt }, account.id));
  assert(product.retiredAt && !product.active && !product.published && !product.commerciallyAvailable, "Product retirement state failed");
  product = await prisma.$transaction((tx) => restoreProduct(tx, productId!, { expectedUpdatedAt: product.updatedAt }));
  assert(!product.retiredAt && !product.editorialApproved && !product.published, "Product safe restoration failed");

  let category = await prisma.$transaction((tx) => createCategory(tx, {
    name: "ACM V2 validation Category", slug: `${runId}-category`,
  }));
  categoryId = category.id;
  assert(!category.active && !category.visible, "Safe Category defaults failed");
  category = await prisma.$transaction((tx) => updateCategory(tx, categoryId!, {
    expectedUpdatedAt: category.updatedAt, slug: `${runId}-category-current`,
  }));
  const categoryAlias = await prisma.categorySlugAlias.findUnique({ where: { slug: `${runId}-category` } });
  assert(categoryAlias?.categoryId === categoryId, "Category historical slug was not retained");
  const retiredCategory = await prisma.$transaction((tx) => retireCategory(tx, categoryId!, {
    expectedUpdatedAt: category.updatedAt,
  }, account.id));
  assert(retiredCategory?.retiredAt && !retiredCategory.active && !retiredCategory.visible, "Category retirement failed");
  category = (await prisma.$transaction((tx) => restoreCategory(tx, categoryId!, {
    expectedUpdatedAt: retiredCategory!.updatedAt,
  })))!;
  assert(!category.retiredAt && !category.active && !category.visible, "Category restoration failed");

  const durations: number[] = [];
  for (let index = 0; index < 100; index += 1) {
    const started = performance.now();
    await listAdminProducts(prisma, { page: "1", limit: "20" });
    durations.push(performance.now() - started);
  }
  durations.sort((left, right) => left - right);
  const p95 = durations[Math.ceil(durations.length * 0.95) - 1];
  assert(p95 <= 750, `Remote Admin Product list p95 ${p95.toFixed(2)} ms exceeds 750 ms evidence limit`);
  console.log(`Admin Catalog Management V2 PostgreSQL validation passed; Product/Category/account invariants and aliases verified; list p95 ${p95.toFixed(2)} ms.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  if (productId) {
    await prisma.productSlugAlias.deleteMany({ where: { productId } });
    await prisma.product.deleteMany({ where: { id: productId } });
  }
  if (categoryId) {
    await prisma.categorySlugAlias.deleteMany({ where: { categoryId } });
    await prisma.category.deleteMany({ where: { id: categoryId } });
  }
  if (accountId) {
    await prisma.productAdminSession.deleteMany({ where: { adminAccountId: accountId } });
    await prisma.adminAccount.deleteMany({ where: { id: accountId } });
  }
  await prisma.$disconnect();
});
