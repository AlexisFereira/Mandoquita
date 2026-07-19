import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const updateSubcategorySchema = z
  .object({
    expectedUpdatedAt: z.string().datetime({ offset: true }),
    slug: slugSchema.optional(),
    name: z.string().trim().min(1).max(160).optional(),
    categoryId: z.string().uuid().optional(),
    sourceOrder: z.number().int().min(1).optional(),
    active: z.boolean().optional(),
  })
  .strict()
  .refine(
    (value) => Object.keys(value).some((key) => key !== "expectedUpdatedAt"),
    { message: "At least one update field is required" },
  );

export type UpdateSubcategoryInput = z.infer<typeof updateSubcategorySchema>;
