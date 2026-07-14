import React, { useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Container } from "../../components/Container";
import { Input } from "../../components/Input";
import { PoliteStatus } from "../../components/PoliteStatus";
import { AdminApiError, adminApi } from "./api";
import type {
  AdminEditorValues,
  AdminFieldErrors,
  AdminFilters,
  AdminProduct,
  AdminProductList,
  AdminProductType,
  AdminSession,
} from "./types";
import { changedEditorValues, productToEditorValues, validateAdminProduct } from "./validation";
import { CategoryMediaAdmin, ProductMediaAdmin } from "./MediaAdmin";

const emptyFilters: AdminFilters = {
  q: "", published: "", commerciallyAvailable: "", featured: "", active: "", category: "", productType: "",
};

function errorMessage(error: unknown, context: "access" | "read" | "save") {
  if (!(error instanceof AdminApiError)) return "Ocurrió un problema inesperado. Inténtalo de nuevo.";
  if (error.status === 429) return error.retryAfter
    ? `Demasiados intentos. Inténtalo de nuevo en ${Math.ceil(error.retryAfter / 60)} minutos.`
    : "Demasiados intentos. Espera antes de intentarlo de nuevo.";
  if (error.status === 503) return "La administración no está disponible en este momento.";
  if (context === "access" && [401, 403].includes(error.status)) return "No pudimos verificar el acceso. Revisa el código e inténtalo de nuevo.";
  if (error.status === 409) return "El producto cambió desde que lo abriste. Recarga la información antes de guardar.";
  if (error.status === 404) return "El producto ya no está disponible.";
  if (error.status === 400) return "Revisa los datos del formulario e inténtalo de nuevo.";
  return context === "save" ? "No pudimos guardar los cambios." : "No pudimos cargar la información.";
}

function AccessGate({ message, onAccess }: { message?: string; onAccess: (session: AdminSession) => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(message ?? "");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError("Ingresa los seis dígitos.");
      inputRef.current?.focus();
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      onAccess(await adminApi.login(code));
      setCode("");
    } catch (requestError) {
      setError(errorMessage(requestError, "access"));
      inputRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main id="admin-main" className="flex min-h-screen items-center py-10 sm:py-16">
      <Container size="sm" padding="lg">
        <Card as="section" padding="lg" className="mx-auto max-w-lg space-y-6" aria-labelledby="access-title">
          <div className="space-y-3">
            <span className="ds-eyebrow">Mandoquita · Administración</span>
            <h1 id="access-title" className="ds-heading ds-heading-lg">Acceso administrativo</h1>
            <p className="leading-7 text-[rgb(var(--muted)/1)]">Ingresa el código de seis dígitos para administrar productos.</p>
          </div>
          {error ? <div role="alert" className="rounded-md border border-[rgb(var(--danger)/0.35)] bg-[rgb(var(--danger)/0.07)] p-4 text-sm text-[rgb(var(--danger)/1)]">{error}</div> : null}
          <form className="space-y-5" onSubmit={submit} noValidate>
            <Input
              ref={inputRef}
              id="admin-code"
              label="Código de acceso"
              helperText={!error ? "Ingresa los seis dígitos." : undefined}
              errorText={error ? "El código debe tener seis dígitos." : undefined}
              invalid={Boolean(error && !/^\d{6}$/.test(code))}
              type="password"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              disabled={submitting}
            />
            <Button type="submit" className="w-full" disabled={submitting} aria-busy={submitting || undefined}>
              {submitting ? "Verificando…" : "Ingresar"}
            </Button>
          </form>
        </Card>
      </Container>
    </main>
  );
}

function SelectField({ id, label, value, onChange, children, helper, error }: {
  id: string; label: string; value: string; onChange: (value: string) => void; children: React.ReactNode; helper?: string; error?: string;
}) {
  const descriptionId = `${id}-${error ? "error" : "helper"}`;
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">{label}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error) || undefined} aria-describedby={helper || error ? descriptionId : undefined} className={`min-h-12 w-full rounded-md border bg-[rgb(var(--surface)/1)] px-4 ${error ? "border-[rgb(var(--danger)/1)]" : "border-[rgb(var(--border)/1)]"}`}>
        {children}
      </select>
      {helper || error ? <p id={descriptionId} className={`text-xs leading-5 ${error ? "text-[rgb(var(--danger)/1)]" : "text-[rgb(var(--muted)/1)]"}`}>{error ?? helper}</p> : null}
    </div>
  );
}

