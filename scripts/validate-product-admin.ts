import { PrismaClient } from "@prisma/client";

import { getAdminProductById, listAdminProducts } from "../src/server/productAdminCatalogService";
import { ProductUpdateConflictError, updateProductById } from "../src/server/productAdminService";
import { hashAdminPassword } from "../src/server/adminAccountService";
import {
  authorizeProductAdminSession,
  createProductAdminSession,
  type ProductAdminSecurityConfig,
} from "../src/server/productAdminSecurity";

const prisma = new PrismaClient();
const runId = `admin-${Date.now()}`;
const QUERY_COUNT = 500;
const CONCURRENCY = 10;
// This command runs from an operator workstation against remote PostgreSQL.
// Production, where the application and database are co-located, keeps a 250 ms target.
const P95_LIMIT_MS = 750;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function p95(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.ceil(sorted.length * 0.95) - 1];
}
function response() {
  return { headers: {} as Record<string, string>, setHeader(name: string, value: string) { this.headers[name] = value; return this; } } as any;
}

async function main() {
  const securityConfig: ProductAdminSecurityConfig = {
    sessionSecret: `${runId}-session-secret-material-at-least-32-bytes`,
    origin: "http://localhost:3000",
    trustProxy: false,
    trustedProxyHops: 1,
    production: false,
  };
  const productType = await prisma.productType.findFirst({
    where: { active: true, subcategory: { active: true, category: { active: true, visible: true, version: { status: "ACTIVE" } } } },
  });
  assert(productType, "Active Product Type required");
  const sessionIds: string[] = [];
  let accountId: string | undefined;

  try {
    const account = await prisma.adminAccount.create({ data: {
      username: runId, normalizedUsername: runId, passwordHash: await hashAdminPassword(`${runId}-validation-password`),
      role: "ADMIN", enabled: true, mustChangePassword: false,
    } });
    accountId = account.id;
    const product = await prisma.product.create({
      data: {
        slug: `${runId}-product`, name: `${runId} Product`, description: "Temporary admin validation",
        price: 10, currency: "USD", active: false, editorialApproved: false,
        published: false, commerciallyAvailable: true, featured: false,
      },
    });

    const list = await listAdminProducts(prisma, { q: `  ${runId.toUpperCase()}  `, active: "false", published: "false" });
    assert(list.items.length === 1 && list.items[0].id === product.id, "Admin list/search/filter failed");
    assert(!JSON.stringify(list).toLowerCase().includes("sku"), "Admin list exposed Variant internals");
    const detail = await getAdminProductById(prisma, product.id);
    assert(detail && !detail.hasVariant, "Admin detail Variant readiness failed");

    const updated = await updateProductById(prisma, product.id, {
      expectedUpdatedAt: product.updatedAt.toISOString(),
      name: `${runId} Corrected`, commerciallyAvailable: false,
    });
    assert(updated.name.endsWith("Corrected"), "Approved scalar update failed");
    assert(updated.price === "10", "Commercial unavailability erased stored price");

    let staleRejected = false;
    try {
      await updateProductById(prisma, product.id, {
        expectedUpdatedAt: product.updatedAt.toISOString(), name: "Stale overwrite",
      });
    } catch (error) { staleRejected = error instanceof ProductUpdateConflictError; }
    assert(staleRejected, "Stale Product update was accepted");

    let publicationRejected = false;
    try {
      await updateProductById(prisma, product.id, {
        expectedUpdatedAt: updated.updatedAt, published: true,
      });
    } catch (error) { publicationRejected = error instanceof ProductUpdateConflictError; }
    assert(publicationRejected, "Invalid publication was accepted");

    const res = response();
    const created = await createProductAdminSession(prisma, res, securityConfig, account);
    sessionIds.push(created.session.id);
    const cookie = res.headers["Set-Cookie"].split(";", 1)[0];
    const authorized = await authorizeProductAdminSession(prisma, {
      headers: { cookie }, query: {}, socket: { remoteAddress: "127.0.0.1" },
    } as any, response(), securityConfig);
    assert(authorized.session.id === created.session.id, "Server session authorization failed");

    const durations: number[] = [];
    for (let offset = 0; offset < QUERY_COUNT; offset += CONCURRENCY) {
      const batch = await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
        const started = performance.now();
        await listAdminProducts(prisma, { page: "1", limit: "20" });
        return performance.now() - started;
      }));
      durations.push(...batch);
    }
    const measured = p95(durations);
    assert(measured <= P95_LIMIT_MS, `Admin list p95 ${measured.toFixed(2)} ms exceeded ${P95_LIMIT_MS} ms`);
    console.log(
      `PostgreSQL Product Admin validation passed; session/invariants/concurrency protected, ` +
      `${QUERY_COUNT} list queries at concurrency ${CONCURRENCY}, p95 ${measured.toFixed(2)} ms <= ${P95_LIMIT_MS} ms`,
    );
  } finally {
    await prisma.product.deleteMany({ where: { slug: { startsWith: runId } } });
    await prisma.productAdminSession.deleteMany({ where: { id: { in: sessionIds } } });
    await prisma.productAdminAuditEvent.deleteMany({ where: { requestId: { startsWith: runId } } });
    if (accountId) await prisma.adminAccount.deleteMany({ where: { id: accountId } });
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
