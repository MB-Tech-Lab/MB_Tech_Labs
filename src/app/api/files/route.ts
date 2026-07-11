/**
 * File Upload Routes
 * GET  /api/files           — list files (filter by entityType, entityId, category)
 * POST /api/files           — upload a file (multipart/form-data)
 * GET  /api/files/:id       — get file metadata
 * GET  /api/files/:id/download — download the actual file
 * DELETE /api/files/:id     — delete file + metadata
 */
import { NextRequest } from "next/server";
import { fileService } from "@/modules/backend/services/FileService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";
import fs from "fs";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const url = new URL(req.url);
    const files = await fileService.list({
      entityType: url.searchParams.get("entityType") || undefined,
      entityId: url.searchParams.get("entityId") || undefined,
      category: url.searchParams.get("category") || undefined,
    });
    return apiResponse(files);
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const entityType = (formData.get("entityType") as string) || "GENERAL";
    const entityId = (formData.get("entityId") as string) || "general";
    const category = (formData.get("category") as string) || null;

    if (!file) {
      return apiError(new Error("No file provided"));
    }

    const document = await fileService.upload(file, entityType, entityId, category, user.id);
    return apiResponse(document, 201);
  } catch (err) {
    return apiError(err);
  }
}
