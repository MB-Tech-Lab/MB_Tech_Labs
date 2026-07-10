import { NextRequest } from "next/server";
import { meetingService } from "@/modules/backend/services/MeetingService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum(["VIDEO", "IN_PERSON", "PHONE"]).optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().optional(),
  location: z.string().optional(),
  meetingUrl: z.string().optional(),
  projectId: z.string().optional(),
  clientId: z.string().optional(),
  organizerId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const url = new URL(req.url);
    const result = await meetingService.list({
      page: parseInt(url.searchParams.get("page") || "1"),
      pageSize: parseInt(url.searchParams.get("pageSize") || "50"),
      search: url.searchParams.get("search") || undefined,
      status: url.searchParams.get("status") || undefined,
    });
    return apiResponse(result);
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAuth(req);
    const body = await req.json();
    const input = createSchema.parse(body);
    return apiResponse(await meetingService.create(input), 201);
  } catch (err) {
    return apiError(err);
  }
}
