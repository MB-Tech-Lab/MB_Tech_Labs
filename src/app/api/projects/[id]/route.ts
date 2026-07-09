/**
 * GET    /api/projects/:id
 * PUT    /api/projects/:id
 * DELETE /api/projects/:id
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { projectService } from "@/modules/backend/services/ProjectService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";

const updateProjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().or(z.literal("")),
  status: z.enum(["DISCOVERY", "PLANNING", "UI_UX", "DEVELOPMENT", "TESTING", "DEPLOYMENT", "MAINTENANCE", "ON_HOLD", "CANCELLED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  currentStage: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  estimatedHours: z.number().int().positive().optional(),
  budget: z.number().positive().optional(),
  technologyStack: z.array(z.string()).optional(),
  notes: z.string().max(5000).optional().or(z.literal("")),
  projectManagerId: z.string().optional().nullable(),
  assignedDeveloperIds: z.array(z.string()).optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req);
    const { id } = await params;
    const project = await projectService.getById(id);
    return apiResponse(project);
  } catch (err) {
    return apiError(err);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req);
    const { id } = await params;
    const body = await req.json();
    const input = updateProjectSchema.parse(body);
    const project = await projectService.update(id, input);
    return apiResponse(project);
  } catch (err) {
    return apiError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req);
    const { id } = await params;
    await projectService.delete(id);
    return apiResponse({ id });
  } catch (err) {
    return apiError(err);
  }
}
