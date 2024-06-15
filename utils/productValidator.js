import { z } from "zod";

const productValidationSchema = z.object({
  productName: z.string(),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .optional(),
  price: z.number(),
  category: z.string(),
});

export { productValidationSchema };
