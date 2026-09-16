import React, { useState } from "react";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Input } from "../../../components/Input";
import { Notice } from "../components/Notice";
import { adminApi, AdminApiError } from "../api";
import type {
  AdminCategory,
  AdminSubcategory,
  AdminProductType,
} from "../types";
import { Icon } from "@/components/Icon";

export type TaxonomyKind = "category" | "subcategory" | "productType";

type TaxonomyItem =
  | { kind: "category"; data: AdminCategory }
  | { kind: "subcategory"; data: AdminSubcategory }
  | { kind: "productType"; data: AdminProductType };

type Props = {
  kind: TaxonomyKind;
  parent?:
    | { kind: "category"; data: AdminCategory }
    | { kind: "subcategory"; data: AdminSubcategory };
  /** Si se provee, el modal entra en modo edición precargando estos datos */
  item?: TaxonomyItem;
  csrfToken: string;
  onClose: () => void;
  onSuccess: () => void;
};

export function TaxonomyCreateModal({
  kind,
  parent,
  item,
  csrfToken,
  onClose,
  onSuccess,
}: Props) {
  const isEditMode = !!item;

  const [name, setName] = useState(item?.data.name ?? "");
  const [slug, setSlug] = useState(
    item && "slug" in item.data ? (item.data as any).slug : "",
  );
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [slugTouched, setSlugTouched] = useState(isEditMode);

  // Auto-slug desde el nombre (solo si el usuario no tocó el slug y no es edición)
  React.useEffect(() => {
    if (!slugTouched && name) {
      setSlug(
        name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-"),
      );
    }
  }, [name, slugTouched]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setStatus("El nombre es obligatorio.");
      return;
    }

    setBusy(true);
    setStatus("");

    try {
      if (isEditMode) {
        await handleUpdate();
      } else {
        await handleCreate();
      }

      onSuccess();
      onClose();
    } catch (cause) {
      if (cause instanceof AdminApiError) {
        setStatus(`Error ${cause.status}: ${cause.message ?? "sin detalle"}`);
      } else if (cause instanceof Error) {
        setStatus(cause.message);
      } else {
        setStatus("No se pudo guardar.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleCreate() {
    if (kind === "category") {
      await adminApi.createCategory(csrfToken, {
        name: name.trim(),
        slug,
      });
    } else if (kind === "subcategory") {
      if (!parent || parent.kind !== "category") {
        throw new Error("Falta la categoría padre.");
      }
      await adminApi.createSubcategory(csrfToken, {
        name: name.trim(),
        slug,
        categoryId: parent.data.id,
      });
    } else {
      if (!parent || parent.kind !== "subcategory") {
        throw new Error("Falta la subcategoría padre.");
      }
      await adminApi.createProductType(csrfToken, {
        name: name.trim(),
        subcategoryId: parent.data.id,
      });
    }
  }

  async function handleUpdate() {
    if (!item) return;

    if (kind === "category") {
      const data = item.data as AdminCategory;
      await adminApi.updateCategory(data.id, csrfToken, {
        name: name.trim(),
        slug,
      });
    } else if (kind === "subcategory") {
      const data = item.data as AdminSubcategory;
      await adminApi.updateSubcategory(data.id, csrfToken, {
        name: name.trim(),
        slug,
        expectedUpdatedAt: "",
      });
    }
    //else {
    //  // productType se identifica por "name", no por "id"
    //  const data = item.data as AdminProductType;
    //  await adminApi.updateProductType(data.name, csrfToken, {
    //    name: name.trim(),
    //  });
    //}
  }

  const titleByKind = {
    category: isEditMode ? "Editar categoría" : "Nueva categoría",
    subcategory: isEditMode
      ? `Editar subcategoría "${item?.data.name}"`
      : `Nueva subcategoría${parent ? ` en "${parent.data.name}"` : ""}`,
    productType: isEditMode
      ? `Editar tipo "${item?.data.name}"`
      : `Nuevo tipo${parent ? ` en "${parent.data.name}"` : ""}`,
  };

  const originalSlug =
    item && "slug" in item.data ? (item.data as any).slug : undefined;

  const hasChanges = isEditMode
    ? name.trim() !== item?.data.name ||
      (kind !== "productType" && slug !== originalSlug)
    : true;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md space-y-5 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="ds-heading ds-heading-md">{titleByKind[kind]}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-2xl leading-none"
          >
            <Icon name="x" />
          </button>
        </div>

        {status ? <Notice text={status} variant="error" /> : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="taxonomy-name"
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={busy}
            autoFocus
          />

          {kind !== "productType" && (
            <Input
              id="taxonomy-slug"
              label="Slug (URL)"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              disabled={busy}
              helperText="Solo minúsculas, números y guiones"
            />
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={busy}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={busy || !name.trim() || (isEditMode && !hasChanges)}
            >
              {busy ? "Guardando…" : isEditMode ? "Guardar cambios" : "Crear"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
