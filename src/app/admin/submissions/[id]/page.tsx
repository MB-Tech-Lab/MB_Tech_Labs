"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  X,
  Mail,
  Phone,
  Globe,
  MapPin,
  Building2,
  Clock,
  FileText,
  Users,
  Workflow as WorkflowIcon,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Briefcase,
  Target,
  ListChecks,
  CalendarClock,
  Archive,
  Eye,
  Inbox,
} from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  AdminButton,
  StatusBadge,
  PriorityBadge,
  SectionTitle,
  PageTransition,
  EmptyState,
} from "@/modules/admin/components/ui";
import { WorkflowFlowCards } from "@/modules/admin/components/WorkflowFlowCards";
import type { ProjectStatus } from "@/modules/admin/types";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const UPLOAD_CATEGORY_COLORS: Record<string, string> = {
  Logo: "bg-cyan/10 border-cyan/25 text-cyan-soft",
  Certificates: "bg-emerald-400/10 border-emerald-400/25 text-emerald-200",
  "Brand Assets": "bg-violet-400/10 border-violet-400/25 text-violet-200",
  Documents: "bg-blue-400/10 border-blue-400/25 text-blue-200",
  Wireframes: "bg-amber-400/10 border-amber-400/25 text-amber-200",
  "Reference Images": "bg-pink-400/10 border-pink-400/25 text-pink-200",
  Videos: "bg-rose-400/10 border-rose-400/25 text-rose-200",
  "API Documents": "bg-teal-400/10 border-teal-400/25 text-teal-200",
  Data: "bg-orange-400/10 border-orange-400/25 text-orange-200",
  Legal: "bg-purple-400/10 border-purple-400/25 text-purple-200",
  Reference: "bg-slate-400/10 border-slate-400/25 text-slate-200",
};

