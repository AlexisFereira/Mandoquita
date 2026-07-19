import React from "react";
import { Card } from "../../../components/Card";
import { Input } from "../../../components/Input";
import type { AdminProductType } from "../types";
import type { ProductFormSetter, ProductFormValues } from "./types";

export function ProductFormBasics({
  values,
  types,
  id,
  busy,
  set,
}: {
  values: ProductFormValues;
  types: AdminProductType[];
  id?: number;
  busy: boolean;
  set: ProductFormSetter;
}) {
  return (
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
          <option value="">Sin clasificar (luego no podrás publicarlo)</option>
          {types.map((type) => (
            <option key={type.name} value={type.name}>
              {type.category?.name} / {type.subcategory?.name} /{type.name}
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
      {!id ? (
        <Input
          id="product-sku"
          label="SKU base"
          value={values.baseSku}
          onChange={(e) => set("baseSku", e.target.value)}
        />
      ) : null}
    </Card>
  );
}
