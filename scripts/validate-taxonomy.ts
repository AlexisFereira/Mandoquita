import { PrismaClient } from "@prisma/client";
import { existsSync } from "node:fs";
import { join } from "node:path";

const prisma = new PrismaClient();

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const expectedTaxonomy = [
  ["cat_ropa_moda", "ropa-y-moda", [
    ["sub_camisetas", "camisetas", ["Camiseta", "Camiseta oversize", "Camiseta básica"]],
    ["sub_conjuntos_mujer", "conjuntos-para-mujer", ["Conjunto de blusa y pantalón", "Conjunto de camiseta y bermuda", "Conjunto con blusón"]],
    ["sub_bodys", "bodys", ["Body"]],
    ["sub_ropa_deportiva_mujer", "ropa-deportiva-para-mujer", ["Leggings", "Top deportivo", "Malla corta", "Falda short", "Camiseta deportiva"]],
    ["sub_pantalonetas_bermudas", "pantalonetas-y-bermudas", ["Pantaloneta", "Bermuda"]],
  ]],
  ["cat_accesorios_moda", "accesorios-de-moda", [
    ["sub_relojes", "relojes", ["Reloj"]],
    ["sub_lentes", "lentes", ["Lentes de moda", "Lentes deportivos"]],
    ["sub_bolsos", "bolsos", ["Bolso", "Bolso bandolera"]],
    ["sub_billeteras", "billeteras", ["Billetera"]],
  ]],
  ["cat_accesorios_moto", "accesorios-para-moto", [
    ["sub_proteccion_motociclista", "proteccion-para-motociclista", ["Pasamontañas", "Mangas protectoras", "Protector para calzado"]],
    ["sub_soportes_celular_moto", "soportes-para-celular", ["Soporte para celular"]],
    ["sub_comunicacion_casco", "comunicacion-para-casco", ["Intercomunicador"]],
  ]],
  ["cat_electronica_seguridad", "electronica-y-seguridad", [
    ["sub_camaras_seguridad", "camaras-de-seguridad", ["Cámara de seguridad", "Cámara 360"]],
  ]],
  ["cat_belleza_cuidado", "belleza-y-cuidado-personal", [
    ["sub_maquinas_afeitar", "maquinas-de-afeitar", ["Máquina de afeitar"]],
  ]],
  ["cat_hogar_cocina", "hogar-y-cocina", [
    ["sub_encendedores_cocina", "encendedores-de-cocina", ["Encendedor para estufa"]],
  ]],
  ["cat_alimentos_bebidas", "alimentos-y-bebidas", [
    ["sub_cafe", "cafe", ["Café"]],
  ]],
] as const;

async function main() {
  const [activeVersions, categories, subcategories, productTypes, publishedOrphans] =
    await Promise.all([
      prisma.taxonomyVersion.count({ where: { status: "ACTIVE" } }),
      prisma.category.findMany({
        where: { version: { version: "1.0.0" } },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          slug: true,
          imagePath: true,
          imageAltText: true,
          imageObjectKey: true,
          imageContentType: true,
          imageWidth: true,
          imageHeight: true,
          imageSize: true,
          imageChecksum: true,
          sortOrder: true,
          active: true,
          subcategories: {
            orderBy: [{ sourceOrder: "asc" }, { id: "asc" }],
            select: {
              id: true,
              slug: true,
              productTypes: {
                orderBy: [{ sourceOrder: "asc" }, { name: "asc" }],
                select: { name: true },
              },
            },
          },
        },
      }),
      prisma.subcategory.count({ where: { category: { version: { version: "1.0.0" } } } }),
      prisma.productType.count({
        where: { subcategory: { category: { version: { version: "1.0.0" } } } },
      }),
      prisma.product.count({ where: { published: true, productTypeId: null } }),
    ]);

  assert(activeVersions === 1, `Expected one ACTIVE taxonomy, found ${activeVersions}`);
  assert(categories.length === 7, `Expected 7 Categories, found ${categories.length}`);
  assert(subcategories === 16, `Expected 16 Subcategories, found ${subcategories}`);
  assert(productTypes === 30, `Expected 30 Product Types, found ${productTypes}`);
  assert(publishedOrphans === 0, `Found ${publishedOrphans} published orphan Products`);
  assert(
    categories.every((category, index) => category.sortOrder === index + 1),
    "Category business order is not 1 through 7"
  );
  assert(categories.every((category) => category.active), "An approved Category is inactive");
  assert(categories.every((category) => {
    if (!category.imagePath || !category.imageAltText?.trim()) return false;
    if (category.imagePath.startsWith("/")) {
      return category.imagePath === `/images/categories/${category.slug}.png` &&
        existsSync(join(process.cwd(), "public", category.imagePath));
    }
    try {
      const url = new URL(category.imagePath);
      return url.protocol === "https:" && Boolean(category.imageObjectKey) &&
        url.pathname.endsWith(`/${category.imageObjectKey}`) &&
        Boolean(category.imageContentType?.startsWith("image/")) &&
        Number(category.imageWidth) > 0 && Number(category.imageHeight) > 0 &&
        Number(category.imageSize) > 0 && Boolean(category.imageChecksum);
    } catch {
      return false;
    }
  }), "A Category local or managed media reference is incomplete");
  assert(
    new Set(categories.map(({ id }) => id)).size === categories.length &&
      new Set(categories.map(({ slug }) => slug)).size === categories.length,
    "A Category identifier or slug collision exists"
  );

  const actualTaxonomy = categories.map((category) => [
    category.id,
    category.slug,
    category.subcategories.map((subcategory) => [
      subcategory.id,
      subcategory.slug,
      subcategory.productTypes.map(({ name }) => name),
    ]),
  ]);
  assert(
    JSON.stringify(actualTaxonomy) === JSON.stringify(expectedTaxonomy),
    "Persisted taxonomy does not exactly match taxonomy.md hierarchy, identifiers, slugs, or source order"
  );

  const allSubcategories = categories.flatMap(({ subcategories }) => subcategories);
  assert(
    new Set(allSubcategories.map(({ id }) => id)).size === allSubcategories.length &&
      new Set(allSubcategories.map(({ slug }) => slug)).size === allSubcategories.length,
    "A Subcategory identifier or slug collision exists"
  );

  const retiredSlugs = [
    "wireless-headset-pro",
    "mechanical-keyboard-tkl",
    "usb-c-dock-8in1",
    "studio-speaker-duo",
    "noise-cancel-earbuds",
    "ultrabook-14",
    "4k-monitor-27",
    "ceramic-table-lamp",
    "linen-storage-basket",
    "walnut-side-table",
  ];
  assert(
    (await prisma.product.count({ where: { slug: { in: retiredSlugs } } })) === 0,
    "A retired demonstration Product remains in the catalog"
  );

  let orphanPublicationRejected = false;
  try {
    await prisma.product.create({
      data: {
        slug: `taxonomy-orphan-${Date.now()}`,
        name: "Invalid taxonomy orphan",
        description: "Must be rejected",
        price: 1,
        currency: "USD",
        active: true,
        editorialApproved: true,
        published: true,
        commerciallyAvailable: true,
      },
    });
  } catch {
    orphanPublicationRejected = true;
  }
  assert(orphanPublicationRejected, "Database accepted a published Product without Product Type");

  console.log(
    "Taxonomy V1 PostgreSQL validation passed: 1 active version, 7 Categories, " +
    "16 Subcategories, 30 Product Types, 7 Category images, 0 published orphans"
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
