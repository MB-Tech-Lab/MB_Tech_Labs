/**
 * HR Applications API
 * GET  /api/hr/applications — list all applications
 * PUT  /api/hr/applications/:id — update status
 */
import { NextRequest } from "next/server";
import { applicationService } from "@/modules/backend/services/ApplicationService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const url = new URL(req.url);
    const result = await applicationService.list({
      page: parseInt(url.searchParams.get("page") || "1"),
      pageSize: parseInt(url.searchParams.get("pageSize") || "100"),
      search: url.searchParams.get("search") || undefined,
      status: url.searchParams.get("status") || undefined,
    });
    return apiResponse(result);
  } catch (err) {
    return apiError(err);
  }
}
