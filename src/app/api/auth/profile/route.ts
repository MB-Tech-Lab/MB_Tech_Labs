/**
 * GET /api/auth/profile
 * Returns the authenticated user's profile.
 */
import { NextRequest } from "next/server";
import { authService } from "@/modules/backend/services/AuthService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const profile = await authService.getProfile(user.id);
    return apiResponse(profile);
  } catch (err) {
    return apiError(err);
  }
}
