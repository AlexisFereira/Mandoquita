import { PrismaClient } from "@prisma/client";

import { getProductDetail } from "../src/server/catalogService";

const prisma = new PrismaClient();
const runId = `pcv-${Date.now()}`;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function rejected(operation: () => Promise<unknown>, message: string) {
  try {
    await operation();
  } catch {
    return;
  }
  throw new Error(message);
}

async function main() {
  const productType = await prisma.productType.findFirst({
    where: { active: true, subcategory: { active: true, category: { active: true, visible: true, version: { status: "ACTIVE" } } } },
  });
  assert(productType, "Active Product Type required");

  try {
    const product = await prisma.product.create({
      data: {
        slug: `${runId}-camiseta`, name: "Camiseta PCV", description: "Descripción completa",
        shortDescription: "Descripción corta", brand: "Marca aprobada", collection: "Colección uno",
        genderApplicability: "UNISEX", seoTitle: "SEO aprobado", seoDescription: "Descripción SEO",
        price: 75, currency: "USD", published: false, editorialApproved: true,
        commerciallyAvailable: false, productTypeId: productType.name,
        tags: { create: [{ value: "algodón" }, { value: "esencial" }] },
      },
    });
    const [front, back] = await Promise.all([
      prisma.productImage.create({ data: { id: `${runId}-front`, productId: product.id, url: "/front.webp", altText: "Vista frontal de la camiseta", position: 1, isPrimary: true } }),
      prisma.productImage.create({ data: { id: `${runId}-back`, productId: product.id, url: "/back.webp", altText: "Vista posterior de la camiseta", position: 2 } }),
    ]);
    await prisma.productVariant.create({
      data: { id: `${runId}-blue`, productId: product.id, sku: `${runId}-SKU-BLUE`, imageId: front.id,
        reference: "REF-INTERNAL", barcode: "770000000001",
        attributes: { create: [{ name: "COLOR", valueType: "TEXT", textValue: "Azul" }] } },
    });
    await prisma.productVariant.create({
      data: { id: `${runId}-red`, productId: product.id, sku: `${runId}-SKU-RED`, imageId: back.id,
        attributes: { create: [{ name: "COLOR", valueType: "TEXT", textValue: "Rojo" }] } },
    });
    await prisma.product.update({ where: { id: product.id }, data: { published: true } });

    const detail = await getProductDetail(prisma, product.slug);
    assert(detail, "Valid Product was not publicly discoverable");
    assert(detail.item.price === null && detail.item.currency === null, "Historical price escaped Commercial Availability protection");
    assert(detail.item.imageUrl === front.url, "Primary Image did not drive compatibility media");
    assert(detail.item.images.map(({ id }) => id).join() === `${front.id},${back.id}`, "Gallery order is not deterministic");
    assert(detail.item.images.every(({ altText }) => altText.trim().length > 0), "Public gallery contains empty alternative text");
    assert(detail.item.shortDescription === "Descripción corta", "Short description was not preserved");
    assert(detail.item.brand === "Marca aprobada" && detail.item.collection === "Colección uno", "Merchandising metadata was not preserved");
    assert(detail.item.genderApplicability === "unisex", "Gender applicability was not localized safely");
    assert(detail.item.tags.join() === "algodón,esencial", "Normalized tags are not deterministic");
    assert(detail.item.seo.title === "SEO aprobado" && detail.item.seo.description === "Descripción SEO", "SEO content was not preserved independently");
    assert(detail.item.productType.name === productType.name, "Variant/content data changed Product taxonomy");
    assert(detail.variantSelection.mode === "selectable" && detail.variantSelection.variants.length === 2, "Meaningful Active Variants were not selectable");
    const serialized = JSON.stringify(detail);
    for (const forbidden of ["sku", "barcode", "reference", "inventory", "warehouse", "supplier", "cost"]) {
      assert(!serialized.toLowerCase().includes(forbidden), `Public contract exposed deferred/internal field: ${forbidden}`);
    }

    await rejected(
      () => prisma.productVariant.create({ data: { productId: product.id, sku: `${runId}-SKU-BLUE`, isBase: true } }),
      "Database accepted duplicate SKU",
    );
    await rejected(
      () => prisma.productVariant.create({ data: { productId: product.id, sku: "   ", isBase: true } }),
      "Database accepted an empty SKU",
    );
    await rejected(
      () => prisma.variantAttribute.create({
        data: { variantId: `${runId}-blue`, name: "MATERIAL", valueType: "TEXT", textValue: "   " },
      }),
      "Database accepted an empty Variant Attribute value",
    );
    await rejected(
      () => prisma.variantAttribute.create({
        data: { variantId: `${runId}-blue`, name: "COLOR", valueType: "TEXT", textValue: "Azul oscuro" },
      }),
      "Database accepted a duplicate Variant Attribute concept",
    );
    await rejected(
      () => prisma.productImage.create({ data: { productId: product.id, url: "/duplicate.webp", altText: "Otra vista", position: 3, isPrimary: true } }),
      "Database accepted two Primary Images",
    );
    await rejected(
      () => prisma.productImage.create({ data: { productId: product.id, url: "/same-position.webp", altText: "Posición repetida", position: 2 } }),
      "Database accepted a duplicate Image position",
    );
    await rejected(
      () => prisma.productImage.create({ data: { productId: product.id, url: "/empty-alt.webp", altText: "   ", position: 3 } }),
      "Database accepted empty Image alternative text",
    );
    await rejected(
      () => prisma.productTag.create({ data: { productId: product.id, value: " Algodón " } }),
      "Database accepted a non-normalized duplicate tag",
    );

    await prisma.productVariant.update({ where: { id: `${runId}-blue` }, data: { active: false } });
    const inactiveVariantDetail = await getProductDetail(prisma, product.slug);
    assert(inactiveVariantDetail?.item.published, "Inactive Variant silently unpublished its Product");
    assert(inactiveVariantDetail?.item.commerciallyAvailable === false, "Variant state changed Commercial Availability");
    assert(inactiveVariantDetail?.item.price === null, "Inactive Variant bypassed public price protection");
    assert(inactiveVariantDetail?.variantSelection.mode === "read_only", "Inactive Variant remained a visitor option");
    await prisma.productVariant.update({ where: { id: `${runId}-blue` }, data: { active: true } });

    const other = await prisma.product.create({
      data: { slug: `${runId}-other`, name: "Otro", price: 1, currency: "USD", published: false, productTypeId: productType.name },
    });
    const otherImage = await prisma.productImage.create({ data: { productId: other.id, url: "/other.webp", altText: "Otro producto", position: 0 } });
    await rejected(
      () => prisma.productVariant.create({ data: { productId: product.id, sku: `${runId}-CROSS`, imageId: otherImage.id } }),
      "Database accepted a Variant Image owned by another Product",
    );
    await rejected(
      () => prisma.product.update({ where: { id: other.id }, data: { published: true } }),
      "Database accepted a Published Product without a Variant",
    );

    const base = await prisma.product.create({
      data: { slug: `${runId}-base`, name: "Producto base", price: 1, currency: "USD", published: true,
        editorialApproved: true, productTypeId: productType.name,
        variants: { create: { id: `${runId}-base-variant`, sku: `${runId}-BASE-SKU`, isBase: true } } },
    });
    const baseDetail = await getProductDetail(prisma, base.slug);
    assert(baseDetail?.variantSelection.mode === "none", "Base Variant became a fabricated public choice");
    assert(baseDetail.item.images.length === 0, "Image-less Product acquired fabricated media");

    const publishedWithoutVariants = await prisma.product.count({
      where: { published: true, variants: { none: {} } },
    });
    assert(publishedWithoutVariants === 0, `Migration completeness failed: ${publishedWithoutVariants} published Products have no Variant`);

    console.log("Product Content and Variants V1 PostgreSQL validation passed: ownership, SKU, attributes, images, metadata, states, public contract and empty migration inventory");
  } finally {
    await prisma.product.deleteMany({ where: { slug: { startsWith: runId } } });
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
