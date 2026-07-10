/**
 * GET  /api/clients — list (paginated, searchable)
 * POST /api/clients — create
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { clientService } from "@/modules/backend/services/ClientService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";

const createClientSchema = z.object({
  companyName: z.string().min(1, "Company name is required").max(200),
  contactName: z.string().min(1, "Contact name is required").max(200),
  email: z.string().email("Valid email required"),
  phone: z.string().max(30).optional().or(z.literal("")),
  website: z.string().max(200).optional().or(z.literal("")),
  industry: z.string().max(100).optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
  country: z.string().max(100).optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const url = new URL(req.url);
    const result = await clientService.list({
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
    const user = requireAuth(req);
    const body = await req.json();
    const input = createClientSchema.parse(body);
    const client = await clientService.create(input, user.id);
    return apiResponse(client, 201);
  } catch (err) {
    return apiError(err);
  }
}
