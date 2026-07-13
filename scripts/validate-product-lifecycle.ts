import { PrismaClient } from "@prisma/client";

import { getProductDetail } from "../src/server/catalogService";

const prisma = new PrismaClient();
const runId = `lifecycle-${Date.now()}`;
const PERFORMANCE_PRODUCT_COUNT = 10_000;
const PERFORMANCE_QUERY_COUNT = 1_000;
const PERFORMANCE_CONCURRENCY = 20;
const PERFORMANCE_P95_THRESHOLD_MS = 50;
const INSERT_BATCH_SIZE = 1_000;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function percentile95(durations: number[]) {
  const sortedDurations = [...durations].sort((left, right) => left - right);
  return sortedDurations[Math.ceil(sortedDurations.length * 0.95) - 1];
}

async function createPerformanceDataset(productTypeId: string) {
  for (let offset = 0; offset < PERFORMANCE_PRODUCT_COUNT; offset += INSERT_BATCH_SIZE) {
    const batchSize = Math.min(INSERT_BATCH_SIZE, PERFORMANCE_PRODUCT_COUNT - offset);
    await prisma.product.createMany({
      data: Array.from({ length: batchSize }, (_, index) => {
        const position = offset + index;
        return {
          slug: `${runId}-performance-${position}`,
          name: `Performance product ${position}`,
          description: "Temporary performance validation record",
          price: 100,
          currency: "USD",
          imageUrl: "",
          active: true,
          editorialApproved: true,
          published: true,
          commerciallyAvailable: position % 5 !== 0,
          featured: false,
          productTypeId,
        };
      }),
    });
  }
}

async function validatePerformance(targetSlug: string) {
  for (let iteration = 0; iteration < PERFORMANCE_CONCURRENCY; iteration += 1) {
    await getProductDetail(prisma, targetSlug);
  }

  const durations: number[] = [];
  let referenceResult: string | undefined;

  for (
    let offset = 0;
    offset < PERFORMANCE_QUERY_COUNT;
    offset += PERFORMANCE_CONCURRENCY
  ) {
    const batchSize = Math.min(
      PERFORMANCE_CONCURRENCY,
      PERFORMANCE_QUERY_COUNT - offset
    );
    const batchResults = await Promise.all(
      Array.from({ length: batchSize }, async () => {
        const startedAt = performance.now();
        const result = await getProductDetail(prisma, targetSlug);
        return {
          duration: performance.now() - startedAt,
          serialized: JSON.stringify(result),
        };
      })
    );

    for (const result of batchResults) {
      durations.push(result.duration);
      referenceResult ??= result.serialized;
      assert(result.serialized === referenceResult, "Concurrent results were not deterministic");
    }
  }

  const p95 = percentile95(durations);
  assert(
    p95 <= PERFORMANCE_P95_THRESHOLD_MS,
    `Detail p95 ${p95.toFixed(2)} ms exceeded ${PERFORMANCE_P95_THRESHOLD_MS} ms`
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
  });
  assert(productType, "Active taxonomy Product Type is required for integration validation");

  try {
    const baseProduct = {
      name: "Lifecycle validation product",
      description: "Temporary integration validation record",
      price: 100,
      currency: "USD",
      imageUrl: "",
      featured: false,
      productTypeId: productType.name,
    };

    await prisma.product.create({
      data: {
        ...baseProduct,
        slug: `${runId}-active-unpublished`,
        active: true,
        editorialApproved: true,
        published: false,
        commerciallyAvailable: true,
      },
    });

    const unpublished = await getProductDetail(prisma, `${runId}-active-unpublished`);
    assert(unpublished === null, "Active but unpublished product became public");

    await prisma.product.create({
      data: {
        ...baseProduct,
        slug: `${runId}-published-inactive`,
        active: false,
        editorialApproved: true,
        published: true,
        commerciallyAvailable: true,
      },
    });

    const publishedInactive = await getProductDetail(prisma, `${runId}-published-inactive`);
    assert(publishedInactive !== null, "Published inactive product was hidden");

    await prisma.product.create({
      data: {
        ...baseProduct,
        slug: `${runId}-commercially-unavailable`,
        active: true,
        editorialApproved: true,
        published: true,
        commerciallyAvailable: false,
      },
    });

    const commerciallyUnavailable = await getProductDetail(
      prisma,
      `${runId}-commercially-unavailable`
    );
    assert(commerciallyUnavailable !== null, "Commercially unavailable product was hidden");
    assert(commerciallyUnavailable.item.price === null, "Unavailable price was exposed");
    assert(commerciallyUnavailable.item.currency === null, "Unavailable currency was exposed");

    let invalidPublicationRejected = false;
    try {
      await prisma.product.create({
        data: {
          ...baseProduct,
          slug: `${runId}-unapproved-published`,
          active: true,
          editorialApproved: false,
          published: true,
          commerciallyAvailable: true,
        },
      });
    } catch {
      invalidPublicationRejected = true;
    }
    assert(invalidPublicationRejected, "Database accepted publication without editorial approval");

    const firstDetail = await getProductDetail(prisma, `${runId}-published-inactive`);
    const secondDetail = await getProductDetail(prisma, `${runId}-published-inactive`);
    assert(firstDetail !== null, "Reference detail unexpectedly unavailable");
    assert(secondDetail !== null, "Repeated detail unexpectedly unavailable");
    assert(
      JSON.stringify(firstDetail) === JSON.stringify(secondDetail),
      "Repeated detail queries produced different business results"
    );

    await createPerformanceDataset(productType.name);
    const p95 = await validatePerformance(`${runId}-published-inactive`);

    console.log(
      `PostgreSQL lifecycle validation passed; ${PERFORMANCE_QUERY_COUNT} queries, ` +
      `concurrency ${PERFORMANCE_CONCURRENCY}, ${PERFORMANCE_PRODUCT_COUNT} products, ` +
      `detail p95 ${p95.toFixed(2)} ms <= ${PERFORMANCE_P95_THRESHOLD_MS} ms`
    );
  } finally {
    await prisma.product.deleteMany({ where: { slug: { startsWith: runId } } });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