export default function ProjectRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { submissions, setStatusOf, updateNotes } = useAdmin();
  const submission = useMemo(
    () => submissions.find((s) => s.id === id || s.sessionId === id),
    [submissions, id]
  );

  const [notesValue, setNotesValue] = useState(submission?.notes ?? "");
  const [actionTaken, setActionTaken] = useState<string | null>(null);

  // Re-sync notes when submission changes
  const lastId = useState<string | undefined>(submission?.id)[0];
  if (submission && submission.id !== lastId) {
    setNotesValue(submission.notes ?? "");
  }

  if (!submission) {
    return (
      <PageTransition>
        <EmptyState
          icon={<X className="h-6 w-6" />}
          title="Request not found"
          description="This request may have been archived or never existed."
          action={
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan text-ink font-medium text-[13px] px-4 py-2.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
          }
        />
      </PageTransition>
    );
  }

  function handleAction(label: string, status: ProjectStatus) {
    setStatusOf(submission!.id, status, label);
    setActionTaken(label);
    setTimeout(() => setActionTaken(null), 2400);
  }

  return (
    <PageTransition>
      {/* Breadcrumb + header */}
      <div className="mb-6">
        <Link
          href="/admin/submissions"
          className="inline-flex items-center gap-1.5 text-[12.5px] text-white/55 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Project Requests
        </Link>

        <div className="mt-4 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={submission.status} />
              <PriorityBadge priority={submission.priority} />
              <span className="text-[11.5px] text-white/40 font-mono">
                {submission.id}
              </span>
            </div>
            <h1 className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              {submission.projectName}
            </h1>
            <p className="mt-1.5 text-[13px] text-white/55">
              {submission.templateName} · Submitted{" "}
              {formatDate(submission.submittedAt)}
            </p>
          </div>

          {/* Phase 1 actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <AdminButton
              variant="ghost"
              size="sm"
              onClick={() => handleAction("Marked as Reviewing", "Reviewing")}
              icon={<Eye className="h-3.5 w-3.5" />}
            >
              Mark as Reviewing
            </AdminButton>
            <AdminButton
              variant="ghost"
              size="sm"
              onClick={() => handleAction("Meeting scheduled", "Meeting Scheduled")}
              icon={<CalendarClock className="h-3.5 w-3.5" />}
            >
              Schedule Meeting
            </AdminButton>
            <AdminButton
              variant="ghost"
              size="sm"
              onClick={() => handleAction("Request approved", "Approved")}
              icon={<Check className="h-3.5 w-3.5" />}
            >
              Approve Request
            </AdminButton>
            <AdminButton
              variant="danger"
              size="sm"
              onClick={() => handleAction("Request rejected", "Rejected")}
              icon={<X className="h-3.5 w-3.5" />}
            >
              Reject Request
            </AdminButton>
            <AdminButton
              variant="outline"
              size="sm"
              onClick={() => handleAction("Request archived", "Archived")}
              icon={<Archive className="h-3.5 w-3.5" />}
            >
              Archive
            </AdminButton>
          </div>
        </div>
      </div>

      {/* Action confirmation */}
      {actionTaken && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-5 inline-flex items-center gap-2 rounded-lg border border-cyan/30 bg-cyan/[0.06] px-3.5 py-2 text-[12.5px] text-cyan-soft"
        >
          <Check className="h-3.5 w-3.5" />
          {actionTaken}
        </motion.div>
      )}

      {/* Sections */}
      <div className="space-y-5">
        {/* Section 1: Client Information */}
        <AdminCard className="p-6">
          <SectionTitle
            eyebrow="Section 01"
            title="Client Information"
            icon={<Users className="h-4 w-4 text-cyan" />}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow
              icon={<Users className="h-3.5 w-3.5" />}
              label="Name"
              value={submission.client.fullName}
            />
            <InfoRow
              icon={<Briefcase className="h-3.5 w-3.5" />}
              label="Job Title"
              value={submission.client.jobTitle}
            />
            <InfoRow
              icon={<Building2 className="h-3.5 w-3.5" />}
              label="Company"
              value={submission.client.company}
            />
            <InfoRow
              icon={<Mail className="h-3.5 w-3.5" />}
              label="Email"
              value={submission.client.email}
              href={`mailto:${submission.client.email}`}
            />
            <InfoRow
              icon={<Phone className="h-3.5 w-3.5" />}
              label="Phone"
              value={submission.client.phone}
              href={`tel:${submission.client.phone}`}
            />
            <InfoRow
              icon={<Globe className="h-3.5 w-3.5" />}
              label="Website"
              value={submission.business.website}
              href={
                submission.business.website
                  ? `https://${submission.business.website.replace(/^https?:\/\//, "")}`
                  : undefined
              }
            />
            <InfoRow
              icon={<MapPin className="h-3.5 w-3.5" />}
              label="Country"
              value={submission.client.country}
            />
            <InfoRow
              icon={<Clock className="h-3.5 w-3.5" />}
              label="Timezone"
              value={submission.client.timezone}
            />
          </div>
        </AdminCard>

        {/* Section 2: Business Information */}
        <AdminCard className="p-6">
          <SectionTitle
            eyebrow="Section 02"
            title="Business Information"
            icon={<Building2 className="h-4 w-4 text-cyan" />}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow label="Legal Name" value={submission.business.legalName} />
            <InfoRow label="Industry" value={submission.business.industry} />
            <InfoRow label="Company Size" value={submission.business.size} />
            <InfoRow label="Business Stage" value={submission.business.stage} />
            <InfoRow label="Annual Budget" value={submission.business.annualBudget} />
            <InfoRow label="Target Launch" value={submission.business.targetLaunch} />
          </div>
          {submission.business.description && (
            <div className="mt-5 pt-5 border-t border-white/8">
              <p className="text-[11px] uppercase tracking-[0.15em] text-cyan-soft/70 mb-1.5">
                Business Description
              </p>
              <p className="text-[13px] text-white/75 leading-relaxed">
                {submission.business.description}
              </p>
            </div>
          )}
          {submission.business.competitors && (
            <div className="mt-4">
              <p className="text-[11px] uppercase tracking-[0.15em] text-cyan-soft/70 mb-1.5">
                Competitors
              </p>
              <p className="text-[13px] text-white/75 leading-relaxed">
                {submission.business.competitors}
              </p>
            </div>
          )}
        </AdminCard>

        {/* Section 3: Project Overview */}
        <AdminCard className="p-6">
          <SectionTitle
            eyebrow="Section 03"
            title="Project Overview"
            icon={<Target className="h-4 w-4 text-cyan" />}
          />
          <div className="space-y-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-cyan-soft/70 mb-1.5">
                Primary Goal
              </p>
              <p className="text-[13.5px] text-white/85 leading-relaxed">
                {submission.goals.primaryGoal}
              </p>
            </div>
            {submission.goals.secondaryGoals.length > 0 && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-cyan-soft/70 mb-2">
                  Secondary Goals
                </p>
                <div className="flex flex-wrap gap-2">
                  {submission.goals.secondaryGoals.map((g) => (
                    <span
                      key={g}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12px] text-white/75"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-cyan-soft/70 mb-1.5">
                Success Metrics
              </p>
              <p className="text-[13px] text-white/75 leading-relaxed">
                {submission.goals.successMetrics}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <InfoChip label="Deadline" value={submission.goals.deadline} />
              <InfoChip label="Budget Range" value={submission.goals.budgetRange} />
              <InfoChip label="Project Type" value={submission.projectType} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-cyan-soft/70 mb-2">
                Priorities
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {Object.entries(submission.goals.priorities).map(([key, val]) => (
                  <div
                    key={key}
                    className="rounded-lg border border-white/8 bg-white/[0.02] p-2.5"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-white/40 capitalize">
                      {key}
                    </p>
                    <p className="text-[16px] font-display font-semibold text-white mt-0.5">
                      {val}
                      <span className="text-[10px] text-white/40">/5</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AdminCard>

        {/* Section 4: Complete SRG (dynamic) */}
        {submission.srgSections && submission.srgSections.length > 0 && (
          <AdminCard className="p-6">
            <SectionTitle
              eyebrow="Section 04"
              title="Software Requirement Gathering"
              description={`Captured via the ${submission.templateName} template`}
              icon={<ListChecks className="h-4 w-4 text-cyan" />}
            />
            <div className="space-y-6">
              {submission.srgSections.map((section) => (
                <div key={section.id}>
                  <p className="font-display text-[13.5px] font-semibold text-white mb-3">
                    {section.title}
                  </p>
                  <div className="space-y-3 pl-4 border-l border-white/8">
                    {section.questions.map((q) => (
                      <div
                        key={q.id}
                        className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr] gap-2"
                      >
                        <p className="text-[12px] text-white/55">{q.label}</p>
                        <p className="text-[12.5px] text-white/85 break-words">
                          {formatAnswer(q.answer)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        )}

        {/* Section 5: Uploaded Documents & Assets */}
        <AdminCard className="p-6">
          <SectionTitle
            eyebrow="Section 05"
            title="Uploaded Documents & Assets"
            description={`${submission.uploads.length} file${submission.uploads.length === 1 ? "" : "s"} uploaded`}
            icon={<FileText className="h-4 w-4 text-cyan" />}
          />
          {submission.uploads.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-5 w-5" />}
              title="No files uploaded"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {submission.uploads.map((up) => {
                const catColor =
                  UPLOAD_CATEGORY_COLORS[up.category] ??
                  "bg-white/5 border-white/10 text-white/60";
                return (
                  <div
                    key={up.id}
                    className="rounded-xl border border-white/8 bg-white/[0.02] p-3 hover:border-cyan/25 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-white/[0.04] border border-white/10 flex items-center justify-center">
                        {up.previewDataUrl && up.type.startsWith("image/") ? (
                          <img
                            src={up.previewDataUrl}
                            alt={up.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FileText className="h-5 w-5 text-cyan/60" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[12px] font-medium text-white truncate"
                          title={up.name}
                        >
                          {up.name}
                        </p>
                        <p className="text-[10.5px] text-white/45 mt-0.5">
                          {formatFileSize(up.size)}
                          {up.pageCount ? ` • ${up.pageCount}p` : ""}
                          {up.width ? ` • ${up.width}×${up.height}` : ""}
                        </p>
                        <span
                          className={`mt-1.5 inline-flex rounded border px-1.5 py-0.5 text-[9.5px] font-medium ${catColor}`}
                        >
                          {up.category}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </AdminCard>

        {/* Section 6: Business Workflow */}
        {Object.values(submission.workflow).some((f) => f.enabled) && (
          <AdminCard className="p-6">
            <SectionTitle
              eyebrow="Section 06"
              title="Business Workflow"
              description="Flows captured during client discovery"
              icon={<WorkflowIcon className="h-4 w-4 text-cyan" />}
            />
            <WorkflowFlowCards workflow={submission.workflow} />
          </AdminCard>
        )}

        {/* Section 7: Internal Admin Notes */}
        <AdminCard className="p-6">
          <SectionTitle
            eyebrow="Section 07"
            title="Internal Admin Notes"
            description="Private notes for the MB Tech Labs team — not visible to the client."
            icon={<ShieldCheck className="h-4 w-4 text-cyan" />}
          />
          <textarea
            value={notesValue}
            onChange={(e) => setNotesValue(e.target.value)}
            onBlur={() => updateNotes(submission.id, notesValue)}
            placeholder="Add private notes about this request..."
            className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3.5 py-2.5 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/50 focus:ring-2 focus:ring-cyan/15 transition-all min-h-[120px] resize-y leading-relaxed"
          />
          <p className="text-[11px] text-white/40 mt-2">
            Notes auto-save when you click away.
          </p>
        </AdminCard>
      </div>

      {/* Lifecycle snapshot */}
      <AdminCard strong className="mt-6 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-cyan" />
          <h3 className="font-display text-[13.5px] font-semibold text-white">
            Request Lifecycle
          </h3>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(["New", "Reviewing", "Meeting Scheduled", "Approved", "Rejected", "Archived"] as const).map(
            (status, idx) => {
              const event = submission.timeline.find((t) => t.status === status);
              const isCurrent = submission.status === status;
              const isPast =
                submission.timeline.findIndex((t) => t.status === submission.status) >
                submission.timeline.findIndex((t) => t.status === status);
              return (
                <div key={status} className="flex items-center gap-1.5 shrink-0">
                  <div
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] transition-all ${
                      isCurrent
                        ? "bg-cyan/15 border-cyan/40 text-white"
                        : isPast
                        ? "bg-emerald-400/[0.06] border-emerald-400/20 text-emerald-200/70"
                        : "bg-white/[0.02] border-white/8 text-white/40"
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-70">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {status}
                    {isCurrent && (
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan pulse-ring" />
                    )}
                  </div>
                  {idx < 5 && <ChevronRight className="h-3 w-3 text-white/20" />}
                </div>
              );
            }
          )}
        </div>
        {submission.timeline.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/8">
            <p className="text-[10.5px] uppercase tracking-wider text-white/40 mb-2">
              Timeline
            </p>
            <div className="space-y-1.5">
              {submission.timeline.map((event, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-[11.5px] text-white/55"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan/60" />
                  <span className="text-white/75 font-medium">{event.status}</span>
                  {event.timestamp && (
                    <span className="text-white/40">· {formatDate(event.timestamp)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </AdminCard>
    </PageTransition>
  );
}

/* --------------------------- Helpers --------------------------- */

function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  href?: string;
}) {
  const content = value ? (
    href ? (
      <a
        href={href}
        className="text-[13px] text-cyan-soft hover:text-cyan transition-colors break-words"
      >
        {value}
      </a>
    ) : (
      <span className="text-[13px] text-white/85 break-words">{value}</span>
    )
  ) : (
    <span className="text-[13px] text-white/30">—</span>
  );
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-white/40 mb-1">
        {icon}
        {label}
      </p>
      {content}
    </div>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/[0.02] p-2.5">
      <p className="text-[10px] uppercase tracking-wider text-white/40">{label}</p>
      <p className="text-[12px] text-white/85 mt-0.5 capitalize">{value || "—"}</p>
    </div>
  );
}

function formatAnswer(value: unknown): string {
  if (value === undefined || value === null || value === "") return "—";
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "—";
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}
