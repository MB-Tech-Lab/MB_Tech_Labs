/**
 * GET /api/search?q=query
 * Global search across all entities.
 */
import { NextRequest } from "next/server";
import { searchService } from "@/modules/backend/services/SearchService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const url = new URL(req.url);
    const query = url.searchParams.get("q") || "";
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
    const results = await searchService.search(query, limit);
    return apiResponse(results);
  } catch (err) {
    return apiError(err);
  }
}
