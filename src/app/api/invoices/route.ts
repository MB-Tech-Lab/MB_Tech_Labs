import { NextRequest } from "next/server";
import { invoiceService } from "@/modules/backend/services/InvoiceService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";
import { z } from "zod";

const createSchema = z.object({
  number: z.string().min(1, "Invoice number is required"),
  amount: z.number().min(0),
  currency: z.string().optional(),
  taxAmount: z.number().optional(),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  quotationId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const url = new URL(req.url);
    const result = await invoiceService.list({
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
    return apiResponse(await invoiceService.create(input), 201);
  } catch (err) {
    return apiError(err);
  }
}
