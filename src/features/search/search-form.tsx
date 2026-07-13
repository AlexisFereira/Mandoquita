import React, { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/router";

import { Button } from "../../components/Button";
import { Icon } from "../../components/Icon";
import { Input } from "../../components/Input";
import { PoliteStatus } from "../../components/PoliteStatus";

export type SearchFormProps = {
  initialQuery?: string;
  initialError?: string;
  autoFocus?: boolean;
  onLoadingChange?: (loading: boolean) => void;
};

export function SearchForm({
  initialQuery = "",
  initialError,
  autoFocus = false,
  onLoadingChange,
}: SearchFormProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [error, setError] = useState(initialError ?? "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
    setError(initialError ?? "");
  }, [initialError, initialQuery]);

  const setNavigationLoading = (value: boolean) => {
    setLoading(value);
    onLoadingChange?.(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = query.trim();

    if (!normalized) {
      setError("Escribe un término para buscar productos.");
      inputRef.current?.focus();
      return;
    }

    if (normalized.length > 120) {
      setError("Revisa la búsqueda e inténtalo de nuevo.");
      inputRef.current?.focus();
      return;
    }

    setError("");
    setNavigationLoading(true);
    try {
      await router.push({ pathname: "/buscar", query: { q: normalized } });
    } catch {
      setError("No pudimos cargar los resultados. Inténtalo de nuevo.");
    } finally {
      setNavigationLoading(false);
    }
  };

  const handleClear = async () => {
    setQuery("");
    setError("");
    inputRef.current?.focus();
    setNavigationLoading(true);
    try {
      await router.replace("/buscar", undefined, { scroll: false });
    } finally {
      setNavigationLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <form role="search" className="max-w-[800px]" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
        <div className="min-w-0 flex-1">
          <Input
            ref={inputRef}
            id="product-search-query"
            name="q"
            type="search"
            label="Buscar productos"
            placeholder="Nombre, marca, colección o etiqueta"
            helperText="Busca por nombre, descripción, marca, colección o etiquetas."
            errorText={error || undefined}
            invalid={Boolean(error)}
            value={query}
            maxLength={121}
            autoComplete="off"
            autoFocus={autoFocus}
            disabled={loading}
            onChange={(event) => {
              setQuery(event.target.value);
              if (error) setError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape" && query) {
                event.preventDefault();
                void handleClear();
              }
            }}
            leftIcon={<Icon name="search" />}
            rightIcon={query && !loading ? (
              <button
                type="button"
                aria-label="Limpiar búsqueda"
                onClick={() => void handleClear()}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-[rgb(var(--muted)/1)] hover:text-[rgb(var(--foreground)/1)]"
              >
                <Icon name="close" />
              </button>
            ) : null}
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full gap-2 sm:mb-7 sm:w-auto sm:min-w-28"
        >
          <Icon name="search" />
          <span>{loading ? "Buscando…" : "Buscar"}</span>
        </Button>
      </div>
      {loading ? (
        <PoliteStatus visuallyHidden={false} className="mt-3 text-sm text-[rgb(var(--muted)/1)]">
          Buscando productos…
        </PoliteStatus>
      ) : null}
    </form>
  );
}
