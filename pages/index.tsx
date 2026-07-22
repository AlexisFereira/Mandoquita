import React from "react";
import Script from "next/script";
import type { GetServerSideProps } from "next";

import { prisma } from "../lib/prisma";
import { Button } from "../src/components/Button";
import { Carousel } from "../src/components/Carousel";
import { CategoryLink } from "../src/components/CategoryLink";
import { CollectionGrid } from "../src/components/CollectionGrid";
import { Container } from "../src/components/Container";
import { Footer } from "../src/components/Footer";
import { Header } from "../src/components/Header";
import { ProductCard } from "../src/components/ProductCard";
import { ScrollEntryMotion } from "../src/components/ScrollEntryMotion";
import { getHomepagePayload } from "../src/server/homepageService";
import { useMediaQuery } from "../src/hooks/use-media-query";
import { PaymentInformation } from "../src/features/homepage/payment-information";
import type { HomepagePayload } from "../src/types/catalog";
import HeadMetas from "./components/HeadMetas";

export const getServerSideProps: GetServerSideProps<HomepagePayload> = async ({
  res,
}) => {
  res.setHeader("Cache-Control", "private, no-store");
  return { props: await getHomepagePayload(prisma) };
};

const urlBase = "https://d139alfkeie86e.cloudfront.net";

const carouselSlides = [
  {
    title: "Tu próximo conjunto favorito",
    description: "Cómodos, versátiles y listos para combinar con tu estilo.",
    imageUrl: `${urlBase}/images/banners/slide-ropa-mujer.png`,
    action: {
      label: "Descubrir colección",
      href: "/categorias/ropa-y-moda/conjuntos-para-mujer",
    },
  },
  {
    title: "El detalle cambia el look",
    description:
      "Gorras, lentes y relojes para llevar tu estilo un paso más allá.",
    imageUrl: `${urlBase}/images/banners/slide-accesorios.png`,
    action: {
      label: "Explorar accesorios",
      href: "/categorias/accesorios-de-moda",
    },
  },
  {
    title: "Tu estilo. Sin uniforme.",
    description: "Oversize, estampadas y acid wash hechas para destacar.",
    imageUrl: `${urlBase}/images/banners/slide-oversizes.png`,
    action: {
      label: "Explorar colección",
      href: "/categorias/ropa-y-moda/camisetas",
    },
  },
];

const whatsappUrl =
  "https://wa.me/584245553041?text=Hola%2C%20vi%20el%20cat%C3%A1logo%20de%20Mandoquita%20y%20quisiera%20recibir%20informaci%C3%B3n%20sobre%20un%20producto.";

export function selectVisibleFeaturedProducts<T>(products: T[], limit: number) {
  return products.slice(0, limit);
}

function getHomepageCategoryVisibility(index: number) {
  if (index === 0) return "";
  if (index === 1) return "hidden min-[400px]:block";
  if (index === 2) return "hidden sm:block";
  if (index === 3) return "hidden md:block";
  if (index < 7) return "hidden lg:block";
  return "hidden";
}