function ProductList({ onEdit, onMedia, onExpired }: { onEdit: (id: number) => void; onMedia: (id: number) => void; onExpired: () => void }) {
  const [draft, setDraft] = useState(emptyFilters);
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<AdminProductList | null>(null);
  const [types, setTypes] = useState<AdminProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestKey = JSON.stringify({ filters, page });

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [products, taxonomy] = await Promise.all([adminApi.products(filters, page), adminApi.productTypes()]);
      setResponse(products);
      setTypes(taxonomy.items);
      if (products.metadata.page !== page) setPage(products.metadata.page);
    } catch (requestError) {
      if (requestError instanceof AdminApiError && [401, 403].includes(requestError.status)) return onExpired();
      setError(errorMessage(requestError, "read"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, [requestKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const categories = useMemo(() => Array.from(new Map(types.map((type) => [type.category.slug, type.category])).values()), [types]);
  const applied = Object.entries(filters).filter(([, value]) => value);

  function apply(event: React.FormEvent) {
    event.preventDefault();
    setPage(1);
    setFilters({ ...draft, q: draft.q.trim() });
  }

  function removeFilter(key: keyof AdminFilters) {
    const next = { ...filters, [key]: "" };
    setFilters(next);
    setDraft((current) => ({ ...current, [key]: "" }));
    setPage(1);
  }

  const filterLabel = (key: string, value: string) => {
    const labels: Record<string, string> = { published: "Publicación", commerciallyAvailable: "Disponibilidad", featured: "Destacado", active: "Actividad", category: "Categoría", productType: "Tipo", q: "Búsqueda" };
    return `${labels[key]}: ${value === "true" ? "Sí" : value === "false" ? "No" : value}`;
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <span className="ds-eyebrow">Catálogo administrativo</span>
        <h1 className="ds-heading ds-heading-lg">Productos</h1>
        <p className="max-w-2xl text-[rgb(var(--muted)/1)]">Busca, filtra y actualiza los productos existentes.</p>
      </div>

      <Card as="section" aria-labelledby="admin-search-title" className="space-y-5">
        <h2 id="admin-search-title" className="ds-heading ds-heading-md">Buscar y filtrar</h2>
        <form onSubmit={apply} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Input id="admin-search" label="Nombre o slug" value={draft.q} maxLength={160} onChange={(event) => setDraft({ ...draft, q: event.target.value })} />
            {(["published", "commerciallyAvailable", "featured", "active"] as const).map((key) => (
              <SelectField key={key} id={`filter-${key}`} label={{ published: "Publicación", commerciallyAvailable: "Disponible comercialmente", featured: "Destacado", active: "Activo" }[key]} value={draft[key]} onChange={(value) => setDraft({ ...draft, [key]: value as "" | "true" | "false" })}>
                <option value="">Todos</option><option value="true">Sí</option><option value="false">No</option>
              </SelectField>
            ))}
            <SelectField id="filter-category" label="Categoría" value={draft.category} onChange={(value) => setDraft({ ...draft, category: value, productType: "" })}>
              <option value="">Todas</option>{categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
            </SelectField>
            <SelectField id="filter-product-type" label="Tipo de producto" value={draft.productType} onChange={(value) => setDraft({ ...draft, productType: value })}>
              <option value="">Todos</option>{types.filter((type) => !draft.category || type.category.slug === draft.category).map((type) => <option key={type.name} value={type.name}>{type.category.name} / {type.subcategory.name} / {type.name}</option>)}
            </SelectField>
          </div>
          <div className="flex flex-wrap gap-3"><Button type="submit">Aplicar filtros</Button>{applied.length ? <Button type="button" variant="ghost" onClick={() => { setDraft(emptyFilters); setFilters(emptyFilters); setPage(1); }}>Limpiar búsqueda y filtros</Button> : null}</div>
        </form>
        {applied.length ? <div aria-label="Filtros aplicados" className="flex flex-wrap gap-2">{applied.map(([key, value]) => <button key={key} type="button" onClick={() => removeFilter(key as keyof AdminFilters)} aria-label={`Quitar ${filterLabel(key, value)}`} className="inline-flex min-h-11 items-center rounded-full border border-[rgb(var(--border)/1)] px-4 text-sm font-medium">{filterLabel(key, value)} <span aria-hidden="true" className="ml-2">×</span></button>)}</div> : null}
      </Card>

      <section aria-labelledby="product-list-title" aria-busy={loading || undefined} className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="product-list-title" className="ds-heading ds-heading-md">Resultados</h2>
          {response && !loading ? <PoliteStatus visuallyHidden={false} className="text-sm text-[rgb(var(--muted)/1)]">{response.metadata.totalItems} {response.metadata.totalItems === 1 ? "producto" : "productos"}</PoliteStatus> : null}
        </div>
        {loading ? <PoliteStatus visuallyHidden={false} className="rounded-md border border-[rgb(var(--border)/1)] p-6">Cargando productos…</PoliteStatus> : null}
        {error ? <div role="alert" className="space-y-4 rounded-md border border-[rgb(var(--danger)/0.35)] p-5"><p>{error}</p><Button variant="secondary" onClick={() => void load()}>Reintentar</Button></div> : null}
        {!loading && !error && response?.items.length === 0 ? <Card><p>{applied.length ? "No hay productos que coincidan con la búsqueda y los filtros actuales." : "No hay productos para administrar."}</p></Card> : null}
        {!loading && !error && response?.items.length ? <ul className="space-y-4">{response.items.map((product) => (
          <Card as="li" key={product.id} className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="min-w-0 space-y-3">
              <div><h3 className="text-lg font-semibold [overflow-wrap:anywhere]">{product.name}</h3><p className="text-sm text-[rgb(var(--muted)/1)] [overflow-wrap:anywhere]">/{product.slug}</p></div>
              <p className="text-sm text-[rgb(var(--muted)/1)]">{[product.category?.name, product.subcategory?.name, product.productType?.name].filter(Boolean).join(" / ") || "Sin clasificación"}</p>
              <div className="flex flex-wrap gap-2"><Badge variant={product.active ? "success" : "neutral"}>{product.active ? "Activo" : "Inactivo"}</Badge><Badge variant={product.published ? "success" : "warning"}>{product.published ? "Publicado" : "No publicado"}</Badge><Badge variant={product.commerciallyAvailable ? "success" : "neutral"}>{product.commerciallyAvailable ? "Disponible comercialmente" : "No disponible comercialmente"}</Badge><Badge variant={product.featured ? "primary" : "neutral"}>{product.featured ? "Destacado" : "No destacado"}</Badge></div>
              <p className="text-xs text-[rgb(var(--muted)/1)]">Actualizado {new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(product.updatedAt))} · {product.currency} {product.price}</p>
            </div>
            <div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={() => onEdit(product.id)} aria-label={`Editar ${product.name}`}>Editar</Button><Button variant="secondary" onClick={() => onMedia(product.id)} aria-label={`Administrar imágenes de ${product.name}`}>Administrar imágenes</Button></div>
          </Card>
        ))}</ul> : null}
        {response && response.metadata.totalPages > 1 && !loading && !error ? <nav aria-label="Paginación de productos" className="flex flex-wrap items-center gap-3"><Button variant="secondary" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Anterior</Button><span aria-current="page" className="text-sm font-semibold">Página {response.metadata.page} de {response.metadata.totalPages}</span><Button variant="secondary" disabled={page >= response.metadata.totalPages} onClick={() => setPage((current) => current + 1)}>Siguiente</Button></nav> : null}
      </section>
    </div>
  );
}

function TextAreaField({ id, label, value, maximum, onChange, error, rows = 4 }: { id: string; label: string; value: string; maximum: number; onChange: (value: string) => void; error?: string; rows?: number }) {
  return <div className="space-y-2"><label htmlFor={id} className="block text-sm font-medium">{label}</label><textarea id={id} rows={rows} value={value} maxLength={maximum + 1} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error) || undefined} aria-describedby={`${id}-${error ? "error" : "count"}`} className={`w-full rounded-md border bg-[rgb(var(--surface)/1)] px-4 py-3 ${error ? "border-[rgb(var(--danger)/1)]" : "border-[rgb(var(--border)/1)]"}`} />{error ? <p id={`${id}-error`} className="text-xs text-[rgb(var(--danger)/1)]">{error}</p> : <p id={`${id}-count`} className="text-xs text-[rgb(var(--muted)/1)]">{value.length} de {maximum.toLocaleString("es-CO")} caracteres</p>}</div>;
}

function CheckField({ id, label, helper, checked, onChange, error }: { id: string; label: string; helper: string; checked: boolean; onChange: (checked: boolean) => void; error?: string }) {
  return <div className="grid min-h-11 grid-cols-[auto_1fr] items-start gap-x-3 rounded-md p-2"><input id={id} type="checkbox" className="mt-1 h-5 w-5 shrink-0" checked={checked} aria-invalid={Boolean(error) || undefined} aria-describedby={`${id}-helper${error ? ` ${id}-error` : ""}`} onChange={(event) => onChange(event.target.checked)} /><div><label htmlFor={id} className="block cursor-pointer font-medium">{label}</label><p id={`${id}-helper`} className="text-sm text-[rgb(var(--muted)/1)]">{helper}</p>{error ? <p id={`${id}-error`} className="mt-1 text-sm text-[rgb(var(--danger)/1)]">{error}</p> : null}</div></div>;
}

function Editor({ id, session, onBack, onMedia, onExpired }: { id: number; session: AdminSession; onBack: () => void; onMedia: () => void; onExpired: () => void }) {
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [types, setTypes] = useState<AdminProductType[]>([]);
  const [baseline, setBaseline] = useState<AdminEditorValues | null>(null);
  const [values, setValues] = useState<AdminEditorValues | null>(null);
  const [errors, setErrors] = useState<AdminFieldErrors>({});
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [conflict, setConflict] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const dirty = Boolean(values && baseline && Object.keys(changedEditorValues(baseline, values)).length);

  async function load() {
    setLoading(true); setStatus(""); setConflict(false);
    try {
      const [detail, taxonomy] = await Promise.all([adminApi.product(id), adminApi.productTypes()]);
      const next = productToEditorValues(detail.item);
      setProduct(detail.item); setTypes(taxonomy.items); setBaseline(next); setValues(next); setErrors({});
    } catch (requestError) {
      if (requestError instanceof AdminApiError && [401, 403].includes(requestError.status)) return onExpired();
      setStatus(errorMessage(requestError, "read"));
    } finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update<K extends keyof AdminEditorValues>(key: K, value: AdminEditorValues[K]) { setValues((current) => current ? { ...current, [key]: value } : current); setStatus(""); }
  function guardedBack() { if (!dirty || window.confirm("Tienes cambios sin guardar. ¿Quieres descartarlos?")) onBack(); }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!values || !baseline || !product || saving) return;
    const nextErrors = validateAdminProduct(values, product.hasVariant);
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); setStatus("Revisa los campos indicados."); requestAnimationFrame(() => summaryRef.current?.focus()); return; }
    const changes = changedEditorValues(baseline, values);
    if (!Object.keys(changes).length) { setStatus("No hay cambios para guardar."); return; }
    setSaving(true); setErrors({}); setStatus(""); setConflict(false);
    try {
      const response = await adminApi.updateProduct(id, session.csrfToken, product.updatedAt, changes);
      const next = productToEditorValues(response.item);
      setProduct(response.item); setBaseline(next); setValues(next); setStatus("Cambios guardados correctamente.");
    } catch (requestError) {
      if (requestError instanceof AdminApiError && [401, 403].includes(requestError.status)) return onExpired();
      setConflict(requestError instanceof AdminApiError && requestError.status === 409);
      setStatus(errorMessage(requestError, "save")); requestAnimationFrame(() => summaryRef.current?.focus());
    } finally { setSaving(false); }
  }

  if (loading) return <PoliteStatus visuallyHidden={false} className="py-12">Cargando producto…</PoliteStatus>;
  if (!product || !values || !baseline) return <div role="alert" className="space-y-4"><p>{status || "No pudimos cargar el producto."}</p><div className="flex gap-3"><Button variant="secondary" onClick={() => void load()}>Reintentar</Button><Button variant="ghost" onClick={onBack}>Volver a productos</Button></div></div>;
  const selectedType = types.find((type) => type.name === values.productTypeId);
  const field = (key: keyof AdminEditorValues, label: string, maximum?: number, helperText?: string) => <Input id={`admin-${key}`} label={label} value={String(values[key])} maxLength={maximum ? maximum + 1 : undefined} helperText={helperText ?? (maximum ? `${String(values[key]).length} de ${maximum} caracteres` : undefined)} errorText={errors[key]} invalid={Boolean(errors[key])} onChange={(event) => update(key, event.target.value as never)} />;

  return <div className="mx-auto max-w-[960px] space-y-8">
    <Button variant="ghost" onClick={guardedBack}>← Volver a productos</Button>
    <div className="space-y-3"><span className="ds-eyebrow">Editar producto</span><h1 className="ds-heading ds-heading-lg [overflow-wrap:anywhere]">{product.name}</h1><p className="text-sm text-[rgb(var(--muted)/1)]">ID {product.id} · /{product.slug} · Actualizado {new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(product.updatedAt))} · {product.hasVariant ? "Con variante" : "Sin variantes"}</p><Button variant="secondary" onClick={() => { if (!dirty || window.confirm("Tienes cambios sin guardar. ¿Quieres descartarlos?")) onMedia(); }}>Administrar imágenes</Button></div>
    {status ? <div ref={summaryRef} tabIndex={-1} role={Object.keys(errors).length || conflict ? "alert" : "status"} className={`space-y-3 rounded-md border p-4 ${Object.keys(errors).length || conflict ? "border-[rgb(var(--danger)/0.35)]" : "border-[rgb(var(--success)/0.35)]"}`}><p>{status}</p>{Object.keys(errors).length ? <ul className="list-disc pl-5">{Object.entries(errors).map(([key, message]) => <li key={key}><a className="underline" href={`#admin-${key}`}>{message}</a></li>)}</ul> : null}{conflict ? <Button variant="secondary" onClick={() => void load()}>Recargar información actual</Button> : null}</div> : null}
    <form onSubmit={save} noValidate className="space-y-6">
      <Card as="section" className="space-y-5"><h2 className="ds-heading ds-heading-md">Identidad</h2><div className="grid gap-5 md:grid-cols-2">{field("name", "Nombre", 200)}{field("slug", "Slug", 160, "Letras minúsculas, números y guiones simples.")}</div></Card>
      <Card as="section" className="space-y-5"><h2 className="ds-heading ds-heading-md">Contenido descriptivo</h2><TextAreaField id="admin-shortDescription" label="Descripción corta" value={values.shortDescription} maximum={500} error={errors.shortDescription} onChange={(value) => update("shortDescription", value)} /><TextAreaField id="admin-description" label="Descripción completa" value={values.description} maximum={5000} rows={8} error={errors.description} onChange={(value) => update("description", value)} /></Card>
      <Card as="section" className="space-y-5"><h2 className="ds-heading ds-heading-md">Información comercial</h2><div className="grid gap-5 md:grid-cols-2">{field("brand", "Marca", 160)}{field("collection", "Colección", 160)}<SelectField id="admin-genderApplicability" label="Aplicabilidad de género" value={values.genderApplicability} onChange={(value) => update("genderApplicability", value as AdminEditorValues["genderApplicability"])}><option value="">Sin especificar</option><option value="mujer">Mujer</option><option value="hombre">Hombre</option><option value="unisex">Unisex</option><option value="no_aplica">No aplica</option></SelectField></div></Card>
      <Card as="section" className="space-y-5"><h2 className="ds-heading ds-heading-md">Precio y disponibilidad</h2><div className="grid gap-5 md:grid-cols-2">{field("price", "Precio", undefined, "Valor positivo con dos decimales.")}{field("currency", "Moneda", 3, "Código de tres letras mayúsculas.")}</div><CheckField id="admin-commerciallyAvailable" label="Disponible comercialmente" helper="Desactivarlo conserva el precio y la moneda." checked={values.commerciallyAvailable} onChange={(checked) => update("commerciallyAvailable", checked)} /></Card>
      <Card as="section" className="space-y-5"><h2 className="ds-heading ds-heading-md">Publicación y descubrimiento</h2><div className="grid gap-2 md:grid-cols-2"><CheckField id="admin-active" label="Producto activo" helper="Permite que el producto participe en el catálogo." checked={values.active} onChange={(checked) => update("active", checked)} /><CheckField id="admin-editorialApproved" label="Aprobación editorial" helper="Confirma que el contenido fue revisado." checked={values.editorialApproved} onChange={(checked) => update("editorialApproved", checked)} /><CheckField id="admin-published" label="Publicado" helper="Requiere aprobación, taxonomía y al menos una variante." error={errors.published} checked={values.published} onChange={(checked) => update("published", checked)} /><CheckField id="admin-featured" label="Producto destacado" helper="Incluye el producto en espacios destacados." checked={values.featured} onChange={(checked) => update("featured", checked)} /></div>{values.featured ? field("featuredOrder", "Orden destacado", undefined, "Número entero positivo opcional.") : baseline.featuredOrder ? <p className="text-sm text-[rgb(var(--muted)/1)]">El orden destacado se eliminará al guardar.</p> : null}</Card>
      <Card as="section" className="space-y-5"><h2 className="ds-heading ds-heading-md">Clasificación</h2><SelectField id="admin-productTypeId" label="Tipo de producto" value={values.productTypeId} error={errors.productTypeId} onChange={(value) => update("productTypeId", value)}><option value="">Sin asignar</option>{types.map((type) => <option key={type.name} value={type.name}>{type.category.name} / {type.subcategory.name} / {type.name}</option>)}</SelectField>{selectedType ? <p className="text-sm text-[rgb(var(--muted)/1)]">Categoría heredada: {selectedType.category.name} · Subcategoría: {selectedType.subcategory.name}</p> : null}</Card>
      <Card as="section" className="space-y-5"><h2 className="ds-heading ds-heading-md">SEO</h2>{field("seoTitle", "Título SEO", 200)}<TextAreaField id="admin-seoDescription" label="Descripción SEO" value={values.seoDescription} maximum={500} error={errors.seoDescription} onChange={(value) => update("seoDescription", value)} /></Card>
      <div className="sticky bottom-0 flex flex-wrap justify-end gap-3 border-t border-[rgb(var(--border)/1)] bg-[rgb(var(--background)/0.96)] py-4"><Button type="button" variant="secondary" disabled={!dirty || saving} onClick={() => { setValues(baseline); setErrors({}); setStatus("Cambios descartados."); }}>Descartar cambios</Button><Button type="submit" disabled={!dirty || saving} aria-busy={saving || undefined}>{saving ? "Guardando…" : "Guardar cambios"}</Button></div>
    </form>
  </div>;
}

