// src/features/taxonomy/components/QuickTogglesPanel.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { Switch } from "@/components/ui/switch";
import { AdminSubcategory, AdminProductType } from "../types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ToggleableEntity =
  | {
      kind: "subcategory";
      id: string;
      name: string;
      active: boolean;
      parentLabel: string;
      updatedAt: string;
      raw: AdminSubcategory;
    }
  | {
      kind: "productType";
      id: string;
      name: string;
      active: boolean;
      parentLabel: string;
      updatedAt: string;
      raw: AdminProductType;
    };

type OverrideState = {
  pending: boolean;
  error: string | null;
};

export type QuickTogglesPanelProps = {
  subcategories: AdminSubcategory[];
  productTypes: AdminProductType[];
  categoryNameById: Record<string, string>;
  subcategoryNameById: Record<string, string>;
  loading?: boolean;
  error?: string | null;
  onToggleSubcategory: (sub: AdminSubcategory, next: boolean) => Promise<void>;
  onToggleProductType: (pt: AdminProductType, next: boolean) => Promise<void>;
  onRefresh: () => void;
};

// ---------------------------------------------------------------------------
// Helper: relative time
// ---------------------------------------------------------------------------

function formatRelative(isoDate: string): string {
  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  const diffMs = new Date(isoDate).getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1_000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, "second");
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute");
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, "hour");
  if (Math.abs(diffDay) < 30) return rtf.format(diffDay, "day");
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

type TabButtonProps = {
  label: string;
  count: number;
  selected: boolean;
  onClick: () => void;
};

function TabButton({ label, count, selected, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary)/0.5)] focus-visible:ring-offset-1",
        selected
          ? "bg-[rgb(var(--primary)/1)] text-[rgb(var(--primary-foreground)/1)]"
          : "bg-transparent text-[rgb(var(--foreground)/0.6)] hover:bg-[rgb(var(--muted)/0.4)] hover:text-[rgb(var(--foreground)/1)]",
      )}
    >
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums",
          selected
            ? "bg-[rgb(var(--primary-foreground)/0.15)] text-[rgb(var(--primary-foreground)/1)]"
            : "bg-[rgb(var(--muted)/0.6)] text-[rgb(var(--foreground)/0.6)]",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function ToggleListSkeleton() {
  return (
    <ul
      aria-hidden="true"
      className="divide-y divide-[rgb(var(--border)/1)] rounded-lg border border-[rgb(var(--border)/1)]"
    >
      {Array.from({ length: 4 }, (_, i) => (
        <li
          key={i}
          className="flex animate-pulse items-center justify-between px-4 py-3"
        >
          <div className="flex flex-col gap-2">
            <div className="h-3.5 w-36 rounded bg-[rgb(var(--muted)/0.3)]" />
            <div className="h-3 w-24 rounded bg-[rgb(var(--muted)/0.3)]" />
          </div>
          <div className="h-5 w-9 rounded-full bg-[rgb(var(--muted)/0.3)]" />
        </li>
      ))}
    </ul>
  );
}

type EmptyStateProps = {
  hasQuery: boolean;
  tab: "subcategories" | "productTypes";
};

