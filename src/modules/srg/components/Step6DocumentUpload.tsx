"use client";

import { useSrg } from "../context/SRGContext";
import { GlassCard, AnimateIn } from "./ui";
import { getTemplate } from "../templates";
import {
  ingestFileBatch,
  formatFileSize,
  getFileTypeLabel,
  canPreviewImage,
  canPreviewVideo,
  isPdf,
  revokePreviewUrl,
  UPLOAD_CATEGORIES,
} from "../services/uploads";
import type { TemplateUploadRequirement, UploadFileMeta } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  File as FileIcon,
  Image as ImageIcon,
  FileText,
  Film,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileArchive,
  Sheet,
  Presentation,
  FileWarning,
} from "lucide-react";
import { useRef, useState } from "react";
import type { ComponentType } from "react";

function getFileIcon(type: string): ComponentType<{ className?: string }> {
  if (canPreviewImage(type)) return ImageIcon;
  if (canPreviewVideo(type)) return Film;
  if (isPdf(type)) return FileText;
  if (type.includes("excel") || type.includes("sheet")) return Sheet;
  if (type.includes("presentation")) return Presentation;
  if (type.includes("zip") || type.includes("compressed")) return FileArchive;
  if (type.includes("word")) return FileText;
  return FileIcon;
}

