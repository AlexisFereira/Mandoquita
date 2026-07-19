import React, { useEffect, useState } from "react";

import { Badge } from "../../../components/Badge";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Icon } from "../../../components/Icon";
import { Notice } from "../components/Notice";
import Pagination from "../components/pagination";
import SearchProducts from "../components/searchProducts";
import { table, tableRegion } from "../utils/table-styles";
import { adminErrorMessage } from "../utils/error-messages";

import { AdminApiError, adminApi } from "../api";
import type { AdminProductList, AdminSession } from "../types";
import { ProductForm } from "./ProductForm";
import { ProductMediaAdmin } from "../MediaAdmin";

export function ProductWorkspace({
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
      else
        setStatus(adminErrorMessage(cause, "No pudimos cargar los productos."));
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
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <span className="ds-eyebrow">Catálogo administrativo</span>
          <h1 className="ds-heading ds-heading-lg">Productos</h1>
        </div>
        <Button onClick={() => setMode("create")}>Crear producto</Button>
        <div className="flex-1 ml-auto mr-0">
          <SearchProducts
            q={q}
            setQ={setQ}
            retired={retired}
            setRetired={setRetired}
            setPage={setPage}
            load={load}
          />
        </div>
      </div>

      {status ? (
        <Notice
          text={status}
          variant={!status.startsWith("Cargando") ? "error" : "info"}
        />
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
            <table
              className={`${table} min-w-[1296px] w-full text-sm text-left rtl:text-right text-body`}
            >
              <caption className="sr-only">
                {retired ? "Productos retirados" : "Productos vigentes"}.
                {data.metadata.totalItems} resultados.
              </caption>
              <thead className="bg-neutral-secondary-soft border-b border-default">
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">SKU base</th>
                  <th scope="col">Clasificación</th>
                  <th scope="col">Estados</th>
                  <th scope="col">Actualización</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((p) => (
                  <tr
                    key={p.id}
                    className="odd:bg-gray-200 even:bg-neutral-secondary-soft border-b border-default"
                  >
                    <td scope="row" className="p-4">
                      <span className="block font-semibold">{p.name}</span>
                      <span className="font-normal text-[rgb(var(--muted)/1)]">
                        /{p.slug}
                      </span>
                    </td>
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
                    <td>
                      {new Intl.DateTimeFormat("es-CO", {
                        dateStyle: "medium",
                      }).format(new Date(p.updatedAt))}
                    </td>
                    <td>
                      <div className="flex flex-nowrap gap-2">
                        <Button
                          size="sm"
                          title={`Editar ${p.name}`}
                          variant="secondary"
                          onClick={() => {
                            setId(p.id);
                            setMode("edit");
                          }}
                        >
                          <Icon name="edit" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} setPage={setPage} data={data} />
        </>
      ) : data && !status ? (
        <Card>No hay productos para administrar.</Card>
      ) : null}
    </div>
  );
}
