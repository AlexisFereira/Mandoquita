import type { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";

import {
  applyProductAdminHeaders,
  authorizeProductAdminSession,
  getProductAdminSecurityConfig,
  ProductAdminConfigurationError,
  ProductAdminHttpError,
  auditProductAdminEvent,
  productAdminRequestId,
} from "./productAdminSecurity";
import { AdminAccountConflictError, AdminAccountPolicyError } from "./adminAccountService";

export async function requireProductAdmin(
  prisma: PrismaClient,
  req: NextApiRequest,
  res: NextApiResponse,
  options: { csrf?: boolean; allowPasswordChange?: boolean; requireSuperAdmin?: boolean } = {},
) {
  applyProductAdminHeaders(res);
  const config = getProductAdminSecurityConfig();
  try {
    return await authorizeProductAdminSession(prisma, req, res, config, options);
  } catch (error) {
    if (error instanceof ProductAdminHttpError && (error.status === 401 || error.status === 403)) {
      const rawId = req.query.id;
      const value = Array.isArray(rawId) ? rawId[0] : rawId;
      const productId = value && /^[1-9]\d*$/.test(value) ? Number(value) : undefined;
      await auditProductAdminEvent(prisma, {
        requestId: productAdminRequestId(req),
        event: "ADMIN_REQUEST",
        outcome: "DENIED",
        reason: error.reason,
        actorAccountId: error.actorAccountId,
        productId: Number.isSafeInteger(productId) ? productId : undefined,
      });
    }
    throw error;
  }
}

export function respondProductAdminError(res: NextApiResponse, error: unknown) {
  if (error instanceof ZodError) return res.status(400).json({ error: "Invalid request" });
  if (error instanceof AdminAccountPolicyError) return res.status(400).json({ error: "Password does not meet policy" });
  if (error instanceof AdminAccountConflictError) return res.status(409).json({ error: "Account conflicts with current state" });
  if (error instanceof ProductAdminHttpError) {
    if (error.retryAfter) res.setHeader("Retry-After", String(error.retryAfter));
    return res.status(error.status).json({
      error: error.status === 401 ? "Unauthorized" :
        error.status === 403 ? "Forbidden" :
        error.status === 429 ? "Temporarily unavailable" :
        error.status === 503 ? "Product Admin is unavailable" : "Request failed",
    });
  }
  if (error instanceof ProductAdminConfigurationError) {
    return res.status(503).json({ error: "Product Admin is unavailable" });
  }
  return res.status(500).json({ error: "Unexpected server error" });
}
