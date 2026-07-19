import type { Dispatch, SetStateAction } from "react";

export type ProductFormValues = {
  name: string;
  slug: string;
  price: string;
  currency: string;
  baseSku: string;
  shortDescription: string;
  description: string;
  brand: string;
  collection: string;
  genderApplicability: "" | "mujer" | "hombre" | "unisex" | "no_aplica";
  productTypeId: string;
  seoTitle: string;
  seoDescription: string;
  featuredOrder: string;
  active: boolean;
  editorialApproved: boolean;
  published: boolean;
  commerciallyAvailable: boolean;
  featured: boolean;
};

export const emptyProduct: ProductFormValues = {
  name: "",
  slug: "",
  price: "",
  currency: "COP",
  baseSku: "",
  shortDescription: "",
  description: "",
  brand: "",
  collection: "",
  genderApplicability: "",
  productTypeId: "",
  seoTitle: "",
  seoDescription: "",
  featuredOrder: "",
  active: false,
  editorialApproved: false,
  published: false,
  commerciallyAvailable: false,
  featured: false,
};

/**
 * Setter tipado para los campos del formulario.
 */
export type ProductFormSetter = <K extends keyof ProductFormValues>(
  key: K,
  value: ProductFormValues[K],
) => void;

/**
 * Flags booleanos editables del producto.
 * Se renderizan como checkboxes en ProductFormFlags.
 */
export const PRODUCT_FLAG_KEYS = [
  "active",
  "editorialApproved",
  "published",
  "commerciallyAvailable",
  "featured",
] as const;

export type ProductFlagKey = (typeof PRODUCT_FLAG_KEYS)[number];

export const PRODUCT_FLAG_LABELS: Record<ProductFlagKey, string> = {
  active: "Activo",
  editorialApproved: "Aprobado editorialmente",
  published: "Publicado",
  commerciallyAvailable: "Disponible comercialmente",
  featured: "Destacado",
};
