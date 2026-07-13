import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [categories, subcategories, productTypes] = await Promise.all([
    prisma.category.count({ where: { version: { version: "1.0.0", status: "ACTIVE" } } }),
    prisma.subcategory.count({ where: { category: { version: { version: "1.0.0" } } } }),
    prisma.productType.count({
      where: { subcategory: { category: { version: { version: "1.0.0" } } } },
    }),
  ]);

  if (categories !== 7 || subcategories !== 16 || productTypes !== 30) {
    throw new Error(
      `Taxonomy 1.0.0 integrity failed: ${categories} categories, ` +
        `${subcategories} subcategories, ${productTypes} product types`
    );
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
