import React, { useEffect, useState } from "react";

import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Input } from "../../../components/Input";
import { Notice } from "../components/Notice";
import { table, tableRegion } from "../utils/table-styles";
import { adminErrorMessage } from "../utils/error-messages";

import { AdminApiError, adminApi } from "../api";
import type { AdminCategory, AdminSession } from "../types";
import { CategoryMediaAdmin } from "../MediaAdmin";
import { Icon } from "@/components/Icon";

export function CategoryWorkspace({
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
      else
        setStatus(
          adminErrorMessage(cause, "No pudimos cargar las categorías."),
        );
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
      setStatus(adminErrorMessage(cause, "No se guardó la categoría."));
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
        adminErrorMessage(
          cause,
          "No se cambió el ciclo de vida de la categoría.",
        ),
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
          <Notice
            text={status}
            variant={status.startsWith("No") ? "error" : "info"}
          />
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
              Dependencias: {selected.dependencies.subcategories} subcategorías,
              {selected.dependencies.productTypes} tipos,
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

      {status ? (
        <Notice
          text={status}
          variant={!status.startsWith("Cargando") ? "error" : "info"}
        />
      ) : null}

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
                  {c.dependencies.subcategories} subcategorías ·
                  {c.dependencies.productTypes} tipos ·{c.dependencies.products}{" "}
                  productos
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
                  <Button
                    title={c.name}
                    variant="secondary"
                    onClick={() => open(c)}
                  >
                    <Icon name="edit" />
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
