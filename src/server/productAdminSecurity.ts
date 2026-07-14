import { createHash, createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";

import type { AdminAccount, PrismaClient, ProductAdminSession } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const IDLE_MS = 30 * 60 * 1000;
const ABSOLUTE_MS = 8 * 60 * 60 * 1000;
const WINDOW_MS = 15 * 60 * 1000;
const CLIENT_LOCK_MS = 15 * 60 * 1000;
const DEPLOYMENT_LOCK_MS = 30 * 60 * 1000;

const configSchema = z.object({
  sessionSecret: z.string().min(32),
  passwordPepper: z.string().min(32).optional(),
  passwordBlocklist: z.string().optional(),
  origin: z.string().url(),
  trustProxy: z.boolean(),
  trustedProxyHops: z.number().int().min(1).max(10),
  edgeSecret: z.string().min(32).optional(),
  production: z.boolean(),
}).superRefine((value, context) => {
  if (value.production && !value.origin.startsWith("https://")) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["origin"], message: "HTTPS origin required" });
  }
  if (value.production && !value.edgeSecret) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["edgeSecret"], message: "Edge proof required" });
  }
  if (value.passwordPepper && value.sessionSecret === value.passwordPepper) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["passwordPepper"], message: "Secrets must be independent" });
  }
});

export type ProductAdminSecurityConfig = z.output<typeof configSchema>;

export class ProductAdminConfigurationError extends Error {}
export class ProductAdminHttpError extends Error {
  constructor(
    public status: 400 | 401 | 403 | 404 | 409 | 429 | 500 | 503,
    public reason: string,
    public retryAfter?: number,
    public actorAccountId?: string,
  ) {
    super(reason);
  }
}

export function getProductAdminSecurityConfig(
  environment: Record<string, string | undefined> = process.env,
): ProductAdminSecurityConfig {
  const result = configSchema.safeParse({
    sessionSecret: environment.PRODUCT_ADMIN_SESSION_SECRET,
    passwordPepper: environment.PRODUCT_ADMIN_PASSWORD_PEPPER || undefined,
    passwordBlocklist: environment.PRODUCT_ADMIN_PASSWORD_BLOCKLIST || undefined,
    origin: environment.PRODUCT_ADMIN_ORIGIN,
    trustProxy: environment.PRODUCT_ADMIN_TRUST_PROXY === "true",
    trustedProxyHops: Number(environment.PRODUCT_ADMIN_TRUSTED_PROXY_HOPS || "1"),
    edgeSecret: environment.PRODUCT_ADMIN_EDGE_SECRET || undefined,
    production: environment.NODE_ENV === "production",
  });
  if (!result.success) throw new ProductAdminConfigurationError("Product Admin security is not configured");
  if (environment.PRODUCT_WRITE_API_KEY && result.data.sessionSecret === environment.PRODUCT_WRITE_API_KEY) {
    throw new ProductAdminConfigurationError("Product Admin secrets must be independent");
  }
  return result.data;
}

