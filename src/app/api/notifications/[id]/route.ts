import { NextRequest } from "next/server";
import { notificationService } from "@/modules/backend/services/NotificationService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";

/** Mark single notification as read */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req);
    const { id } = await params;
    return apiResponse(await notificationService.markAsRead(id));
  } catch (err) {
    return apiError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req);
    const { id } = await params;
    await notificationService.delete(id);
    return apiResponse({ id });
  } catch (err) {
    return apiError(err);
  }
}
