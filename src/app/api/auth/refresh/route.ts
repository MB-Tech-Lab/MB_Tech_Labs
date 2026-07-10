/**
 * POST /api/auth/refresh
 * Body: { refreshToken }
 * Returns: { accessToken }
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { authService } from "@/modules/backend/services/AuthService";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";

const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = refreshSchema.parse(body);
    const result = await authService.refresh(input.refreshToken);
    return apiResponse(result);
  } catch (err) {
    return apiError(err);
  }
}
