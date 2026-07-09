/**
 * GET /api/dashboard — real metrics from database (zeros if empty)
 * GET /api/dashboard/activity — recent activity feed
 */
import { NextRequest } from "next/server";
import { dashboardService } from "@/modules/backend/services/DashboardService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const url = new URL(req.url);

    // /api/dashboard/activity
    if (url.pathname.endsWith("/activity")) {
      const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "10")));
      const activities = await dashboardService.getRecentActivity(limit);
      return apiResponse(activities);
    }

    // /api/dashboard
    const stats = await dashboardService.getStats();
    return apiResponse(stats);
  } catch (err) {
    return apiError(err);
  }
}
