/**
 * Auth Validators
 * ---------------
 * Zod schemas for auth endpoints.
 */
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
