import { PoliteStatus, Button, Badge, Card, Input } from "@/components";
import React, { useState, useEffect } from "react";
import { emptyProduct, message, ProductFormValues } from "./AdminApp";
import { adminApi, AdminApiError } from "./api";
import { Notice } from "./components/Notice";
import type { AdminSession, AdminProduct, AdminProductType } from "./types";

export function ProductForm({
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

        // Limpiá featuredOrder si no es destacado
        const changesCleaned: Partial<typeof changes> = { ...changes };
        if (!changes.featured) {
          changesCleaned.featuredOrder = "";
        }

        if (
          changes.featured &&
          (changes.featuredOrder == null || changes.featuredOrder === "")
        ) {
          delete changesCleaned.featuredOrder;
        }

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
          //currency: values.currency,
          currency: "USD",
          baseSku: values.baseSku.trim(),
          productTypeId: values.productTypeId.trim() || null,
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
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="space-y-2">
          <span className="ds-eyebrow">
            {id ? "Editar producto" : "Nuevo producto"}
          </span>

          <h1 className="ds-heading ds-heading-lg">
            {id ? product?.name : "Crear producto"}
          </h1>
        </div>

        <div className="flex flex-1 gap-2 items-center">
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

        <a className="p-1 hover:bg-gray-200 rounded-b-sm" onClick={onDone}>
          ← Volver a productos
        </a>
      </div>

      {status ? (
        <Notice
          text={status}
          variant={
            status.startsWith("No") || status.startsWith("Revisa")
              ? "error"
              : "info"
          }
        />
      ) : null}

      <section className="flex gap-6">
        <form onSubmit={save} className="space-y-6 flex-12 lg:flex-8">
          <Card className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="product-type" className="block font-medium">
                Categoría
              </label>
              <select
                id="product-type"
                className="min-h-11 w-full rounded-md border border-[rgb(var(--border)/1)] bg-[rgb(var(--surface)/1)] p-2"
                value={values.productTypeId}
                onChange={(e) => set("productTypeId", e.target.value)}
                disabled={busy}
              >
                <option value="">
                  Sin clasificar (luego no podrás publicarlo)
                </option>
                {types.map((type) => (
                  <option key={type.name} value={type.name}>
                    {type.category?.name} / {type.subcategory?.name} /
                    {type.name}
                  </option>
                ))}
              </select>
              <p className="pt-1 text-xs text-[rgb(var(--muted)/1)]">
                Solo aparecen tipos activos en categorías visibles y activas.
              </p>
            </div>

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
            <div className="flex">
              <div className="max-w-3/6">
                <Input
                  id="product-price"
                  label="Precio del producto"
                  inputMode="decimal"
                  value={values.price}
                  onChange={(e) => set("price", e.target.value)}
                />
              </div>
              <span className="flex items-center pt-6 pl-3 font-black text-gray-400">
                USD
              </span>
            </div>
            {/*<Input
            id="product-currency"
            label="Moneda"
            maxLength={3}
            value={values.currency}
            onChange={(e) => set("currency", e.target.value.toUpperCase())}
          />*/}
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
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {(
                  [
                    "active",
                    "editorialApproved",
                    "published",
                    "commerciallyAvailable",
                    "featured",
                  ] as const
                ).map((key) => (
                  <label
                    key={key}
                    className="flex min-h-11 items-center gap-3 px-2 rounded-sm bg-gray-100 border-2 border-transparent hover:border-gray-300"
                  >
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
            <Button
              type="submit"
              disabled={busy || Boolean(product?.retiredAt)}
            >
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
          <Card className="space-y-4 flex-12 lg:flex-4">
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
      </section>
    </div>
  );
}
