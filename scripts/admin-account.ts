import "dotenv/config";

import { prisma } from "../lib/prisma";
import {
  adminUsernameSchema,
  hashAdminPassword,
  normalizeAdminUsername,
  validateAdminPassword,
} from "../src/server/adminAccountService";
import { getProductAdminSecurityConfig, productAdminAccountKey } from "../src/server/productAdminSecurity";

async function main() {
  const [action, rawUsername] = process.argv.slice(2);
  if (!action || !["bootstrap", "reset"].includes(action) || !rawUsername) {
    throw new Error("Usage: npm run admin:account -- <bootstrap|reset> <username>");
  }
  const username = adminUsernameSchema.parse(rawUsername);
  const passwordInput = process.env.ADMIN_ACCOUNT_PASSWORD;
  const config = getProductAdminSecurityConfig();
  const password = validateAdminPassword(passwordInput, username, config.passwordBlocklist);
  const passwordHash = await hashAdminPassword(password, config.passwordPepper);
  const normalizedUsername = normalizeAdminUsername(username);
  const now = new Date();

  if (action === "bootstrap") {
    const existing = await prisma.adminAccount.findFirst({ where: { role: "SUPER_ADMIN" }, select: { id: true } });
    if (existing) throw new Error("Superadministrator already exists; use reset for emergency credential rotation");
    await prisma.adminAccount.create({ data: {
      username, normalizedUsername, passwordHash, role: "SUPER_ADMIN", enabled: true,
      mustChangePassword: true,
    } });
    console.log(`Superadministrator '${username}' bootstrapped; temporary password was not displayed.`);
    return;
  }

  const existing = await prisma.adminAccount.findFirst({ where: { role: "SUPER_ADMIN" } });
  if (!existing || existing.normalizedUsername !== normalizedUsername) {
    throw new Error("Superadministrator username does not match the protected account");
  }
  await prisma.$transaction(async (tx) => {
    await tx.adminAccount.update({ where: { id: existing.id }, data: {
      passwordHash, enabled: true, mustChangePassword: true, passwordChangedAt: now,
      credentialVersion: { increment: 1 },
    } });
    await tx.productAdminSession.updateMany({
      where: { adminAccountId: existing.id, revokedAt: null }, data: { revokedAt: now },
    });
    await tx.productAdminThrottle.deleteMany({
      where: { scope: "ACCOUNT", keyHash: productAdminAccountKey(existing.normalizedUsername, config) },
    });
    await tx.productAdminAuditEvent.create({ data: {
      requestId: `deployment-${now.getTime()}`, event: "SUPER_ADMIN_EMERGENCY_RESET",
      outcome: "SUCCESS", actorAccountId: existing.id, targetAccountId: existing.id,
    } });
  });
  console.log(`Superadministrator '${username}' reset; every previous session was revoked.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Admin account command failed");
  process.exitCode = 1;
}).finally(async () => prisma.$disconnect());
