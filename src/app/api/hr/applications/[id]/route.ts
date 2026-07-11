import { NextRequest } from "next/server";
import { applicationService } from "@/modules/backend/services/ApplicationService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req);
    const { id } = await params;
    return apiResponse(await applicationService.getById(id));
  } catch (err) {
    return apiError(err);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = requireAuth(req);
    const { id } = await params;
    const body = await req.json();

    if (body.status) {
      await applicationService.updateStatus(id, body.status, user.id);
    }
    if (body.note) {
      await applicationService.addNote(id, body.note, user.id);
    }
    if (body.convertToEmployee) {
      const result = await applicationService.convertToEmployee(id);
      return apiResponse(result);
    }

    return apiResponse(await applicationService.getById(id));
  } catch (err) {
    return apiError(err);
  }
}
