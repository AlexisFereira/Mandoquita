import React, { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import type { GetServerSideProps } from "next";

import { Footer } from "../../src/components/Footer";
import { Header } from "../../src/components/Header";
import { ProductCard } from "../../src/components/ProductCard";
import {
  ProductOffer,
  hasCurrentOffer,
} from "../../src/components/ProductOffer";
import { prisma } from "../../lib/prisma";
import { getProductDetail } from "../../src/server/catalogService";
import type { ProductDetailResponse } from "../../src/types/catalog";
import { APPLICATION_THEME_COLOR } from "../../src/design-system/metadata";
import { Container } from "../../src/components/Container";
import { Carousel } from "../../src/components/Carousel";
import { Chip } from "../../src/components/Chip";
import { ProductVariantOptions } from "../../src/components/ProductVariantOptions";
import type { PublicProductVariantItem } from "../../src/types/catalog";
import { ScrollEntryMotion } from "../../src/components/ScrollEntryMotion";
import { Icon } from "../../src/components/Icon";

type ProductDetailPageProps = ProductDetailResponse;

export const getServerSideProps: GetServerSideProps<
  ProductDetailPageProps
> = async ({ params }) => {
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  if (!slug) {
    return { notFound: true };
  }

  const data = await getProductDetail(prisma, slug);

  if (!data) {
    return { notFound: true };
  }

  return { props: data };
};

export function createProductStructuredData(item: ProductDetailResponse["item"]) {
  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    description: item.shortDescription ?? item.description ?? undefined,
  };

  if (item.images.length > 0) {
    structuredData.image = item.images.map((image) => image.url);
  }

  if (hasCurrentOffer(item)) {
    structuredData.offers = {
      "@type": "Offer",
      price: item.price,
      priceCurrency: item.currency,
      availability: "https://schema.org/InStock",
    };
  }

  return structuredData;
}

