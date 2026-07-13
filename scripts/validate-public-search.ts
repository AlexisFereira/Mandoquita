import { PrismaClient } from "@prisma/client";

import { listProducts } from "../src/server/catalogService";

const prisma = new PrismaClient();
const runId = `search-${Date.now()}`;
const token = runId.replace(/-/g, "");
const PERFORMANCE_PRODUCT_COUNT = 10_000;
const PERFORMANCE_QUERY_COUNT = 1_000;
const PERFORMANCE_CONCURRENCY = 20;
const PERFORMANCE_P95_THRESHOLD_MS = 150;
const INSERT_BATCH_SIZE = 1_000;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function percentile95(durations: number[]) {
  const sorted = [...durations].sort((left, right) => left - right);
  return sorted[Math.ceil(sorted.length * 0.95) - 1];
}

async function createProduct(
  productTypeId: string,
  suffix: string,
  data: Record<string, unknown>,
  published = true,
) {
  const slug = `${runId}-${suffix}`;
  return prisma.product.create({
    data: {
      slug,
      name: `Validación pública ${suffix}`,
      price: 100,
      currency: "USD",
      editorialApproved: true,
      published,
      productTypeId,
      variants: {
        create: {
          id: `${slug}-variant`,
          sku: `${runId.toUpperCase()}-${suffix.toUpperCase()}`,
          isBase: true,
        },
      },
      ...data,
    },
  });
}

async function createPerformanceDataset(productTypeId: string) {
  for (let offset = 0; offset < PERFORMANCE_PRODUCT_COUNT; offset += INSERT_BATCH_SIZE) {
    const batchSize = Math.min(INSERT_BATCH_SIZE, PERFORMANCE_PRODUCT_COUNT - offset);
    await prisma.product.createMany({
      data: Array.from({ length: batchSize }, (_, index) => {
        const position = offset + index;
        return {
          slug: `${runId}-performance-${position}`,
          name: `${token} rendimiento ${position}`,
          description: "Registro temporal para validar búsqueda pública",
          brand: position === 7_777 ? `${token}objetivo` : `marca-${position}`,
          price: 100,
          currency: "USD",
          editorialApproved: true,
          published: false,
          productTypeId,
        };
      }),
    });
  }

  const products = await prisma.product.findMany({
    where: { slug: { startsWith: `${runId}-performance-` } },
    select: { id: true },
  });
  await prisma.productVariant.createMany({
    data: products.map(({ id }) => ({
      id: `${runId}-performance-variant-${id}`,
      productId: id,
      sku: `${runId.toUpperCase()}-PERFORMANCE-${id}`,
      isBase: true,
    })),
  });
  await prisma.product.updateMany({
    where: { slug: { startsWith: `${runId}-performance-` } },
    data: { published: true },
  });
}

async function validatePerformance() {
  const q = `${token}objetivo`;
  for (let index = 0; index < PERFORMANCE_CONCURRENCY; index += 1) {
    await listProducts(prisma, { q });
  }

  const durations: number[] = [];
  let reference: string | undefined;
  for (let offset = 0; offset < PERFORMANCE_QUERY_COUNT; offset += PERFORMANCE_CONCURRENCY) {
    const results = await Promise.all(
      Array.from({ length: PERFORMANCE_CONCURRENCY }, async () => {
        const startedAt = performance.now();
        const result = await listProducts(prisma, { q });
        return { duration: performance.now() - startedAt, result: JSON.stringify(result) };
      }),
    );
    for (const result of results) {
      durations.push(result.duration);
      reference ??= result.result;
      assert(result.result === reference, "Concurrent Search results were not deterministic");
    }
  }

  const p95 = percentile95(durations);
  assert(
    p95 <= PERFORMANCE_P95_THRESHOLD_MS,
    `Search p95 ${p95.toFixed(2)} ms exceeded ${PERFORMANCE_P95_THRESHOLD_MS} ms`,
  );
  return p95;
}