function EmptyState({ hasQuery, tab }: EmptyStateProps) {
  const isSubcategories = tab === "subcategories";

  if (hasQuery) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-[rgb(var(--border)/1)] px-4 py-10 text-center">
        <p className="text-sm font-medium text-[rgb(var(--foreground)/1)]">
          Sin coincidencias
        </p>
        <p className="text-xs text-[rgb(var(--foreground)/0.5)]">
          Proba con otro termino o limpia la busqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-[rgb(var(--border)/1)] px-4 py-10 text-center">
      <p className="text-sm font-medium text-[rgb(var(--foreground)/1)]">
        {isSubcategories
          ? "Todavia no hay subcategorias"
          : "Todavia no hay tipos de producto"}
      </p>
      <p className="text-xs text-[rgb(var(--foreground)/0.5)]">
        Cuando crees elementos en el arbol apareceran aca.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function QuickTogglesPanel({
  subcategories,
  productTypes,
  categoryNameById,
  subcategoryNameById,
  loading = false,
  error,
  onToggleSubcategory,
  onToggleProductType,
  onRefresh,
}: QuickTogglesPanelProps) {
  const [tab, setTab] = React.useState<"subcategories" | "productTypes">(
    "subcategories",
  );
  const [query, setQuery] = React.useState("");
  const [overrides, setOverrides] = React.useState<
    Record<string, OverrideState>
  >({});
  const [refreshing, setRefreshing] = React.useState(false);

  // -------------------------------------------------------------------------
  // Enriched lists
  // -------------------------------------------------------------------------

  const enrichedSubcategories = React.useMemo<ToggleableEntity[]>(
    () =>
      subcategories.map((sub) => ({
        kind: "subcategory" as const,
        id: sub.id,
        name: sub.name,
        active: sub.active,
        parentLabel: categoryNameById[sub.categoryId] ?? sub.categoryId,
        updatedAt: sub.updatedAt,
        raw: sub,
      })),
    [subcategories, categoryNameById],
  );

  const enrichedProductTypes = React.useMemo<ToggleableEntity[]>(
    () =>
      productTypes.map((pt) => ({
        kind: "productType" as const,
        id: pt.id,
        name: pt.name,
        active: pt.active,
        parentLabel: subcategoryNameById[pt.subcategoryId] ?? pt.subcategoryId,
        updatedAt: pt.updatedAt,
        raw: pt,
      })),
    [productTypes, subcategoryNameById],
  );

  const activeList =
    tab === "subcategories" ? enrichedSubcategories : enrichedProductTypes;

  const filteredList = React.useMemo<ToggleableEntity[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return activeList;
    return activeList.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.parentLabel.toLowerCase().includes(q),
    );
  }, [activeList, query]);

  // -------------------------------------------------------------------------
  // Toggle handler
  // -------------------------------------------------------------------------

  async function handleToggle(entity: ToggleableEntity, next: boolean) {
    setOverrides((prev) => ({
      ...prev,
      [entity.id]: { pending: true, error: null },
    }));

    try {
      if (entity.kind === "subcategory") {
        await onToggleSubcategory(entity.raw, next);
      } else {
        await onToggleProductType(entity.raw, next);
      }

      setOverrides((prev) => {
        const next = { ...prev };
        delete next[entity.id];
        return next;
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo actualizar.";
      setOverrides((prev) => ({
        ...prev,
        [entity.id]: { pending: false, error: message },
      }));
    }
  }

  // -------------------------------------------------------------------------
  // Refresh handler
  // -------------------------------------------------------------------------

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await Promise.resolve(onRefresh());
    } finally {
      setRefreshing(false);
    }
  }

  // -------------------------------------------------------------------------
  // Footer counts
  // -------------------------------------------------------------------------

  const totalCount = activeList.length;
  const activeCount = activeList.filter((e) => {
    const override = overrides[e.id];
    if (override?.pending) return e.active; // optimistic: keep original while pending
    return e.active;
  }).length;

  const footerLabel =
    tab === "subcategories"
      ? `${totalCount} subcategor${totalCount === 1 ? "ia" : "ias"} · ${activeCount} activ${activeCount === 1 ? "a" : "as"}`
      : `${totalCount} tipo${totalCount !== 1 ? "s" : ""} · ${activeCount} activ${activeCount === 1 ? "o" : "os"}`;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const isRefreshing = loading || refreshing;

  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="ds-heading ds-heading-md">Visor rapido</h2>
        <p className="text-sm text-[rgb(var(--foreground)/0.55)]">
          Activa o desactiva subcategorias y tipos de producto sin salir de esta
          vista.
        </p>
      </div>

      {/* Error notice */}
      {error ? <Notice text={error} variant="error" /> : null}

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Tipo de elemento"
        className="flex gap-1.5"
      >
        <TabButton
          label="Subcategorias"
          count={subcategories.length}
          selected={tab === "subcategories"}
          onClick={() => {
            setTab("subcategories");
            setQuery("");
          }}
        />
        <TabButton
          label="Tipos de producto"
          count={productTypes.length}
          selected={tab === "productTypes"}
          onClick={() => {
            setTab("productTypes");
            setQuery("");
          }}
        />
      </div>

      {/* Controls row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            tab === "subcategories"
              ? "Filtrar subcategorias o categorias…"
              : "Filtrar tipos o subcategorias…"
          }
          aria-label={
            tab === "subcategories"
              ? "Filtrar subcategorias"
              : "Filtrar tipos de producto"
          }
          className={cn(
            "w-full rounded-md border border-[rgb(var(--border)/1)] bg-[rgb(var(--background)/1)]",
            "px-3 py-1.5 text-sm text-[rgb(var(--foreground)/1)] placeholder:text-[rgb(var(--foreground)/0.35)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary)/0.5)] focus-visible:ring-offset-1",
            "sm:max-w-xs",
          )}
        />

        <Button
          variant="secondary"
          size="sm"
          disabled={isRefreshing}
          onClick={() => {
            void handleRefresh();
          }}
        >
          {isRefreshing ? "Actualizando…" : "Actualizar"}
        </Button>
      </div>

      {/* List */}
      {loading ? (
        <ToggleListSkeleton />
      ) : activeList.length === 0 ? (
        <EmptyState hasQuery={false} tab={tab} />
      ) : filteredList.length === 0 ? (
        <EmptyState hasQuery={true} tab={tab} />
      ) : (
        <ul
          role="tabpanel"
          className="divide-y divide-[rgb(var(--border)/1)] rounded-lg border border-[rgb(var(--border)/1)]"
        >
          {filteredList.map((entity) => {
            const override = overrides[entity.id];
            const isPending = override?.pending === true;
            const rowError = override?.error ?? null;

            // Optimistic checked value: while pending, show toggled state
            const checkedValue = isPending ? !entity.active : entity.active;

            return (
              <li
                key={entity.id}
                className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Left: name + meta */}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium text-[rgb(var(--foreground)/1)]">
                    {entity.name}
                  </span>
                  <span className="truncate text-xs text-[rgb(var(--foreground)/0.5)]">
                    {entity.parentLabel}
                    {" · "}
                    {formatRelative(entity.updatedAt)}
                  </span>
                </div>

                {/* Right: switch + inline error */}
                <div className="flex flex-col items-start gap-1 sm:items-end">
                  <Switch
                    size="sm"
                    checked={checkedValue}
                    loading={isPending}
                    onCheckedChange={(next) => {
                      void handleToggle(entity, next);
                    }}
                    aria-label={`Activar o desactivar ${entity.name}`}
                  />
                  {rowError !== null && (
                    <p
                      role="alert"
                      className="mt-1 text-xs text-[rgb(var(--destructive)/1)]"
                    >
                      {rowError}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Footer */}
      {!loading && activeList.length > 0 && (
        <p className="text-right text-xs text-[rgb(var(--foreground)/0.45)] tabular-nums">
          {footerLabel}
        </p>
      )}
    </section>
  );
}
