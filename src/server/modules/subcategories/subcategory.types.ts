import type { Subcategory } from "@prisma/client";

export type CreateSubcategoryInput = {
  slug: string;
  name: string;
  categoryId: string;
  sourceOrder?: number; // se calcula si falta
  active?: boolean;
};

export type UpdateSubcategoryInput = {
  slug?: string;
  name?: string;
  categoryId?: string; // mover de categoría
  sourceOrder?: number;
  active?: boolean;
};
