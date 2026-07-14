import { createHmac } from "node:crypto";

import argon2 from "argon2";
import type { AdminAccount, Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

const USERNAME_PATTERN = /^[A-Za-z0-9._-]{3,64}$/;
const COMMON_PASSWORDS = new Set([
  "password", "password123456", "123456789012345", "qwertyuiop12345",
  "administrator", "administrador", "mandoquita123456",
]);

export class AdminAccountConflictError extends Error {}
export class AdminAccountNotFoundError extends Error {}
export class AdminAccountPolicyError extends Error {}

export function normalizeAdminUsername(value: string) {
  return value.trim().normalize("NFKC").toLowerCase();
}

export const adminUsernameSchema = z.string().transform((value) => value.trim().normalize("NFKC"))
  .refine((value) => USERNAME_PATTERN.test(value), "Invalid username");

function passwordMaterial(password: string, pepper?: string) {
  return pepper ? createHmac("sha256", pepper).update(password, "utf8").digest("base64url") : password;
}

export function validateAdminPassword(password: unknown, username: string, extraBlocklist = "") {
  if (typeof password !== "string") throw new AdminAccountPolicyError("Invalid password");
  const normalized = password.normalize("NFC");
  const length = Array.from(normalized).length;
  if (length < 12 || length > 128) throw new AdminAccountPolicyError("Password must contain 12 to 128 characters");
  const comparable = normalized.trim().toLocaleLowerCase("en-US");
  const blocked = new Set([
    ...COMMON_PASSWORDS,
    ...extraBlocklist.split(",").map((item) => item.trim().toLocaleLowerCase("en-US")).filter(Boolean),
  ]);
  const normalizedUsername = normalizeAdminUsername(username);
  if (blocked.has(comparable) || comparable.includes("mandoquita") ||
      (normalizedUsername.length >= 3 && comparable.includes(normalizedUsername))) {
    throw new AdminAccountPolicyError("Password is too common or account-specific");
  }
  return normalized;
}

export async function hashAdminPassword(password: string, pepper?: string) {
  return argon2.hash(passwordMaterial(password.normalize("NFC"), pepper), {
    type: argon2.argon2id,
    memoryCost: 19_456,
    timeCost: 2,
    parallelism: 1,
    hashLength: 32,
  });
}

const dummyHashes = new Map<string, Promise<string>>();
export function dummyAdminPasswordHash(pepper?: string) {
  const key = pepper ?? "without-pepper";
  let value = dummyHashes.get(key);
  if (!value) {
    value = hashAdminPassword("dummy-password-never-valid-2026", pepper);
    dummyHashes.set(key, value);
  }
  return value;
}

export async function verifyAdminPassword(password: unknown, encodedHash: string, pepper?: string) {
  const candidate = typeof password === "string" ? password.normalize("NFC") : "invalid-password-candidate";
  try {
    return await argon2.verify(encodedHash, passwordMaterial(candidate, pepper));
  } catch {
    return false;
  }
}

export type SafeAdminAccount = {
  id: string;
  username: string;
  role: "SUPER_ADMIN" | "ADMIN";
  enabled: boolean;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export function safeAdminAccount(account: AdminAccount): SafeAdminAccount {
  return {
    id: account.id,
    username: account.username,
    role: account.role,
    enabled: account.enabled,
    mustChangePassword: account.mustChangePassword,
    lastLoginAt: account.lastLoginAt?.toISOString() ?? null,
    createdAt: account.createdAt.toISOString(),
    updatedAt: account.updatedAt.toISOString(),
  };
}

type Db = PrismaClient | Prisma.TransactionClient;

export async function assertAdminUsernameAvailable(db: Db, username: string, excludingId?: string) {
  const normalizedUsername = normalizeAdminUsername(username);
  const account = await db.adminAccount.findFirst({
    where: { normalizedUsername, ...(excludingId ? { id: { not: excludingId } } : {}) },
    select: { id: true },
  });
  if (account) throw new AdminAccountConflictError("Username is reserved");
  return normalizedUsername;
}

export async function revokeAccountSessions(db: Db, accountId: string, now = new Date()) {
  await db.productAdminSession.updateMany({
    where: { adminAccountId: accountId, revokedAt: null },
    data: { revokedAt: now },
  });
}
