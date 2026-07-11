/**
 * GET    /api/clients/:id
 * PUT    /api/clients/:id
 * DELETE /api/clients/:id
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { clientService } from "@/modules/backend/services/ClientService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";

const updateClientSchema = z.object({
  companyName: z.string().min(1).max(200).optional(),
  contactName: z.string().min(1).max(200).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional().or(z.literal("")),
  website: z.string().max(200).optional().or(z.literal("")),
  industry: z.string().max(100).optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
  country: z.string().max(100).optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req);
    const { id } = await params;
    const client = await clientService.getById(id);
    return apiResponse(client);
  } catch (err) {
    return apiError(err);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req);
    const { id } = await params;
    const body = await req.json();
    const input = updateClientSchema.parse(body);
    const client = await clientService.update(id, input);
    return apiResponse(client);
  } catch (err) {
    return apiError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req);
    const { id } = await params;
    await clientService.delete(id);
    return apiResponse({ id });
  } catch (err) {
    return apiError(err);
  }
}
