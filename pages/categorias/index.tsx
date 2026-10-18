import Head from "next/head";
import type { GetServerSideProps } from "next";
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
import MetaTags from "@/components/MetaTags";

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
      <MetaTags
        title="Categorías | Mandoquita"
        desc="Explora todas las categorías disponibles en el catálogo de Mandoquita."
      />

      <a href="#main-content" className="skip-link">
        Ir al contenido principal
      </a>

      <Header />

      <main id="main-content">
        <section className="space-y-3 bg-gray-200">
          <Container size="wide" padding="lg" className="space-y-3 py-6">
            <div className="max-w-3xl space-y-3">
              <span className="ds-eyebrow">Catálogo Mandoquita</span>
              <h1 className="ds-heading ds-heading-lg">
                Explora por categorías
              </h1>
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
          </Container>
        </section>
        <Container size="wide" padding="lg" className="space-y-9">
          {categories.length > 0 ? (
            <section
              aria-labelledby="available-categories"
              className="space-y-6 py-6"
            >
              <h2
                id="available-categories"
                className="ds-heading ds-heading-md"
              >
                Categorías disponibles
              </h2>
              <div className="grid grid-cols-1 gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 content-center">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    title={category.name}
                    href={`/categorias/${category.slug}`}
                    description={category.description}
                    imageUrl={category.imageUrl}
                    imageAltText={category.imageAltText}
                    count={category.productCount}
                    compact={true}
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
