import React, { useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Container } from "../../components/Container";
import { Input } from "../../components/Input";
import { PoliteStatus } from "../../components/PoliteStatus";
import { AdminApiError, adminApi } from "./api";
import { CategoryMediaAdmin, ProductMediaAdmin } from "./MediaAdmin";
import type {
  AdminAccount,
  AdminCategory,
  AdminProduct,
  AdminProductList,
  AdminProductType,
  AdminSession,
} from "./types";
import { Icon } from "../../components/Icon";

const tableRegion =
  "overflow-x-auto rounded-md border border-[rgb(var(--border)/1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--focus)/1)]";
const table =
  "min-w-[1024px] w-full border-collapse text-left text-sm [&_td]:border-t [&_td]:border-[rgb(var(--border)/1)] [&_td]:p-4 [&_td]:align-top [&_th]:p-4 [&_th]:align-top";

function message(error: unknown, fallback: string) {
  if (!(error instanceof AdminApiError)) return fallback;
  if (error.status === 429)
    return "La acción no está disponible temporalmente. Intenta más tarde.";
  if (error.status === 503)
    return "La administración no está disponible en este momento.";
  if (error.status === 409)
    return "La información cambió en otra sesión. Recarga antes de continuar.";
  if (error.status === 404) return "El recurso ya no está disponible.";
  if (error.status === 400) return "Revisa los datos indicados.";
  if ([401, 403].includes(error.status))
    return "No se pudo confirmar la autorización.";
  return fallback;
}

function Notice({
  text,
  error = false,
  children,
}: {
  text: string;
  error?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      role={error ? "alert" : "status"}
      tabIndex={error ? -1 : undefined}
      className={`space-y-3 rounded-md border p-4 ${error ? "border-[rgb(var(--danger)/.4)]" : "border-[rgb(var(--border)/1)]"}`}
    >
      <p>{text}</p>
      {children}
    </div>
  );
}

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="space-y-2">
      <Input {...props} ref={ref} type={visible ? "text" : "password"} />
      <Button
        type="button"
        variant="ghost"
        aria-pressed={visible}
        onClick={() => setVisible((value) => !value)}
      >
        {visible
          ? `Ocultar ${String(props.label).toLowerCase()}`
          : `Mostrar ${String(props.label).toLowerCase()}`}
      </Button>
    </div>
  );
});

function AccessGate({
  notice,
  onAccess,
}: {
  notice?: string;
  onAccess: (session: AdminSession) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(notice ?? "");
  const [busy, setBusy] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError("Ingresa tu usuario y contraseña.");
      passwordRef.current?.focus();
      return;
    }
    setBusy(true);
    setError("");
    try {
      onAccess(await adminApi.login(username.trim(), password));
      setPassword("");
    } catch (cause) {
      setPassword("");
      setError(
        cause instanceof AdminApiError && [401, 403].includes(cause.status)
          ? "No se pudo iniciar sesión. Revisa los datos o contacta al Superadministrador."
          : message(cause, "No se pudo iniciar sesión."),
      );
      requestAnimationFrame(() => passwordRef.current?.focus());
    } finally {
      setBusy(false);
    }
  }
  return (
    <main id="admin-main" className="flex min-h-screen items-center py-10">
      <Container size="sm" padding="lg">
        <Card
          as="section"
          padding="lg"
          className="mx-auto max-w-[480px] space-y-6"
          aria-labelledby="access-title"
        >
          <div className="space-y-3">
            <span className="ds-eyebrow">Mandoquita · Administración</span>
            <h1 id="access-title" className="ds-heading ds-heading-lg">
              Acceso administrativo
            </h1>
            <p>Ingresa con tu cuenta administrativa.</p>
          </div>
          {error ? <Notice text={error} error /> : null}
          <form onSubmit={submit} noValidate className="space-y-5">
            <Input
              id="admin-username"
              label="Usuario"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={busy}
            />
            <PasswordInput
              ref={passwordRef}
              id="admin-password"
              label="Contraseña"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={busy}
            />
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Ingresando…" : "Ingresar"}
            </Button>
          </form>
          <details>
            <summary className="min-h-11 cursor-pointer py-2 font-medium">
              No puedo acceder
            </summary>
            <p className="pt-2 text-sm text-[rgb(var(--muted)/1)]">
              Solicita al Superadministrador que restablezca tu acceso. Si el
              Superadministrador perdió el acceso, el responsable técnico debe
              seguir el procedimiento de emergencia.
            </p>
          </details>
        </Card>
      </Container>
    </main>
  );
}

