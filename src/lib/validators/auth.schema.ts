import { z } from "zod";

// Mirrors load-shedding-api/src/modules/auth/auth.schema.ts exactly, so a
// form error surfaces client-side before the request ever reaches the API.
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  phone: z.string().trim().min(6).max(20).optional().or(z.literal("")),
});
export type RegisterInput = z.infer<typeof registerSchema>;
