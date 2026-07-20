import React from "react";
import { Card } from "../../../components/Card";
import { Input } from "../../../components/Input";
import type {
  AdminCategory,
  AdminSubcategory,
  AdminProductType,
} from "../types";
import type { ProductFormSetter, ProductFormValues } from "./types";
import Select from "@/components/Select";

export function ProductFormBasics({
  values,
  categories,
  subcategories,
  productTypes,
  id,
  busy,
  set,
}: {
  values: ProductFormValues;
  categories: AdminCategory[];
  subcategories: AdminSubcategory[];
  productTypes: AdminProductType[];
  id?: number;
  busy: boolean;
  set: ProductFormSetter;
}) {
  // Estado de la cascada (lo que el usuario va eligiendo)
  const [selectedCategoryId, setSelectedCategoryId] =
    React.useState<string>("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] =
    React.useState<string>("");

  // ── Pre-selección al EDITAR un producto existente ──
  React.useEffect(() => {
    if (!id) return;
    if (!values.productTypeId) return;
    if (productTypes.length === 0) return;

    const pt = productTypes.find((p) => p.name === values.productTypeId);
    if (!pt?.subcategory) return;

    setSelectedCategoryId(pt.subcategory.category?.id ?? "");
    setSelectedSubcategoryId(pt.subcategory.id);
  }, [id, productTypes.length, values.productTypeId]);

  // ── Cascada de arriba hacia abajo ──

  // Subcategorías filtradas por la categoría elegida
  const availableSubcategories = subcategories.filter(
    (s) => !selectedCategoryId || s.categoryId === selectedCategoryId,
  );

  // ProductTypes filtrados por la subcategoría elegida
  const availableProductTypes = productTypes.filter(
    (pt) =>
      !selectedSubcategoryId || pt.subcategoryId === selectedSubcategoryId,
  );

  // ── Handlers de cambio con reset en cascada ──
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId("");
    set("productTypeId", "");
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategoryId(subcategoryId);
    set("productTypeId", "");
  };

  return (
    <Card className="grid gap-5 md:grid-cols-2">
      <div className="col-span-2 grid md:grid-cols-6 gap-5">
        {/* ── SELECT 1: Categoría ── */}
        <div className="md:col-span-2">
          <Select
            label="Categoría"
            id="product-category"
            value={selectedCategoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            disabled={busy}
            options={categories
              .filter((c) => c.active && c.visible)
              .map((c) => ({ value: c.id, label: c.name }))}
          />
        </div>

        {/* ── SELECT 2: Subcategoría ── */}
        <div className="md:col-span-2">
          <Select
            label="Subcategoría"
            id="product-subcategory"
            value={selectedSubcategoryId}
            onChange={(e) => handleSubcategoryChange(e.target.value)}
            disabled={busy || !selectedCategoryId}
            options={availableSubcategories
              .filter((s) => s.active)
              .map((s) => ({ value: s.id, label: s.name }))}
          />
        </div>

        {/* ── SELECT 3: Tipo de producto ── */}
        <div className="md:col-span-2">
          <Select
            label="Tipo de producto"
            id="product-type"
            value={values.productTypeId}
            onChange={(e) => set("productTypeId", e.target.value)}
            disabled={busy || !selectedSubcategoryId}
            options={availableProductTypes
              .filter((pt) => pt.active)
              .map((pt) => ({ value: pt.name, label: pt.name }))}
          />
          <small className="pt-1 text-xs text-[rgb(var(--muted)/1)]">
            {!selectedCategoryId &&
              "Sin clasificar (luego no podrás publicarlo)"}
            {selectedCategoryId &&
              !selectedSubcategoryId &&
              "Elegí una subcategoría para ver los tipos disponibles"}
            {selectedSubcategoryId &&
              availableProductTypes.length === 0 &&
              "Esta subcategoría no tiene tipos. Creá uno desde el módulo de taxonomía."}
          </small>
        </div>
      </div>

      <Input
        id="product-name"
        label="Nombre"
        value={values.name}
        onChange={(e) => set("name", e.target.value)}
        disabled={!values.productTypeId}
      />
      <Input
        id="product-slug"
        label="Slug"
        value={values.slug}
        onChange={(e) => set("slug", e.target.value)}
        disabled={!values.productTypeId}
      />
      <div className="flex">
        <div className="max-w-3/6">
          <Input
            id="product-price"
            label="Precio del producto"
            inputMode="decimal"
            value={values.price}
            onChange={(e) => set("price", e.target.value)}
            disabled={!values.productTypeId}
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
          disabled={!values.productTypeId}
        />
      ) : null}
    </Card>
  );
}