function getViewAllCategoriesVisibility(categoryCount: number) {
  return [
    categoryCount <= 2 ? "min-[400px]:hidden" : "",
    categoryCount <= 3 ? "sm:hidden" : "",
    categoryCount <= 4 ? "md:hidden" : "",
    categoryCount <= 7 ? "lg:hidden" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function MerchandisingSection({
  id,
  title,
  description,
  children,
  tone = "default",
  layout = "stacked",
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  tone?: "default" | "surface";
  layout?: "stacked" | "split";
}) {
  const split = layout === "split";
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`py-10 sm:py-12 lg:py-16 ${tone === "surface" ? "bg-[rgb(var(--surface-muted)/1)]" : ""}`}
    >
      <Container
        size="wide"
        padding="lg"
        className={
          split
            ? "space-y-5 sm:space-y-6 xl:flex xl:items-center xl:justify-between xl:gap-12 xl:space-y-0"
            : "space-y-5 sm:space-y-6"
        }
      >
        <div
          className={
            split ? "space-y-2 xl:w-max xl:max-w-none xl:shrink-0" : "space-y-2"
          }
        >
          <h2
            id={`${id}-title`}
            className="text-balance text-2xl font-semibold tracking-[-0.02em] sm:text-3xl"
          >
            {title}
          </h2>
          {description ? (
            <p
              className={`max-w-2xl leading-7 text-[rgb(var(--muted)/1)] ${split ? "xl:whitespace-nowrap" : ""}`}
            >
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </Container>
    </section>
  );
}

export default function HomePage({
  featuredProducts,
  categories,
  selectedCategoryProducts,
}: HomepagePayload) {
  const showsThreeFeatured = useMediaQuery("(min-width: 640px)");
  const showsFourFeatured = useMediaQuery("(min-width: 1024px)");
  const showsSixFeatured = useMediaQuery("(min-width: 1400px)");
  const featuredLimit = showsSixFeatured
    ? 6
    : showsFourFeatured
      ? 4
      : showsThreeFeatured
        ? 3
        : 2;

  const visibleFeaturedProducts = selectVisibleFeaturedProducts(
    featuredProducts,
    featuredLimit,
  );
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Productos destacados de Mandoquita",
    itemListElement: visibleFeaturedProducts.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
    })),
  };

  return (
    <>
      <HeadMetas />
      <Script
        id="homepage-products-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <a href="#main-content" className="skip-link">
        Ir al contenido principal
      </a>
      <Header />

      <main id="main-content">
        <h1 className="sr-only">Catálogo Mandoquita</h1>
        {carouselSlides.length ? <Carousel slides={carouselSlides} /> : null}
        {categories.length ? (
          <ScrollEntryMotion distance="sm">
            <MerchandisingSection
              id="categorias"
              title="Categorías"
              description="Explora el catálogo según tus intereses."
              tone="surface"
              layout="split"
            >
              <ul className="flex flex-nowrap items-start justify-between gap-[30px] xl:justify-start">
                {categories.map((category, index) => (
                  <li
                    key={category.slug}
                    className={`shrink-0 ${getHomepageCategoryVisibility(index)}`}
                  >
                    <CategoryLink
                      title={category.name}
                      href={`/categorias/${category.slug}`}
                      imageUrl={category.imageUrl}
                      imageAltText={category.imageAltText}
                    />
                  </li>
                ))}
                {categories.length > 1 ? (
                  <li
                    className={`shrink-0 ${getViewAllCategoriesVisibility(categories.length)}`}
                  >
                    <CategoryLink
                      title="Ver todas"
                      href="/categorias"
                      icon="categories"
                    />
                  </li>
                ) : null}
              </ul>
            </MerchandisingSection>
          </ScrollEntryMotion>
        ) : null}
        {visibleFeaturedProducts.length ? (
          <ScrollEntryMotion distance="sm">
            <MerchandisingSection
              id="destacados"
              title="Productos destacados"
              description="Conoce algunos de los productos seleccionados por Mandoquita."
            >
              <CollectionGrid as="ul">
                {visibleFeaturedProducts.map((product) => (
                  <li key={product.id}>
                    <ProductCard product={product} featured />
                  </li>
                ))}
              </CollectionGrid>
              <div className="flex justify-end">
                <Button variant="outline" href="/destacados">
                  Ver más destacados
                </Button>
              </div>
            </MerchandisingSection>
          </ScrollEntryMotion>
        ) : null}
        <PaymentInformation />
        {selectedCategoryProducts?.products.length ? (
          <ScrollEntryMotion distance="sm">
            <MerchandisingSection
              id="seleccion-categoria"
              title={`Productos de ${selectedCategoryProducts.category.name}`}
              description="Descubre una selección de esta categoría para hoy."
              tone="surface"
            >
              <CollectionGrid as="ul">
                {selectedCategoryProducts.products.map((product) => (
                  <li key={product.id}>
                    <ProductCard product={product} />
                  </li>
                ))}
              </CollectionGrid>
              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  href={`/categorias/${selectedCategoryProducts.category.slug}`}
                >
                  Ver categoría {selectedCategoryProducts.category.name}
                </Button>
              </div>
            </MerchandisingSection>
          </ScrollEntryMotion>
        ) : null}
        <section id="contacto" className="py-10 sm:py-12 lg:py-16">
          <Container size="wide" padding="lg">
            <div className="grid overflow-hidden rounded-2xl bg-[rgb(var(--inverse-surface)/1)] text-[rgb(var(--inverse-foreground)/1)] lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
              <div className="flex flex-col items-start justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--inverse-muted)/1)]">
                  Atención personalizada
                </span>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
                  ¿Quieres conocer mejor un producto?
                </h2>
                <p className="mt-3 max-w-2xl leading-7 text-[rgb(var(--inverse-muted)/1)]">
                  Escríbenos por WhatsApp y recibe información para resolver tus
                  dudas.
                </p>
                <Button
                  variant="inverse"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7"
                >
                  Hablar por WhatsApp
                </Button>
              </div>
              <div className="relative min-h-[260px] bg-[rgb(var(--surface)/1)] sm:min-h-[320px] lg:min-h-[360px]">
                <img
                  src="/images/whatsapp-contact.png"
                  alt=""
                  width="1448"
                  height="1086"
                  sizes="(min-width: 1024px) 40vw, calc(100vw - 48px)"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
