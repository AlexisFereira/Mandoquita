import React, { useState } from "react";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Input } from "../../../components/Input";
import { Notice } from "../components/Notice";
import { adminApi, AdminApiError } from "../api";
import type { AdminCategory, AdminSubcategory } from "../types";

export type TaxonomyKind = "category" | "subcategory" | "productType";

type Props = {
  kind: TaxonomyKind;
  parent?:
    | { kind: "category"; data: AdminCategory }
    | { kind: "subcategory"; data: AdminSubcategory };
  csrfToken: string;
  onClose: () => void;
  onSuccess: () => void;
};

export function TaxonomyCreateModal({
  kind,
  parent,
  csrfToken,
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  // Auto-slug desde el nombre (solo si el usuario no tocó el slug)
  React.useEffect(() => {
    if (!slug && name) {
      setSlug(
        name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-"),
      );
    }
  }, [name, slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setStatus("El nombre es obligatorio.");
      return;
    }

    setBusy(true);
    setStatus("");

    try {
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
          sourceOrder: 0,
        });
      } else {
        if (!parent || parent.kind !== "subcategory") {
          throw new Error("Falta la subcategoría padre.");
        }
        const resp = await adminApi.createProductType(csrfToken, {
          name: name.trim(),
          subcategoryId: parent.data.id,
        });
      }

      onSuccess();
      onClose();
    } catch (cause) {
      console.log("AdminApiError", cause);
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

  const titleByKind = {
    category: "Nueva categoría",
    subcategory: `Nueva subcategoría${parent ? ` en "${parent.data.name}"` : ""}`,
    productType: `Nuevo tipo${parent ? ` en "${parent.data.name}"` : ""}`,
  };

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
            ×
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

          {/* El slug solo aplica a category y subcategory, no a productType */}
          {kind !== "productType" && (
            <Input
              id="taxonomy-slug"
              label="Slug (URL)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
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
            <Button type="submit" disabled={busy || !name.trim()}>
              {busy ? "Guardando…" : "Crear"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
