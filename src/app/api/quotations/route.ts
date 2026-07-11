import { NextRequest } from "next/server";
import { quotationService } from "@/modules/backend/services/QuotationService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1, "Title is required"),
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
  projectId: z.string().optional(),
  submissionId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const url = new URL(req.url);
    const result = await quotationService.list({
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
    requireAuth(req);
    const body = await req.json();
    const input = createSchema.parse(body);
    const quotation = await quotationService.create(input);
    return apiResponse(quotation, 201);
  } catch (err) {
    return apiError(err);
  }
}
