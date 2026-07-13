import React from "react";
import Head from "next/head";
import Script from "next/script";
import type { GetServerSideProps } from "next";

import { prisma } from "../lib/prisma";
import { Button } from "../src/components/Button";
import { Carousel } from "../src/components/Carousel";
import { CategoryCard } from "../src/components/CategoryCard";
import { Container } from "../src/components/Container";
import { Footer } from "../src/components/Footer";
import { Header } from "../src/components/Header";
import { Hero } from "../src/components/Hero";
import { ProductCard } from "../src/components/ProductCard";
import { Section } from "../src/components/Section";
import { ScrollEntryMotion } from "../src/components/ScrollEntryMotion";
import { getHomepagePayload } from "../src/server/homepageService";
import { useMediaQuery } from "../src/hooks/use-media-query";
import { PaymentInformation } from "../src/features/homepage/payment-information";
import type { HomepagePayload } from "../src/types/catalog";
import { APPLICATION_THEME_COLOR } from "../src/design-system/metadata";

export const getServerSideProps: GetServerSideProps<HomepagePayload> = async () => {
  return {
    props: await getHomepagePayload(prisma),
  };
};

const carouselSlides = [
  {
    title: "Productos que se adaptan a tu día",
    description: "Descubre opciones seleccionadas para tecnología, audio y hogar.",
    imageUrl: "/images/banners/banner-1.svg",
    action: { label: "Ver destacados", href: "#destacados" },
  },
  {
    title: "Explora con claridad",
    description:
      "Encuentra productos y categorías de manera simple desde cualquier dispositivo.",
    imageUrl: "/images/banners/banner-2.svg",
  },
  {
    title: "Estamos para orientarte",
    description:
      "Conversa con nosotros y recibe información personalizada sobre el producto que te interesa.",
    imageUrl: "/images/banners/banner-3.svg",
    action: { label: "Hablar por WhatsApp", href: "#contacto" },
  },
];

const whatsappUrl =
  "https://wa.me/573506928681?text=Hola%2C%20vi%20el%20cat%C3%A1logo%20de%20Mandoquita%20y%20quisiera%20recibir%20informaci%C3%B3n%20sobre%20un%20producto.";

const COMPACT_FEATURED_LIMIT = 4;
const WIDE_FEATURED_LIMIT = 8;

export function selectVisibleFeaturedProducts<T>(products: T[], isWideViewport: boolean) {
  return products.slice(0, isWideViewport ? WIDE_FEATURED_LIMIT : COMPACT_FEATURED_LIMIT);
}

export default function HomePage({ featuredProducts, categories }: HomepagePayload) {
  const isWideViewport = useMediaQuery("(min-width: 1280px)");
  const visibleFeaturedProducts = selectVisibleFeaturedProducts(
    featuredProducts,
    isWideViewport,
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
      <Head>
        <title>Mandoquita | Catálogo de productos</title>
        <meta
          name="description"
          content="Explora productos para tecnología, audio y hogar, y recibe atención personalizada de Mandoquita."
        />
        <meta name="robots" content="index,follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content={APPLICATION_THEME_COLOR} />
        <link rel="canonical" href="/" />
        <meta property="og:title" content="Mandoquita | Catálogo de productos" />
        <meta property="og:description" content="Productos elegidos para acompañar tu día a día." />
        <meta property="og:type" content="website" />
      </Head>

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
        <div className="py-8 sm:py-12">
          <Container size="xl" padding="lg">
            <Hero
              eyebrow="Catálogo Mandoquita"
              title="Productos elegidos para acompañar tu día a día."
              description="Explora una selección de productos para tecnología, audio y hogar, y contáctanos para recibir atención personalizada."
              primaryAction={
                <Button variant="primary" href="#destacados">
                  Ver productos destacados
                </Button>
              }
              secondaryAction={
                <Button variant="outline" href="#categorias">
                  Explorar categorías
                </Button>
              }
              media={<Carousel slides={carouselSlides} />}
            />
          </Container>
        </div>

        {visibleFeaturedProducts.length > 0 ? (
          <ScrollEntryMotion distance="sm" delayStep={0}>
          <Section id="destacados" tone="default" spacing="spacious">
            <Container size="xl" padding="lg" className="space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted)/1)]">
                  Productos destacados
                </span>
                <h2 className="text-balance text-2xl font-semibold tracking-[-0.02em] text-[rgb(var(--foreground)/1)] sm:text-3xl">
                  Una selección para empezar a explorar
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-[rgb(var(--muted)/1)] sm:text-base">
                  Conoce algunos de los productos seleccionados por Mandoquita.
                </p>
              </div>
              <div className="product-card-grid">
                {visibleFeaturedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} featured />
                ))}
              </div>
            </Container>
          </Section>
          </ScrollEntryMotion>
        ) : null}

        {categories.length > 0 ? (
          <ScrollEntryMotion distance="sm" delayStep={0}>
          <Section id="categorias" tone="surface" spacing="spacious">
            <Container size="xl" padding="lg" className="space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--muted)/1)]">
                  Categorías
                </span>
                <h2 className="text-balance text-2xl font-semibold tracking-[-0.02em] text-[rgb(var(--foreground)/1)] sm:text-3xl">
                  Encuentra lo que necesitas
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-[rgb(var(--muted)/1)] sm:text-base">
                  Explora el catálogo según tus intereses.
                </p>
              </div>
              <div className="category-card-grid">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.slug}
                    title={category.name}
                    href={`/categorias/${category.slug}`}
                    description={`Explora productos de ${category.name.toLowerCase()}.`}
                    imageUrl={category.imageUrl}
                    imageAltText={category.imageAltText}
                    count={category.productCount}
                  />
                ))}
              </div>
            </Container>
          </Section>
          </ScrollEntryMotion>
        ) : null}

        <PaymentInformation contactHref={whatsappUrl} />

        <Section id="contacto" tone="default" spacing="spacious">
          <Container size="xl" padding="lg">
            <div className="rounded-2xl bg-[rgb(var(--inverse-surface)/1)] px-6 py-10 text-[rgb(var(--inverse-foreground)/1)] sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:gap-12">
              <div className="max-w-2xl">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--inverse-muted)/1)]">
                  Atención personalizada
                </span>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
                  ¿Quieres conocer mejor un producto?
                </h2>
                <p className="mt-3 leading-7 text-[rgb(var(--inverse-muted)/1)]">
                  Escríbenos por WhatsApp y recibe información para resolver tus dudas.
                </p>
              </div>
              <Button
                variant="inverse"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-7 lg:mt-0"
              >
                Hablar por WhatsApp
              </Button>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