function PasswordChange({
  session,
  onChanged,
  onLogout,
}: {
  session: AdminSession;
  onChanged: (session: AdminSession) => void;
  onLogout: () => void;
}) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (next.length < 12 || next.length > 128 || next !== confirmation) {
      setStatus(
        next !== confirmation
          ? "La confirmación no coincide con la nueva contraseña."
          : "Usa entre 12 y 128 caracteres.",
      );
      return;
    }
    setBusy(true);
    setStatus("");
    try {
      onChanged(
        await adminApi.changePassword(session.csrfToken, current, next),
      );
    } catch (cause) {
      setCurrent("");
      setNext("");
      setConfirmation("");
      setStatus(message(cause, "No se pudo confirmar la nueva contraseña."));
    } finally {
      setBusy(false);
    }
  }
  return (
    <main id="admin-main" className="py-10">
      <Container size="sm" padding="lg">
        <Card className="mx-auto max-w-[560px] space-y-6">
          <div className="space-y-3">
            <span className="ds-eyebrow">Mandoquita · Administración</span>
            <h1 className="ds-heading ds-heading-lg">
              Reemplaza tu contraseña
            </h1>
            <p>
              Tu contraseña temporal no permite administrar el catálogo. Crea
              una nueva contraseña para continuar.
            </p>
            <p className="text-sm text-[rgb(var(--muted)/1)]">
              Usa entre 12 y 128 caracteres. Puedes usar espacios y caracteres
              Unicode.
            </p>
          </div>
          {status ? <Notice text={status} error /> : null}
          <form className="space-y-5" onSubmit={submit}>
            <PasswordInput
              id="current-password"
              label="Contraseña temporal"
              autoComplete="current-password"
              value={current}
              onChange={(event) => setCurrent(event.target.value)}
            />
            <PasswordInput
              id="new-password"
              label="Nueva contraseña"
              autoComplete="new-password"
              value={next}
              onChange={(event) => setNext(event.target.value)}
            />
            <PasswordInput
              id="confirm-password"
              label="Confirmar nueva contraseña"
              autoComplete="new-password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
            />
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={busy}>
                {busy
                  ? "Guardando nueva contraseña…"
                  : "Guardar nueva contraseña"}
              </Button>
              <Button type="button" variant="secondary" onClick={onLogout}>
                Salir
              </Button>
            </div>
          </form>
        </Card>
      </Container>
    </main>
  );
}

type ProductFormValues = {
  name: string;
  slug: string;
  price: string;
  currency: string;
  baseSku: string;
  shortDescription: string;
  description: string;
  brand: string;
  collection: string;
  genderApplicability: "" | "mujer" | "hombre" | "unisex" | "no_aplica";
  productTypeId: string;
  seoTitle: string;
  seoDescription: string;
  featuredOrder: string;
  active: boolean;
  editorialApproved: boolean;
  published: boolean;
  commerciallyAvailable: boolean;
  featured: boolean;
};
const emptyProduct: ProductFormValues = {
  name: "",
  slug: "",
  price: "",
  currency: "COP",
  baseSku: "",
  shortDescription: "",
  description: "",
  brand: "",
  collection: "",
  genderApplicability: "",
  productTypeId: "",
  seoTitle: "",
  seoDescription: "",
  featuredOrder: "",
  active: false,
  editorialApproved: false,
  published: false,
  commerciallyAvailable: false,
  featured: false,
};