async function main() {
  const productType = await prisma.productType.findFirst({
    where: {
      active: true,
      subcategory: {
        active: true,
        category: { active: true, visible: true, version: { status: "ACTIVE" } },
      },
    },
    include: { subcategory: true },
  });
  assert(productType, "An eligible Product Type is required");

  const maxOrder = await prisma.productType.aggregate({
    where: { subcategoryId: productType.subcategoryId },
    _max: { sourceOrder: true },
  });
  const inactiveProductType = `${runId}-inactive-type`;

  try {
    await prisma.productType.create({
      data: {
        name: inactiveProductType,
        sourceOrder: (maxOrder._max.sourceOrder ?? 0) + 1,
        active: false,
        subcategoryId: productType.subcategoryId,
      },
    });

    const fieldQueries = [
      ["name", { name: `${token} Nombre Café` }, `${token} NOMBRE CAFÉ`],
      ["short description", { shortDescription: `${token} resumen aprobado` }, `${token} resumen`],
      ["description", { description: `${token} descripción completa` }, `${token} descripción`],
      ["brand", { brand: `${token} Marca Pública` }, `${token} marca`],
      ["collection", { collection: `${token} Edición: Otoño` }, `${token} Edición:`],
      ["tag", { tags: { create: { value: `${token}etiqueta` } } }, `${token}etiqueta`],
    ] as const;

    for (const [suffix, data, q] of fieldQueries) {
      const product = await createProduct(productType.name, suffix.replace(/ /g, "-"), data);
      const result = await listProducts(prisma, { q: `  ${q}  ` });
      assert(result.items.some(({ id }) => id === product.id), `Approved ${suffix} did not match`);
    }

    const unavailable = await createProduct(productType.name, "unavailable", {
      name: `${token} sin disponibilidad`,
      commerciallyAvailable: false,
    });
    const unavailableResult = await listProducts(prisma, { q: `${token} sin disponibilidad` });
    const unavailableItem = unavailableResult.items.find(({ id }) => id === unavailable.id);
    assert(unavailableItem, "Commercially unavailable Product was hidden");
    assert(unavailableItem.price === null && unavailableItem.currency === null, "Protected price escaped");

    await createProduct(productType.name, "hidden-identifier", {
      name: "Producto con identificador interno",
      variants: {
        create: {
          id: `${runId}-hidden-variant`,
          sku: `${token}SECRETSKU`,
          reference: `${token}SECRETREFERENCE`,
          barcode: `${token}SECRETBARCODE`,
          isBase: true,
        },
      },
    });
    for (const hiddenQuery of ["SECRETSKU", "SECRETREFERENCE", "SECRETBARCODE"]) {
      const result = await listProducts(prisma, { q: `${token}${hiddenQuery}` });
      assert(result.items.length === 0, `Search matched hidden operational field ${hiddenQuery}`);
    }

    await createProduct(productType.name, "unpublished", {
      name: `${token} ineligible unpublished`,
    }, false);
    await createProduct(inactiveProductType, "inactive-type", {
      name: `${token} ineligible taxonomy`,
    });
    assert((await listProducts(prisma, { q: `${token} ineligible` })).items.length === 0, "Ineligible Product became searchable");

    await createPerformanceDataset(productType.name);
    const lastPage = await listProducts(prisma, {
      q: `${token} rendimiento`,
      page: "999999",
      limit: "12",
    });
    assert(lastPage.metadata.page === lastPage.metadata.totalPages, "Out-of-range page was not clamped");

    const indexCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint AS count
      FROM pg_indexes
      WHERE indexname IN (
        'Product_search_name_trgm_idx',
        'Product_search_short_description_trgm_idx',
        'Product_search_description_trgm_idx',
        'Product_search_brand_trgm_idx',
        'Product_search_collection_trgm_idx',
        'ProductTag_search_value_trgm_idx'
      )
    `;
    assert(indexCount[0]?.count === 6n, "Search indexes are not fully installed");

    const p95 = await validatePerformance();
    console.log(
      `PostgreSQL public Search validation passed; ${PERFORMANCE_QUERY_COUNT} queries, ` +
      `concurrency ${PERFORMANCE_CONCURRENCY}, ${PERFORMANCE_PRODUCT_COUNT} Products, ` +
      `p95 ${p95.toFixed(2)} ms <= ${PERFORMANCE_P95_THRESHOLD_MS} ms`,
    );
  } finally {
    await prisma.product.deleteMany({ where: { slug: { startsWith: runId } } });
    await prisma.productType.deleteMany({ where: { name: inactiveProductType } });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
