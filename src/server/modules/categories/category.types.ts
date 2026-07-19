import type { Category } from "@prisma/client";

/**
 * Campos que el admin puede setear al crear una categoría.
 * Excluye campos derivados (id, versionId, sortOrder si se calcula, etc.).
 */
export type CreateCategoryInput = {
  slug: string;
  name: string;
  description?: string | null;
  versionId: string;
  sortOrder?: number; // se calcula si falta
  active?: boolean;
  visible?: boolean;
};

/**
 * Campos editables de una categoría existente.
 * El versionId no se permite cambiar (rompería la taxonomía).
 */
export type UpdateCategoryInput = {
  slug?: string;
  name?: string;
  description?: string | null;
  sortOrder?: number;
  active?: boolean;
  visible?: boolean;
};

/**
 * Resultado del aggregate para saber el sortOrder máximo.
 */
export type SortOrderAggregate = {
  _max: { sortOrder: number | null };
};

/**
 * Tipo de retorno normalizado para category con dependencias.
 */
export type CategoryWithDependencies = {
  category: Category;
  dependencies: {
    subcategories: number;
    productTypes: number;
    products: number;
  };
};
