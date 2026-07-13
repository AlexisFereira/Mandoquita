import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import inventory from "./data/products-v1.json";

const prisma = new PrismaClient();
const sourceBranchCorrections = new Map([
  [
    "electronica-y-seguridad/comunicacion-para-casco",
    "accesorios-para-moto/comunicacion-para-casco",
  ],
]);

const productSchema = z.object({
  id: z.number().int().positive(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.string().regex(/^\d+\.\d{2}$/),
  currency: z.string().length(3),
  imageUrl: z.string().trim().min(1),
  active: z.literal(true),
  editorialApproved: z.literal(false),
  published: z.literal(false),
  commerciallyAvailable: z.boolean(),
  featured: z.literal(false),
  featuredOrder: z.number().int(),
  category: z.object({ id: z.string(), slug: z.string(), name: z.string() }),
  subcategory: z.object({ id: z.string(), slug: z.string(), name: z.string() }),
  productType: z.object({ name: z.string() }),
}).strict();

const inventorySchema = z.object({
  version: z.literal("1.0.0"),
  currencyAssumption: z.literal("USD"),
  notes: z.array(z.string()),
  products: z.array(productSchema).min(1),
}).strict();

function assertUnique(values: Array<string | number>, label: string) {
  if (new Set(values).size !== values.length) {
    throw new Error(`Product seed contains duplicate ${label}`);
  }
}

async function main() {
  const [categories, subcategories, productTypes] = await Promise.all([
    prisma.category.count({ where: { version: { version: "1.0.0", status: "ACTIVE" } } }),
    prisma.subcategory.count({ where: { category: { version: { version: "1.0.0" } } } }),
    prisma.productType.count({
      where: { subcategory: { category: { version: { version: "1.0.0" } } } },
    }),
  ]);

  if (categories !== 7 || subcategories !== 16 || productTypes !== 30) {
    throw new Error(
      `Taxonomy 1.0.0 integrity failed: ${categories} categories, ` +
        `${subcategories} subcategories, ${productTypes} product types`
    );
  }

  const source = inventorySchema.parse(inventory);
  assertUnique(source.products.map(({ id }) => id), "IDs");
  assertUnique(source.products.map(({ slug }) => slug), "slugs");

  for (const product of source.products) {
    if (product.currency !== source.currencyAssumption) {
      throw new Error(`Currency mismatch for ${product.slug}`);
    }
  }

  const taxonomyBranches = await prisma.subcategory.findMany({
    where: { active: true, category: { active: true, version: { status: "ACTIVE" } } },
    select: { slug: true, category: { select: { slug: true } } },
  });
  const eligibleBranches = new Set(
    taxonomyBranches.map(({ slug, category }) => `${category.slug}/${slug}`),
  );
  for (const product of source.products) {
    const suppliedBranch = `${product.category.slug}/${product.subcategory.slug}`;
    const branch = sourceBranchCorrections.get(suppliedBranch) ?? suppliedBranch;
    if (!eligibleBranches.has(branch)) {
      throw new Error(`Unknown Taxonomy V1 branch for ${product.slug}: ${suppliedBranch}`);
    }
  }

  const ids = source.products.map(({ id }) => id);
  await prisma.$transaction(async (tx) => {
    await tx.product.createMany({
      data: source.products.map((product) => ({
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        currency: product.currency,
        active: product.active,
        editorialApproved: false,
        published: false,
        commerciallyAvailable: product.commerciallyAvailable,
        featured: false,
        featuredOrder: null,
        productTypeId: null,
      })),
      skipDuplicates: true,
    });

    const persisted = await tx.product.findMany({
      where: { id: { in: ids } },
      select: { id: true, slug: true },
    });
    if (persisted.length !== source.products.length) {
      throw new Error(
        `Product seed collision: expected ${source.products.length} source IDs, found ${persisted.length}`,
      );
    }
    const persistedSlugs = new Map(persisted.map(({ id, slug }) => [id, slug]));
    for (const product of source.products) {
      if (persistedSlugs.get(product.id) !== product.slug) {
        throw new Error(`Product seed ID ${product.id} belongs to a different slug`);
      }
    }

    await tx.$executeRaw`
      SELECT setval(
        pg_get_serial_sequence('"Product"', 'id'),
        GREATEST(
          (SELECT COALESCE(MAX("id"), 1) FROM "Product"),
          (SELECT last_value FROM "Product_id_seq")
        ),
        true
      )
    `;
  });

  console.log(
    `Seeded ${source.products.length} Product drafts from inventory ${source.version}. ` +
      "Variants, Images and Product Type remain intentionally unset pending approved SKU, alt text and leaf classification.",
  );
  console.log(
    "Source review: comunicacion-para-casco is governed by accesorios-para-moto in Taxonomy V1; " +
      "the source JSON remains unchanged and no classification was persisted.",
  );
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
