import type { NextApiRequest, NextApiResponse } from "next";
import { z, ZodError } from "zod";

import { prisma } from "../../../lib/prisma";
import {
  dummyAdminPasswordHash,
  hashAdminPassword,
  normalizeAdminUsername,
  validateAdminPassword,
  verifyAdminPassword,
} from "../../../src/server/adminAccountService";
import {
  applyProductAdminHeaders,
  auditProductAdminEvent,
  authorizeProductAdminSession,
  clearProductAdminAccountThrottle,
  clearProductAdminClientThrottle,
  clearProductAdminCookie,
  createProductAdminSession,
  currentDeploymentThrottle,
  currentThrottle,
  getProductAdminSecurityConfig,
  ProductAdminConfigurationError,
  ProductAdminHttpError,
  productAdminAccountKey,
  productAdminClientKey,
  productAdminRequestId,
  recordProductAdminFailure,
  revokeProductAdminSession,
  validateProductAdminEdge,
  validateProductAdminOrigin,
} from "../../../src/server/productAdminSecurity";

const accessSchema = z.object({
  username: z.string().min(1).max(128),
  password: z.string().max(256),
}).strict();
const passwordChangeSchema = z.object({
  currentPassword: z.string().max(256),
  newPassword: z.string().max(256),
}).strict();

type Dependencies = { prismaClient: typeof prisma; now: () => Date };
const defaults: Dependencies = { prismaClient: prisma, now: () => new Date() };

function safeError(res: NextApiResponse, error: unknown) {
  if (error instanceof ProductAdminHttpError) {
    if (error.retryAfter) res.setHeader("Retry-After", String(error.retryAfter));
    return res.status(error.status).json({
      error: error.status === 429 ? "Access temporarily unavailable" :
        error.status === 503 ? "Product Admin is unavailable" :
        error.status === 403 ? "Forbidden" : "Unauthorized",
    });
  }
  if (error instanceof ZodError) return res.status(400).json({ error: "Invalid request" });
  if (error instanceof ProductAdminConfigurationError) return res.status(503).json({ error: "Product Admin is unavailable" });
  return res.status(500).json({ error: "Unexpected server error" });
}

function sessionResponse(authorized: Awaited<ReturnType<typeof authorizeProductAdminSession>>) {
  return {
    authorized: true as const,
    idleExpiresAt: authorized.session.idleExpiresAt.toISOString(),
    absoluteExpiresAt: authorized.session.absoluteExpiresAt.toISOString(),
    csrfToken: authorized.csrfToken,
    account: {
      id: authorized.account.id,
      username: authorized.account.username,
      role: authorized.account.role,
      mustChangePassword: authorized.account.mustChangePassword,
    },
  };
}