function ProductForm({
  session,
  id,
  onDone,
  onMedia,
  onExpired,
}: {
  session: AdminSession;
  id?: number;
  onDone: () => void;
  onMedia?: () => void;
  onExpired: () => void;
}) {
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [types, setTypes] = useState<AdminProductType[]>([]);
  const [values, setValues] = useState(emptyProduct);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(Boolean(id));
  const [confirming, setConfirming] = useState(false);
  useEffect(() => {
    void adminApi
      .productTypes()
      .then(({ items }) => setTypes(items))
      .catch(() => null);
    if (!id) return;
    setBusy(true);
    adminApi
      .product(id)
      .then(({ item }) => {
        setProduct(item);
        setValues({
          name: item.name,
          slug: item.slug,
          price: item.price,
          currency: item.currency,
          baseSku: item.baseVariant?.sku ?? "",
          shortDescription: item.shortDescription ?? "",
          description: item.description ?? "",
          brand: item.brand ?? "",
          collection: item.collection ?? "",
          genderApplicability: item.genderApplicability ?? "",
          productTypeId: item.productType?.name ?? "",
          seoTitle: item.seoTitle ?? "",
          seoDescription: item.seoDescription ?? "",
          featuredOrder:
            item.featuredOrder == null ? "" : String(item.featuredOrder),
          active: item.active,
          editorialApproved: item.editorialApproved,
          published: item.published,
          commerciallyAvailable: item.commerciallyAvailable,
          featured: item.featured,
        });
      })
      .catch((cause) => {
        if (cause instanceof AdminApiError && [401, 403].includes(cause.status))
          onExpired();
        else setStatus(message(cause, "No pudimos cargar el producto."));
      })
      .finally(() => setBusy(false));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  const set = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => setValues((old) => ({ ...old, [key]: value }));
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (
      !values.name.trim() ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug) ||
      Number(values.price) <= 0 ||
      !/^[A-Z]{3}$/.test(values.currency) ||
      (!id && !values.baseSku.trim())
    ) {
      setStatus("Revisa nombre, slug, precio, moneda y SKU base.");
      return;
    }
    setBusy(true);
    setStatus("");
    try {
      if (id && product) {
        const { baseSku: _baseSku, ...changes } = values;
        const result = await adminApi.updateProduct(
          id,
          session.csrfToken,
          product.updatedAt,
          changes,
        );
        setProduct(result.item);
        setStatus("Cambios guardados.");
      } else {
        const result = await adminApi.createProduct(session.csrfToken, {
          name: values.name.trim(),
          slug: values.slug.trim(),
          price: values.price,
          currency: values.currency,
          baseSku: values.baseSku.trim(),
        });
        setProduct(result.item);
        setStatus("Producto creado.");
      }
    } catch (cause) {
      if (cause instanceof AdminApiError && [401, 403].includes(cause.status))
        onExpired();
      else setStatus(message(cause, "No se guardó el producto."));
    } finally {
      setBusy(false);
    }
  }
  async function lifecycle() {
    if (!product) return;
    setBusy(true);
    try {
      const action = product.retiredAt ? "restore" : "retire";
      const result = await adminApi.productLifecycle(
        product.id,
        action,
        session.csrfToken,
        product.updatedAt,
      );
      setProduct(result.item);
      setConfirming(false);
      setStatus(
        action === "retire" ? "Producto retirado." : "Producto restaurado.",
      );
    } catch (cause) {
      setStatus(message(cause, "No se cambió el ciclo de vida."));
    } finally {
      setBusy(false);
    }
  }
  if (busy && id && !product)
    return (
      <PoliteStatus visuallyHidden={false}>Cargando producto…</PoliteStatus>
    );
  return (
    <div className="mx-auto max-w-[960px] space-y-6">
      <Button variant="ghost" onClick={onDone}>
        ← Volver a productos
      </Button>
      <div className="space-y-2">
        <span className="ds-eyebrow">
          {id ? "Editar producto" : "Nuevo producto"}
        </span>
        <h1 className="ds-heading ds-heading-lg">
          {id ? product?.name : "Crear producto"}
        </h1>
        {product ? (
          <Badge variant={product.retiredAt ? "warning" : "success"}>
            {product.retiredAt ? "Retirado" : "Vigente"}
          </Badge>
        ) : (
          <p>
            Se creará una variante base y el producto quedará inactivo y no
            publicado.
          </p>
        )}
      </div>
      {status ? (
        <Notice
          text={status}
          error={status.startsWith("No") || status.startsWith("Revisa")}
        />
      ) : null}
      <form onSubmit={save} className="space-y-6">
        <Card className="grid gap-5 md:grid-cols-2">
          <Input
            id="product-name"
            label="Nombre"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
          />
          <Input
            id="product-slug"
            label="Slug"
            value={values.slug}
            onChange={(e) => set("slug", e.target.value)}
          />
          <Input
            id="product-price"
            label="Precio del producto"
            inputMode="decimal"
            value={values.price}
            onChange={(e) => set("price", e.target.value)}
          />
          <Input
            id="product-currency"
            label="Moneda"
            maxLength={3}
            value={values.currency}
            onChange={(e) => set("currency", e.target.value.toUpperCase())}
          />
          {!id ? (
            <Input
              id="product-sku"
              label="SKU base"
              value={values.baseSku}
              onChange={(e) => set("baseSku", e.target.value)}
            />
          ) : null}
        </Card>
        {id && !product?.retiredAt ? (
          <Card className="space-y-4">
            <label htmlFor="product-description" className="font-medium">
              Descripción
            </label>
            <textarea
              id="product-description"
              className="min-h-32 w-full rounded-md border p-3"
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  "active",
                  "editorialApproved",
                  "published",
                  "commerciallyAvailable",
                  "featured",
                ] as const
              ).map((key) => (
                <label key={key} className="flex min-h-11 items-center gap-3">
                  <input
                    type="checkbox"
                    checked={values[key]}
                    onChange={(e) => set(key, e.target.checked)}
                  />
                  {
                    {
                      active: "Activo",
                      editorialApproved: "Aprobado editorialmente",
                      published: "Publicado",
                      commerciallyAvailable: "Disponible comercialmente",
                      featured: "Destacado",
                    }[key]
                  }
                </label>
              ))}
            </div>
          </Card>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={busy || Boolean(product?.retiredAt)}>
            {busy ? "Guardando…" : id ? "Guardar cambios" : "Crear producto"}
          </Button>
          {product && onMedia ? (
            <Button type="button" variant="secondary" onClick={onMedia}>
              Administrar imágenes
            </Button>
          ) : null}
        </div>
      </form>
      {product ? (
        <Card className="space-y-4">
          <h2 className="ds-heading ds-heading-md">Ciclo de vida</h2>
          {confirming ? (
            <>
              <p>
                {product.retiredAt
                  ? "Volverá a vigente, inactivo y no publicado."
                  : "Dejará de aparecer públicamente; se conservarán identidad, variantes e imágenes."}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setConfirming(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant={product.retiredAt ? "primary" : "danger"}
                  onClick={() => void lifecycle()}
                >
                  {product.retiredAt
                    ? "Restaurar producto"
                    : "Retirar producto"}
                </Button>
              </div>
            </>
          ) : (
            <Button
              variant={product.retiredAt ? "primary" : "danger"}
              onClick={() => setConfirming(true)}
            >
              {product.retiredAt ? "Restaurar producto" : "Retirar producto"}
            </Button>
          )}
        </Card>
      ) : null}
    </div>
  );
}

