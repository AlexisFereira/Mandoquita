import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { ZodError } from "zod";
import type { GetServerSideProps } from "next";

import { prisma } from "../lib/prisma";
import { Container } from "../src/components/Container";
import { Footer } from "../src/components/Footer";
import { Header } from "../src/components/Header";
import { Icon } from "../src/components/Icon";
import { ProductCard } from "../src/components/ProductCard";
import { PoliteStatus } from "../src/components/PoliteStatus";
import { SearchForm } from "../src/features/search/search-form";
import { APPLICATION_THEME_COLOR } from "../src/design-system/metadata";
import { listProducts } from "../src/server/catalogService";
import type { ProductListResponse } from "../src/types/catalog";
import FaviconLinks from "./components/FaviconLinks";

export type SearchPageProps = {
  query: string;
  outcome: "initial" | "invalid" | "results" | "error";
  response: ProductListResponse | null;
  focusSearch?: boolean;
};

function singleQuery(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export const getServerSideProps: GetServerSideProps<SearchPageProps> = async ({
  query,
}) => {
  const rawQuery = singleQuery(query.q);

  if (rawQuery === undefined) {
    return {
      props: {
        query: "",
        outcome: "initial",
        response: null,
        focusSearch: singleQuery(query.focus) === "1",
      },
    };
  }

  const understandableQuery = rawQuery.trim();
  if (!understandableQuery || understandableQuery.length > 120) {
    return {
      props: {
        query: understandableQuery.slice(0, 121),
        outcome: "invalid",
        response: null,
      },
    };
  }

  try {
    const response = await listProducts(prisma, {
      q: understandableQuery,
      page: singleQuery(query.page),
      limit: "12",
    });
    return {
      props: { query: understandableQuery, outcome: "results", response },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        props: {
          query: understandableQuery,
          outcome: "invalid",
          response: null,
        },
      };
    }
    return {
      props: { query: understandableQuery, outcome: "error", response: null },
    };
  }
};

function searchPageHref(query: string, page: number) {
  return `/buscar?q=${encodeURIComponent(query)}&page=${page}`;
}

