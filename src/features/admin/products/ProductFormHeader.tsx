import React from "react";
import { Badge } from "../../../components/Badge";
import type { AdminProduct } from "../types";

export function ProductFormHeader({
  product,
  id,
  onDone,
}: {
  product: AdminProduct | null;
  id?: number;
  onDone: () => void;
}) {
  return (
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
  );
}
