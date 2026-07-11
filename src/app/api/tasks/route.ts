import { NextRequest } from "next/server";
import { taskService } from "@/modules/backend/services/TaskService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE", "BLOCKED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  estimatedHours: z.number().int().positive().optional(),
  dueDate: z.string().optional(),
  projectId: z.string().min(1, "Project is required"),
  assigneeId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const url = new URL(req.url);
    const result = await taskService.list({
      page: parseInt(url.searchParams.get("page") || "1"),
      pageSize: parseInt(url.searchParams.get("pageSize") || "100"),
      search: url.searchParams.get("search") || undefined,
      status: url.searchParams.get("status") || undefined,
      projectId: url.searchParams.get("projectId") || undefined,
      assigneeId: url.searchParams.get("assigneeId") || undefined,
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
    const input = createSchema.parse(body);
    return apiResponse(await taskService.create(input, user.id), 201);
  } catch (err) {
    return apiError(err);
  }
}
