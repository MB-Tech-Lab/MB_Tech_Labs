/**
 * Upload Engine
 * -------------
 * Pure in-browser file upload manager. Handles:
 *   - Drag & drop and file picker ingestion
 *   - File type + size validation (template-driven)
 *   - Preview URL generation (images / videos / PDFs / generic icons)
 *   - Metadata extraction (image dimensions, video duration, PDF page count)
 *   - Replace / delete / queue operations
 *   - Categorization by upload category
 *
 * File objects and preview URLs are kept in memory only — they cannot
 * survive a page refresh. The storage engine persists metadata so the
 * UI can prompt the user to re-upload after recovery.
 */
import {
  ACCEPTED_UPLOAD_TYPES,
  MAX_UPLOAD_MB,
} from "../engine/schemas";
import type {
  TemplateUploadRequirement,
  UploadFileMeta,
  UploadCategory,
  UploadStatus,
} from "../types";

/* --------------------------- Utilities --------------------------- */

function generateId(): string {
  return `up_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

const MAX_SIZE_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

const TYPE_LABELS: Record<string, string> = {
  "image/png": "PNG Image",
  "image/jpeg": "JPEG Image",
  "image/webp": "WebP Image",
  "image/gif": "GIF Image",
  "image/svg+xml": "SVG Vector",
  "application/pdf": "PDF Document",
  "application/zip": "ZIP Archive",
  "application/x-zip-compressed": "ZIP Archive",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel Workbook",
  "application/vnd.ms-excel": "Excel Workbook",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word Document",
  "application/msword": "Word Document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PowerPoint",
  "application/vnd.ms-powerpoint": "PowerPoint",
  "video/mp4": "MP4 Video",
  "video/quicktime": "MOV Video",
  "video/webm": "WebM Video",
  "text/csv": "CSV File",
  "application/json": "JSON File",
};

export function getFileTypeLabel(mimeType: string): string {
  return TYPE_LABELS[mimeType] ?? "File";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/* --------------------------- Validation --------------------------- */

export interface ValidationResult {
  ok: boolean;
  error?: string;
  status: UploadStatus;
}

export function validateFile(
  file: File,
  requirement?: TemplateUploadRequirement
): ValidationResult {
  // global type check
  if (!ACCEPTED_UPLOAD_TYPES.includes(file.type)) {
    return {
      ok: false,
      error: `Unsupported file type: ${file.type || "unknown"}`,
      status: "rejected",
    };
  }
  // global size check
  if (file.size > MAX_SIZE_BYTES) {
    return {
      ok: false,
      error: `File exceeds ${MAX_UPLOAD_MB}MB limit`,
      status: "rejected",
    };
  }
  // template-driven type check
  if (requirement && requirement.accept.length > 0) {
    if (!requirement.accept.includes(file.type)) {
      return {
        ok: false,
        error: `Allowed types: ${requirement.accept
          .map((t) => TYPE_LABELS[t] ?? t)
          .join(", ")}`,
        status: "rejected",
      };
    }
  }
  // template-driven size check
  if (requirement) {
    const reqMaxBytes = requirement.maxSizeMB * 1024 * 1024;
    if (file.size > reqMaxBytes) {
      return {
        ok: false,
        error: `File exceeds ${requirement.maxSizeMB}MB limit for this slot`,
        status: "rejected",
      };
    }
  }
  return { ok: true, status: "ready" };
}

/* --------------------------- Preview URL --------------------------- */

const PREVIEWABLE_IMAGE = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];
const PREVIEWABLE_VIDEO = ["video/mp4", "video/webm", "video/quicktime"];

export function canPreviewImage(type: string): boolean {
  return PREVIEWABLE_IMAGE.includes(type);
}
export function canPreviewVideo(type: string): boolean {
  return PREVIEWABLE_VIDEO.includes(type);
}
export function isPdf(type: string): boolean {
  return type === "application/pdf";
}

export function createPreviewUrl(file: File): string | null {
  if (canPreviewImage(file.type) || canPreviewVideo(file.type) || isPdf(file.type)) {
    return URL.createObjectURL(file);
  }
  return null;
}

/* --------------------------- Metadata extraction --------------------------- */

/**
 * Extracts metadata from a file (image dimensions, video duration,
 * PDF page count, last-modified). All async — returns a promise.
 */
export async function extractMetadata(
  file: File
): Promise<Partial<UploadFileMeta>> {
  const meta: Partial<UploadFileMeta> = {
    lastModified: file.lastModified,
  };

  if (canPreviewImage(file.type)) {
    const dims = await getImageDimensions(file).catch(() => null);
    if (dims) {
      meta.width = dims.width;
      meta.height = dims.height;
    }
  } else if (canPreviewVideo(file.type)) {
    const vmeta = await getVideoMetadata(file).catch(() => null);
    if (vmeta) {
      meta.width = vmeta.width;
      meta.height = vmeta.height;
      meta.durationSec = vmeta.duration;
    }
  } else if (isPdf(file.type)) {
    const pages = await getPdfPageCount(file).catch(() => null);
    if (pages != null) meta.pageCount = pages;
  }

  return meta;
}

function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

function getVideoMetadata(
  file: File
): Promise<{ width: number; height: number; duration: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
      });
      URL.revokeObjectURL(url);
    };
    video.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    video.src = url;
  });
}

/**
 * Best-effort PDF page count. We avoid pulling in pdf.js for the runtime
 * engine — instead we count "/Type /Page" occurrences in the raw bytes.
 * This works for most PDFs and is good enough for metadata hints.
 */
async function getPdfPageCount(file: File): Promise<number | null> {
  try {
    const buf = await file.slice(0, Math.min(file.size, 5 * 1024 * 1024)).arrayBuffer();
    const bytes = new Uint8Array(buf);
    const text = new TextDecoder("latin1").decode(bytes);
    const matches = text.match(/\/Type\s*\/Page[^s]/g);
    return matches ? matches.length : null;
  } catch {
    return null;
  }
}

/* --------------------------- Upload ingestion --------------------------- */

export interface IngestResult {
  meta: UploadFileMeta;
  needsAsyncMetadata: boolean;
}

/**
 * Ingest a single file. Validates, creates preview URL, and prepares
 * the metadata shell. Image/video/PDF metadata extraction is async and
 * the caller should call `extractMetadata` afterwards to enrich the meta.
 */
export function ingestFile(
  file: File,
  category: UploadCategory,
  requirement?: TemplateUploadRequirement
): IngestResult {
  const validation = validateFile(file, requirement);
  const previewUrl = validation.ok ? createPreviewUrl(file) : null;
  const meta: UploadFileMeta = {
    id: generateId(),
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    category,
    previewUrl,
    status: validation.status,
    error: validation.error,
    uploadedAt: Date.now(),
    lastModified: file.lastModified,
  };
  return {
    meta,
    needsAsyncMetadata: validation.ok,
  };
}

/**
 * Process a list of dropped/selected files for a given requirement slot.
 * Returns ready-to-add metas. Caller is responsible for adding to state.
 */
export function ingestFileBatch(
  files: FileList | File[],
  category: UploadCategory,
  requirement?: TemplateUploadRequirement
): IngestResult[] {
  const arr = Array.from(files);
  return arr.map((f) => ingestFile(f, category, requirement));
}

/* --------------------------- Cleanup --------------------------- */

export function revokePreviewUrl(meta: UploadFileMeta): void {
  if (meta.previewUrl) {
    try {
      URL.revokeObjectURL(meta.previewUrl);
    } catch {
      /* ignore */
    }
  }
}

/* --------------------------- Category helpers --------------------------- */

export const UPLOAD_CATEGORIES: {
  value: UploadCategory;
  label: string;
  description: string;
}[] = [
  { value: "branding", label: "Branding", description: "Logos, brand guidelines, fonts" },
  { value: "documents", label: "Documents", description: "PRDs, process flows, specs" },
  { value: "media", label: "Media", description: "Images, videos, audio" },
  { value: "data", label: "Data", description: "CSV, Excel, JSON samples" },
  { value: "legal", label: "Legal", description: "Certificates, contracts, licenses" },
  { value: "reference", label: "Reference", description: "Competitor screenshots, inspiration" },
];