export function Step6DocumentUpload() {
  const { session, addUpload, enrichUploadMetadata, removeUpload } = useSrg();
  const template = getTemplate(session.selectedTemplateId);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  if (!template) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-white/60">Please select a project template first.</p>
      </GlassCard>
    );
  }

  // filter uploads
  const filteredUploads =
    activeCategory === "all"
      ? session.uploads
      : session.uploads.filter((u) => u.category === activeCategory);

  return (
    <div className="space-y-8">
      <AnimateIn>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
            Step 06
          </span>
          <h1 className="mt-5 font-display text-3xl sm:text-4xl md:text-[40px] font-semibold text-white tracking-tight leading-[1.1]">
            Document upload{" "}
            <span className="text-gradient-cyan">center</span>
          </h1>
          <p className="mt-3 text-[14.5px] text-white/55 max-w-xl">
            Upload supporting documents, brand assets, sample data, and
            reference materials. Files are processed locally in your browser
            — previews and metadata are extracted on the fly.
          </p>
        </div>
      </AnimateIn>

      {/* Required upload slots */}
      <div className="space-y-4">
        <AnimateIn delay={0.08}>
          <h2 className="font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-white/80">
            Required Uploads
          </h2>
        </AnimateIn>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {template.uploadRequirements.map((req, i) => (
            <AnimateIn key={i} delay={0.1 + i * 0.04}>
              <UploadSlot
                requirement={req}
                uploads={session.uploads.filter(
                  (u) => u.category === req.category
                )}
                onAdd={(files) => {
                  const results = ingestFileBatch(files, req.category, req);
                  results.forEach((r) => {
                    addUpload(r.meta);
                    if (r.needsAsyncMetadata) {
                      enrichUploadMetadata(r.meta.id);
                    }
                  });
                }}
                onRemove={removeUpload}
              />
            </AnimateIn>
          ))}
        </div>
      </div>

      {/* All uploads (categorized) */}
      <AnimateIn delay={0.2}>
        <GlassCard strong className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="font-display text-[15px] font-semibold text-white">
                Upload Queue
              </h2>
              <p className="text-[12px] text-white/45 mt-0.5">
                {session.uploads.length} file{session.uploads.length === 1 ? "" : "s"} •{" "}
                {formatFileSize(
                  session.uploads.reduce((n, u) => n + u.size, 0)
                )}{" "}
                total
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <CategoryChip
                label="All"
                active={activeCategory === "all"}
                onClick={() => setActiveCategory("all")}
              />
              {UPLOAD_CATEGORIES.map((c) => (
                <CategoryChip
                  key={c.value}
                  label={c.label}
                  active={activeCategory === c.value}
                  onClick={() => setActiveCategory(c.value)}
                />
              ))}
            </div>
          </div>

          {filteredUploads.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] py-12 text-center">
              <FileWarning className="h-8 w-8 text-white/30 mx-auto" />
              <p className="mt-3 text-[13px] text-white/45">
                No files in this category yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <AnimatePresence>
                {filteredUploads.map((u) => (
                  <FileCard key={u.id} meta={u} onRemove={removeUpload} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </GlassCard>
      </AnimateIn>
    </div>
  );
}

/* --------------------------- Upload slot --------------------------- */

function UploadSlot({
  requirement,
  uploads,
  onAdd,
  onRemove,
}: {
  requirement: TemplateUploadRequirement;
  uploads: UploadFileMeta[];
  onAdd: (files: FileList | File[]) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const slotUploads = uploads.slice(
    0,
    requirement.multiple ? undefined : 1
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      onAdd(e.dataTransfer.files);
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`glass-panel rounded-2xl p-5 transition-all duration-300 ${
        isDragging
          ? "border-cyan/50 ring-2 ring-cyan/20 bg-cyan/[0.04]"
          : ""
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={requirement.accept.join(",")}
        multiple={requirement.multiple}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onAdd(e.target.files);
            e.target.value = "";
          }
        }}
        className="hidden"
      />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display font-semibold text-[14.5px] text-white">
              {requirement.label}
            </h3>
            {requirement.required && (
              <span className="rounded-full bg-cyan/15 border border-cyan/30 px-1.5 py-0.5 text-[9.5px] uppercase tracking-wider text-cyan-soft">
                Required
              </span>
            )}
          </div>
          {requirement.description && (
            <p className="text-[12px] text-white/45 mt-0.5">
              {requirement.description}
            </p>
          )}
          <p className="text-[11px] text-white/35 mt-1.5">
            Max {requirement.maxSizeMB}MB •{" "}
            {requirement.accept
              .map((t) => getFileTypeLabel(t).split(" ")[0])
              .join(", ")}
          </p>
        </div>
      </div>

      {slotUploads.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`w-full rounded-xl border border-dashed py-7 px-4 text-center transition-all ${
            isDragging
              ? "border-cyan/60 bg-cyan/[0.06]"
              : "border-white/15 bg-white/[0.02] hover:border-cyan/40 hover:bg-white/[0.04]"
          }`}
        >
          <UploadCloud className="h-6 w-6 text-cyan/70 mx-auto" />
          <p className="mt-2 text-[13px] text-white/70 font-medium">
            Drop files here or click to browse
          </p>
          <p className="text-[11px] text-white/35 mt-1">
            {requirement.multiple
              ? "Multiple files allowed"
              : "Single file only"}
          </p>
        </button>
      ) : (
        <div className="space-y-2">
          {slotUploads.map((u) => (
            <FileCard key={u.id} meta={u} onRemove={onRemove} compact />
          ))}
          {requirement.multiple && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2 text-[12px] text-white/60 hover:bg-white/[0.05] hover:text-white transition-all"
            >
              + Add more files
            </button>
          )}
          {!requirement.multiple && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2 text-[12px] text-white/60 hover:bg-white/[0.05] hover:text-white transition-all inline-flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="h-3 w-3" />
              Replace file
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* --------------------------- File card --------------------------- */

function FileCard({
  meta,
  onRemove,
  compact = false,
}: {
  meta: UploadFileMeta;
  onRemove: (id: string) => void;
  compact?: boolean;
}) {
  const statusBadge = {
    ready: { label: "Ready", color: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30", icon: CheckCircle2 },
    queued: { label: "Queued", color: "bg-amber-400/15 text-amber-300 border-amber-400/30", icon: RefreshCw },
    processing: { label: "Processing", color: "bg-cyan/15 text-cyan border-cyan/30", icon: RefreshCw },
    error: { label: "Error", color: "bg-rose-400/15 text-rose-300 border-rose-400/30", icon: AlertCircle },
    rejected: { label: "Rejected", color: "bg-rose-400/15 text-rose-300 border-rose-400/30", icon: AlertCircle },
  }[meta.status];

  const StatusIcon = statusBadge.icon;

  // Render the correct icon statically — avoid dynamic component lookup
  // which trips the react-hooks/static-components lint rule.
  function renderFileIcon() {
    if (canPreviewImage(meta.type)) return <ImageIcon className="h-6 w-6 text-cyan/70" />;
    if (canPreviewVideo(meta.type)) return <Film className="h-6 w-6 text-cyan/70" />;
    if (isPdf(meta.type)) return <FileText className="h-6 w-6 text-cyan/70" />;
    if (meta.type.includes("excel") || meta.type.includes("sheet")) return <Sheet className="h-6 w-6 text-cyan/70" />;
    if (meta.type.includes("presentation")) return <Presentation className="h-6 w-6 text-cyan/70" />;
    if (meta.type.includes("zip") || meta.type.includes("compressed")) return <FileArchive className="h-6 w-6 text-cyan/70" />;
    if (meta.type.includes("word")) return <FileText className="h-6 w-6 text-cyan/70" />;
    return <FileIcon className="h-6 w-6 text-cyan/70" />;
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`relative glass-panel rounded-xl overflow-hidden group ${
        compact ? "p-3" : "p-3"
      }`}
    >
      <div className="flex gap-3">
        {/* preview */}
        <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-white/[0.04] border border-white/10 flex items-center justify-center">
          {canPreviewImage(meta.type) && meta.previewUrl ? (
            <img
              src={meta.previewUrl}
              alt={meta.name}
              className="h-full w-full object-cover"
            />
          ) : canPreviewVideo(meta.type) && meta.previewUrl ? (
            <video
              src={meta.previewUrl}
              className="h-full w-full object-cover"
              muted
            />
          ) : (
            renderFileIcon()
          )}
        </div>

        {/* info */}
        <div className="flex-1 min-w-0">
          <p className="text-[12.5px] font-medium text-white truncate" title={meta.name}>
            {meta.name}
          </p>
          <p className="text-[11px] text-white/40 mt-0.5">
            {getFileTypeLabel(meta.type)} • {formatFileSize(meta.size)}
          </p>
          {/* metadata chips */}
          <div className="flex flex-wrap gap-1 mt-1.5">
            {meta.width && meta.height && (
              <span className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[9.5px] text-white/40">
                {meta.width}×{meta.height}
              </span>
            )}
            {meta.durationSec != null && (
              <span className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[9.5px] text-white/40">
                {Math.round(meta.durationSec)}s
              </span>
            )}
            {meta.pageCount != null && (
              <span className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[9.5px] text-white/40">
                {meta.pageCount}p
              </span>
            )}
            <span className={`rounded border px-1.5 py-0.5 text-[9.5px] inline-flex items-center gap-1 ${statusBadge.color}`}>
              <StatusIcon className={`h-2.5 w-2.5 ${meta.status === "processing" ? "animate-spin" : ""}`} />
              {statusBadge.label}
            </span>
          </div>
          {meta.error && (
            <p className="text-[10.5px] text-rose-300 mt-1">{meta.error}</p>
          )}
        </div>

        {/* remove */}
        <button
          type="button"
          onClick={() => {
            revokePreviewUrl(meta);
            onRemove(meta.id);
          }}
          aria-label="Remove file"
          className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-lg text-white/40 hover:text-rose-300 hover:bg-rose-400/10 transition-all"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

/* --------------------------- Category chip --------------------------- */

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-[11.5px] font-medium transition-all ${
        active
          ? "bg-cyan/15 border border-cyan/40 text-white"
          : "bg-white/[0.03] border border-white/10 text-white/55 hover:border-white/20"
      }`}
    >
      {label}
    </button>
  );
}
