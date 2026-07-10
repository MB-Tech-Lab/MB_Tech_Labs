import { NextRequest } from "next/server";
import { notificationService } from "@/modules/backend/services/NotificationService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const url = new URL(req.url);
    const result = await notificationService.list({
      page: parseInt(url.searchParams.get("page") || "1"),
      pageSize: parseInt(url.searchParams.get("pageSize") || "50"),
      status: url.searchParams.get("status") || undefined,
      userId: user.id,
    });
    return apiResponse(result);
  } catch (err) {
    return apiError(err);
  }
}

/** Mark all as read */
export async function PATCH(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const result = await notificationService.markAllAsRead(user.id);
    return apiResponse(result);
  } catch (err) {
    return apiError(err);
  }
}
