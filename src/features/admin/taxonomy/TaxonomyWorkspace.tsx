import React, { useState } from "react";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Notice } from "../components/Notice";
import { useTaxonomy, type TaxonomyNode } from "./hooks/useTaxonomy";
import { TaxonomyCreateModal, type TaxonomyKind } from "./TaxonomyCreateModal";
import { useAdminSession } from "../hooks/useAdminSession";
import { adminApi } from "../api-back";

export function TaxonomyWorkspace() {
  const { tree, loading, error, refresh } = useTaxonomy();
  const { session } = useAdminSession();
  const [modal, setModal] = useState<{
    kind: TaxonomyKind;
    parent?:
      | { kind: "category"; data: any }
      | { kind: "subcategory"; data: any };
  } | null>(null);

  if (loading) {
    return (
      <Card>
        <p>Cargando taxonomía…</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Notice text={error} variant="error" />
        <Button onClick={() => void refresh()}>Reintentar</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="ds-heading ds-heading-lg">Taxonomía del catálogo</h1>
          <p className="text-sm text-[rgb(var(--muted)/1)]">
            Gestioná categorías, subcategorías y tipos de producto.
          </p>
        </div>
        <Button onClick={() => setModal({ kind: "category" })}>
          + Nueva categoría
        </Button>
      </div>

      {tree.length === 0 ? (
        <Card>
          <p className="text-center">
            No hay categorías todavía. Creá la primera con el botón de arriba.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {tree.map((node) =>
            node.kind === "category" ? (
              <CategoryRow
                key={node.data.id}
                node={node}
                onAddSubcategory={(category) =>
                  setModal({
                    kind: "subcategory",
                    parent: { kind: "category", data: category },
                  })
                }
                onAddProductType={(subcategory) =>
                  setModal({
                    kind: "productType",
                    parent: { kind: "subcategory", data: subcategory },
                  })
                }
              />
            ) : null,
          )}
        </div>
      )}

      {modal ? (
        <TaxonomyCreateModal
          kind={modal.kind}
          parent={modal.parent}
          csrfToken={session?.csrfToken ?? ""}
          onClose={() => setModal(null)}
          onSuccess={() => void refresh()}
          onCreate={async (body) => {
            debugger;
            if (!session?.csrfToken) throw new Error("Sin sesión");

            if (modal.kind === "category") {
              return await fetch("/api/admin/categories", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-csrf-token": session.csrfToken,
                },
                body: JSON.stringify(body),
              }).then((r) => r.json());
            }
            if (modal.kind === "subcategory") {
              return await fetch("/api/admin/subcategories", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-csrf-token": session.csrfToken,
                },
                body: JSON.stringify(body),
              }).then((r) => r.json());
            }

            return await adminApi.createProductType(session.csrfToken, body);
          }}
        />
      ) : null}
    </div>
  );
}

function CategoryRow({
  node,
  onAddSubcategory,
  onAddProductType,
}: {
  node: Extract<TaxonomyNode, { kind: "category" }>;
  onAddSubcategory: (category: any) => void;
  onAddProductType: (subcategory: any) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-left"
        >
          <span>{open ? "▼" : "▶"}</span>
          <span className="ds-heading ds-heading-md">{node.data.name}</span>
          <span className="text-xs text-[rgb(var(--muted)/1)]">
            ({node.children.length} subcategorías)
          </span>
        </button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onAddSubcategory(node.data)}
        >
          + Subcategoría
        </Button>
      </div>

      {open && (
        <div className="ml-6 space-y-2">
          {node.children.length === 0 ? (
            <p className="text-xs text-[rgb(var(--muted)/1)]">
              Sin subcategorías.
            </p>
          ) : (
            node.children.map((sub) =>
              sub.kind === "subcategory" ? (
                <SubcategoryRow
                  key={sub.data.id}
                  node={sub}
                  onAddProductType={onAddProductType}
                />
              ) : null,
            )
          )}
        </div>
      )}
    </Card>
  );
}

function SubcategoryRow({
  node,
  onAddProductType,
}: {
  node: Extract<TaxonomyNode, { kind: "subcategory" }>;
  onAddProductType: (subcategory: any) => void;
}) {
  return (
    <div className="space-y-1 border-l-2 border-[rgb(var(--border)/1)] pl-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">{node.data.name}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onAddProductType(node.data)}
        >
          + Tipo
        </Button>
      </div>
      {node.children.length > 0 && (
        <ul className="ml-4 space-y-1 text-sm">
          {node.children.map((pt) =>
            pt.kind === "productType" ? (
              <li key={pt.data.name} className="text-[rgb(var(--muted)/1)]">
                • {pt.data.name}
              </li>
            ) : null,
          )}
        </ul>
      )}
    </div>
  );
}
