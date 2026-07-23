import React from "react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import FaviconLinks from "../components/FaviconLinks";
import { prisma } from "../../lib/prisma";
import { Button } from "../../src/components/Button";
import { CategoryCard } from "../../src/components/CategoryCard";
import { Container } from "../../src/components/Container";
import { Footer } from "../../src/components/Footer";
import { Header } from "../../src/components/Header";
import { listDiscoverableTaxonomy } from "../../src/server/taxonomyService";
import type { TaxonomyCategory } from "../../src/types/catalog";
import { APPLICATION_THEME_COLOR } from "../../src/design-system/metadata";
import { Icon } from "../../src/components/Icon";

export type CategoriesPageProps = {
  categories: TaxonomyCategory[];
};

export const getServerSideProps: GetServerSideProps<
  CategoriesPageProps
> = async () => ({
  props: { categories: await listDiscoverableTaxonomy(prisma) },
});

export default function CategoriesPage({ categories }: CategoriesPageProps) {
  return (
    <>
      <Head>
        <title>Categorías | Mandoquita</title>
        <meta
          name="description"
          content="Explora todas las categorías disponibles en el catálogo de Mandoquita."
        />
        <meta name="robots" content="index,follow" />
        <meta name="theme-color" content={APPLICATION_THEME_COLOR} />
        <link rel="canonical" href="/categorias" />
        {/* Favicons estándar */}{" "}
        <link rel="icon" href="/favicon.ico" sizes="any" />{" "}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />{" "}
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        {/* Apple Touch Icon (iOS) */}{" "}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        {/* Android Chrome / PWA */}{" "}
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />{" "}
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/android-chrome-512x512.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <a href="#main-content" className="skip-link">
        Ir al contenido principal
      </a>
      <Header />

      <main id="main-content" className="py-10 sm:py-14">
        <Container size="wide" padding="lg" className="space-y-9">
          <div className="max-w-3xl space-y-3">
            <span className="ds-eyebrow">Catálogo Mandoquita</span>
            <h1 className="ds-heading ds-heading-lg">Explora por categorías</h1>
            <p className="max-w-2xl leading-7 text-[rgb(var(--muted)/1)]">
              Encuentra productos recorriendo las categorías disponibles según
              tus intereses.
            </p>
          </div>

          <Button
            variant="outline"
            href="/buscar?focus=1"
            className="gap-2 justify-self-start"
          >
            <Icon name="search" />
            Buscar productos
          </Button>

          {categories.length > 0 ? (
            <section
              aria-labelledby="available-categories"
              className="space-y-6"
            >
              <h2
                id="available-categories"
                className="ds-heading ds-heading-md"
              >
                Categorías disponibles
              </h2>
              <div className="category-card-grid">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    title={category.name}
                    href={`/categorias/${category.slug}`}
                    description={category.description}
                    imageUrl={category.imageUrl}
                    imageAltText={category.imageAltText}
                    count={category.productCount}
                  />
                ))}
              </div>
            </section>
          ) : (
            <section
              aria-labelledby="categories-unavailable"
              className="space-y-5"
            >
              <h2
                id="categories-unavailable"
                className="ds-heading ds-heading-md"
              >
                Categorías no disponibles temporalmente
              </h2>
              <p className="max-w-2xl text-[rgb(var(--muted)/1)]">
                En este momento no hay categorías disponibles para explorar.
              </p>
              <Button variant="outline" href="/">
                Volver al inicio
              </Button>
            </section>
          )}
        </Container>
      </main>

      <Footer />
    </>
  );
}
