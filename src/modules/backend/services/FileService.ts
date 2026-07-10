/**
 * File Service
 * ------------
 * Handles file uploads (PDF, DOCX, images, ZIP), storage in /uploads,
 * and metadata persistence in the Document table.
 */
import { db } from "@/lib/db";
import { ApiError } from "../utils/ApiError";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "application/zip",
  "application/x-zip-compressed",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "text/csv",
  "application/json",
  "video/mp4",
  "video/quicktime",
];

export class FileService {
  async upload(
    file: File,
    entityType: string,
    entityId: string,
    category: string | null,
    userId?: string
  ) {
    // Validate
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw ApiError.badRequest(`File type ${file.type} is not allowed`);
    }
    if (file.size > MAX_FILE_SIZE) {
      throw ApiError.badRequest(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
    }

    // Generate unique filename
    const ext = path.extname(file.name);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filepath, buffer);

    // Persist metadata to database
    const document = await db.document.create({
      data: {
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        path: `/uploads/${filename}`,
        category,
        entityType,
        entityId,
        ...(userId ? { uploadedById: userId } : {}),
      },
    });

    return document;
  }

  async list(query: {
    entityType?: string;
    entityId?: string;
    category?: string;
  }) {
    const where: Record<string, unknown> = {};
    if (query.entityType) where.entityType = query.entityType;
    if (query.entityId) where.entityId = query.entityId;
    if (query.category) where.category = query.category;

    return db.document.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: true,
      },
    });
  }

  async getById(id: string) {
    const doc = await db.document.findUnique({
      where: { id },
      include: { uploadedBy: true },
    });
    if (!doc) throw ApiError.notFound("File not found");
    return doc;
  }

  async getFilePath(id: string): Promise<{ path: string; originalName: string; mimeType: string }> {
    const doc = await this.getById(id);
    const fullPath = path.join(process.cwd(), doc.path.replace(/^\//, ""));
    if (!fs.existsSync(fullPath)) {
      throw ApiError.notFound("File not found on disk");
    }
    return { path: fullPath, originalName: doc.originalName, mimeType: doc.mimeType };
  }

  async delete(id: string) {
    const doc = await this.getById(id);
    const fullPath = path.join(process.cwd(), doc.path.replace(/^\//, ""));
    // Delete file from disk
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
    // Delete metadata from database
    await db.document.delete({ where: { id } });
    return { id };
  }
}

export const fileService = new FileService();
