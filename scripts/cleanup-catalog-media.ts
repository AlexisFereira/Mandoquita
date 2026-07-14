import "dotenv/config";
import { PrismaClient } from "@prisma/client";

import { cleanupCatalogMedia } from "../src/server/catalogMediaService";

const prisma = new PrismaClient();

cleanupCatalogMedia(prisma)
  .then((result) => console.log("Catalog media cleanup completed", result))
  .catch((error) => {
    console.error("Catalog media cleanup failed", error instanceof Error ? error.name : "UnknownError");
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
