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
  ChevronRight,
  Briefcase,
  Target,
  ListChecks,
  CalendarClock,
  Archive,
  Eye,
  FileCheck,
  Calculator,
  UserPlus,
  FolderKanban,
  Download,
  Activity,
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
  Tabs,
} from "@/modules/admin/components/ui";
import { WorkflowFlowCards } from "@/modules/admin/components/WorkflowFlowCards";
import { SRG_STATUS_FLOW, type SrgStatus } from "@/modules/admin/types";

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

const TABS = [
  { label: "Overview", value: "overview" },
  { label: "Business", value: "business" },
  { label: "Requirements", value: "requirements" },
  { label: "Workflow", value: "workflow" },
  { label: "Documents", value: "documents" },
  { label: "Proposal", value: "proposal" },
  { label: "Quotation", value: "quotation" },
  { label: "Activity", value: "activity" },
  { label: "Notes", value: "notes" },
];

export default function SrgDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { submissions, teamMembers, setStatusOf, updateNotes, assignTeam } = useAdmin();
  const submission = useMemo(
    () => submissions.find((s) => s.id === id || s.sessionId === id),
    [submissions, id]
  );

  const [activeTab, setActiveTab] = useState("overview");
  const [notesValue, setNotesValue] = useState(submission?.notes ?? "");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [actionTaken, setActionTaken] = useState<string | null>(null);

  // sync notes when submission changes
  const [lastId, setLastId] = useState<string | undefined>(submission?.id);
  if (submission && submission.id !== lastId) {
    setLastId(submission.id);
    setNotesValue(submission.notes ?? "");
  }

  if (!submission) {
    return (
      <PageTransition>
        <EmptyState
          icon={<X className="h-6 w-6" />}
          title="Submission not found"
          action={
            <Link href="/admin/submissions" className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[13px] font-medium" style={{ background: "var(--admin-accent)", color: "#0F172A" }}>
              <ArrowLeft className="h-4 w-4" />
              Back to Submissions
            </Link>
          }
        />
      </PageTransition>
    );
  }

  function handleAction(label: string, status: SrgStatus) {
    setStatusOf(submission!.id, status, label);
    setActionTaken(label);
    setTimeout(() => setActionTaken(null), 2400);
  }

  const assignedMembers = Object.entries(submission.assignedTeam)
    .filter(([, memberId]) => memberId)
    .map(([role, memberId]) => ({
      role,
      member: teamMembers.find((m) => m.id === memberId),
    }));

  return (
    <PageTransition>
      {/* Breadcrumb */}
      <Link
        href="/admin/submissions"
        className="inline-flex items-center gap-1.5 text-[12.5px] mb-4 transition-colors"
        style={{ color: "var(--admin-text-secondary)" }}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to SRG Submissions
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <StatusBadge status={submission.status} />
            <PriorityBadge priority={submission.priority} />
            <span className="text-[11.5px] font-mono" style={{ color: "var(--admin-text-muted)" }}>
              {submission.id}
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight" style={{ color: "var(--admin-text)" }}>
            {submission.projectName}
          </h1>
          <p className="mt-1 text-[13px]" style={{ color: "var(--admin-text-secondary)" }}>
            {submission.templateName} · Submitted {formatDate(submission.submittedAt)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="relative">
            <AdminButton variant="ghost" size="sm" onClick={() => setShowStatusMenu((v) => !v)}>
              <ChevronRight className="h-3.5 w-3.5" />
              Update Status
            </AdminButton>
            {showStatusMenu && (
              <div
                className="absolute right-0 top-10 w-52 rounded-xl border shadow-2xl overflow-hidden z-20 py-1"
                style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
              >
                {SRG_STATUS_FLOW.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      handleAction(`Marked as ${s}`, s);
                      setShowStatusMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-[12px] transition-colors flex items-center justify-between"
                    style={{
                      color: submission.status === s ? "var(--admin-accent)" : "var(--admin-text-secondary)",
                      background: submission.status === s ? "rgba(37,214,255,0.06)" : "transparent",
                    }}
                  >
                    {s}
                    {submission.status === s && <Check className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <AdminButton variant="ghost" size="sm" onClick={() => handleAction("Marked as Reviewing", "Reviewing")} icon={<Eye className="h-3.5 w-3.5" />}>
            Review
          </AdminButton>
          <AdminButton variant="ghost" size="sm" onClick={() => handleAction("Meeting scheduled", "Meeting Scheduled")} icon={<CalendarClock className="h-3.5 w-3.5" />}>
            Schedule
          </AdminButton>
          <AdminButton variant="ghost" size="sm" onClick={() => { setActiveTab("proposal"); setActionTaken("Switched to Proposal tab"); setTimeout(() => setActionTaken(null), 2000); }} icon={<FileCheck className="h-3.5 w-3.5" />}>
            Generate Proposal
          </AdminButton>
          <AdminButton variant="ghost" size="sm" onClick={() => { setActiveTab("quotation"); setActionTaken("Switched to Quotation tab"); setTimeout(() => setActionTaken(null), 2000); }} icon={<Calculator className="h-3.5 w-3.5" />}>
            Generate Quotation
          </AdminButton>
          <AdminButton variant="ghost" size="sm" onClick={() => handleAction("Team assigned", submission.status === "New" ? "Reviewing" : submission.status)} icon={<UserPlus className="h-3.5 w-3.5" />}>
            Assign Team
          </AdminButton>
          <AdminButton variant="primary" size="sm" onClick={() => handleAction("Converted to project", "Approved")} icon={<FolderKanban className="h-3.5 w-3.5" />}>
            Convert to Project
          </AdminButton>
          <AdminButton variant="ghost" size="sm" onClick={() => handleAction("Approved", "Approved")} icon={<Check className="h-3.5 w-3.5" />}>
            Approve
          </AdminButton>
          <AdminButton variant="danger" size="sm" onClick={() => handleAction("Rejected", "Rejected")} icon={<X className="h-3.5 w-3.5" />}>
            Reject
          </AdminButton>
          <AdminButton variant="outline" size="sm" onClick={() => handleAction("Archived", "Archived")} icon={<Archive className="h-3.5 w-3.5" />}>
            Archive
          </AdminButton>
        </div>
      </div>

      {/* Action confirmation */}
      {actionTaken && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-[12.5px]"
          style={{
            borderColor: "rgba(37,214,255,0.3)",
            background: "rgba(37,214,255,0.06)",
            color: "var(--admin-accent)",
          }}
        >
          <Check className="h-3.5 w-3.5" />
          {actionTaken}
        </motion.div>
      )}

      {/* Tabs */}
      <div className="mb-5">
        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab content */}
      <div className="space-y-5">
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AdminCard className="p-5">
                <SectionTitle eyebrow="Section 01" title="Client Information" icon={<Users className="h-4 w-4" />} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoRow icon={<Users className="h-3.5 w-3.5" />} label="Name" value={submission.client.fullName} />
                  <InfoRow icon={<Briefcase className="h-3.5 w-3.5" />} label="Job Title" value={submission.client.jobTitle} />
                  <InfoRow icon={<Building2 className="h-3.5 w-3.5" />} label="Company" value={submission.client.company} />
                  <InfoRow icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={submission.client.email} href={`mailto:${submission.client.email}`} />
                  <InfoRow icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={submission.client.phone} href={`tel:${submission.client.phone}`} />
                  <InfoRow icon={<Globe className="h-3.5 w-3.5" />} label="Country" value={submission.client.country} />
                </div>
              </AdminCard>

              <AdminCard className="p-5">
                <SectionTitle eyebrow="Section 02" title="Project Overview" icon={<Target className="h-4 w-4" />} />
                <div className="space-y-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] mb-1" style={{ color: "var(--admin-text-muted)" }}>Primary Goal</p>
                    <p className="text-[13px]" style={{ color: "var(--admin-text)" }}>{submission.goals.primaryGoal}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <InfoChip label="Deadline" value={submission.goals.deadline} />
                    <InfoChip label="Budget" value={submission.goals.budgetRange} />
                    <InfoChip label="Type" value={submission.projectType} />
                  </div>
                </div>
              </AdminCard>
            </div>
          </>
        )}

        {activeTab === "business" && (
          <AdminCard className="p-5">
            <SectionTitle eyebrow="Section 02" title="Business Information" icon={<Building2 className="h-4 w-4" />} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow label="Legal Name" value={submission.business.legalName} />
              <InfoRow label="Industry" value={submission.business.industry} />
              <InfoRow label="Company Size" value={submission.business.size} />
              <InfoRow label="Business Stage" value={submission.business.stage} />
              <InfoRow label="Annual Budget" value={submission.business.annualBudget} />
              <InfoRow label="Target Launch" value={submission.business.targetLaunch} />
            </div>
            {submission.business.description && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--admin-border)" }}>
                <p className="text-[11px] uppercase tracking-[0.15em] mb-1.5" style={{ color: "var(--admin-text-muted)" }}>Description</p>
                <p className="text-[13px]" style={{ color: "var(--admin-text)" }}>{submission.business.description}</p>
              </div>
            )}
            {submission.business.competitors && (
              <div className="mt-4">
                <p className="text-[11px] uppercase tracking-[0.15em] mb-1.5" style={{ color: "var(--admin-text-muted)" }}>Competitors</p>
                <p className="text-[13px]" style={{ color: "var(--admin-text)" }}>{submission.business.competitors}</p>
              </div>
            )}
          </AdminCard>
        )}

        {activeTab === "requirements" && (
          <AdminCard className="p-5">
            <SectionTitle
              eyebrow="Section 03"
              title="Software Requirement Gathering"
              description={`Captured via the ${submission.templateName} template`}
              icon={<ListChecks className="h-4 w-4" />}
            />
            {submission.srgSections && submission.srgSections.length > 0 ? (
              <div className="space-y-6">
                {submission.srgSections.map((section) => (
                  <div key={section.id}>
                    <p className="font-semibold text-[13.5px] mb-3" style={{ color: "var(--admin-text)" }}>{section.title}</p>
                    <div className="space-y-3 pl-4 border-l" style={{ borderColor: "var(--admin-border)" }}>
                      {section.questions.map((q) => (
                        <div key={q.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr] gap-2">
                          <p className="text-[12px]" style={{ color: "var(--admin-text-secondary)" }}>{q.label}</p>
                          <p className="text-[12.5px]" style={{ color: "var(--admin-text)" }}>
                            {formatAnswer(q.answer)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={<ListChecks className="h-5 w-5" />} title="No SRG answers captured" />
            )}
          </AdminCard>
        )}

        {activeTab === "workflow" && (
          <AdminCard className="p-5">
            <SectionTitle eyebrow="Section 04" title="Business Workflow" icon={<WorkflowIcon className="h-4 w-4" />} />
            {Object.values(submission.workflow).some((f) => f.enabled) ? (
              <WorkflowFlowCards workflow={submission.workflow} />
            ) : (
              <EmptyState icon={<WorkflowIcon className="h-5 w-5" />} title="No workflows defined" />
            )}
          </AdminCard>
        )}

        {activeTab === "documents" && (
          <AdminCard className="p-5">
            <SectionTitle
              eyebrow="Section 05"
              title="Uploaded Documents & Assets"
              description={`${submission.uploads.length} file${submission.uploads.length === 1 ? "" : "s"}`}
              icon={<FileText className="h-4 w-4" />}
            />
            {submission.uploads.length === 0 ? (
              <EmptyState icon={<FileText className="h-5 w-5" />} title="No files uploaded" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {submission.uploads.map((up) => (
                  <div
                    key={up.id}
                    className="rounded-xl border p-3 transition-colors"
                    style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface-2)" }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden flex items-center justify-center"
                        style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
                      >
                        {up.previewDataUrl && up.type.startsWith("image/") ? (
                          <img src={up.previewDataUrl} alt={up.name} className="h-full w-full object-cover" />
                        ) : (
                          <FileText className="h-5 w-5" style={{ color: "var(--admin-accent)" }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium truncate" style={{ color: "var(--admin-text)" }} title={up.name}>{up.name}</p>
                        <p className="text-[10.5px] mt-0.5" style={{ color: "var(--admin-text-secondary)" }}>
                          {formatFileSize(up.size)}
                          {up.pageCount ? ` · ${up.pageCount}p` : ""}
                          {up.width ? ` · ${up.width}×${up.height}` : ""}
                        </p>
                        <span
                          className="mt-1.5 inline-flex rounded border px-1.5 py-0.5 text-[9.5px] font-medium"
                          style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-accent)" }}
                        >
                          {up.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        )}

        {activeTab === "proposal" && (
          <AdminCard className="p-5">
            <SectionTitle
              eyebrow="Section 06"
              title="Proposal"
              action={
                <Link href={`/admin/submissions/${submission.id}/proposal`}>
                  <AdminButton variant="primary" size="sm" icon={<FileCheck className="h-3.5 w-3.5" />}>
                    {submission.proposal ? "Edit Proposal" : "Create Proposal"}
                  </AdminButton>
                </Link>
              }
            />
            {submission.proposal ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center rounded-md border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider"
                    style={{
                      background: submission.proposal.status === "accepted" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                      borderColor: submission.proposal.status === "accepted" ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)",
                      color: submission.proposal.status === "accepted" ? "#10B981" : "#F59E0B",
                    }}
                  >
                    {submission.proposal.status}
                  </span>
                  <span className="text-[11.5px]" style={{ color: "var(--admin-text-muted)" }}>
                    {submission.proposal.sections.length} sections · Updated {formatDate(submission.proposal.updatedAt)}
                  </span>
                </div>
                {submission.proposal.sections.filter((s) => s.content.trim()).slice(0, 3).map((section) => (
                  <div key={section.id} className="rounded-lg border p-3" style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface-2)" }}>
                    <p className="font-semibold text-[13px] mb-1" style={{ color: "var(--admin-text)" }}>{section.title}</p>
                    <p className="text-[12px] line-clamp-3" style={{ color: "var(--admin-text-secondary)" }}>{section.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<FileCheck className="h-5 w-5" />}
                title="No proposal created yet"
                action={
                  <Link href={`/admin/submissions/${submission.id}/proposal`}>
                    <AdminButton variant="primary" size="sm">Create Proposal</AdminButton>
                  </Link>
                }
              />
            )}
          </AdminCard>
        )}

        {activeTab === "quotation" && (
          <AdminCard className="p-5">
            <SectionTitle
              eyebrow="Section 07"
              title="Quotation"
              action={
                <Link href={`/admin/submissions/${submission.id}/quotation`}>
                  <AdminButton variant="primary" size="sm" icon={<Calculator className="h-3.5 w-3.5" />}>
                    {submission.quotation ? "Edit Quotation" : "Generate Quotation"}
                  </AdminButton>
                </Link>
              }
            />
            {submission.quotation ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center rounded-md border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider"
                    style={{
                      background: submission.quotation.status === "accepted" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                      borderColor: submission.quotation.status === "accepted" ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)",
                      color: submission.quotation.status === "accepted" ? "#10B981" : "#F59E0B",
                    }}
                  >
                    {submission.quotation.status}
                  </span>
                  <span className="text-[11.5px]" style={{ color: "var(--admin-text-muted)" }}>
                    {submission.quotation.items.length} line items
                  </span>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface-2)" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px]" style={{ color: "var(--admin-text-secondary)" }}>Total</span>
                    <span className="font-display text-[20px] font-bold" style={{ color: "var(--admin-accent)" }}>
                      {computeQuotationTotal(submission.quotation).toLocaleString("en-US", { style: "currency", currency: submission.quotation.currency })}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={<Calculator className="h-5 w-5" />}
                title="No quotation created yet"
                action={
                  <Link href={`/admin/submissions/${submission.id}/quotation`}>
                    <AdminButton variant="primary" size="sm">Generate Quotation</AdminButton>
                  </Link>
                }
              />
            )}
          </AdminCard>
        )}

        {activeTab === "activity" && (
          <AdminCard className="p-5">
            <SectionTitle eyebrow="Section 08" title="Activity Timeline" icon={<Activity className="h-4 w-4" />} />
            {submission.timeline.length > 0 ? (
              <div className="space-y-3">
                {submission.timeline.map((event, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className="h-3 w-3 rounded-full ring-4"
                        style={{ background: "var(--admin-accent)", boxShadow: "0 0 0 2px var(--admin-surface)" }}
                      />
                      {i < submission.timeline.length - 1 && (
                        <span className="w-px h-8 mt-1" style={{ background: "var(--admin-border)" }} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-[13px] font-medium" style={{ color: "var(--admin-text)" }}>{event.status}</p>
                      {event.timestamp && (
                        <p className="text-[11.5px] mt-0.5" style={{ color: "var(--admin-text-secondary)" }}>
                          {formatDate(event.timestamp)}
                        </p>
                      )}
                      {event.note && (
                        <p className="text-[12px] mt-1" style={{ color: "var(--admin-text-secondary)" }}>{event.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={<Activity className="h-5 w-5" />} title="No activity yet" />
            )}
          </AdminCard>
        )}

        {activeTab === "notes" && (
          <AdminCard className="p-5">
            <SectionTitle eyebrow="Section 09" title="Internal Notes" icon={<ShieldCheck className="h-4 w-4" />} />
            <textarea
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              onBlur={() => updateNotes(submission.id, notesValue)}
              placeholder="Add private notes about this submission..."
              className="w-full rounded-lg border px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 transition-all min-h-[120px] resize-y leading-relaxed"
              style={{
                background: "var(--admin-surface-2)",
                borderColor: "var(--admin-border)",
                color: "var(--admin-text)",
              }}
            />
            <p className="text-[11px] mt-2" style={{ color: "var(--admin-text-muted)" }}>
              Notes auto-save when you click away.
            </p>
          </AdminCard>
        )}
      </div>
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
      <a href={href} className="text-[13px] hover:underline" style={{ color: "var(--admin-accent)" }}>
        {value}
      </a>
    ) : (
      <span className="text-[13px]" style={{ color: "var(--admin-text)" }}>{value}</span>
    )
  ) : (
    <span className="text-[13px]" style={{ color: "var(--admin-text-muted)" }}>—</span>
  );
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] mb-1" style={{ color: "var(--admin-text-muted)" }}>
        {icon}
        {label}
      </p>
      {content}
    </div>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-2.5" style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface-2)" }}>
      <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--admin-text-muted)" }}>{label}</p>
      <p className="text-[12px] mt-0.5 capitalize" style={{ color: "var(--admin-text)" }}>{value || "—"}</p>
    </div>
  );
}

function formatAnswer(value: unknown): string {
  if (value === undefined || value === null || value === "") return "—";
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function computeQuotationTotal(q: { items: { qty: number; unitPrice: number }[]; taxRate: number; discount: number }): number {
  const subtotal = q.items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
  const discountAmount = (subtotal * q.discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const tax = (taxableAmount * q.taxRate) / 100;
  return taxableAmount + tax;
}