function equal(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function hmac(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function cookieName(config: ProductAdminSecurityConfig) {
  return config.production ? "__Host-mandoquita_admin" : "mandoquita_admin";
}

function parseCookies(req: NextApiRequest) {
  const header = req.headers.cookie || "";
  return Object.fromEntries(header.split(";").map((part) => part.trim().split("=", 2)).filter(([name, value]) => name && value));
}

export function clearProductAdminCookie(res: NextApiResponse, config: ProductAdminSecurityConfig) {
  res.setHeader("Set-Cookie", `${cookieName(config)}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${config.production ? "; Secure" : ""}`);
}

export function applyProductAdminHeaders(res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
  res.setHeader("Vary", "Cookie, Origin");
}

export function validateProductAdminEdge(req: NextApiRequest, config: ProductAdminSecurityConfig) {
  if (!config.production) return;
  const supplied = req.headers["x-product-admin-edge"];
  if (typeof supplied !== "string" || !config.edgeSecret || !equal(supplied, config.edgeSecret)) {
    throw new ProductAdminHttpError(503, "EDGE_UNAVAILABLE");
  }
}

export function validateProductAdminOrigin(req: NextApiRequest, config: ProductAdminSecurityConfig) {
  const supplied = req.headers.origin;
  const host = req.headers.host;
  if (typeof supplied !== "string" || supplied !== config.origin || !host || new URL(config.origin).host !== host) {
    throw new ProductAdminHttpError(403, "ORIGIN_REJECTED");
  }
}

export function productAdminRequestId(req: NextApiRequest) {
  const supplied = req.headers["x-request-id"];
  return typeof supplied === "string" && /^[a-zA-Z0-9._-]{8,100}$/.test(supplied) ? supplied : randomUUID();
}

export function productAdminClientKey(req: NextApiRequest, config: ProductAdminSecurityConfig) {
  let address = req.socket.remoteAddress || "unknown";
  if (config.trustProxy) {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
      const values = forwarded.split(",").map((value) => value.trim()).filter(Boolean);
      const index = values.length - config.trustedProxyHops;
      if (index >= 0) address = values[index];
    }
  }
  return hmac(`client:${address}`, config.sessionSecret);
}

export function productAdminAccountKey(normalizedUsername: string, config: ProductAdminSecurityConfig) {
  return hmac(`account:${normalizedUsername}`, config.sessionSecret);
}

export async function createProductAdminSession(
  prisma: PrismaClient,
  res: NextApiResponse,
  config: ProductAdminSecurityConfig,
  account: Pick<AdminAccount, "id" | "credentialVersion">,
  now = new Date(),
) {
  const token = randomBytes(32).toString("base64url");
  const signature = hmac(`session:${token}`, config.sessionSecret);
  const csrfToken = hmac(`csrf:${token}`, config.sessionSecret);
  const absoluteExpiresAt = new Date(now.getTime() + ABSOLUTE_MS);
  const idleExpiresAt = new Date(now.getTime() + IDLE_MS);
  const session = await prisma.productAdminSession.create({
    data: {
      tokenHash: sha256(token),
      csrfHash: sha256(csrfToken),
      credentialFingerprint: "named-account-v2",
      adminAccountId: account.id,
      credentialVersion: account.credentialVersion,
      lastActivityAt: now,
      idleExpiresAt,
      absoluteExpiresAt,
    },
  });
  const cookie = `${cookieName(config)}=${token}.${signature}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${ABSOLUTE_MS / 1000}${config.production ? "; Secure" : ""}`;
  res.setHeader("Set-Cookie", cookie);
  return { session, sessionIdHash: sha256(session.id), csrfToken };
}

function sessionToken(req: NextApiRequest, config: ProductAdminSecurityConfig) {
  const value = parseCookies(req)[cookieName(config)];
  if (!value) return null;
  const separator = value.lastIndexOf(".");
  if (separator < 1) return null;
  const token = value.slice(0, separator);
  const signature = value.slice(separator + 1);
  return equal(signature, hmac(`session:${token}`, config.sessionSecret)) ? token : null;
}

export type AuthorizedProductAdminSession = {
  session: ProductAdminSession;
  account: AdminAccount;
  sessionIdHash: string;
  csrfToken: string;
};

export async function authorizeProductAdminSession(
  prisma: PrismaClient,
  req: NextApiRequest,
  res: NextApiResponse,
  config: ProductAdminSecurityConfig,
  options: { csrf?: boolean; now?: Date; touch?: boolean; allowPasswordChange?: boolean; requireSuperAdmin?: boolean } = {},
): Promise<AuthorizedProductAdminSession> {
  validateProductAdminEdge(req, config);
  const token = sessionToken(req, config);
  if (!token) throw new ProductAdminHttpError(401, "SESSION_INVALID");
  const now = options.now ?? new Date();
  const tokenHash = sha256(token);
  const session = await prisma.productAdminSession.findUnique({ where: { tokenHash }, include: { adminAccount: true } });
  if (!session || !session.adminAccount || session.revokedAt || session.idleExpiresAt <= now ||
      session.absoluteExpiresAt <= now || !session.adminAccount.enabled ||
      session.credentialVersion !== session.adminAccount.credentialVersion) {
    if (session && !session.revokedAt) {
      await prisma.productAdminSession.update({ where: { id: session.id }, data: { revokedAt: now } });
    }
    clearProductAdminCookie(res, config);
    throw new ProductAdminHttpError(401, "SESSION_EXPIRED");
  }
  const account = session.adminAccount;
  const csrfToken = hmac(`csrf:${token}`, config.sessionSecret);
  if (session.csrfHash !== sha256(csrfToken)) throw new ProductAdminHttpError(401, "SESSION_INVALID");
  if (account.mustChangePassword && !options.allowPasswordChange) {
    throw new ProductAdminHttpError(403, "PASSWORD_CHANGE_REQUIRED", undefined, account.id);
  }
  if (options.requireSuperAdmin && account.role !== "SUPER_ADMIN") {
    throw new ProductAdminHttpError(403, "ROLE_REJECTED", undefined, account.id);
  }
  if (options.csrf) {
    validateProductAdminOrigin(req, config);
    const supplied = req.headers["x-csrf-token"];
    if (typeof supplied !== "string" || !equal(supplied, csrfToken)) {
      throw new ProductAdminHttpError(403, "CSRF_REJECTED");
    }
  }
  let authorizedSession: ProductAdminSession = session;
  if (options.touch !== false) {
    const idleExpiresAt = new Date(Math.min(now.getTime() + IDLE_MS, session.absoluteExpiresAt.getTime()));
    authorizedSession = await prisma.productAdminSession.update({
      where: { id: session.id },
      data: { lastActivityAt: now, idleExpiresAt },
    });
  }
  return { session: authorizedSession, account, sessionIdHash: sha256(session.id), csrfToken };
}

export async function revokeProductAdminSession(prisma: PrismaClient, sessionId: string, now = new Date()) {
  await prisma.productAdminSession.updateMany({ where: { id: sessionId, revokedAt: null }, data: { revokedAt: now } });
}

export async function currentThrottle(
  prisma: PrismaClient,
  clientKey: string,
  accountKey?: string,
  now = new Date(),
) {
  const rows = await prisma.productAdminThrottle.findMany({
    where: { OR: [
      { scope: "CLIENT", keyHash: clientKey },
      { scope: "DEPLOYMENT", keyHash: "global" },
      ...(accountKey ? [{ scope: "ACCOUNT", keyHash: accountKey }] : []),
    ] },
  });
  const locked = rows.filter((row) => row.lockedUntil && row.lockedUntil > now)
    .sort((a, b) => b.lockedUntil!.getTime() - a.lockedUntil!.getTime())[0];
  return locked?.lockedUntil ? Math.max(1, Math.ceil((locked.lockedUntil.getTime() - now.getTime()) / 1000)) : null;
}

export async function currentDeploymentThrottle(prisma: PrismaClient, now = new Date()) {
  const row = await prisma.productAdminThrottle.findUnique({
    where: { scope_keyHash: { scope: "DEPLOYMENT", keyHash: "global" } },
  });
  return row?.lockedUntil && row.lockedUntil > now
    ? Math.max(1, Math.ceil((row.lockedUntil.getTime() - now.getTime()) / 1000))
    : null;
}

async function recordScopeFailure(
  prisma: PrismaClient,
  scope: "ACCOUNT" | "CLIENT" | "DEPLOYMENT",
  keyHash: string,
  limit: number,
  lockMs: number,
  now: Date,
) {
  const cutoff = new Date(now.getTime() - WINDOW_MS);
  await prisma.productAdminThrottle.updateMany({
    where: { scope, keyHash, windowStartedAt: { lt: cutoff } },
    data: { windowStartedAt: now, failureCount: 0, lockedUntil: null },
  });
  const row = await prisma.productAdminThrottle.upsert({
    where: { scope_keyHash: { scope, keyHash } },
    create: { scope, keyHash, windowStartedAt: now, failureCount: 1 },
    update: { failureCount: { increment: 1 } },
  });
  if (row.failureCount >= limit) {
    return prisma.productAdminThrottle.update({
      where: { scope_keyHash: { scope, keyHash } },
      data: { lockedUntil: new Date(now.getTime() + lockMs) },
    });
  }
  return row;
}

export async function recordProductAdminFailure(prisma: PrismaClient, clientKey: string, accountKey?: string, now = new Date()) {
  await prisma.$transaction(async (tx) => {
    await recordScopeFailure(tx as PrismaClient, "CLIENT", clientKey, 5, CLIENT_LOCK_MS, now);
    if (accountKey) await recordScopeFailure(tx as PrismaClient, "ACCOUNT", accountKey, 5, CLIENT_LOCK_MS, now);
    await recordScopeFailure(tx as PrismaClient, "DEPLOYMENT", "global", 50, DEPLOYMENT_LOCK_MS, now);
  });
  return currentThrottle(prisma, clientKey, accountKey, now);
}

export async function clearProductAdminClientThrottle(prisma: PrismaClient, clientKey: string) {
  await prisma.productAdminThrottle.deleteMany({ where: { scope: "CLIENT", keyHash: clientKey } });
}

export async function clearProductAdminAccountThrottle(prisma: PrismaClient, accountKey: string) {
  await prisma.productAdminThrottle.deleteMany({ where: { scope: "ACCOUNT", keyHash: accountKey } });
}

export async function auditProductAdminEvent(
  prisma: PrismaClient,
  data: {
    requestId: string; event: string; outcome: string; reason?: string;
    sessionIdHash?: string; productId?: number; expectedUpdatedAt?: Date;
    currentUpdatedAt?: Date; changedFields?: string[]; actorAccountId?: string; targetAccountId?: string;
  },
) {
  await prisma.productAdminAuditEvent.create({ data: { ...data, changedFields: data.changedFields ?? undefined } });
}
