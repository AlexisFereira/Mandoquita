import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function ensureSuperAdmin() {
  const username = process.env.ADMIN_BOOTSTRAP_USERNAME;
  const passwordHash = process.env.ADMIN_BOOTSTRAP_PASSWORD_HASH;

  // Si no están configuradas, salir silenciosamente
  if (!username || !passwordHash) {
    console.log(
      "[seed-admin] ADMIN_BOOTSTRAP_USERNAME o ADMIN_BOOTSTRAP_PASSWORD_HASH no están definidas. Saltando.",
    );
    return;
  }

  // Idempotente: si ya existe, no hace nada
  const normalizedUsername = username.toLowerCase();
  const existing = await prisma.adminAccount.findFirst({
    where: { normalizedUsername },
  });

  if (existing) {
    console.log(
      `[seed-admin] La cuenta "${username}" ya existe. No se hace nada.`,
    );
    return;
  }

  // Crear la cuenta
  await prisma.adminAccount.create({
    data: {
      username,
      normalizedUsername,
      passwordHash, // Ya viene hasheado de Amplify
      role: "SUPER_ADMIN",
      enabled: true,
      mustChangePassword: true, // ⚠️ Obliga al primer cambio
      credentialVersion: 1,
    },
  });

  console.log(
    `[seed-admin] ✅ Super admin "${username}" creado con mustChangePassword=true.`,
  );
}

ensureSuperAdmin()
  .catch((error) => {
    console.error("[seed-admin] ❌ Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