export default function ProductDetailPage({
  item,
  variantSelection,
  related,
}: ProductDetailPageProps) {
  const structuredData = createProductStructuredData(item);
  const initialImageId = item.images.find((image) => image.isPrimary)?.id ?? item.images[0]?.id;
  const [activeImageId, setActiveImageId] = useState(initialImageId);
  const galleryItems = useMemo(() => item.images.map((image, index) => ({
    id: image.id,
    src: image.url,
    alt: image.altText,
    thumbnailSrc: image.url,
    controlLabel: `Mostrar ${image.altText}, imagen ${index + 1} de ${item.images.length}`,
  })), [item.images]);

  useEffect(() => {
    setActiveImageId(initialImageId);
  }, [initialImageId, item.id]);

  const handleVariantResolved = useCallback((variant: PublicProductVariantItem) => {
    if (variant.imageId && item.images.some((image) => image.id === variant.imageId)) {
      setActiveImageId(variant.imageId);
    }
  }, [item.images]);

  const genderLabel = item.genderApplicability
    ? ({ mujer: "Mujer", hombre: "Hombre", unisex: "Unisex", no_aplica: "No aplica" } as const)[item.genderApplicability]
    : null;
  const hasMerchandisingMetadata = Boolean(
    item.brand || item.collection || genderLabel || item.tags.length > 0,
  );

  return (
    <>
      <Head>
        <title>{item.seo.title ?? `${item.name} | Mandoquita`}</title>
        <meta name="description" content={item.seo.description ?? item.shortDescription ?? item.description ?? undefined} />
        <meta name="robots" content="index,follow" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content={APPLICATION_THEME_COLOR} />
        <link rel="canonical" href={`/products/${item.slug}`} />
        <meta property="og:title" content={item.seo.title ?? item.name} />
        <meta property="og:description" content={item.seo.description ?? item.shortDescription ?? item.description ?? undefined} />
        {item.imageUrl ? <meta property="og:image" content={item.imageUrl} /> : null}
        <meta property="og:type" content="product" />
      </Head>

      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <a href="#main-content" className="skip-link">
        Ir al contenido principal
      </a>

      <Header />

      <main id="main-content" className="py-8 sm:py-12">
        <Container size="xl" padding="lg">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="m-0 flex list-none flex-wrap gap-2 p-0">
            <li>
              <Link
                href="/categorias"
                className="ds-text-muted inline-flex min-h-11 items-center underline underline-offset-4"
              >
                Categorías
              </Link>
            </li>
            <li aria-hidden="true" className="ds-text-muted">
              /
            </li>
            <li>
              <Link
                href={`/categorias/${item.category.slug}`}
                className="ds-text-muted inline-flex min-h-11 items-center underline underline-offset-4"
              >
                {item.category.name}
              </Link>
            </li>
            <li aria-hidden="true" className="ds-text-muted">
              /
            </li>
            <li>
              <Link
                href={`/categorias/${item.category.slug}/${item.subcategory.slug}`}
                className="ds-text-muted inline-flex min-h-11 items-center underline underline-offset-4"
              >
                {item.subcategory.name}
              </Link>
            </li>
            <li aria-hidden="true" className="ds-text-muted">
              /
            </li>
            <li className="ds-text-muted">{item.productType.name}</li>
            <li aria-hidden="true" className="ds-text-muted">
              /
            </li>
            <li aria-current="page" className="ds-text-muted">
              {item.name}
            </li>
          </ol>
        </nav>

        <article className="mb-12 grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
          <Carousel
            mode="gallery"
            items={galleryItems}
            activeItemId={activeImageId}
            onActiveItemChange={setActiveImageId}
            aria-label={`Galería de ${item.name}`}
            missingMediaMessage="No hay imágenes disponibles para este producto."
            failedMediaMessage="No pudimos mostrar esta imagen."
          />

          <div className="flex self-start flex-col gap-5">
            <span className="ds-eyebrow">{item.productType.name}</span>

            <h1 className="ds-heading ds-heading-lg">
              {item.name}
            </h1>

            {item.shortDescription ? (
              <p className="m-0 text-lg leading-7 text-[rgb(var(--foreground)/1)]">
                {item.shortDescription}
              </p>
            ) : null}

            <ProductOffer product={item} emphasis="detail" />

            <ProductVariantOptions
              key={item.id}
              selection={variantSelection}
              onVariantResolved={handleVariantResolved}
            />

            <dl className="m-0 grid gap-2 text-sm">
              <div className="flex flex-wrap gap-2">
                <dt className="font-semibold">Categoría:</dt>
                <dd className="m-0"><Link href={`/categorias/${item.category.slug}`} className="underline underline-offset-4">{item.category.name}</Link></dd>
              </div>
              <div className="flex flex-wrap gap-2">
                <dt className="font-semibold">Subcategoría:</dt>
                <dd className="m-0"><Link href={`/categorias/${item.category.slug}/${item.subcategory.slug}`} className="underline underline-offset-4">{item.subcategory.name}</Link></dd>
              </div>
              <div className="flex flex-wrap gap-2">
                <dt className="font-semibold">Tipo de producto:</dt>
                <dd className="m-0">{item.productType.name}</dd>
              </div>
            </dl>
          </div>
        </article>

        {item.description ? (
          <section aria-labelledby="product-description-heading" className="mb-10 max-w-3xl">
            <h2 id="product-description-heading" className="ds-heading ds-heading-md mb-4">
              Descripción
            </h2>
            <p className="m-0 leading-7 text-[rgb(var(--foreground)/1)]">
              {item.description}
            </p>
          </section>
        ) : null}

        {hasMerchandisingMetadata ? (
          <section aria-labelledby="product-metadata-heading" className="mb-10 max-w-3xl">
            <h2 id="product-metadata-heading" className="ds-heading ds-heading-md mb-4">
              Información del producto
            </h2>
            {item.brand || item.collection || genderLabel ? (
              <dl className="m-0 grid gap-2 text-sm">
                {item.brand ? <div className="flex flex-wrap gap-2"><dt className="font-semibold">Marca:</dt><dd className="m-0">{item.brand}</dd></div> : null}
                {item.collection ? <div className="flex flex-wrap gap-2"><dt className="font-semibold">Colección:</dt><dd className="m-0">{item.collection}</dd></div> : null}
                {genderLabel ? <div className="flex flex-wrap gap-2"><dt className="font-semibold">Aplicabilidad:</dt><dd className="m-0">{genderLabel}</dd></div> : null}
              </dl>
            ) : null}
            {item.tags.length > 0 ? (
              <div className="mt-4 space-y-2">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Icon name="tag" size="sm" />
                  Etiquetas
                </p>
                <div className="flex flex-wrap gap-2" aria-label="Etiquetas del producto">
                  {item.tags.map((tag) => <Chip key={tag}>{tag}</Chip>)}
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        {related.length > 0 && (
          <ScrollEntryMotion distance="sm" delayStep={0}>
          <section aria-labelledby="related-heading" className="mt-8">
            <h2
              id="related-heading"
              className="ds-heading ds-heading-md mb-6"
            >
              Productos relacionados
            </h2>
            <div className="product-card-grid">
              {related.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
          </ScrollEntryMotion>
        )}
        </Container>
      </main>

      <Footer />
    </>
  );
}
