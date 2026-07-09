/**
 * GET  /api/projects — list (paginated, searchable)
 * POST /api/projects — create
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { projectService } from "@/modules/backend/services/ProjectService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";

const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  clientId: z.string().min(1, "Client is required"),
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
});

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const url = new URL(req.url);
    const result = await projectService.list({
      page: parseInt(url.searchParams.get("page") || "1"),
      pageSize: parseInt(url.searchParams.get("pageSize") || "20"),
      search: url.searchParams.get("search") || undefined,
      sortBy: url.searchParams.get("sortBy") || undefined,
      sortOrder: (url.searchParams.get("sortOrder") as "asc" | "desc") || undefined,
      status: url.searchParams.get("status") || undefined,
    });
    return apiResponse(result);
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const body = await req.json();
    const input = createProjectSchema.parse(body);
    const project = await projectService.create(input, user.id);
    return apiResponse(project, 201);
  } catch (err) {
    return apiError(err);
  }
}
