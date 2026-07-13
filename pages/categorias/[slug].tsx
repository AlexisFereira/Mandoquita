import React from "react";
import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps } from "next";

import { prisma } from "../../lib/prisma";
import { Button } from "../../src/components/Button";
import { Container } from "../../src/components/Container";
import { Footer } from "../../src/components/Footer";
import { Header } from "../../src/components/Header";
import { ProductCard } from "../../src/components/ProductCard";
import { listProducts } from "../../src/server/catalogService";
import { getDiscoverableCategory } from "../../src/server/taxonomyService";
import type { ProductItem, TaxonomyCategory } from "../../src/types/catalog";
import { APPLICATION_THEME_COLOR } from "../../src/design-system/metadata";

export type CategoryPageProps = {
  category: TaxonomyCategory | null;
  products: ProductItem[];
};

export const getServerSideProps: GetServerSideProps<CategoryPageProps> = async ({
  params,
}) => {
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  if (!slug) {
    return { notFound: true };
  }

  const [category, catalog] = await Promise.all([
    getDiscoverableCategory(prisma, slug),
    listProducts(prisma, { category: slug, page: "1", limit: "50" }),
  ]);

  return {
    props: {
      category,
      products: catalog.items,
    },
  };
};

export default function CategoryPage({ category, products }: CategoryPageProps) {
  if (!category) {
    return (
      <>
        <Head><title>Categoría no disponible | Mandoquita</title></Head>
        <a href="#main-content" className="skip-link">Ir al contenido principal</a>
        <Header />
        <main id="main-content" className="py-10 sm:py-14">
          <Container size="xl" padding="lg">
            <section aria-labelledby="category-unavailable" className="space-y-5">
              <h1 id="category-unavailable" className="ds-heading ds-heading-lg">Categoría no disponible</h1>
              <p className="max-w-2xl text-[rgb(var(--muted)/1)]">Esta categoría no está disponible para explorar en este momento.</p>
              <Button variant="outline" href="/categorias">Ver todas las categorías</Button>
            </section>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`${category.name} | Mandoquita`}</title>
        <meta
          name="description"
          content={`Explora las subcategorías y productos de ${category.name} disponibles en Mandoquita.`}
        />
        <meta name="robots" content="index,follow" />
        <meta name="theme-color" content={APPLICATION_THEME_COLOR} />
      </Head>

      <a href="#main-content" className="skip-link">
        Ir al contenido principal
      </a>
      <Header />

      <main id="main-content" className="py-10 sm:py-14">
        <Container size="xl" padding="lg" className="space-y-9">
          <div className="space-y-5">
            <nav aria-label="Breadcrumb">
              <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 text-sm">
                <li>
                  <Link href="/categorias" className="ds-text-muted inline-flex min-h-11 items-center underline underline-offset-4">
                    Categorías
                  </Link>
                </li>
                <li aria-hidden="true" className="ds-text-muted">/</li>
                <li aria-current="page" className="ds-text-muted">{category.name}</li>
              </ol>
            </nav>
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted)/1)]">
                Categoría
              </span>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--foreground)/1)] sm:text-5xl">
                {category.name}
              </h1>
              <p className="max-w-2xl leading-7 text-[rgb(var(--muted)/1)]">
                {category.description ?? "Explora las subcategorías y productos disponibles en esta categoría."}
              </p>
            </div>
          </div>

          {category.subcategories.length > 0 ? (
            <section aria-labelledby="subcategories-heading" className="space-y-6">
              <h2 id="subcategories-heading" className="ds-heading ds-heading-md">Subcategorías</h2>
              <div className="category-card-grid">
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    href={`/categorias/${category.slug}/${subcategory.slug}`}
                    className="flex min-h-11 flex-col justify-center rounded-lg border border-[rgb(var(--border)/1)] bg-[rgb(var(--surface)/1)] p-6 no-underline shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-[rgb(var(--primary)/1)] motion-reduce:transform-none"
                  >
                    <span className="text-lg font-semibold text-[rgb(var(--foreground)/1)]">{subcategory.name}</span>
                    <span className="mt-2 text-sm text-[rgb(var(--muted)/1)]">{subcategory.productCount} productos</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <section aria-labelledby="products-heading" className="space-y-6">
            <h2 id="products-heading" className="ds-heading ds-heading-md">Productos de {category.name}</h2>
            <div className="product-card-grid">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </section>

          <Link href="/categorias" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
            Ver todas las categorías
          </Link>
        </Container>
      </main>

      <Footer />
    </>
  );
}
