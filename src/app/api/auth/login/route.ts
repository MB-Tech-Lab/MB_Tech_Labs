/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { user, accessToken, refreshToken }
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { authService } from "@/modules/backend/services/AuthService";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = loginSchema.parse(body);
    const result = await authService.login(input.email, input.password);
    return apiResponse(result);
  } catch (err) {
    return apiError(err);
  }
}
