import React from "react";

import { Button } from "../../../components/Button";
import { PoliteStatus } from "../../../components/PoliteStatus";
import { Notice } from "../components/Notice";

import type { AdminSession } from "../types";

import { ProductFormHeader } from "./ProductFormHeader";
import { ProductFormBasics } from "./ProductFormBasics";
import { ProductFormFlags } from "./ProductFormFlags";
import { ProductFormLifecycle } from "./ProductFormLifecycle";
import { useProductForm } from "./hooks/useProductForm";
import { useProductLifecycle } from "./hooks/useProductLifecycle";

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
  const form = useProductForm(session, id, onExpired);
  const lifecycle = useProductLifecycle(
    session,
    form.product,
    form.setProduct,
    onExpired,
  );

  if (form.busy && id && !form.product)
    return (
      <PoliteStatus visuallyHidden={false}>Cargando producto…</PoliteStatus>
    );

  const status = form.status || lifecycle.status;
  const busy = form.busy || lifecycle.busy;

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <ProductFormHeader product={form.product} id={id} onDone={onDone} />

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
        <form onSubmit={form.save} className="space-y-6 flex-12 lg:flex-8">
          <ProductFormBasics
            values={form.values}
            categories={form.categories}
            subcategories={form.subcategories}
            productTypes={form.productTypes}
            id={id}
            busy={busy}
            set={form.set}
          />

          {id && !form.product?.retiredAt ? (
            <ProductFormFlags values={form.values} set={form.set} />
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              disabled={busy || Boolean(form.product?.retiredAt)}
            >
              {busy ? "Guardando…" : id ? "Guardar cambios" : "Crear producto"}
            </Button>
            {form.product && onMedia ? (
              <Button type="button" variant="secondary" onClick={onMedia}>
                Administrar imágenes
              </Button>
            ) : null}
          </div>
        </form>

        {form.product ? (
          <ProductFormLifecycle
            product={form.product}
            confirming={lifecycle.confirming}
            setConfirming={lifecycle.setConfirming}
            onConfirm={() => void lifecycle.run()}
          />
        ) : null}
      </section>
    </div>
  );
}