function ProductWorkspace({
  session,
  onExpired,
}: {
  session: AdminSession;
  onExpired: () => void;
}) {
  const [mode, setMode] = useState<"list" | "create" | "edit" | "media">(
    "list",
  );
  const [id, setId] = useState<number>();
  const [q, setQ] = useState("");
  const [retired, setRetired] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<AdminProductList>();
  const [status, setStatus] = useState("");
  async function load() {
    setStatus("Cargando productos…");
    try {
      const result = await adminApi.products(
        {
          q,
          published: "",
          commerciallyAvailable: "",
          featured: "",
          active: "",
          category: "",
          productType: "",
          retired: retired ? "true" : "false",
        },
        page,
      );
      setData(result);
      setStatus("");
    } catch (cause) {
      if (cause instanceof AdminApiError && [401, 403].includes(cause.status))
        onExpired();
      else setStatus(message(cause, "No pudimos cargar los productos."));
    }
  }
  useEffect(() => {
    if (mode === "list") void load();
  }, [mode, page, retired]); // eslint-disable-line react-hooks/exhaustive-deps
  if (mode === "create" || mode === "edit")
    return (
      <ProductForm
        session={session}
        id={mode === "edit" ? id : undefined}
        onDone={() => setMode("list")}
        onMedia={id ? () => setMode("media") : undefined}
        onExpired={onExpired}
      />
    );
  if (mode === "media" && id)
    return (
      <ProductMediaAdmin
        productId={id}
        session={session}
        onBack={() => setMode("edit")}
        onExpired={onExpired}
      />
    );
  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="ds-eyebrow">Catálogo administrativo</span>
          <h1 className="ds-heading ds-heading-lg">Productos</h1>
        </div>
        <Button onClick={() => setMode("create")}>Crear producto</Button>
      </div>
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          void load();
        }}
      >
        <Input
          id="product-search"
          label="Buscar productos"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <label className="flex min-h-11 items-center gap-2">
          <input
            type="checkbox"
            checked={retired}
            onChange={(e) => {
              setRetired(e.target.checked);
              setPage(1);
            }}
          />
          Mostrar retirados
        </label>
        <Button type="submit">Buscar</Button>
      </form>
      {status ? (
        <Notice text={status} error={!status.startsWith("Cargando")} />
      ) : null}
      {data?.items.length ? (
        <>
          <p id="product-table-help">
            Desplázate horizontalmente dentro de la tabla para consultar todas
            las columnas.
          </p>
          <div
            className={tableRegion}
            tabIndex={0}
            aria-label="Tabla de productos"
            aria-describedby="product-table-help"
          >
            <table className={`${table} min-w-[1296px]`}>
              <caption className="sr-only">
                {retired ? "Productos retirados" : "Productos vigentes"}.{" "}
                {data.metadata.totalItems} resultados.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">SKU base</th>
                  <th scope="col">Clasificación</th>
                  <th scope="col">Estados</th>
                  <th scope="col">Ciclo de vida</th>
                  <th scope="col">Actualización</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((p) => (
                  <tr key={p.id}>
                    <th scope="row" className="p-4">
                      <span className="block font-semibold">{p.name}</span>
                      <span className="font-normal text-[rgb(var(--muted)/1)]">
                        /{p.slug}
                      </span>
                    </th>
                    <td>{p.baseVariant?.sku ?? "Disponible al editar"}</td>
                    <td>
                      {[
                        p.category?.name,
                        p.subcategory?.name,
                        p.productType?.name,
                      ]
                        .filter(Boolean)
                        .join(" / ") || "Sin clasificación"}
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <Badge>{p.active ? "Activo" : "Inactivo"}</Badge>
                        <Badge>
                          {p.editorialApproved ? "Aprobado" : "Sin aprobar"}
                        </Badge>
                        <Badge>
                          {p.published ? "Publicado" : "No publicado"}
                        </Badge>
                      </div>
                    </td>
                    <td>{p.retiredAt ? "Retirado" : "Vigente"}</td>
                    <td>
                      {new Intl.DateTimeFormat("es-CO", {
                        dateStyle: "medium",
                      }).format(new Date(p.updatedAt))}
                    </td>
                    <td>
                      <div className="flex flex-col items-start gap-2">
                        <Button
                          title={`Editar ${p.name}`}
                          variant="secondary"
                          onClick={() => {
                            setId(p.id);
                            setMode("edit");
                          }}
                        >
                          <Icon name="edit" />
                        </Button>
                        <Button
                          title={`Administrar imágenes de ${p.name}`}
                          variant="secondary"
                          onClick={() => {
                            setId(p.id);
                            setMode("media");
                          }}
                        >
                          <Icon name="imageUp" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav
            aria-label="Paginación de productos"
            className="flex items-center gap-3"
          >
            <Button
              variant="secondary"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>
            <span aria-current="page">
              Página {data.metadata.page} de {data.metadata.totalPages}
            </span>
            <Button
              variant="secondary"
              disabled={page >= data.metadata.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </Button>
          </nav>
        </>
      ) : data && !status ? (
        <Card>No hay productos para administrar.</Card>
      ) : null}
    </div>
  );
}

function CategoryWorkspace({
  session,
  onExpired,
}: {
  session: AdminSession;
  onExpired: () => void;
}) {
  const [mode, setMode] = useState<"list" | "form" | "media">("list");
  const [items, setItems] = useState<AdminCategory[]>([]);
  const [selected, setSelected] = useState<AdminCategory>();
  const [q, setQ] = useState("");
  const [retired, setRetired] = useState(false);
  const [status, setStatus] = useState("");
  const [values, setValues] = useState({
    name: "",
    slug: "",
    description: "",
    sortOrder: "1",
    active: false,
    visible: false,
  });
  async function load() {
    try {
      const result = await adminApi.categories(q, 1, retired);
      setItems(result.items);
      setStatus("");
    } catch (cause) {
      if (cause instanceof AdminApiError && [401, 403].includes(cause.status))
        onExpired();
      else setStatus(message(cause, "No pudimos cargar las categorías."));
    }
  }
  useEffect(() => {
    if (mode === "list") void load();
  }, [mode, retired]); // eslint-disable-line react-hooks/exhaustive-deps
  function open(item?: AdminCategory) {
    setSelected(item);
    setValues(
      item
        ? {
            name: item.name,
            slug: item.slug,
            description: item.description ?? "",
            sortOrder: String(item.sortOrder),
            active: item.active,
            visible: item.visible,
          }
        : {
            name: "",
            slug: "",
            description: "",
            sortOrder: "1",
            active: false,
            visible: false,
          },
    );
    setStatus("");
    setMode("form");
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    try {
      const body = {
        name: values.name.trim(),
        slug: values.slug.trim(),
        description: values.description.trim() || null,
        ...(selected
          ? {
              expectedUpdatedAt: selected.updatedAt,
              sortOrder: Number(values.sortOrder),
              active: values.active,
              visible: values.visible,
            }
          : {}),
      };
      const result = selected
        ? await adminApi.updateCategory(selected.id, session.csrfToken, body)
        : await adminApi.createCategory(session.csrfToken, body);
      setSelected(result.item);
      setStatus(selected ? "Cambios guardados." : "Categoría creada.");
    } catch (cause) {
      setStatus(message(cause, "No se guardó la categoría."));
    }
  }
  async function lifecycle() {
    if (!selected) return;
    try {
      const result = await adminApi.categoryLifecycle(
        selected.id,
        selected.retiredAt ? "restore" : "retire",
        session.csrfToken,
        selected.updatedAt,
      );
      setSelected(result.item);
      setStatus(
        selected.retiredAt ? "Categoría restaurada." : "Categoría retirada.",
      );
    } catch (cause) {
      setStatus(
        message(cause, "No se cambió el ciclo de vida de la categoría."),
      );
    }
  }
  if (mode === "media")
    return <CategoryMediaAdmin session={session} onExpired={onExpired} />;
  if (mode === "form")
    return (
      <div className="mx-auto max-w-[800px] space-y-6">
        <Button variant="ghost" onClick={() => setMode("list")}>
          ← Volver a categorías
        </Button>
        <h1 className="ds-heading ds-heading-lg">
          {selected ? `Editar ${selected.name}` : "Crear categoría"}
        </h1>
        {status ? (
          <Notice text={status} error={status.startsWith("No")} />
        ) : null}
        <form onSubmit={save} className="space-y-5">
          <Card className="space-y-5">
            <Input
              id="category-name"
              label="Nombre"
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
            <Input
              id="category-slug"
              label="Slug"
              value={values.slug}
              onChange={(e) => setValues({ ...values, slug: e.target.value })}
            />
            <label className="block font-medium" htmlFor="category-description">
              Descripción
            </label>
            <textarea
              id="category-description"
              className="min-h-28 w-full rounded-md border p-3"
              value={values.description}
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
            {selected && !selected.retiredAt ? (
              <>
                <Input
                  id="category-order"
                  label="Posición en la colección"
                  inputMode="numeric"
                  value={values.sortOrder}
                  onChange={(e) =>
                    setValues({ ...values, sortOrder: e.target.value })
                  }
                />
                <label className="flex min-h-11 items-center gap-3">
                  <input
                    type="checkbox"
                    checked={values.active}
                    onChange={(e) =>
                      setValues({ ...values, active: e.target.checked })
                    }
                  />
                  Activa
                </label>
                <label className="flex min-h-11 items-center gap-3">
                  <input
                    type="checkbox"
                    checked={values.visible}
                    onChange={(e) =>
                      setValues({ ...values, visible: e.target.checked })
                    }
                  />
                  Visible
                </label>
              </>
            ) : null}
          </Card>
          <Button type="submit" disabled={Boolean(selected?.retiredAt)}>
            Guardar cambios
          </Button>
        </form>
        {selected ? (
          <Card className="space-y-3">
            <h2 className="ds-heading ds-heading-md">Ciclo de vida</h2>
            <p>
              Dependencias: {selected.dependencies.subcategories} subcategorías,{" "}
              {selected.dependencies.productTypes} tipos,{" "}
              {selected.dependencies.products} productos.
            </p>
            {!selected.retiredAt &&
            Object.values(selected.dependencies).some(Boolean) ? (
              <p>No se puede retirar: tiene elementos asociados.</p>
            ) : (
              <Button
                variant={selected.retiredAt ? "primary" : "danger"}
                onClick={() => void lifecycle()}
              >
                {selected.retiredAt
                  ? "Restaurar categoría"
                  : "Retirar categoría"}
              </Button>
            )}
          </Card>
        ) : null}
      </div>
    );
  return (
    <div className="space-y-7">
      <div className="flex flex-wrap justify-between gap-3">
        <h1 className="ds-heading ds-heading-lg">Categorías</h1>
        <div className="flex gap-2">
          <Button onClick={() => open()}>Crear categoría</Button>
          <Button variant="secondary" onClick={() => setMode("media")}>
            Administrar imágenes
          </Button>
        </div>
      </div>
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          void load();
        }}
      >
        <Input
          id="category-search"
          label="Buscar categorías"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <label className="flex min-h-11 items-center gap-2">
          <input
            type="checkbox"
            checked={retired}
            onChange={(e) => setRetired(e.target.checked)}
          />
          Mostrar retiradas
        </label>
        <Button>Buscar</Button>
      </form>
      {status ? <Notice text={status} error /> : null}
      <div
        className={tableRegion}
        tabIndex={0}
        aria-label="Tabla de categorías"
      >
        <table className={table}>
          <caption className="sr-only">
            Categorías {retired ? "retiradas" : "vigentes"}
          </caption>
          <thead>
            <tr>
              <th scope="col">Categoría</th>
              <th scope="col">Orden</th>
              <th scope="col">Estados</th>
              <th scope="col">Dependencias</th>
              <th scope="col">Imagen</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <th scope="row" className="p-4">
                  {c.name}
                  <span className="block font-normal">/{c.slug}</span>
                </th>
                <td>{c.sortOrder}</td>
                <td>
                  {c.retiredAt
                    ? "Retirada"
                    : `${c.active ? "Activa" : "Inactiva"}, ${c.visible ? "visible" : "no visible"}`}
                </td>
                <td>
                  {c.dependencies.subcategories} subcategorías ·{" "}
                  {c.dependencies.productTypes} tipos ·{" "}
                  {c.dependencies.products} productos
                </td>
                <td>
                  {c.image ? (
                    <img
                      src={c.image.previewUrl}
                      alt={c.image.altText ?? ""}
                      className="h-16 w-16 object-contain"
                    />
                  ) : (
                    "Sin imagen"
                  )}
                </td>
                <td>
                  <Button variant="secondary" onClick={() => open(c)}>
                    Editar {c.name}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Accounts({
  session,
  onExpired,
}: {
  session: AdminSession;
  onExpired: () => void;
}) {
  const [items, setItems] = useState<AdminAccount[]>([]);
  const [task, setTask] = useState<{
    action: "create" | "reset" | "deactivate" | "reactivate";
    item?: AdminAccount;
  }>();
  const [username, setUsername] = useState("");
  const [temporaryPassword, setTemporary] = useState("");
  const [confirm, setConfirm] = useState("");
  const [currentPassword, setCurrent] = useState("");
  const [status, setStatus] = useState("");
  async function load() {
    try {
      setItems((await adminApi.accounts()).items);
    } catch (cause) {
      if (cause instanceof AdminApiError && [401, 403].includes(cause.status))
        onExpired();
      else
        setStatus(
          message(cause, "No pudimos cargar las cuentas de administradores."),
        );
    }
  }
  useEffect(() => {
    void load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (
      task?.action !== "deactivate" &&
      (temporaryPassword.length < 12 || temporaryPassword !== confirm)
    ) {
      setStatus(
        "La contraseña temporal debe tener entre 12 y 128 caracteres y coincidir.",
      );
      return;
    }
    try {
      if (task?.action === "create")
        await adminApi.createAccount(session.csrfToken, {
          username,
          temporaryPassword,
          currentPassword,
        });
      else if (task?.item)
        await adminApi.updateAccount(task.item.id, session.csrfToken, {
          action: task.action,
          expectedUpdatedAt: task.item.updatedAt,
          currentPassword,
          ...(task.action !== "deactivate" ? { temporaryPassword } : {}),
        });
      setStatus("Acción de cuenta confirmada.");
      setTask(undefined);
      setTemporary("");
      setConfirm("");
      setCurrent("");
      await load();
    } catch (cause) {
      setTemporary("");
      setConfirm("");
      setCurrent("");
      setStatus(message(cause, "La acción de cuenta no se completó."));
    }
  }
  if (task)
    return (
      <div className="mx-auto max-w-[720px] space-y-6">
        <Button variant="ghost" onClick={() => setTask(undefined)}>
          ← Volver a cuentas
        </Button>
        <h1 className="ds-heading ds-heading-lg">
          {
            {
              create: "Crear administrador",
              reset: `Restablecer contraseña de ${task.item?.username}`,
              deactivate: `Desactivar acceso de ${task.item?.username}`,
              reactivate: `Reactivar ${task.item?.username}`,
            }[task.action]
          }
        </h1>
        {status ? <Notice text={status} error /> : null}
        <form onSubmit={submit} className="space-y-5">
          <Card className="space-y-5">
            {task.action === "create" ? (
              <Input
                id="account-username"
                label="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            ) : null}
            {task.action !== "deactivate" ? (
              <>
                <PasswordInput
                  id="temporary-password"
                  label="Contraseña temporal"
                  autoComplete="new-password"
                  value={temporaryPassword}
                  onChange={(e) => setTemporary(e.target.value)}
                />
                <PasswordInput
                  id="confirm-temporary"
                  label="Confirmar contraseña temporal"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </>
            ) : (
              <p>
                Las sesiones activas terminarán. La cuenta y su atribución
                histórica se conservarán.
              </p>
            )}
            <PasswordInput
              id="fresh-password"
              label="Confirma tu contraseña"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </Card>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setTask(undefined)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant={task.action === "deactivate" ? "danger" : "primary"}
            >
              Confirmar y continuar
            </Button>
          </div>
        </form>
      </div>
    );
  return (
    <div className="space-y-7">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h1 className="ds-heading ds-heading-lg">
            Cuentas de administradores
          </h1>
          <p>Los roles son fijos y no se pueden cambiar.</p>
        </div>
        <Button onClick={() => setTask({ action: "create" })}>
          Crear administrador
        </Button>
      </div>
      {status ? <Notice text={status} error /> : null}
      <p id="accounts-help">
        Desplázate horizontalmente dentro de la tabla para consultar todas las
        columnas.
      </p>
      <div
        className={tableRegion}
        tabIndex={0}
        aria-label="Tabla de cuentas de administradores"
        aria-describedby="accounts-help"
      >
        <table className={table}>
          <caption className="sr-only">Cuentas administrativas</caption>
          <thead>
            <tr>
              <th scope="col">Usuario</th>
              <th scope="col">Rol</th>
              <th scope="col">Acceso</th>
              <th scope="col">Credencial</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id}>
                <th scope="row" className="p-4">
                  {a.username}
                </th>
                <td>
                  {a.role === "SUPER_ADMIN"
                    ? "Superadministrador"
                    : "Administrador"}
                </td>
                <td>{a.enabled ? "Activo" : "Desactivado"}</td>
                <td>
                  {a.mustChangePassword
                    ? "Debe reemplazar contraseña"
                    : "Lista para usar"}
                </td>
                <td>
                  {a.role === "SUPER_ADMIN" ? (
                    <span>Cuenta protegida</span>
                  ) : (
                    <div className="flex flex-col items-start gap-2">
                      {a.enabled ? (
                        <>
                          <Button
                            variant="secondary"
                            onClick={() =>
                              setTask({ action: "reset", item: a })
                            }
                          >
                            Restablecer contraseña de {a.username}
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() =>
                              setTask({ action: "deactivate", item: a })
                            }
                          >
                            Desactivar acceso de {a.username}
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() =>
                            setTask({ action: "reactivate", item: a })
                          }
                        >
                          Reactivar {a.username}
                        </Button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminApp() {
  const [checking, setChecking] = useState(true);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [notice, setNotice] = useState("");
  const [section, setSection] = useState<
    "products" | "categories" | "accounts"
  >("products");
  useEffect(() => {
    adminApi
      .session()
      .then(setSession)
      .catch(() => null)
      .finally(() => setChecking(false));
  }, []);
  function expired() {
    setSession(null);
    setNotice("Tu sesión administrativa terminó. Ingresa nuevamente.");
  }
  async function logout() {
    if (session)
      try {
        await adminApi.logout(session.csrfToken);
      } finally {
        setSession(null);
        setNotice("La sesión se cerró correctamente.");
      }
  }
  if (checking)
    return (
      <main className="flex min-h-screen items-center justify-center">
        <PoliteStatus visuallyHidden={false}>Verificando acceso…</PoliteStatus>
      </main>
    );
  if (!session) return <AccessGate notice={notice} onAccess={setSession} />;
  if (session.account.mustChangePassword)
    return (
      <PasswordChange
        session={session}
        onChanged={setSession}
        onLogout={() => void logout()}
      />
    );
  const superadmin = session.account.role === "SUPER_ADMIN";
  return (
    <>
      <a href="#admin-main" className="skip-link">
        Ir al contenido principal
      </a>
      <header className="border-b bg-[rgb(var(--surface)/1)]">
        <Container
          size="xl"
          padding="lg"
          className="flex min-h-20 flex-wrap items-center justify-between gap-4"
        >
          <div>
            <p className="font-semibold">Mandoquita · Administración</p>
            <p className="text-sm text-[rgb(var(--muted)/1)]">
              Sesión: {session.account.username}
            </p>
          </div>
          <nav aria-label="Administración" className="flex flex-wrap gap-2">
            <Button
              variant={section === "products" ? "primary" : "ghost"}
              aria-current={section === "products" ? "page" : undefined}
              onClick={() => setSection("products")}
            >
              Productos
            </Button>
            <Button
              variant={section === "categories" ? "primary" : "ghost"}
              aria-current={section === "categories" ? "page" : undefined}
              onClick={() => setSection("categories")}
            >
              Categorías
            </Button>
            {superadmin ? (
              <Button
                variant={section === "accounts" ? "primary" : "ghost"}
                aria-current={section === "accounts" ? "page" : undefined}
                onClick={() => setSection("accounts")}
              >
                Cuentas de administradores
              </Button>
            ) : null}
            <Button variant="ghost" onClick={() => void logout()}>
              Salir
            </Button>
          </nav>
        </Container>
      </header>
      <main id="admin-main" className="py-6">
        <Container size="wide" padding="lg">
          {section === "products" ? (
            <ProductWorkspace session={session} onExpired={expired} />
          ) : section === "categories" ? (
            <CategoryWorkspace session={session} onExpired={expired} />
          ) : superadmin ? (
            <Accounts session={session} onExpired={expired} />
          ) : (
            <Notice text="No tienes acceso a esta sección" error />
          )}
        </Container>
      </main>
    </>
  );
}
