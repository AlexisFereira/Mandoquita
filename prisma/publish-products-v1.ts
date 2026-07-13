import { PrismaClient } from "@prisma/client";
import { existsSync } from "node:fs";
import { join } from "node:path";

import inventory from "./data/products-v1.json";

const prisma = new PrismaClient();
const featuredProductIds = [
  // Preserve the approved editorial rhythm after source variants were
  // consolidated into unique Products: Acid Wash first, then alternate the
  // strongest watch, coffee and eyewear discovery candidates.
  200000,
  200021, 200044, 200022, 200045,
  200029, 200023, 200046, 200030,
  200024, 200031, 200025, 200032,
  200026, 200027, 200028,
];
const featuredOrderById = new Map(featuredProductIds.map((id, index) => [id, index + 1]));

function exactProductType(name: string, subcategory: string): string {
  if (subcategory === "camisetas") {
    if (/oversize/i.test(name)) return "Camiseta oversize";
    if (/básica/i.test(name)) return "Camiseta básica";
    return "Camiseta";
  }
  if (subcategory === "conjuntos-para-mujer") {
    if (/blusón/i.test(name)) return "Conjunto con blusón";
    if (/blusa y pantalón/i.test(name)) return "Conjunto de blusa y pantalón";
    return "Conjunto de camiseta y bermuda";
  }
  if (subcategory === "lentes") return /deportivos/i.test(name) ? "Lentes deportivos" : "Lentes de moda";
  if (subcategory === "ropa-deportiva-para-mujer") {
    if (/leggings/i.test(name)) return "Leggings";
    if (/^Top/i.test(name)) return "Top deportivo";
    if (/malla corta/i.test(name)) return "Malla corta";
    if (/falda short/i.test(name)) return "Falda short";
    return "Camiseta deportiva";
  }
  if (subcategory === "proteccion-para-motociclista") {
    if (/pasamontañas/i.test(name)) return "Pasamontañas";
    if (/mangas/i.test(name)) return "Mangas protectoras";
    return "Protector para calzado";
  }
  const singleLeafBySubcategory: Record<string, string> = {
    bodys: "Body",
    relojes: "Reloj",
    cafe: "Café",
    "pantalonetas-y-bermudas": "Pantaloneta",
    "soportes-para-celular": "Soporte para celular",
    billeteras: "Billetera",
    bolsos: "Bolso bandolera",
    "encendedores-de-cocina": "Encendedor para estufa",
    "maquinas-de-afeitar": "Máquina de afeitar",
    "comunicacion-para-casco": "Intercomunicador",
    "camaras-de-seguridad": "Cámara 360",
  };
  const productType = singleLeafBySubcategory[subcategory];
  if (!productType) throw new Error(`No approved Product Type rule for ${subcategory}: ${name}`);
  return productType;
}

async function main() {
  const taxonomy = await prisma.productType.findMany({
    where: { active: true, subcategory: { active: true, category: { active: true, version: { status: "ACTIVE" } } } },
    select: { name: true, subcategory: { select: { slug: true } } },
  });
  const approvedLeaves = new Set(taxonomy.map(({ name, subcategory }) => `${subcategory.slug}/${name}`));

  await prisma.$transaction(async (tx) => {
    for (const source of inventory.products) {
      const current = await tx.product.findUnique({ where: { id: source.id }, select: { slug: true } });
      if (!current || current.slug !== source.slug) throw new Error(`Seeded Product identity missing or changed: ${source.id}`);

      const productTypeId = exactProductType(source.name, source.subcategory.slug);
      if (!approvedLeaves.has(`${source.subcategory.slug}/${productTypeId}`)) {
        throw new Error(`Product Type ${productTypeId} is not an Active leaf of ${source.subcategory.slug}`);
      }

      const imageId = `product-${source.id}-primary`;
      const hasApprovedMedia = existsSync(join(process.cwd(), "public", source.imageUrl));
      if (hasApprovedMedia) {
        await tx.productImage.upsert({
          where: { id: imageId },
          create: {
            id: imageId,
            productId: source.id,
            url: source.imageUrl,
            altText: source.name,
            position: 0,
            isPrimary: true,
          },
          update: { url: source.imageUrl, altText: source.name, position: 0, isPrimary: true },
        });
      }

      const variantId = `product-${source.id}-base`;
      await tx.productVariant.upsert({
        where: { id: variantId },
        create: {
          id: variantId,
          productId: source.id,
          sku: `MDQ-${source.id}`,
          active: true,
          isBase: true,
          imageId: hasApprovedMedia ? imageId : null,
        },
        update: { active: true, isBase: true, imageId: hasApprovedMedia ? imageId : null },
      });
      if (!hasApprovedMedia) await tx.productImage.deleteMany({ where: { id: imageId } });

      const featuredOrder = featuredOrderById.get(source.id) ?? null;
      await tx.product.update({
        where: { id: source.id },
        data: {
          productTypeId,
          editorialApproved: true,
          published: true,
          active: true,
          commerciallyAvailable: source.commerciallyAvailable,
          featured: featuredOrder !== null,
          featuredOrder,
        },
      });
    }
  }, { timeout: 60_000 });

  console.log(
    `Published ${inventory.products.length} Products with explicit Taxonomy V1 leaves and ` +
      `one Base Variant/SKU each; ${featuredProductIds.length} curated Products are Featured.`,
  );
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
