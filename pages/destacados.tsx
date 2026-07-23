import React from "react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import FaviconLinks from "./components/FaviconLinks";

import { prisma } from "../lib/prisma";
import { Button } from "../src/components/Button";
import { CollectionGrid } from "../src/components/CollectionGrid";
import { Container } from "../src/components/Container";
import { Footer } from "../src/components/Footer";
import { Header } from "../src/components/Header";
import { ProductCard } from "../src/components/ProductCard";
import { APPLICATION_THEME_COLOR } from "../src/design-system/metadata";
import { listFeaturedProducts } from "../src/server/catalogService";
import type { ProductItem } from "../src/types/catalog";

export type FeaturedProductsPageProps = {
  products: ProductItem[];
};

export const getServerSideProps: GetServerSideProps<
  FeaturedProductsPageProps
> = async () => ({
  props: { products: await listFeaturedProducts(prisma, 50) },
});

export default function FeaturedProductsPage({
  products,
}: FeaturedProductsPageProps) {
  return (
    <>
      <Head>
        <title>Productos destacados | Mandoquita</title>
        <meta
          name="description"
          content="Explora los productos destacados seleccionados por Mandoquita."
        />
        <meta name="robots" content="index,follow" />
        <meta name="theme-color" content={APPLICATION_THEME_COLOR} />
        <link rel="canonical" href="/destacados" />
        <FaviconLinks />
      </Head>

      <a href="#main-content" className="skip-link">
        Ir al contenido principal
      </a>
      <Header />

      <main id="main-content" className="py-10 sm:py-14 lg:py-16">
        <Container size="wide" padding="lg" className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="ds-eyebrow">Selección Mandoquita</span>
            <h1 className="ds-heading ds-heading-lg">Productos destacados</h1>
            <p className="max-w-2xl leading-7 text-[rgb(var(--muted)/1)]">
              Conoce la selección ampliada de productos destacados del catálogo.
            </p>
          </div>

          {products.length ? (
            <CollectionGrid as="ul">
              {products.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} featured />
                </li>
              ))}
            </CollectionGrid>
          ) : (
            <section
              aria-labelledby="featured-unavailable"
              className="space-y-4"
            >
              <h2
                id="featured-unavailable"
                className="ds-heading ds-heading-md"
              >
                No hay productos destacados disponibles
              </h2>
              <p className="text-[rgb(var(--muted)/1)]">
                Explora las categorías para encontrar otros productos del
                catálogo.
              </p>
              <Button variant="outline" href="/categorias">
                Explorar categorías
              </Button>
            </section>
          )}
        </Container>
      </main>

      <Footer />
    </>
  );
}
