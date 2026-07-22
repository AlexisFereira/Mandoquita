import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { prisma } from "../../../../lib/prisma";
import {
  hashAdminPassword,
  safeAdminAccount,
  validateAdminPassword,
  verifyAdminPassword,
} from "../../../../src/server/adminAccountService";
import { requireProductAdmin, respondProductAdminError } from "../../../../src/server/productAdminApi";
import {
  applyProductAdminHeaders,
  getProductAdminSecurityConfig,
  ProductAdminHttpError,
  productAdminAccountKey,
  productAdminRequestId,
} from "../../../../src/server/productAdminSecurity";

const mutationSchema = z.object({
  action: z.enum(["reset", "deactivate", "reactivate"]),
  expectedUpdatedAt: z.string().datetime({ offset: true }),
  currentPassword: z.string().max(256),
  temporaryPassword: z.string().max(256).optional(),
}).strict().superRefine((value, context) => {
  if ((value.action === "reset" || value.action === "reactivate") && !value.temporaryPassword) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["temporaryPassword"], message: "Temporary password required" });
  }
  if (value.action === "deactivate" && value.temporaryPassword !== undefined) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["temporaryPassword"], message: "Unexpected temporary password" });
  }
});

export async function handleAdminAccount(req: NextApiRequest, res: NextApiResponse) {
  applyProductAdminHeaders(res);
  if (req.method !== "PATCH") {
    res.setHeader("Allow", "PATCH");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const authorized = await requireProductAdmin(prisma, req, res, { csrf: true, requireSuperAdmin: true });
    const targetId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    if (!targetId)
      return res.status(400).json({ error: "Invalid account ID" });

    if (targetId === authorized.account.id)
      return res.status(409).json({ error: "The protected Superadministrator cannot be changed here" });
    const input = mutationSchema.parse(req.body);
    const config = getProductAdminSecurityConfig();
    if (!await verifyAdminPassword(input.currentPassword, authorized.account.passwordHash, config.passwordPepper)) {
      await prisma.productAdminAuditEvent.create({
        data: {
          requestId: productAdminRequestId(req), event: `ADMIN_ACCOUNT_${input.action.toUpperCase()}`,
          outcome: "DENIED", reason: "FRESH_AUTH_REJECTED", actorAccountId: authorized.account.id,
          targetAccountId: targetId, sessionIdHash: authorized.sessionIdHash,
        }
      });
      throw new ProductAdminHttpError(401, "FRESH_AUTH_REJECTED");
    }
    const target = await prisma.adminAccount.findUnique({ where: { id: targetId } });

    if (req.query.action === "bootstrap") {
      if (process.env.NODE_ENV === "production") {
        return res.status(403).json({ error: "Bootstrap is disabled in production", });
      }
    }

    if (!target || target.role !== "ADMIN")
      return res.status(404).json({ error: "Administrator not found" });

    if (target.updatedAt.getTime() !== new Date(input.expectedUpdatedAt).getTime()) {
      return res.status(409).json({ error: "Administrator changed since it was read" });
    }
    if (input.action === "deactivate" && !target.enabled)
      return res.status(409).json({ error: "Administrator is already inactive" });

    if (input.action === "reactivate" && target.enabled)
      return res.status(409).json({ error: "Administrator is already active" });

    if (input.action === "reset" && !target.enabled)
      return res.status(409).json({ error: "Inactive Administrator must be reactivated" });

    let passwordHash: string | undefined;
    if (input.temporaryPassword) {
      const password = validateAdminPassword(input.temporaryPassword, target.username, config.passwordBlocklist);

      if (await verifyAdminPassword(password, target.passwordHash, config.passwordPepper)) {
        return res.status(409).json({ error: "Temporary password must replace the current credential" });
      }
      passwordHash = await hashAdminPassword(password, config.passwordPepper);
    }
    const now = new Date();
    const item = await prisma.$transaction(async (tx) => {

      const updated = await tx.adminAccount.update({
        where: { id: target.id, updatedAt: target.updatedAt },
        data: input.action === "deactivate" ? {
          enabled: false, credentialVersion: { increment: 1 },
        } : {
          enabled: true, passwordHash: passwordHash!, mustChangePassword: true,
          passwordChangedAt: now, credentialVersion: { increment: 1 },
        },
      });

      await tx.productAdminSession.updateMany({
        where: { adminAccountId: target.id, revokedAt: null }, data: { revokedAt: now },
      });

      await tx.productAdminThrottle.deleteMany({
        where: { scope: "ACCOUNT", keyHash: productAdminAccountKey(target.normalizedUsername, config) },
      });

      await tx.productAdminAuditEvent.create({
        data: {
          requestId: productAdminRequestId(req),
          event: `ADMIN_ACCOUNT_${input.action.toUpperCase()}`,
          outcome: "SUCCESS", actorAccountId: authorized.account.id, targetAccountId: target.id,
          sessionIdHash: authorized.sessionIdHash, expectedUpdatedAt: target.updatedAt,
          currentUpdatedAt: updated.updatedAt,
        }
      });
      return updated;
    });

    return res.status(200).json({ item: safeAdminAccount(item) });

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return res.status(409).json({ error: "Administrator changed since it was read" });
    }
    return respondProductAdminError(res, error);
  }
}

export default handleAdminAccount;
