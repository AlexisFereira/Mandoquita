import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must be lowercase alphanumeric with single hyphens",
  });

export const createSubcategorySchema = z
  .object({
    slug: slugSchema,
    name: z.string().trim().min(1).max(160),
    categoryId: z.string().uuid(),
    active: z.boolean().optional(),
  })
  .strict();

export type CreateSubcategoryInput = z.infer<typeof createSubcategorySchema>;
