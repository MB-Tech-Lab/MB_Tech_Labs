"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  UserPlus,
  FileCheck,
  Calculator,
  Check,
  X,
  Mail,
  Phone,
  Globe,
  MapPin,
  Building2,
  Calendar,
  Clock,
  FileText,
  Download,
  Users,
  Workflow as WorkflowIcon,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Briefcase,
  Target,
  ListChecks,
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
import { ProjectTimeline } from "@/modules/admin/components/ProjectTimeline";
import { PROJECT_STATUS_FLOW } from "@/modules/admin/types";
import type { ProjectStatus, Priority } from "@/modules/admin/types";

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

export default function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { submissions, teamMembers, setStatusOf, setPriorityOf, updateNotes } =
    useAdmin();
  const submission = useMemo(
    () => submissions.find((s) => s.id === id || s.sessionId === id),
    [submissions, id]
  );

  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [notesValue, setNotesValue] = useState(submission?.notes ?? "");

  if (!submission) {
    return (
      <PageTransition>
        <EmptyState
          icon={<X className="h-6 w-6" />}
          title="Submission not found"
          description="This submission may have been deleted or never existed."
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

  const assignedMembers = Object.entries(submission.assignedTeam)
    .filter(([, memberId]) => memberId)
    .map(([role, memberId]) => ({
      role,
      member: teamMembers.find((m) => m.id === memberId),
    }));

  return (
    <PageTransition>
      {/* Breadcrumb + header */}
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-[12.5px] text-white/55 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to dashboard
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
              {submission.templateName} • Submitted{" "}
              {formatDate(submission.submittedAt)}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="relative">
              <AdminButton
                variant="ghost"
                size="sm"
                onClick={() => setShowStatusMenu((v) => !v)}
                icon={<ChevronRight className="h-3.5 w-3.5" />}
              >
                Update Status
              </AdminButton>
              {showStatusMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-10 w-56 glass-panel-strong rounded-xl overflow-hidden z-20"
                >
                  <div className="max-h-72 overflow-y-auto py-1">
                    {PROJECT_STATUS_FLOW.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setStatusOf(submission.id, s as ProjectStatus);
                          setShowStatusMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-[12px] hover:bg-white/[0.04] transition-colors flex items-center justify-between ${
                          submission.status === s
                            ? "text-cyan-soft bg-cyan/[0.06]"
                            : "text-white/75"
                        }`}
                      >
                        {s}
                        {submission.status === s && (
                          <Check className="h-3 w-3" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            <Link href={`/admin/submissions/${submission.id}/team`}>
              <AdminButton variant="ghost" size="sm" icon={<UserPlus className="h-3.5 w-3.5" />}>
                Assign Team
              </AdminButton>
            </Link>
            <Link href={`/admin/submissions/${submission.id}/proposal`}>
              <AdminButton variant="ghost" size="sm" icon={<FileCheck className="h-3.5 w-3.5" />}>
                Create Proposal
              </AdminButton>
            </Link>
            <Link href={`/admin/submissions/${submission.id}/quotation`}>
              <AdminButton variant="primary" size="sm" icon={<Calculator className="h-3.5 w-3.5" />}>
                Generate Quotation
              </AdminButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Layout: main content + sidebar timeline */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        {/* Main column */}
        <div className="space-y-5 min-w-0">
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
              <InfoRow
                label="Legal Name"
                value={submission.business.legalName}
              />
              <InfoRow label="Industry" value={submission.business.industry} />
              <InfoRow
                label="Company Size"
                value={submission.business.size}
              />
              <InfoRow
                label="Business Stage"
                value={submission.business.stage}
              />
              <InfoRow
                label="Annual Budget"
                value={submission.business.annualBudget}
              />
              <InfoRow
                label="Target Launch"
                value={submission.business.targetLaunch}
              />
            </div>
            {submission.business.mission && (
              <div className="mt-5 pt-5 border-t border-white/8">
                <p className="text-[11px] uppercase tracking-[0.15em] text-cyan-soft/70 mb-1.5">
                  Mission
                </p>
                <p className="text-[13px] text-white/75 leading-relaxed">
                  {submission.business.mission}
                </p>
              </div>
            )}
            {submission.business.vision && (
              <div className="mt-4">
                <p className="text-[11px] uppercase tracking-[0.15em] text-cyan-soft/70 mb-1.5">
                  Vision
                </p>
                <p className="text-[13px] text-white/75 leading-relaxed">
                  {submission.business.vision}
                </p>
              </div>
            )}
            {submission.business.targetAudience && (
              <div className="mt-4">
                <p className="text-[11px] uppercase tracking-[0.15em] text-cyan-soft/70 mb-1.5">
                  Target Audience
                </p>
                <p className="text-[13px] text-white/75 leading-relaxed">
                  {submission.business.targetAudience}
                </p>
              </div>
            )}
            {submission.business.description && (
              <div className="mt-4">
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

          {/* Section 3: Project Goals & Requirements */}
          <AdminCard className="p-6">
            <SectionTitle
              eyebrow="Section 03"
              title="Project Goals & Requirements"
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
                <InfoChip
                  label="Project Type"
                  value={submission.projectType}
                />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-cyan-soft/70 mb-2">
                  Priorities
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {Object.entries(submission.goals.priorities).map(
                    ([key, val]) => (
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
                    )
                  )}
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Section 4: Dynamic SRG Questions */}
          {submission.srgSections && submission.srgSections.length > 0 && (
            <AdminCard className="p-6">
              <SectionTitle
                eyebrow="Section 04"
                title="SRG Discovery Answers"
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
                        <div key={q.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr] gap-2">
                          <p className="text-[12px] text-white/55">{q.label}</p>
                          <p className="text-[12.5px] text-white/85 break-words">
                            {formatAnswer(q.answer, q.type)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>
          )}

          {/* Section 5: Upload Center */}
          <AdminCard className="p-6">
            <SectionTitle
              eyebrow="Section 05"
              title="Upload Center"
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

          {/* Section 6: Team Requirements */}
          <AdminCard className="p-6">
            <SectionTitle
              eyebrow="Section 06"
              title="Team Requirements"
              icon={<Users className="h-4 w-4 text-cyan" />}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-cyan-soft/70 mb-2">
                  Required Roles
                </p>
                {submission.teamRequirements.roles.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {submission.teamRequirements.roles.map((r) => (
                      <span
                        key={r}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11.5px] text-white/70"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[12px] text-white/40">Not specified</p>
                )}
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-cyan-soft/70 mb-2">
                  Permissions
                </p>
                {submission.teamRequirements.permissions.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {submission.teamRequirements.permissions.map((p) => (
                      <span
                        key={p}
                        className="rounded-md border border-cyan/20 bg-cyan/[0.06] px-2 py-1 text-[11.5px] text-cyan-soft"
                      >
                        <ShieldCheck className="inline h-3 w-3 mr-1" />
                        {p}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[12px] text-white/40">Not specified</p>
                )}
              </div>
              {submission.teamRequirements.approvalHierarchy.length > 0 && (
                <div className="sm:col-span-2">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-cyan-soft/70 mb-2">
                    Approval Hierarchy
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {submission.teamRequirements.approvalHierarchy.map(
                      (h, i) => (
                        <span key={h} className="inline-flex items-center gap-2">
                          <span className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11.5px] text-white/70">
                            {h}
                          </span>
                          {i <
                            submission.teamRequirements.approvalHierarchy.length - 1 && (
                            <ChevronRight className="h-3 w-3 text-white/30" />
                          )}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </AdminCard>

          {/* Section 7: Workflow Visualization */}
          {Object.values(submission.workflow).some((f) => f.enabled) && (
            <AdminCard className="p-6">
              <SectionTitle
                eyebrow="Section 07"
                title="Workflow Visualization"
                description="Business flows captured during discovery"
                icon={<WorkflowIcon className="h-4 w-4 text-cyan" />}
              />
              <WorkflowFlowCards workflow={submission.workflow} />
            </AdminCard>
          )}

          {/* Section 8: Assigned Team */}
          <AdminCard className="p-6">
            <SectionTitle
              eyebrow="Section 08"
              title="Assigned Team"
              action={
                <Link href={`/admin/submissions/${submission.id}/team`}>
                  <AdminButton variant="subtle" size="sm" icon={<UserPlus className="h-3.5 w-3.5" />}>
                    Manage
                  </AdminButton>
                </Link>
              }
            />
            {assignedMembers.length === 0 ? (
              <EmptyState
                icon={<Users className="h-5 w-5" />}
                title="No team assigned yet"
                description="Assign internal team members to this project."
                action={
                  <Link href={`/admin/submissions/${submission.id}/team`}>
                    <AdminButton variant="primary" size="sm">
                      Assign Team
                    </AdminButton>
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {assignedMembers.map(({ role, member }) => (
                  <div
                    key={role}
                    className="rounded-xl border border-white/8 bg-white/[0.02] p-3 flex items-center gap-3"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan/25 to-cyan/5 border border-cyan/25 font-display font-semibold text-[12px] text-cyan-soft">
                      {member?.initials ?? "?"}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-medium text-white truncate">
                        {member?.name ?? "Unassigned"}
                      </p>
                      <p className="text-[11px] text-cyan-soft/70 truncate">
                        {role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>

          {/* Section 9: Proposal + Quotation quick view */}
          {(submission.proposal || submission.quotation) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {submission.proposal && (
                <AdminCard className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.15em] text-cyan-soft/70">
                        Proposal
                      </p>
                      <p className="font-display text-[14px] font-semibold text-white mt-1">
                        {submission.proposal.sections.length} sections
                      </p>
                    </div>
                    <Link href={`/admin/submissions/${submission.id}/proposal`}>
                      <AdminButton variant="subtle" size="sm" icon={<FileCheck className="h-3.5 w-3.5" />}>
                        Open
                      </AdminButton>
                    </Link>
                  </div>
                </AdminCard>
              )}
              {submission.quotation && (
                <AdminCard className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.15em] text-cyan-soft/70">
                        Quotation
                      </p>
                      <p className="font-display text-[14px] font-semibold text-white mt-1">
                        {computeQuotationTotal(submission.quotation).toLocaleString(
                          "en-US",
                          { style: "currency", currency: submission.quotation.currency }
                        )}
                      </p>
                    </div>
                    <Link href={`/admin/submissions/${submission.id}/quotation`}>
                      <AdminButton variant="subtle" size="sm" icon={<Calculator className="h-3.5 w-3.5" />}>
                        Open
                      </AdminButton>
                    </Link>
                  </div>
                </AdminCard>
              )}
            </div>
          )}

          {/* Notes */}
          <AdminCard className="p-6">
            <SectionTitle eyebrow="Section 09" title="Internal Notes" />
            <textarea
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              onBlur={() => updateNotes(submission.id, notesValue)}
              placeholder="Add private notes about this submission..."
              className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3.5 py-2.5 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/50 focus:ring-2 focus:ring-cyan/15 transition-all min-h-[100px] resize-y leading-relaxed"
            />
            <p className="text-[11px] text-white/40 mt-2">
              Notes are auto-saved when you click away.
            </p>
          </AdminCard>
        </div>

        {/* Sidebar: Project Timeline */}
        <div className="xl:sticky xl:top-20 self-start">
          <ProjectTimeline submission={submission} />
        </div>
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

function formatAnswer(value: unknown, type: string): string {
  if (value === undefined || value === null || value === "") return "—";
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "—";
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function computeQuotationTotal(quotation: {
  items: { qty: number; unitPrice: number }[];
  taxRate: number;
  discount: number;
}): number {
  const subtotal = quotation.items.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  );
  const discountAmount = (subtotal * quotation.discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const tax = (taxableAmount * quotation.taxRate) / 100;
  return taxableAmount + tax;
}
