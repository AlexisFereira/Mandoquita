import { z } from "zod";

export const listProductTypesSchema = z
  .object({
    q: z.string().trim().min(1).max(160).optional(),
    retired: z
      .enum(["true", "false"])
      .transform((v) => v === "true")
      .default("false"),
    subcategoryId: z.string().uuid().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
  })
  .strict();

export type ListProductTypesInput = z.infer<typeof listProductTypesSchema>;
