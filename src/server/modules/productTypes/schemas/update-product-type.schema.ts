import { z } from "zod";

export const updateProductTypeSchema = z
  .object({
    expectedUpdatedAt: z.string().datetime({ offset: true }),
    subcategoryId: z.string().uuid().optional(),
    sourceOrder: z.number().int().min(1).optional(),
    active: z.boolean().optional(),
  })
  .strict()
  .refine(
    (value) => Object.keys(value).some((key) => key !== "expectedUpdatedAt"),
    { message: "At least one update field is required" },
  );

export type UpdateProductTypeInput = z.infer<typeof updateProductTypeSchema>;
