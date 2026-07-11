"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  FileText,
  Save,
  Eye,
  Download,
  Printer,
} from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  AdminButton,
  AdminTextarea,
  AdminInput,
  SectionTitle,
  PageTransition,
  EmptyState,
} from "@/modules/admin/components/ui";
import { generateId } from "@/modules/admin/services/storage";
import type { Proposal, ProposalSection } from "@/modules/admin/types";

const DEFAULT_SECTIONS: { id: string; title: string; placeholder: string }[] = [
  {
    id: "scope",
    title: "Project Scope",
    placeholder:
      "Describe the overall scope of the project, the problem being solved, and the high-level approach...",
  },
  {
    id: "modules",
    title: "Modules",
    placeholder: "List the modules and features to be built...",
  },
  {
    id: "deliverables",
    title: "Deliverables",
    placeholder:
      "List tangible deliverables (source code, documentation, designs, etc.)...",
  },
  {
    id: "tech_stack",
    title: "Technology Stack",
    placeholder:
      "Specify the tech stack — frontend, backend, database, cloud, third-party...",
  },
  {
    id: "timeline",
    title: "Timeline",
    placeholder: "Overall timeline and key milestones...",
  },
  {
    id: "milestones",
    title: "Milestones",
    placeholder: "Detailed milestone breakdown with dates...",
  },
  {
    id: "team",
    title: "Team",
    placeholder: "Roles and headcount that will be assigned...",
  },
  {
    id: "pricing",
    title: "Pricing",
    placeholder: "Pricing breakdown, payment milestones, and total cost...",
  },
  {
    id: "terms",
    title: "Terms",
    placeholder:
      "Payment terms, IP ownership, confidentiality, change-request process...",
  },
];

const STATUS_COLORS: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  draft: { bg: "#F59E0B1A", border: "#F59E0B40", text: "#F59E0B" },
  sent: { bg: "#3B82F61A", border: "#3B82F640", text: "#3B82F6" },
  accepted: { bg: "#10B9811A", border: "#10B98140", text: "#10B981" },
  rejected: { bg: "#EF44441A", border: "#EF444440", text: "#EF4444" },
};

