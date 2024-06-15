import { z } from "zod";

const categoryValidationSchema = z.object({
  categoryName: z
    .string()
    .min(3, { message: "Category name must be 3 characters long" })
    .trim(),
  categoryDescription: z.string().optional(),
});

export { categoryValidationSchema };
