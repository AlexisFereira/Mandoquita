import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps } from "next";

import { prisma } from "../../lib/prisma";
import { Container } from "../../src/components/Container";
import { Footer } from "../../src/components/Footer";
import { Header } from "../../src/components/Header";
import { ProductCard } from "../../src/components/ProductCard";
import { listProducts } from "../../src/server/catalogService";
import type { ProductItem } from "../../src/types/catalog";
import { APPLICATION_THEME_COLOR } from "../../src/design-system/metadata";

type CategoryPageProps = {
  categoryName: string;
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

  const catalog = await listProducts(prisma, {
    category: slug,
    page: "1",
    limit: "50",
  });

  if (catalog.items.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      categoryName: catalog.items[0].category.name,
      products: catalog.items,
    },
  };
};

export default function CategoryPage({ categoryName, products }: CategoryPageProps) {
  return (
    <>
      <Head>
        <title>{`${categoryName} | Mandoquita`}</title>
        <meta
          name="description"
          content={`Explora los productos de ${categoryName} disponibles en Mandoquita.`}
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
            <Link
              href="/#categorias"
              className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary)/.45)]"
            >
              Volver a categorías
            </Link>
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted)/1)]">
                Categoría
              </span>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--foreground)/1)] sm:text-5xl">
                {categoryName}
              </h1>
              <p className="max-w-2xl leading-7 text-[rgb(var(--muted)/1)]">
                Explora los productos disponibles en esta categoría.
              </p>
            </div>
          </div>

          <div className="product-card-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