export default function ProposalBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { submissions, updateProposal } = useAdmin();
  const submission = useMemo(
    () => submissions.find((s) => s.id === id || s.sessionId === id),
    [submissions, id]
  );

  const [sections, setSections] = useState<ProposalSection[]>(() => {
    if (submission?.proposal) return submission.proposal.sections;
    return DEFAULT_SECTIONS.map((s) => ({
      id: s.id,
      title: s.title,
      content: "",
    }));
  });
  const [status, setStatus] = useState<Proposal["status"]>(
    submission?.proposal?.status ?? "draft"
  );
  const [showPreview, setShowPreview] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [initId, setInitId] = useState<string | undefined>(submission?.id);

  // Re-initialize when submission ID changes
  if (submission && submission.id !== initId) {
    setInitId(submission.id);
    if (submission.proposal) {
      setSections(submission.proposal.sections);
      setStatus(submission.proposal.status);
    } else {
      setSections(
        DEFAULT_SECTIONS.map((s) => ({
          id: s.id,
          title: s.title,
          content: "",
        }))
      );
      setStatus("draft");
    }
  }

  if (!submission) {
    return (
      <PageTransition>
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="Submission not found"
          description="This submission may have been removed."
          action={
            <Link href="/admin/proposals">
              <AdminButton variant="primary" size="sm" icon={<ArrowLeft className="h-3.5 w-3.5" />}>
                Back to proposals
              </AdminButton>
            </Link>
          }
        />
      </PageTransition>
    );
  }

  function updateSection(sectionId: string, patch: Partial<ProposalSection>) {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, ...patch } : s))
    );
  }

  function addSection() {
    const newSection: ProposalSection = {
      id: generateId("sec"),
      title: "New Section",
      content: "",
    };
    setSections((prev) => [...prev, newSection]);
  }

  function removeSection(sectionId: string) {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  }

  function handleSave(newStatus?: Proposal["status"]) {
    if (!submission) return;
    const proposal: Proposal = {
      id: submission.proposal?.id ?? generateId("prop"),
      createdAt: submission.proposal?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
      status: newStatus ?? status,
      sections,
    };
    updateProposal(submission.id, proposal);
    if (newStatus) setStatus(newStatus);
    setSavedAt(Date.now());
  }

  function handleDownload() {
    setShowPreview(true);
    setTimeout(() => window.print(), 400);
  }

  const filledSections = sections.filter(
    (s) => s.content.trim().length > 0
  ).length;
  const statusColors = STATUS_COLORS[status];

  return (
    <PageTransition>
      <Link
        href={`/admin/submissions/${submission.id}`}
        className="inline-flex items-center gap-1.5 text-[12.5px] mb-4 transition-opacity hover:opacity-80"
        style={{ color: "var(--admin-text-secondary)" }}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to submission
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.18em]"
              style={{
                background: "var(--admin-surface-2)",
                borderColor: "var(--admin-border)",
                color: "var(--admin-accent)",
              }}
            >
              <FileText className="h-3 w-3" />
              Proposal Builder
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider"
              style={{
                background: statusColors.bg,
                borderColor: statusColors.border,
                color: statusColors.text,
              }}
            >
              {status}
            </span>
          </div>
          <h1
            className="font-bold text-2xl sm:text-3xl tracking-tight"
            style={{ color: "var(--admin-text)" }}
          >
            {submission.projectName}
          </h1>
          <p
            className="mt-1.5 text-[13px]"
            style={{ color: "var(--admin-text-secondary)" }}
          >
            {filledSections} of {sections.length} sections completed
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap print:hidden">
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            icon={<Download className="h-3.5 w-3.5" />}
          >
            PDF
          </AdminButton>
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview((v) => !v)}
            icon={<Eye className="h-3.5 w-3.5" />}
          >
            {showPreview ? "Edit" : "Preview"}
          </AdminButton>
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={() => handleSave()}
            icon={<Save className="h-3.5 w-3.5" />}
          >
            Save Draft
          </AdminButton>
          <AdminButton
            variant="primary"
            size="sm"
            onClick={() => handleSave("sent")}
            icon={<Check className="h-3.5 w-3.5" />}
          >
            Mark as Sent
          </AdminButton>
        </div>
      </div>

      {/* Editor / Preview */}
      {!showPreview ? (
        <div className="space-y-4">
          <AnimatePresence>
            {sections.map((section, idx) => (
              <motion.div
                key={section.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <AdminCard className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span
                      className="font-mono text-[11px] tabular-nums mt-1"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) =>
                          updateSection(section.id, { title: e.target.value })
                        }
                        className="w-full bg-transparent border-none outline-none font-semibold text-[15px]"
                        style={{ color: "var(--admin-text)" }}
                        placeholder="Section title"
                      />
                    </div>
                    <button
                      onClick={() => removeSection(section.id)}
                      aria-label="Remove section"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md transition-all hover:opacity-80"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <AdminTextarea
                    value={section.content}
                    onChange={(e) =>
                      updateSection(section.id, { content: e.target.value })
                    }
                    placeholder={
                      DEFAULT_SECTIONS.find((s) => s.id === section.id)
                        ?.placeholder ?? "Write section content..."
                    }
                    className="min-h-[120px]"
                  />
                </AdminCard>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={addSection}
            className="w-full rounded-xl border border-dashed py-4 text-[13px] transition-all inline-flex items-center justify-center gap-1.5 hover:opacity-90"
            style={{
              borderColor: "var(--admin-border)",
              color: "var(--admin-text-secondary)",
              background: "transparent",
            }}
          >
            <Plus className="h-4 w-4" />
            Add Section
          </button>
        </div>
      ) : (
        <AdminCard strong className="p-8 sm:p-10 print:border-none print:shadow-none">
          <div className="text-center mb-8">
            <p
              className="font-semibold text-[11px] uppercase tracking-[0.22em]"
              style={{ color: "var(--admin-accent)" }}
            >
              MB Tech Labs
            </p>
            <h1
              className="mt-3 font-bold text-2xl sm:text-3xl"
              style={{ color: "var(--admin-text)" }}
            >
              Project Proposal
            </h1>
            <p
              className="mt-2 text-[14px]"
              style={{ color: "var(--admin-text-secondary)" }}
            >
              {submission.projectName}
            </p>
            <p
              className="mt-1 text-[12px]"
              style={{ color: "var(--admin-text-muted)" }}
            >
              Prepared for {submission.client.fullName},{" "}
              {submission.client.company}
            </p>
          </div>
          <div className="space-y-7">
            {sections.filter((s) => s.content.trim().length > 0).length === 0 && (
              <p
                className="text-center text-[13px] py-8"
                style={{ color: "var(--admin-text-muted)" }}
              >
                No content to preview yet. Fill in some sections first.
              </p>
            )}
            {sections
              .filter((s) => s.content.trim().length > 0)
              .map((section, idx) => (
                <div key={section.id}>
                  <h2
                    className="font-semibold text-[16px] mb-2 flex items-center gap-2"
                    style={{ color: "var(--admin-text)" }}
                  >
                    <span
                      className="font-mono text-[12px]"
                      style={{ color: "var(--admin-accent)" }}
                    >
                      {String(idx + 1).padStart(2, "0")}.
                    </span>
                    {section.title}
                  </h2>
                  <p
                    className="text-[13.5px] leading-relaxed whitespace-pre-wrap"
                    style={{ color: "var(--admin-text-secondary)" }}
                  >
                    {section.content}
                  </p>
                </div>
              ))}
          </div>
          <div
            className="mt-10 pt-6 border-t flex items-center justify-between text-[11px]"
            style={{
              borderColor: "var(--admin-border)",
              color: "var(--admin-text-muted)",
            }}
          >
            <span>MB Tech Labs · Confidential</span>
            <span>
              Generated {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </AdminCard>
      )}

      {savedAt && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-[11.5px] flex items-center gap-1.5 print:hidden"
          style={{ color: "var(--admin-accent)" }}
        >
          <Check className="h-3 w-3" />
          Saved {new Date(savedAt).toLocaleTimeString()}
        </motion.p>
      )}

      <div className="print:hidden mt-4">
        <AdminButton
          variant="outline"
          size="sm"
          onClick={handleDownload}
          icon={<Printer className="h-3.5 w-3.5" />}
        >
          Print / Save as PDF
        </AdminButton>
      </div>
    </PageTransition>
  );
}
