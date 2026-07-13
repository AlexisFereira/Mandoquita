import type { NextApiRequest, NextApiResponse } from "next";
import { z, ZodError } from "zod";

import { prisma } from "../../../lib/prisma";
import {
  applyProductAdminHeaders,
  auditProductAdminEvent,
  authorizeProductAdminSession,
  clearProductAdminClientThrottle,
  clearProductAdminCookie,
  createProductAdminSession,
  currentThrottle,
  getProductAdminSecurityConfig,
  ProductAdminConfigurationError,
  ProductAdminHttpError,
  productAdminClientKey,
  productAdminRequestId,
  recordProductAdminFailure,
  revokeProductAdminSession,
  validateProductAdminEdge,
  validateProductAdminOrigin,
  verifyProductAdminCode,
} from "../../../src/server/productAdminSecurity";

const accessSchema = z.object({ code: z.string().regex(/^\d{6}$/) }).strict();
type ErrorBody = { error: string };
type SessionBody = { authorized: true; idleExpiresAt: string; absoluteExpiresAt: string; csrfToken: string };

type Dependencies = {
  prismaClient: typeof prisma;
  now: () => Date;
};
const defaults: Dependencies = { prismaClient: prisma, now: () => new Date() };

function safeError(res: NextApiResponse, error: unknown) {
  if (error instanceof ProductAdminHttpError) {
    if (error.retryAfter) res.setHeader("Retry-After", String(error.retryAfter));
    const message = error.status === 429 ? "Access temporarily unavailable" :
      error.status === 503 ? "Product Admin is unavailable" :
      error.status === 403 ? "Forbidden" : "Unauthorized";
    return res.status(error.status).json({ error: message });
  }
  if (error instanceof ZodError) return res.status(401).json({ error: "Unauthorized" });
  if (error instanceof ProductAdminConfigurationError) return res.status(503).json({ error: "Product Admin is unavailable" });
  return res.status(500).json({ error: "Unexpected server error" });
}

export async function handleProductAdminSession(
  req: NextApiRequest,
  res: NextApiResponse<SessionBody | ErrorBody | void>,
  dependencies: Dependencies = defaults,
) {
  applyProductAdminHeaders(res);
  if (!req.method || !["POST", "GET", "DELETE"].includes(req.method)) {
    res.setHeader("Allow", "POST, GET, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const requestId = productAdminRequestId(req);
  const now = dependencies.now();

  try {
    const config = getProductAdminSecurityConfig();
    validateProductAdminEdge(req, config);

    if (req.method === "POST") {
      validateProductAdminOrigin(req, config);
      const clientKey = productAdminClientKey(req, config);
      const retryAfter = await currentThrottle(dependencies.prismaClient, clientKey, now);
      if (retryAfter) {
        await auditProductAdminEvent(dependencies.prismaClient, {
          requestId, event: "ACCESS", outcome: "DENIED", reason: "THROTTLED",
        });
        throw new ProductAdminHttpError(429, "THROTTLED", retryAfter);
      }

      const parsed = accessSchema.safeParse(req.body);
      const valid = await verifyProductAdminCode(parsed.success ? parsed.data.code : undefined, config.codeHash);
      if (!valid) {
        const lockedFor = await recordProductAdminFailure(dependencies.prismaClient, clientKey, now);
        await auditProductAdminEvent(dependencies.prismaClient, {
          requestId, event: "ACCESS", outcome: "DENIED", reason: lockedFor ? "THROTTLED" : "INVALID",
        });
        throw new ProductAdminHttpError(lockedFor ? 429 : 401, "ACCESS_DENIED", lockedFor ?? undefined);
      }

      const { session, sessionIdHash, csrfToken } = await createProductAdminSession(dependencies.prismaClient, res, config, now);
      try {
        await clearProductAdminClientThrottle(dependencies.prismaClient, clientKey);
        await auditProductAdminEvent(dependencies.prismaClient, {
          requestId, event: "ACCESS", outcome: "SUCCESS",
          sessionIdHash,
        });
      } catch (error) {
        await revokeProductAdminSession(dependencies.prismaClient, session.id, now);
        clearProductAdminCookie(res, config);
        throw error;
      }
      return res.status(200).json({
        authorized: true,
        idleExpiresAt: session.idleExpiresAt.toISOString(),
        absoluteExpiresAt: session.absoluteExpiresAt.toISOString(),
        csrfToken,
      });
    }

    if (req.method === "GET") {
      const authorized = await authorizeProductAdminSession(
        dependencies.prismaClient, req, res, config, { now },
      );
      return res.status(200).json({
        authorized: true,
        idleExpiresAt: authorized.session.idleExpiresAt.toISOString(),
        absoluteExpiresAt: authorized.session.absoluteExpiresAt.toISOString(),
        csrfToken: authorized.csrfToken,
      });
    }

    let authorized;
    try {
      authorized = await authorizeProductAdminSession(
        dependencies.prismaClient, req, res, config, { now, csrf: true, touch: false },
      );
    } catch (error) {
      clearProductAdminCookie(res, config);
      if (error instanceof ProductAdminHttpError && error.status === 401) return res.status(204).end();
      throw error;
    }
    await revokeProductAdminSession(dependencies.prismaClient, authorized.session.id, now);
    await auditProductAdminEvent(dependencies.prismaClient, {
      requestId, event: "SESSION", outcome: "REVOKED", sessionIdHash: authorized.sessionIdHash,
    });
    clearProductAdminCookie(res, config);
    return res.status(204).end();
  } catch (error) {
    if ((req.method === "GET" || req.method === "DELETE") &&
        error instanceof ProductAdminHttpError && (error.status === 401 || error.status === 403)) {
      try {
        await auditProductAdminEvent(dependencies.prismaClient, {
          requestId, event: "SESSION", outcome: "DENIED", reason: error.reason,
        });
      } catch {
        return res.status(503).json({ error: "Product Admin is unavailable" });
      }
    }
    return safeError(res, error);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return handleProductAdminSession(req, res);
}
