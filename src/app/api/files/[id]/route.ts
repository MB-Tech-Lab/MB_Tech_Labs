import { NextRequest } from "next/server";
import { fileService } from "@/modules/backend/services/FileService";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";
import fs from "fs";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req);
    const { id } = await params;
    const url = new URL(req.url);

    // Download endpoint: /api/files/:id?download=true
    if (url.searchParams.get("download") === "true") {
      const fileInfo = await fileService.getFilePath(id);
      const fileBuffer = fs.readFileSync(fileInfo.path);
      return new Response(new Uint8Array(fileBuffer), {
        headers: {
          "Content-Type": fileInfo.mimeType,
          "Content-Disposition": `attachment; filename="${fileInfo.originalName}"`,
        },
      });
    }

    // Default: return metadata
    return apiResponse(await fileService.getById(id));
  } catch (err) {
    return apiError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req);
    const { id } = await params;
    await fileService.delete(id);
    return apiResponse({ id });
  } catch (err) {
    return apiError(err);
  }
}
