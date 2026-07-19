import type { ProductType } from "@prisma/client";

export type CreateProductTypeInput = {
  name: string;
  subcategoryId: string;
  sourceOrder?: number; // se calcula si falta
  active?: boolean;
};

/**
 * Nota: el name es PK en Prisma. No se puede cambiar.
 * Si querés renombrarlo, hay que crear uno nuevo y migrar productos.
 */
export type UpdateProductTypeInput = {
  subcategoryId?: string; // mover de subcategoría
  sourceOrder?: number;
  active?: boolean;
};
