import React from "react";
import { Card } from "../../../components/Card";
import {
  PRODUCT_FLAG_KEYS,
  PRODUCT_FLAG_LABELS,
  type ProductFormSetter,
  type ProductFormValues,
} from "./types";

export function ProductFormFlags({
  values,
  set,
}: {
  values: ProductFormValues;
  set: ProductFormSetter;
}) {
  return (
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
        {PRODUCT_FLAG_KEYS.map((key) => (
          <label
            key={key}
            className="flex min-h-11 items-center gap-3 px-2 rounded-sm bg-gray-100 border-2 border-transparent hover:border-gray-300"
          >
            <input
              type="checkbox"
              checked={values[key]}
              onChange={(e) => set(key, e.target.checked)}
            />
            {PRODUCT_FLAG_LABELS[key]}
          </label>
        ))}
      </div>
    </Card>
  );
}
