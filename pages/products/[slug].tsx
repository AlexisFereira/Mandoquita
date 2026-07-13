import React from "react";
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
    description: item.description,
    image: item.imageUrl,
  };

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
  related,
}: ProductDetailPageProps) {
  const structuredData = createProductStructuredData(item);

  return (
    <>
      <Head>
        <title>{`${item.name} | Mandoquita`}</title>
        <meta name="description" content={item.description} />
        <meta name="robots" content="index,follow" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content={APPLICATION_THEME_COLOR} />
        <link rel="canonical" href={`/products/${item.slug}`} />
        <meta property="og:title" content={item.name} />
        <meta property="og:description" content={item.description} />
        <meta property="og:image" content={item.imageUrl} />
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
            <li aria-current="page" className="ds-text-muted">
              {item.name}
            </li>
          </ol>
        </nav>

        <article className="mb-12 grid gap-10 md:grid-cols-2">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-[rgb(var(--primary)/0.12)] to-[rgb(var(--accent)/0.14)]">
            <img
              src={item.imageUrl}
              alt={item.name}
              width="800"
              height="600"
              onError={(event) => {
                event.currentTarget.src = "/images/banners/default-banner.svg";
              }}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex self-start flex-col gap-5">
            <span className="ds-eyebrow">{item.productType.name}</span>

            <h1 className="ds-heading ds-heading-lg">
              {item.name}
            </h1>

            <ProductOffer product={item} emphasis="detail" />

            <p className="m-0 leading-7 text-[rgb(var(--foreground)/1)]">
              {item.description}
            </p>

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

        {related.length > 0 && (
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
        )}
        </Container>
      </main>

      <Footer />
    </>
  );
}
