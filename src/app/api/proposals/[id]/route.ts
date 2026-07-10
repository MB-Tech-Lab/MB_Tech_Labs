import { NextRequest } from "next/server";
import { proposalService } from "@/modules/backend/services/ProposalService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  sections: z.array(z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
  })).optional(),
  status: z.enum(["DRAFT", "SENT", "ACCEPTED", "REJECTED", "ARCHIVED"]).optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req);
    const { id } = await params;
    const proposal = await proposalService.getById(id);
    return apiResponse(proposal);
  } catch (err) {
    return apiError(err);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req);
    const { id } = await params;
    const body = await req.json();
    const input = updateSchema.parse(body);
    const proposal = await proposalService.update(id, input);
    return apiResponse(proposal);
  } catch (err) {
    return apiError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req);
    const { id } = await params;
    await proposalService.delete(id);
    return apiResponse({ id });
  } catch (err) {
    return apiError(err);
  }
}
