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
  Sparkles,
  Save,
  Eye,
} from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  AdminButton,
  AdminTextarea,
  SectionTitle,
  PageTransition,
  EmptyState,
} from "@/modules/admin/components/ui";
import { generateId } from "@/modules/admin/services/storage";
import type { Proposal, ProposalSection } from "@/modules/admin/types";

const DEFAULT_SECTIONS: { id: string; title: string; placeholder: string }[] = [
  { id: "scope", title: "Project Scope", placeholder: "Describe the overall scope of the project, the problem being solved, and the high-level approach..." },
  { id: "modules", title: "Modules", placeholder: "List the modules and features to be built..." },
  { id: "deliverables", title: "Deliverables", placeholder: "List tangible deliverables (source code, documentation, designs, etc.)..." },
  { id: "tech_stack", title: "Technology Stack", placeholder: "Specify the tech stack — frontend, backend, database, cloud, third-party..." },
  { id: "timeline", title: "Timeline", placeholder: "Overall timeline and key milestones..." },
  { id: "milestones", title: "Milestones", placeholder: "Detailed milestone breakdown with dates..." },
  { id: "support", title: "Support", placeholder: "Post-launch support — duration, response times, scope..." },
  { id: "terms", title: "Terms", placeholder: "Payment terms, IP ownership, confidentiality, change-request process..." },
];

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

  // Re-initialize when submission ID changes (different submission loaded).
  // Uses functional setState so the lint rule about setState-in-effect
  // is satisfied — we only update when the value actually changes.
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
          title="Submission not found"
          action={
            <Link href="/admin" className="inline-flex items-center gap-1.5 rounded-xl bg-cyan text-ink font-medium text-[13px] px-4 py-2.5">
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
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

  const filledSections = sections.filter((s) => s.content.trim().length > 0).length;

  return (
    <PageTransition>
      <Link
        href={`/admin/submissions/${submission.id}`}
        className="inline-flex items-center gap-1.5 text-[12.5px] text-white/55 hover:text-white transition-colors mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to submission
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
              <FileText className="h-3 w-3" />
              Proposal Builder
            </span>
            <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider ${
              status === "draft"
                ? "bg-amber-400/10 text-amber-200 border-amber-400/25"
                : status === "sent"
                ? "bg-blue-400/10 text-blue-200 border-blue-400/25"
                : status === "accepted"
                ? "bg-emerald-400/10 text-emerald-200 border-emerald-400/25"
                : "bg-rose-400/10 text-rose-200 border-rose-400/25"
            }`}>
              {status}
            </span>
          </div>
          <h1 className="mt-3 font-display text-2xl font-semibold text-white tracking-tight">
            {submission.projectName}
          </h1>
          <p className="mt-1.5 text-[13px] text-white/55">
            {filledSections} of {sections.length} sections completed
          </p>
        </div>
        <div className="flex items-center gap-2">
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
                    <span className="font-mono text-[11px] text-cyan-soft/70 tabular-nums mt-1">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) =>
                          updateSection(section.id, { title: e.target.value })
                        }
                        className="w-full bg-transparent border-none outline-none font-display text-[15px] font-semibold text-white placeholder:text-white/30 focus:outline-none"
                        placeholder="Section title"
                      />
                    </div>
                    <button
                      onClick={() => removeSection(section.id)}
                      aria-label="Remove section"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-white/40 hover:text-rose-300 hover:bg-rose-400/10 transition-all"
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
                      DEFAULT_SECTIONS.find((s) => s.id === section.id)?.placeholder ??
                      "Write section content..."
                    }
                    className="min-h-[120px]"
                  />
                </AdminCard>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={addSection}
            className="w-full rounded-xl border border-dashed border-white/15 py-4 text-[13px] text-white/55 hover:border-cyan/40 hover:bg-cyan/[0.04] hover:text-cyan-soft transition-all inline-flex items-center justify-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Section
          </button>
        </div>
      ) : (
        <AdminCard strong className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <p className="font-display text-[11px] uppercase tracking-[0.22em] text-cyan-soft/70">
              MB Tech Labs
            </p>
            <h1 className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-white">
              Project Proposal
            </h1>
            <p className="mt-2 text-[14px] text-white/60">
              {submission.projectName}
            </p>
            <p className="mt-1 text-[12px] text-white/40">
              Prepared for {submission.client.fullName},{" "}
              {submission.client.company}
            </p>
          </div>
          <div className="space-y-7">
            {sections
              .filter((s) => s.content.trim().length > 0)
              .map((section, idx) => (
                <div key={section.id}>
                  <h2 className="font-display text-[16px] font-semibold text-white mb-2 flex items-center gap-2">
                    <span className="font-mono text-[12px] text-cyan-soft/70">
                      {String(idx + 1).padStart(2, "0")}.
                    </span>
                    {section.title}
                  </h2>
                  <p className="text-[13.5px] text-white/75 leading-relaxed whitespace-pre-wrap">
                    {section.content}
                  </p>
                </div>
              ))}
          </div>
        </AdminCard>
      )}

      {savedAt && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-[11.5px] text-cyan-soft/70 flex items-center gap-1.5"
        >
          <Check className="h-3 w-3" />
          Saved {new Date(savedAt).toLocaleTimeString()}
        </motion.p>
      )}
    </PageTransition>
  );
}
