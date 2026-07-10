/**
 * Public: POST /api/careers/applications — submit application (no auth)
 * Admin: GET /api/careers/applications — list all (auth required)
 */
import { NextRequest } from "next/server";
import { applicationService } from "@/modules/backend/services/ApplicationService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";
import { z } from "zod";

const submitSchema = z.object({
  positionId: z.string().min(1),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  college: z.string().optional(),
  university: z.string().optional(),
  degree: z.string().optional(),
  branch: z.string().optional(),
  cgpa: z.number().min(0).max(10).optional(),
  currentSemester: z.number().int().min(1).max(12).optional(),
  graduationYear: z.number().int().min(2000).max(2030).optional(),
  skills: z.array(z.string()).optional(),
  portfolioWebsite: z.string().optional(),
  githubProfile: z.string().optional(),
  linkedinProfile: z.string().optional(),
  resumePath: z.string().optional(),
  whyJoin: z.string().optional(),
  techInterest: z.string().optional(),
  bestProject: z.string().optional(),
  careerGoals: z.string().optional(),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    technology: z.string().optional(),
    githubUrl: z.string().optional(),
    liveDemoUrl: z.string().optional(),
    role: z.string().optional(),
    achievements: z.string().optional(),
  })).optional(),
  hackathons: z.array(z.object({
    name: z.string(),
    year: z.number().optional(),
    rank: z.string().optional(),
    repositoryUrl: z.string().optional(),
  })).optional(),
});

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const url = new URL(req.url);
    const result = await applicationService.list({
      page: parseInt(url.searchParams.get("page") || "1"),
      pageSize: parseInt(url.searchParams.get("pageSize") || "20"),
      search: url.searchParams.get("search") || undefined,
      status: url.searchParams.get("status") || undefined,
      positionId: url.searchParams.get("positionId") || undefined,
    });
    return apiResponse(result);
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = submitSchema.parse(body);
    const result = await applicationService.submit(input);
    return apiResponse(result, 201);
  } catch (err) {
    return apiError(err);
  }
}
