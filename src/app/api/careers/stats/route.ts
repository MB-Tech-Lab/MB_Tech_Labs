/**
 * GET /api/careers/stats — talent acquisition dashboard stats
 */
import { NextRequest } from "next/server";
import { applicationService } from "@/modules/backend/services/ApplicationService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const stats = await applicationService.getStats();
    return apiResponse(stats);
  } catch (err) {
    return apiError(err);
  }
}
