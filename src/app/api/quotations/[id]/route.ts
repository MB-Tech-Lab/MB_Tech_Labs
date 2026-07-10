import { NextRequest } from "next/server";
import { quotationService } from "@/modules/backend/services/QuotationService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().optional(),
  items: z.array(z.object({
    id: z.string(),
    category: z.string(),
    description: z.string(),
    qty: z.number(),
    unitPrice: z.number(),
  })).optional(),
  currency: z.string().optional(),
  taxRate: z.number().optional(),
  discount: z.number().optional(),
  paymentTerms: z.string().optional(),
  validUntil: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"]).optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req);
    const { id } = await params;
    return apiResponse(await quotationService.getById(id));
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
    return apiResponse(await quotationService.update(id, input));
  } catch (err) {
    return apiError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req);
    const { id } = await params;
    await quotationService.delete(id);
    return apiResponse({ id });
  } catch (err) {
    return apiError(err);
  }
}
