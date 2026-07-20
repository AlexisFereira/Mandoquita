import { z } from "zod";

export const createProductTypeSchema = z
  .object({
    name: z.string().trim().min(1).max(160),
    subcategoryId: z.string().min(1),
    active: z.boolean().optional(),
  })
  .strict();

export type CreateProductTypeInput = z.infer<typeof createProductTypeSchema>;
