/**
 * POST /api/init — one-time setup. Creates default admin if no users exist.
 * Safe to call multiple times.
 */
import { authService } from "@/modules/backend/services/AuthService";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";

export async function POST() {
  try {
    await authService.ensureDefaultAdmin();
    return apiResponse({ message: "Default admin ensured" });
  } catch (err) {
    return apiError(err);
  }
}
