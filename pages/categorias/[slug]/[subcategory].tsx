import React from "react";
import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps } from "next";

import { prisma } from "../../../lib/prisma";
import { Button } from "../../../src/components/Button";
import { Container } from "../../../src/components/Container";
import { Footer } from "../../../src/components/Footer";
import { Header } from "../../../src/components/Header";
import { ProductCard } from "../../../src/components/ProductCard";
import { listProducts } from "../../../src/server/catalogService";
import { getDiscoverableCategory, resolveCategorySlug } from "../../../src/server/taxonomyService";
import type { ProductItem, TaxonomySubcategory } from "../../../src/types/catalog";
import { APPLICATION_THEME_COLOR } from "../../../src/design-system/metadata";

export type SubcategoryPageProps = {
  category: { slug: string; name: string } | null;
  subcategory: TaxonomySubcategory | null;
  products: ProductItem[];
};

export const getServerSideProps: GetServerSideProps<SubcategoryPageProps> = async ({ params }) => {
  const rawCategory = params?.slug;
  const rawSubcategory = params?.subcategory;
  const categorySlug = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory;
  const subcategorySlug = Array.isArray(rawSubcategory) ? rawSubcategory[0] : rawSubcategory;

  if (!categorySlug || !subcategorySlug) return { notFound: true };

  const resolved = await resolveCategorySlug(prisma, categorySlug);
  const canonicalCategorySlug = resolved?.slug ?? categorySlug;
  const category = await getDiscoverableCategory(prisma, canonicalCategorySlug);
  const subcategory = category?.subcategories.find((item) => item.slug === subcategorySlug);
  if (!category || !subcategory) {
    return { props: { category: null, subcategory: null, products: [] } };
  }
  if (resolved?.redirected) {
    return { redirect: { destination: `/categorias/${resolved.slug}/${subcategorySlug}`, permanent: true } };
  }

  const catalog = await listProducts(prisma, {
    category: canonicalCategorySlug,
    subcategory: subcategorySlug,
    page: "1",
    limit: "50",
  });

  return {
    props: {
      category: { slug: category.slug, name: category.name },
      subcategory,
      products: catalog.items,
    },
  };
};

export default function SubcategoryPage({ category, subcategory, products }: SubcategoryPageProps) {
  if (!category || !subcategory) {
    return (
      <>
        <Head><title>Subcategoría no disponible | Mandoquita</title></Head>
        <a href="#main-content" className="skip-link">Ir al contenido principal</a>
        <Header />
        <main id="main-content" className="py-10 sm:py-14">
          <Container size="wide" padding="lg">
            <section aria-labelledby="subcategory-unavailable" className="space-y-5">
              <h1 id="subcategory-unavailable" className="ds-heading ds-heading-lg">Subcategoría no disponible</h1>
              <p className="max-w-2xl text-[rgb(var(--muted)/1)]">Esta subcategoría no está disponible para explorar en este momento.</p>
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
        <title>{`${subcategory.name} | ${category.name} | Mandoquita`}</title>
        <meta name="description" content={`Explora productos de ${subcategory.name} en Mandoquita.`} />
        <meta name="robots" content="index,follow" />
        <meta name="theme-color" content={APPLICATION_THEME_COLOR} />
      </Head>
      <a href="#main-content" className="skip-link">Ir al contenido principal</a>
      <Header />

      <main id="main-content" className="py-10 sm:py-14">
        <Container size="wide" padding="lg" className="space-y-9">
          <div className="space-y-5">
            <nav aria-label="Breadcrumb">
              <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 text-sm">
                <li><Link href="/categorias" className="ds-text-muted inline-flex min-h-11 items-center underline underline-offset-4">Categorías</Link></li>
                <li aria-hidden="true" className="ds-text-muted">/</li>
                <li><Link href={`/categorias/${category.slug}`} className="ds-text-muted inline-flex min-h-11 items-center underline underline-offset-4">{category.name}</Link></li>
                <li aria-hidden="true" className="ds-text-muted">/</li>
                <li aria-current="page" className="ds-text-muted">{subcategory.name}</li>
              </ol>
            </nav>
            <div className="space-y-3">
              <span className="ds-eyebrow">Subcategoría de {category.name}</span>
              <h1 className="ds-heading ds-heading-lg">{subcategory.name}</h1>
              <p className="max-w-2xl leading-7 text-[rgb(var(--muted)/1)]">Explora los productos disponibles en esta subcategoría.</p>
            </div>
          </div>

          <section aria-labelledby="subcategory-products" className="space-y-6">
            <h2 id="subcategory-products" className="ds-heading ds-heading-md">Productos de {subcategory.name}</h2>
            <div className="product-card-grid">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </section>

          <div className="flex flex-wrap gap-5">
            <Link href={`/categorias/${category.slug}`} className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">Volver a {category.name}</Link>
            <Link href="/categorias" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">Ver todas las categorías</Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
