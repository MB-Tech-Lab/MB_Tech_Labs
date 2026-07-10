/**
 * GET  /api/srg — list (protected, admin only)
 * POST /api/srg — create (PUBLIC — clients submit from /start-project)
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { srgService } from "@/modules/backend/services/SrgService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";

const createSrgSchema = z.object({
  sessionId: z.string().min(1),
  templateId: z.string().min(1),
  templateName: z.string().min(1),
  projectType: z.string().min(1),
  projectName: z.string().min(1),
  clientInfo: z.object({
    fullName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    company: z.string(),
    jobTitle: z.string().optional().or(z.literal("")),
    country: z.string(),
    timezone: z.string(),
    preferredContact: z.string(),
  }),
  businessInfo: z.record(z.any()).optional(),
  projectGoals: z.record(z.any()).optional(),
  answers: z.record(z.any()).optional(),
  srgSections: z.array(z.object({
    id: z.string(),
    title: z.string(),
    questions: z.array(z.object({
      id: z.string(),
      label: z.string(),
      type: z.string(),
      answer: z.any(),
    })),
  })).optional(),
  workflow: z.record(z.any()).optional(),
  teamRequirements: z.object({
    roles: z.array(z.string()).optional(),
    permissions: z.array(z.string()).optional(),
  }).optional(),
  uploads: z.array(z.object({
    id: z.string(),
    name: z.string(),
    size: z.number(),
    type: z.string(),
    category: z.string(),
  })).optional(),
});

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const url = new URL(req.url);
    const result = await srgService.list({
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
    // PUBLIC — no auth required (clients submit from /start-project)
    const body = await req.json();
    const input = createSrgSchema.parse(body);
    const submission = await srgService.create(input);
    return apiResponse(submission, 201);
  } catch (err) {
    return apiError(err);
  }
}