export async function handleProductAdminSession(
  req: NextApiRequest,
  res: NextApiResponse,
  dependencies: Dependencies = defaults,
) {
  applyProductAdminHeaders(res);
  if (!req.method || !["POST", "GET", "PATCH", "DELETE"].includes(req.method)) {
    res.setHeader("Allow", "POST, GET, PATCH, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const requestId = productAdminRequestId(req);
  const now = dependencies.now();

  try {
    const config = getProductAdminSecurityConfig();
    validateProductAdminEdge(req, config);

    if (req.method === "POST") {
      validateProductAdminOrigin(req, config);
      const parsed = accessSchema.safeParse(req.body);
      const normalizedUsername = normalizeAdminUsername(parsed.success ? parsed.data.username : "invalid");
      const clientKey = productAdminClientKey(req, config);
      const accountKey = productAdminAccountKey(normalizedUsername, config);
      const deploymentRetryAfter = await currentDeploymentThrottle(dependencies.prismaClient, now);
      if (deploymentRetryAfter) {
        await auditProductAdminEvent(dependencies.prismaClient, {
          requestId, event: "ACCOUNT_ACCESS", outcome: "DENIED", reason: "THROTTLED",
        });
        throw new ProductAdminHttpError(429, "THROTTLED", deploymentRetryAfter);
      }

      const account = await dependencies.prismaClient.adminAccount.findUnique({ where: { normalizedUsername } });
      const dummyHash = await dummyAdminPasswordHash(config.passwordPepper);
      const passwordHash = account?.passwordHash ?? dummyHash;
      const passwordValid = await verifyAdminPassword(parsed.success ? parsed.data.password : undefined, passwordHash, config.passwordPepper);
      if (!parsed.success || !account?.enabled || !passwordValid) {
        const retryAfter = await currentThrottle(dependencies.prismaClient, clientKey, accountKey, now);
        if (retryAfter) {
          await auditProductAdminEvent(dependencies.prismaClient, {
            requestId, event: "ACCOUNT_ACCESS", outcome: "DENIED", reason: "THROTTLED",
          });
          throw new ProductAdminHttpError(429, "THROTTLED", retryAfter);
        }
        const lockedFor = await recordProductAdminFailure(dependencies.prismaClient, clientKey, accountKey, now);
        await auditProductAdminEvent(dependencies.prismaClient, {
          requestId, event: "ACCOUNT_ACCESS", outcome: "DENIED", reason: lockedFor ? "THROTTLED" : "INVALID",
        });
        throw new ProductAdminHttpError(lockedFor ? 429 : 401, "ACCESS_DENIED", lockedFor ?? undefined);
      }

      const created = await createProductAdminSession(dependencies.prismaClient, res, config, account, now);
      try {
        await dependencies.prismaClient.$transaction([
          dependencies.prismaClient.adminAccount.update({ where: { id: account.id }, data: { lastLoginAt: now } }),
          dependencies.prismaClient.productAdminThrottle.deleteMany({
            where: { OR: [{ scope: "CLIENT", keyHash: clientKey }, { scope: "ACCOUNT", keyHash: accountKey }] },
          }),
          dependencies.prismaClient.productAdminAuditEvent.create({ data: {
            requestId, event: "ACCOUNT_ACCESS", outcome: "SUCCESS", actorAccountId: account.id,
            sessionIdHash: created.sessionIdHash,
          } }),
        ]);
      } catch (error) {
        await revokeProductAdminSession(dependencies.prismaClient, created.session.id, now);
        clearProductAdminCookie(res, config);
        throw error;
      }
      return res.status(200).json(sessionResponse({ ...created, account }));
    }

    if (req.method === "GET") {
      const authorized = await authorizeProductAdminSession(
        dependencies.prismaClient, req, res, config, { now, allowPasswordChange: true },
      );
      return res.status(200).json(sessionResponse(authorized));
    }

    if (req.method === "PATCH") {
      const authorized = await authorizeProductAdminSession(
        dependencies.prismaClient, req, res, config, { now, csrf: true, allowPasswordChange: true, touch: false },
      );
      const input = passwordChangeSchema.parse(req.body);
      if (!await verifyAdminPassword(input.currentPassword, authorized.account.passwordHash, config.passwordPepper)) {
        throw new ProductAdminHttpError(401, "ACCESS_DENIED");
      }
      const password = validateAdminPassword(
        input.newPassword, authorized.account.username, config.passwordBlocklist,
      );
      if (await verifyAdminPassword(password, authorized.account.passwordHash, config.passwordPepper)) {
        return res.status(409).json({ error: "New password must be different" });
      }
      const passwordHash = await hashAdminPassword(password, config.passwordPepper);
      const updated = await dependencies.prismaClient.$transaction(async (tx) => {
        const account = await tx.adminAccount.update({
          where: { id: authorized.account.id },
          data: { passwordHash, mustChangePassword: false, passwordChangedAt: now, credentialVersion: { increment: 1 } },
        });
        await tx.productAdminSession.updateMany({
          where: { adminAccountId: account.id, revokedAt: null }, data: { revokedAt: now },
        });
        await tx.productAdminAuditEvent.create({ data: {
          requestId, event: "PASSWORD_CHANGE", outcome: "SUCCESS", actorAccountId: account.id,
          sessionIdHash: authorized.sessionIdHash,
        } });
        return account;
      });
      const replacement = await createProductAdminSession(dependencies.prismaClient, res, config, updated, now);
      return res.status(200).json(sessionResponse({ ...replacement, account: updated }));
    }

    let authorized;
    try {
      authorized = await authorizeProductAdminSession(
        dependencies.prismaClient, req, res, config, { now, csrf: true, touch: false, allowPasswordChange: true },
      );
    } catch (error) {
      clearProductAdminCookie(res, config);
      if (error instanceof ProductAdminHttpError && error.status === 401) return res.status(204).end();
      throw error;
    }
    await revokeProductAdminSession(dependencies.prismaClient, authorized.session.id, now);
    await auditProductAdminEvent(dependencies.prismaClient, {
      requestId, event: "SESSION", outcome: "REVOKED", sessionIdHash: authorized.sessionIdHash,
      actorAccountId: authorized.account.id,
    });
    clearProductAdminCookie(res, config);
    return res.status(204).end();
  } catch (error) {
    return safeError(res, error);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return handleProductAdminSession(req, res);
}