export function AdminApp() {
  const [checking, setChecking] = useState(true);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [gateMessage, setGateMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [mediaProductId, setMediaProductId] = useState<number | null>(null);
  const [workspace, setWorkspace] = useState<"products" | "categories">("products");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => { void adminApi.session().then(setSession).catch((error) => { if (error instanceof AdminApiError && error.status === 503) setGateMessage(errorMessage(error, "access")); }).finally(() => setChecking(false)); }, []);
  function expired() { setSession(null); setEditingId(null); setMediaProductId(null); setGateMessage("Tu sesión terminó. Ingresa el código para continuar."); }
  async function logout() { if (!session || loggingOut) return; setLoggingOut(true); try { await adminApi.logout(session.csrfToken); } finally { setSession(null); setEditingId(null); setMediaProductId(null); setGateMessage("La sesión se cerró correctamente."); setLoggingOut(false); } }

  if (checking) return <main id="admin-main" className="flex min-h-screen items-center justify-center"><PoliteStatus visuallyHidden={false}>Verificando acceso…</PoliteStatus></main>;
  if (!session) return <AccessGate message={gateMessage} onAccess={(next) => { setSession(next); setGateMessage(""); }} />;
  return <><a href="#admin-main" className="skip-link">Ir al contenido principal</a><header className="border-b border-[rgb(var(--border)/1)] bg-[rgb(var(--surface)/1)]"><Container size="xl" padding="lg" className="flex min-h-20 flex-wrap items-center justify-between gap-4"><p className="font-semibold">Mandoquita · Administración</p><nav aria-label="Administración" className="flex flex-wrap items-center gap-2"><Button variant={workspace === "products" ? "primary" : "ghost"} aria-current={workspace === "products" ? "page" : undefined} onClick={() => { setWorkspace("products"); setEditingId(null); setMediaProductId(null); }}>Productos</Button><Button variant={workspace === "categories" ? "primary" : "ghost"} aria-current={workspace === "categories" ? "page" : undefined} onClick={() => { setWorkspace("categories"); setEditingId(null); setMediaProductId(null); }}>Imágenes de categorías</Button><Button variant="ghost" onClick={() => void logout()} disabled={loggingOut}>{loggingOut ? "Saliendo…" : "Salir"}</Button></nav></Container></header><main id="admin-main" className="py-8 sm:py-12"><Container size="xl" padding="lg">{workspace === "categories" ? <CategoryMediaAdmin session={session} onExpired={expired} /> : <><div hidden={editingId !== null || mediaProductId !== null}><ProductList onEdit={setEditingId} onMedia={setMediaProductId} onExpired={expired} /></div>{editingId !== null ? <Editor id={editingId} session={session} onBack={() => setEditingId(null)} onMedia={() => { setEditingId(null); setMediaProductId(editingId); }} onExpired={expired} /> : null}{mediaProductId !== null ? <ProductMediaAdmin productId={mediaProductId} session={session} onBack={() => setMediaProductId(null)} onExpired={expired} /> : null}</>}</Container></main></>;
}
