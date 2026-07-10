/**
 * Public: GET /api/careers/positions — list published positions
 * Admin: POST /api/careers/positions — create position (auth required)
 */
import { NextRequest } from "next/server";
import { positionService } from "@/modules/backend/services/InternshipPositionService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    // If authenticated (admin), return all positions including drafts
    let isAuthenticated = false;
    try {
      requireAuth(req);
      isAuthenticated = true;
    } catch {
      // Not authenticated — public access
    }

    if (isAuthenticated) {
      const result = await positionService.list({
        page: parseInt(url.searchParams.get("page") || "1"),
        pageSize: parseInt(url.searchParams.get("pageSize") || "100"),
        search: url.searchParams.get("search") || undefined,
        status: url.searchParams.get("status") || undefined,
        department: url.searchParams.get("department") || undefined,
      });
      return apiResponse(result);
    }

    // Public — only published positions
    const positions = await positionService.listPublic({
      search: url.searchParams.get("search") || undefined,
      department: url.searchParams.get("department") || undefined,
    });
    return apiResponse(positions);
  } catch (err) {
    return apiError(err);
  }
}

const createSchema = z.object({
  title: z.string().min(1, "Title is required"),
  department: z.string().min(1, "Department is required"),
  technology: z.string().optional(),
  duration: z.string().min(1, "Duration is required"),
  stipend: z.string().optional(),
  mode: z.enum(["REMOTE", "ONSITE", "HYBRID"]).optional(),
  location: z.string().optional(),
  openings: z.number().int().positive().optional(),
  description: z.string().min(1, "Description is required"),
  responsibilities: z.array(z.string()).optional(),
  skillsRequired: z.array(z.string()).optional(),
  eligibility: z.array(z.string()).optional(),
  techStack: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  learningOutcome: z.string().optional(),
  selectionProcess: z.array(z.string()).optional(),
  applicationDeadline: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const body = await req.json();
    const input = createSchema.parse(body);
    return apiResponse(await positionService.create(input, user.id), 201);
  } catch (err) {
    return apiError(err);
  }
}
