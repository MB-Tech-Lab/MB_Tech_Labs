import { NextRequest } from "next/server";
import { proposalService } from "@/modules/backend/services/ProposalService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1, "Title is required"),
  sections: z.array(z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
  })).optional(),
  projectId: z.string().optional(),
  submissionId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const url = new URL(req.url);
    const result = await proposalService.list({
      page: parseInt(url.searchParams.get("page") || "1"),
      pageSize: parseInt(url.searchParams.get("pageSize") || "20"),
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
    const user = requireAuth(req);
    const body = await req.json();
    const input = createSchema.parse(body);
    const proposal = await proposalService.create(input, user.id);
    return apiResponse(proposal, 201);
  } catch (err) {
    return apiError(err);
  }
}
