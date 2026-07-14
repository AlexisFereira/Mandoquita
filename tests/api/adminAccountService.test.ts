import { describe, expect, it, vi } from "vitest";

import {
  hashAdminPassword,
  normalizeAdminUsername,
  revokeAccountSessions,
  validateAdminPassword,
  verifyAdminPassword,
} from "../../src/server/adminAccountService";

describe("Admin account security", () => {
  it("normalizes usernames for case-insensitive uniqueness", () => {
    expect(normalizeAdminUsername("  Admin.One  ")).toBe("admin.one");
    expect(normalizeAdminUsername("ＡＤＭＩＮ")).toBe("admin");
  });

  it("enforces length, blocklist and account-context password rules", () => {
    expect(() => validateAdminPassword("short", "admin.one")).toThrow();
    expect(() => validateAdminPassword("Mandoquita password 2026", "admin.one")).toThrow();
    expect(() => validateAdminPassword("admin.one has a long secret", "admin.one")).toThrow();
    expect(validateAdminPassword("Café orbital con 47 lunas!", "admin.one"))
      .toBe("Café orbital con 47 lunas!");
    expect(validateAdminPassword("Río9!SolAzul", "admin.one")).toBe("Río9!SolAzul");
  });

  it("stores passwords with the approved Argon2id floor and verifies exactly", async () => {
    const hash = await hashAdminPassword("Café orbital con 47 lunas!", "independent-pepper-value-at-least-32-bytes");
    expect(hash).toMatch(/^\$argon2id\$v=19\$m=19456,t=2,p=1\$/);
    await expect(verifyAdminPassword("Café orbital con 47 lunas!", hash, "independent-pepper-value-at-least-32-bytes"))
      .resolves.toBe(true);
    await expect(verifyAdminPassword("Café orbital con 48 lunas!", hash, "independent-pepper-value-at-least-32-bytes"))
      .resolves.toBe(false);
  });

  it("revokes every active named session for credential lifecycle changes", async () => {
    const updateMany = vi.fn().mockResolvedValue({ count: 3 });
    const now = new Date("2026-07-13T12:00:00.000Z");
    await revokeAccountSessions({ productAdminSession: { updateMany } } as any, "account-1", now);
    expect(updateMany).toHaveBeenCalledWith({
      where: { adminAccountId: "account-1", revokedAt: null }, data: { revokedAt: now },
    });
  });
});