export default function SearchPage({
  query,
  outcome,
  response,
  focusSearch = false,
}: SearchPageProps) {
  const [navigating, setNavigating] = useState(false);
  const hasResults = outcome === "results" && Boolean(response?.items.length);
  const noResults = outcome === "results" && response?.items.length === 0;
  const initialError =
    outcome === "invalid"
      ? query
        ? "Revisa la búsqueda e inténtalo de nuevo."
        : "Escribe un término para buscar productos."
      : undefined;

  return (
    <>
      <Head>
        <title>
          {query
            ? `Resultados para ${query} | Mandoquita`
            : "Buscar productos | Mandoquita"}
        </title>
        <meta
          name="description"
          content="Busca productos por nombre, descripción, marca, colección o etiquetas en Mandoquita."
        />
        <meta name="robots" content="noindex,follow" />
        <meta name="theme-color" content={APPLICATION_THEME_COLOR} />
        <FaviconLinks />
      </Head>

      <a href="#main-content" className="skip-link">
        Ir al contenido principal
      </a>
      <Header />

      <main id="main-content" className="py-10 sm:py-14 lg:py-16">
        <Container size="xl" padding="lg" className="space-y-8 sm:space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="ds-eyebrow">Catálogo Mandoquita</span>
            <h1 className="ds-heading ds-heading-lg">Buscar productos</h1>
            <p className="max-w-2xl leading-7 text-[rgb(var(--muted)/1)]">
              Encuentra productos disponibles para explorar en el catálogo.
            </p>
          </div>

          <SearchForm
            initialQuery={query}
            initialError={initialError}
            autoFocus={focusSearch || outcome === "invalid"}
            onLoadingChange={setNavigating}
          />

          <div aria-busy={navigating || undefined}>
            {!navigating && hasResults && response ? (
              <section
                aria-labelledby="search-results-heading"
                className="space-y-6"
              >
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div className="min-w-0 space-y-2">
                    <h2
                      id="search-results-heading"
                      className="ds-heading ds-heading-md [overflow-wrap:anywhere]"
                    >
                      Resultados para “{query}”
                    </h2>
                    <PoliteStatus
                      visuallyHidden={false}
                      className="text-sm text-[rgb(var(--muted)/1)]"
                    >
                      {response.metadata.totalItems === 1
                        ? "1 producto encontrado"
                        : `${response.metadata.totalItems} productos encontrados`}
                    </PoliteStatus>
                  </div>
                  <p className="text-sm text-[rgb(var(--muted)/1)]">
                    Mostrando{" "}
                    {(response.metadata.page - 1) * response.metadata.limit + 1}
                    –
                    {Math.min(
                      response.metadata.page * response.metadata.limit,
                      response.metadata.totalItems,
                    )}{" "}
                    de {response.metadata.totalItems}
                  </p>
                </div>

                <div className="product-card-grid">
                  {response.items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {response.metadata.totalPages > 1 ? (
                  <nav
                    aria-label="Paginación de resultados"
                    className="flex flex-wrap items-center gap-3"
                  >
                    {response.metadata.page > 1 ? (
                      <Link
                        href={searchPageHref(query, response.metadata.page - 1)}
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[rgb(var(--primary)/1)] px-5 py-2 text-sm font-semibold"
                      >
                        <Icon name="previous" /> Anterior
                      </Link>
                    ) : null}
                    <span
                      aria-current="page"
                      className="px-2 text-sm font-semibold"
                    >
                      Página {response.metadata.page} de{" "}
                      {response.metadata.totalPages}
                    </span>
                    {response.metadata.page < response.metadata.totalPages ? (
                      <Link
                        href={searchPageHref(query, response.metadata.page + 1)}
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[rgb(var(--primary)/1)] px-5 py-2 text-sm font-semibold"
                      >
                        Siguiente <Icon name="next" />
                      </Link>
                    ) : null}
                  </nav>
                ) : null}
              </section>
            ) : null}

            {!navigating && noResults ? (
              <section
                aria-labelledby="no-search-results"
                className="max-w-2xl space-y-4"
              >
                <h2
                  id="no-search-results"
                  className="ds-heading ds-heading-md flex items-start gap-2 [overflow-wrap:anywhere]"
                >
                  <Icon name="information" className="mt-1" />
                  <span>No encontramos productos para “{query}”.</span>
                </h2>
                <p className="text-[rgb(var(--muted)/1)]">
                  Prueba con otro nombre, descripción, marca, colección o
                  etiqueta.
                </p>
              </section>
            ) : null}

            {!navigating && outcome === "error" ? (
              <section
                aria-labelledby="search-error"
                className="max-w-2xl space-y-4"
              >
                <h2
                  id="search-error"
                  className="ds-heading ds-heading-md flex items-center gap-2"
                >
                  <Icon name="error" /> No pudimos cargar los resultados
                </h2>
                <p className="text-[rgb(var(--muted)/1)]">
                  Inténtalo de nuevo.
                </p>
                <Link
                  href={searchPageHref(query, 1)}
                  className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
                >
                  Reintentar
                </Link>
              </section>
            ) : null}
          </div>

          <nav
            aria-label="Alternativas de exploración"
            className="flex flex-wrap gap-x-6 gap-y-3 border-t border-[rgb(var(--border)/1)] pt-6"
          >
            <Link
              href="/categorias"
              className="inline-flex min-h-11 items-center gap-2 font-semibold underline underline-offset-4"
            >
              <Icon name="back" /> Explorar categorías
            </Link>
            <Link
              href="/#destacados"
              className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
            >
              Ver productos destacados
            </Link>
          </nav>
        </Container>
      </main>

      <Footer />
    </>
  );
}
