import React from "react";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import type { AdminProduct } from "../types";

export function ProductFormLifecycle({
  product,
  confirming,
  setConfirming,
  onConfirm,
}: {
  product: AdminProduct;
  confirming: boolean;
  setConfirming: (value: boolean) => void;
  onConfirm: () => void;
}) {
  return (
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
            <Button variant="secondary" onClick={() => setConfirming(false)}>
              Cancelar
            </Button>
            <Button
              variant={product.retiredAt ? "primary" : "danger"}
              onClick={onConfirm}
            >
              {product.retiredAt ? "Restaurar producto" : "Retirar producto"}
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
  );
}
