import { PrismaClient } from "@prisma/client";
import { existsSync } from "node:fs";
import { join } from "node:path";

import inventory from "../prisma/data/products-v1.json";
import { getProductDetail, listFeaturedProducts, listProducts } from "../src/server/catalogService";

const prisma = new PrismaClient();
const expectedFeaturedIds = [
  200001, 200002, 200003, 200004,
  200031, 200046, 200032, 200047,
  200039, 200033, 200048, 200040,
  200034, 200041, 200035, 200042,
  200036, 200043, 200037, 200044,
  200038, 200045,
];
const featuredOrderById = new Map(expectedFeaturedIds.map((id, index) => [id, index + 1]));

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  const ids = inventory.products.map(({ id }) => id);
  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    include: {
      variants: { include: { attributes: true } },
      images: true,
      productType: { include: { subcategory: true } },
    },
    orderBy: { id: "asc" },
  });

  assert(products.length === inventory.products.length, `Expected ${inventory.products.length} seeded Products, found ${products.length}`);
  const sourceById = new Map(inventory.products.map((product) => [product.id, product]));

  for (const product of products) {
    const source = sourceById.get(product.id);
    assert(source, `Unexpected Product ID ${product.id}`);
    assert(product.slug === source.slug && product.name === source.name, `Identity mismatch for Product ${product.id}`);
    assert(
      Math.round(Number(product.price) * 100) === Math.round(Number(source.price) * 100) &&
        product.currency === source.currency,
      `Commercial value mismatch for ${source.slug}`,
    );
    assert(product.active && product.editorialApproved && product.published, `Published lifecycle mismatch for ${source.slug}`);
    const expectedFeaturedOrder = featuredOrderById.get(product.id) ?? null;
    assert(
      product.commerciallyAvailable && product.featured === (expectedFeaturedOrder !== null) &&
        product.featuredOrder === expectedFeaturedOrder,
      `Featured/commercial mismatch for ${source.slug}`,
    );
    assert(product.productType?.subcategory.slug === source.subcategory.slug, `Taxonomy branch mismatch for ${source.slug}`);
    assert(product.variants.length === 1, `Expected one Base Variant for ${source.slug}`);
    assert(
      product.variants[0].sku === `MDQ-${product.id}` && product.variants[0].isBase &&
        product.variants[0].active && product.variants[0].attributes.length === 0,
      `Base Variant integrity mismatch for ${source.slug}`,
    );
    const hasSourceMedia = existsSync(join(process.cwd(), "public", source.imageUrl));
    assert(product.images.length === (hasSourceMedia ? 1 : 0), `Product Image disposition mismatch for ${source.slug}`);
    if (hasSourceMedia) {
      assert(
        product.images[0].url === source.imageUrl && product.images[0].altText === source.name &&
          product.images[0].position === 0 && product.images[0].isPrimary,
        `Primary Image mismatch for ${source.slug}`,
      );
    }
  }

  const [{ last_value: sequenceValue }] = await prisma.$queryRaw<Array<{ last_value: bigint }>>`
    SELECT last_value FROM "Product_id_seq"
  `;
  const maximumId = Math.max(...ids);
  assert(Number(sequenceValue) >= maximumId, `Product sequence ${sequenceValue} is behind ${maximumId}`);

  const listing = await listProducts(prisma, { limit: "50" });
  assert(listing.metadata.totalItems === inventory.products.length, `Public listing expected ${inventory.products.length} Products, found ${listing.metadata.totalItems}`);
  const detail = await getProductDetail(prisma, inventory.products[0].slug);
  assert(detail?.variantSelection.mode === "none", "Base Variant became a fabricated visitor choice");
  const publicPayload = JSON.stringify(detail).toLowerCase();
  assert(!publicPayload.includes("mdq-200001") && !publicPayload.includes("sku"), "Public API exposed internal SKU");
  const featured = await prisma.product.findMany({
    where: { featured: true },
    orderBy: { featuredOrder: "asc" },
    select: { id: true },
  });
  assert(
    JSON.stringify(featured.map(({ id }) => id)) === JSON.stringify(expectedFeaturedIds),
    "Featured Product editorial order does not match the approved Acid Wash/Lentes/Relojes/Café sequence",
  );
  const homepageFeatured = await listFeaturedProducts(prisma, 8);
  assert(
    JSON.stringify(homepageFeatured.map(({ id }) => id)) === JSON.stringify(expectedFeaturedIds.slice(0, 8)),
    "Homepage Featured limit does not preserve the approved editorial sequence",
  );

  console.log(
    `Product publication PostgreSQL validation passed: ${products.length} published Products, ` +
      "73 exact taxonomy leaves, 73 Base Variants/SKUs, 22 Featured in deterministic order, public contract protected",
  );
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
