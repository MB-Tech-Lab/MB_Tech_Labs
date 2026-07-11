/**
 * GET    /api/srg/:id — detail (protected)
 * PUT    /api/srg/:id — update status/notes (protected)
 * DELETE /api/srg/:id — delete (protected)
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { srgService } from "@/modules/backend/services/SrgService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";

const updateSrgSchema = z.object({
  status: z.enum(["NEW", "REVIEWING", "MEETING_SCHEDULED", "APPROVED", "REJECTED", "ARCHIVED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  internalNotes: z.string().optional().or(z.literal("")),
  clientId: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req);
    const { id } = await params;
    const sub = await srgService.getById(id);
    return apiResponse(sub);
  } catch (err) {
    return apiError(err);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req);
    const { id } = await params;
    const body = await req.json();
    const input = updateSrgSchema.parse(body);
    const sub = await srgService.update(id, input);
    return apiResponse(sub);
  } catch (err) {
    return apiError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req);
    const { id } = await params;
    await srgService.delete(id);
    return apiResponse({ id });
  } catch (err) {
    return apiError(err);
  }
}
