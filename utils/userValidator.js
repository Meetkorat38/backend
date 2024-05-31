import { z } from "zod";

const userValidationSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  mobilenumber: z.string(),
  skypeID: z.string().optional(),
  password: z.string().min(6),
  isAdmin: z.boolean().optional(),
});

const signinValidationSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export { userValidationSchema, signinValidationSchema };
