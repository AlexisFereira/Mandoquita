import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { prisma } from "../../../../lib/prisma";
import {
  adminUsernameSchema,
  assertAdminUsernameAvailable,
  hashAdminPassword,
  normalizeAdminUsername,
  safeAdminAccount,
  validateAdminPassword,
  verifyAdminPassword,
} from "../../../../src/server/adminAccountService";
import { requireProductAdmin, respondProductAdminError } from "../../../../src/server/productAdminApi";
import {
  applyProductAdminHeaders,
  getProductAdminSecurityConfig,
  ProductAdminHttpError,
  productAdminRequestId,
} from "../../../../src/server/productAdminSecurity";

const createSchema = z.object({
  username: adminUsernameSchema,
  temporaryPassword: z.string().max(256),
  currentPassword: z.string().max(256),
}).strict();

export async function handleAdminAccounts(req: NextApiRequest, res: NextApiResponse) {
  applyProductAdminHeaders(res);
  if (!req.method || !["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const authorized = await requireProductAdmin(prisma, req, res, {
      csrf: req.method === "POST", requireSuperAdmin: true,
    });
    if (req.method === "GET") {
      const accounts = await prisma.adminAccount.findMany({ orderBy: [{ role: "asc" }, { username: "asc" }] });
      return res.status(200).json({ items: accounts.map(safeAdminAccount) });
    }

    const input = createSchema.parse(req.body);
    const config = getProductAdminSecurityConfig();
    if (!await verifyAdminPassword(input.currentPassword, authorized.account.passwordHash, config.passwordPepper)) {
      await prisma.productAdminAuditEvent.create({ data: {
        requestId: productAdminRequestId(req), event: "ADMIN_ACCOUNT_CREATE", outcome: "DENIED",
        reason: "FRESH_AUTH_REJECTED", actorAccountId: authorized.account.id,
        sessionIdHash: authorized.sessionIdHash,
      } });
      throw new ProductAdminHttpError(401, "FRESH_AUTH_REJECTED");
    }
    const password = validateAdminPassword(input.temporaryPassword, input.username, config.passwordBlocklist);
    const passwordHash = await hashAdminPassword(password, config.passwordPepper);
    const account = await prisma.$transaction(async (tx) => {
      const normalizedUsername = await assertAdminUsernameAvailable(tx, input.username);
      const created = await tx.adminAccount.create({ data: {
        username: input.username,
        normalizedUsername,
        passwordHash,
        role: "ADMIN",
        enabled: true,
        mustChangePassword: true,
      } });
      await tx.productAdminAuditEvent.create({ data: {
        requestId: productAdminRequestId(req), event: "ADMIN_ACCOUNT_CREATE", outcome: "SUCCESS",
        actorAccountId: authorized.account.id, targetAccountId: created.id,
        sessionIdHash: authorized.sessionIdHash,
      } });
      return created;
    });
    return res.status(201).json({ item: safeAdminAccount(account) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(409).json({ error: "Username is already reserved" });
    }
    return respondProductAdminError(res, error);
  }
}

export default handleAdminAccounts;
