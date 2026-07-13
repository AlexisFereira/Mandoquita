import { beforeAll, describe, expect, it, vi } from "vitest";

import {
  applyProductAdminHeaders,
  authorizeProductAdminSession,
  createProductAdminSession,
  getProductAdminSecurityConfig,
  hashProductAdminCode,
  ProductAdminConfigurationError,
  ProductAdminHttpError,
  validateProductAdminEdge,
  verifyProductAdminCode,
  recordProductAdminFailure,
} from "../../src/server/productAdminSecurity";

let codeHash: string;
beforeAll(async () => { codeHash = await hashProductAdminCode("482951", "fixed-test-salt"); });

function config(overrides: Record<string, unknown> = {}) {
  return {
    codeHash,
    sessionSecret: "session-secret-with-at-least-thirty-two-bytes",
    origin: "http://localhost:3000",
    trustProxy: false,
    trustedProxyHops: 1,
    production: false,
    ...overrides,
  } as any;
}

function response() {
  return {
    headers: {} as Record<string, string>,
    setHeader(name: string, value: string) { this.headers[name] = value; return this; },
  } as any;
}

describe("Product Admin security", () => {
  it("verifies only the exact six-digit code against its slow salted hash", async () => {
    expect(await verifyProductAdminCode("482951", codeHash)).toBe(true);
    expect(await verifyProductAdminCode("482952", codeHash)).toBe(false);
    expect(await verifyProductAdminCode("48295", codeHash)).toBe(false);
  });

  it("fails closed on missing production configuration", () => {
    expect(() => getProductAdminSecurityConfig({ NODE_ENV: "production" }))
      .toThrow(ProductAdminConfigurationError);
    expect(() => getProductAdminSecurityConfig({
      NODE_ENV: "production",
      PRODUCT_ADMIN_CODE_HASH: codeHash,
      PRODUCT_ADMIN_SESSION_SECRET: "session-secret-with-at-least-thirty-two-bytes",
      PRODUCT_ADMIN_ORIGIN: "https://admin.example.com",
    })).toThrow(ProductAdminConfigurationError);
  });

  it("requires managed-edge proof in production", () => {
    expect(() => validateProductAdminEdge({ headers: {} } as any, config({
      production: true,
      origin: "https://admin.example.com",
      edgeSecret: "edge-secret-with-at-least-thirty-two-characters",
    }))).toThrow(ProductAdminHttpError);
  });

  it("issues a signed HttpOnly cookie and authorizes the stored opaque session", async () => {
    const now = new Date("2026-07-13T12:00:00.000Z");
    let stored: any;
    const prisma = {
      productAdminSession: {
        create: vi.fn(async ({ data }) => stored = { id: "session-1", ...data, revokedAt: null, updatedAt: now }),
        findUnique: vi.fn(async () => stored),
        update: vi.fn(async ({ data }) => stored = { ...stored, ...data }),
      },
    } as any;
    const res = response();
    const created = await createProductAdminSession(prisma, res, config(), now);
    expect(res.headers["Set-Cookie"]).toContain("HttpOnly");
    expect(res.headers["Set-Cookie"]).toContain("SameSite=Strict");
    expect(res.headers["Set-Cookie"]).not.toContain("482951");

    const cookie = res.headers["Set-Cookie"].split(";", 1)[0];
    const authorized = await authorizeProductAdminSession(prisma, {
      headers: { cookie }, query: {}, socket: { remoteAddress: "127.0.0.1" },
    } as any, response(), config(), { now: new Date(now.getTime() + 1_000) });
    expect(authorized.session.id).toBe(created.session.id);
    expect(authorized.csrfToken).toBe(created.csrfToken);
  });

  it("adds Secure to the session cookie in production configuration", async () => {
    const now = new Date("2026-07-13T12:00:00.000Z");
    const prisma = {
      productAdminSession: {
        create: vi.fn(async ({ data }) => ({ id: "session-secure", ...data, revokedAt: null, updatedAt: now })),
      },
    } as any;
    const res = response();

    await createProductAdminSession(prisma, res, config({
      production: true,
      origin: "https://admin.example.com",
      edgeSecret: "edge-secret-with-at-least-thirty-two-characters",
    }), now);

    expect(res.headers["Set-Cookie"]).toContain("Secure");
    expect(res.headers["Set-Cookie"]).toContain("HttpOnly");
    expect(res.headers["Set-Cookie"]).toContain("SameSite=Strict");
  });

  it("rejects expired sessions and revokes their server record", async () => {
    const now = new Date("2026-07-13T12:00:00.000Z");
    let stored: any;
    const prisma = {
      productAdminSession: {
        create: vi.fn(async ({ data }) => stored = { id: "session-1", ...data, revokedAt: null, updatedAt: now }),
        findUnique: vi.fn(async () => ({ ...stored, idleExpiresAt: new Date(now.getTime() - 1) })),
        update: vi.fn(async ({ data }) => ({ ...stored, ...data })),
      },
    } as any;
    const res = response();
    await createProductAdminSession(prisma, res, config(), now);
    const cookie = res.headers["Set-Cookie"].split(";", 1)[0];
    await expect(authorizeProductAdminSession(prisma, {
      headers: { cookie }, query: {}, socket: { remoteAddress: "127.0.0.1" },
    } as any, response(), config(), { now })).rejects.toMatchObject({ status: 401 });
    expect(prisma.productAdminSession.update).toHaveBeenCalledWith(expect.objectContaining({
      data: { revokedAt: now },
    }));
  });

  it("applies no-cache, no-index and response-hardening headers", () => {
    const res = response();
    applyProductAdminHeaders(res);
    expect(res.headers).toMatchObject({
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    });
  });

  it("persists the approved five-attempt client lockout", async () => {
    const rows = new Map<string, any>();
    const key = (scope: string, keyHash: string) => `${scope}:${keyHash}`;
    const prisma: any = {
      productAdminThrottle: {
        updateMany: vi.fn(async ({ where, data }) => {
          const row = rows.get(key(where.scope, where.keyHash));
          if (row && (!where.windowStartedAt || row.windowStartedAt < where.windowStartedAt.lt)) {
            Object.assign(row, data); return { count: 1 };
          }
          return { count: 0 };
        }),
        upsert: vi.fn(async ({ where, create, update }) => {
          const rowKey = key(where.scope_keyHash.scope, where.scope_keyHash.keyHash);
          const row = rows.get(rowKey);
          if (!row) { const created = { ...create, lockedUntil: null, updatedAt: create.windowStartedAt }; rows.set(rowKey, created); return created; }
          row.failureCount += update.failureCount.increment;
          return row;
        }),
        update: vi.fn(async ({ where, data }) => {
          const row = rows.get(key(where.scope_keyHash.scope, where.scope_keyHash.keyHash));
          Object.assign(row, data); return row;
        }),
        findMany: vi.fn(async ({ where }) => where.OR.map((item: any) => rows.get(key(item.scope, item.keyHash))).filter(Boolean)),
      },
    };
    prisma.$transaction = async (operation: (tx: any) => unknown) => operation(prisma);
    const now = new Date("2026-07-13T12:00:00.000Z");
    let retryAfter: number | null = null;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      retryAfter = await recordProductAdminFailure(prisma, "client-hash", now);
    }
    expect(retryAfter).toBe(15 * 60);
    expect(rows.get("CLIENT:client-hash").failureCount).toBe(5);
    expect(rows.get("DEPLOYMENT:global").failureCount).toBe(5);
  });
});
