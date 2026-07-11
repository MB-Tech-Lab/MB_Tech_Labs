/**
 * GET /api/careers/applications/:id — admin detail
 * PUT /api/careers/applications/:id — update status / scorecard
 * DELETE /api/careers/applications/:id — delete
 */
import { NextRequest } from "next/server";
import { applicationService } from "@/modules/backend/services/ApplicationService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["APPLIED", "RESUME_REVIEWED", "PROJECT_REVIEWED", "TECHNICAL_DISCUSSION", "SELECTED", "OFFER_SENT", "JOINED", "TRAINING", "COMPLETED", "REJECTED"]).optional(),
  scoreProgramming: z.number().int().min(0).max(30).optional(),
  scoreProjects: z.number().int().min(0).max(25).optional(),
  scoreHackathons: z.number().int().min(0).max(15).optional(),
  scoreGithub: z.number().int().min(0).max(10).optional(),
  scoreCommunication: z.number().int().min(0).max(10).optional(),
  scoreAttitude: z.number().int().min(0).max(10).optional(),
  note: z.string().optional(),
  convertToEmployee: z.boolean().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req);
    const { id } = await params;
    return apiResponse(await applicationService.getById(id));
  } catch (err) {
    return apiError(err);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = requireAuth(req);
    const { id } = await params;
    const body = await req.json();
    const input = updateSchema.parse(body);

    // Handle conversion to employee
    if (input.convertToEmployee) {
      const result = await applicationService.convertToEmployee(id);
      return apiResponse(result);
    }

    // Handle note addition
    if (input.note) {
      await applicationService.addNote(id, input.note, user.id);
    }

    // Handle status update
    if (input.status) {
      await applicationService.updateStatus(id, input.status, user.id);
    }

    // Handle scorecard update
    const scores = {
      scoreProgramming: input.scoreProgramming,
      scoreProjects: input.scoreProjects,
      scoreHackathons: input.scoreHackathons,
      scoreGithub: input.scoreGithub,
      scoreCommunication: input.scoreCommunication,
      scoreAttitude: input.scoreAttitude,
    };
    const hasScores = Object.values(scores).some((v) => v !== undefined);
    if (hasScores) {
      await applicationService.updateScorecard(id, scores as { scoreProgramming?: number; scoreProjects?: number; scoreHackathons?: number; scoreGithub?: number; scoreCommunication?: number; scoreAttitude?: number });
    }

    return apiResponse(await applicationService.getById(id));
  } catch (err) {
    return apiError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req);
    const { id } = await params;
    await applicationService.delete(id);
    return apiResponse({ id });
  } catch (err) {
    return apiError(err);
  }
}
