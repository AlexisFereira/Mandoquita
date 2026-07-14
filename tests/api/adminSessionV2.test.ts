import { afterEach, describe, expect, it, vi } from "vitest";

import { handleProductAdminSession } from "../../pages/api/admin/session";
import { hashAdminPassword } from "../../src/server/adminAccountService";

afterEach(() => vi.unstubAllEnvs());

function response() {
  return {
    statusCode: 0,
    body: undefined as unknown,
    headers: {} as Record<string, unknown>,
    setHeader(name: string, value: unknown) { this.headers[name] = value; return this; },
    status(code: number) { this.statusCode = code; return this; },
    json(body: unknown) { this.body = body; return this; },
    end() { return this; },
  } as any;
}

describe("Admin V2 login throttling", () => {
  it("lets a correct credential recover immediately from account/client lockout", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("PRODUCT_ADMIN_SESSION_SECRET", "session-secret-with-at-least-thirty-two-bytes");
    vi.stubEnv("PRODUCT_ADMIN_ORIGIN", "http://localhost:3000");
    vi.stubEnv("PRODUCT_ADMIN_PASSWORD_PEPPER", "");
    const now = new Date("2026-07-14T05:06:00.000Z");
    const account = {
      id: "account-1", username: "superadmin", normalizedUsername: "superadmin",
      passwordHash: await hashAdminPassword("Río9!SolAzul"), role: "SUPER_ADMIN",
      enabled: true, mustChangePassword: false, credentialVersion: 3,
      passwordChangedAt: now, lastLoginAt: now, createdAt: now, updatedAt: now,
    };
    const findMany = vi.fn(async () => [{
      scope: "ACCOUNT", keyHash: "locked", windowStartedAt: now,
      failureCount: 5, lockedUntil: new Date(now.getTime() + 15 * 60_000), updatedAt: now,
    }]);
    const prisma: any = {
      productAdminThrottle: {
        findUnique: vi.fn(async () => null),
        findMany,
        deleteMany: vi.fn(async () => ({ count: 2 })),
      },
      adminAccount: {
        findUnique: vi.fn(async () => account),
        update: vi.fn(async () => ({ ...account, lastLoginAt: now })),
      },
      productAdminSession: {
        create: vi.fn(async ({ data }) => ({ id: "session-1", ...data, createdAt: now, updatedAt: now, revokedAt: null })),
      },
      productAdminAuditEvent: { create: vi.fn(async ({ data }) => ({ id: 1n, ...data })) },
    };
    prisma.$transaction = vi.fn(async (operations: Array<Promise<unknown>>) => Promise.all(operations));
    const res = response();
    await handleProductAdminSession({
      method: "POST",
      body: { username: "superadmin", password: "Río9!SolAzul" },
      headers: { origin: "http://localhost:3000", host: "localhost:3000" },
      socket: { remoteAddress: "127.0.0.1" }, query: {},
    } as any, res, { prismaClient: prisma, now: () => now });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ authorized: true, account: { username: "superadmin" } });
    expect(findMany).not.toHaveBeenCalled();
    expect(prisma.productAdminThrottle.deleteMany).toHaveBeenCalled();
  });
});
