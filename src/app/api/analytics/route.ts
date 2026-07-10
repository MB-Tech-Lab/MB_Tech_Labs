import { NextRequest } from "next/server";
import { analyticsService } from "@/modules/backend/services/AnalyticsService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const data = await analyticsService.getAnalytics();
    return apiResponse(data);
  } catch (err) {
    return apiError(err);
  }
}
