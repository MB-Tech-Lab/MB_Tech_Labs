"use client";

import { useSrg } from "../context/SRGContext";
import { GlassCard, AnimateIn, PrimaryButton } from "./ui";
import { getTemplate } from "../templates";
import { buildSubmissionPayload } from "../engine/runtime";
import { formatFileSize, getFileTypeLabel, UPLOAD_CATEGORIES } from "../services/uploads";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Download,
  Send,
  Sparkles,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { SrgSubmissionPayload } from "../types";

export function Step9FinalReview() {
  const { session, submit, progress } = useSrg();
  const template = getTemplate(session.selectedTemplateId);
  const [payload, setPayload] = useState<SrgSubmissionPayload | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    buildSubmissionPayload(session).then(setPayload).catch(() => setPayload(null));
  }, [session]);

  function handleDownload() {
    if (!payload) return;
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `srg-submission-${payload.sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleCopy() {
    if (!payload) return;
    navigator.clipboard
      .writeText(JSON.stringify(payload, null, 2))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const result = await submit();
    setSubmitting(false);
    if (result.ok) {
      setSubmitted(true);
      setSubmissionId(result.submissionId ?? null);
    } else {
      setError(result.error ?? "Submission failed");
    }
  }

  if (submitted) {
    return (
      <div className="space-y-8">
        <AnimateIn>
          <GlassCard strong className="p-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan/15 border border-cyan/40 mx-auto"
            >
              <CheckCircle2 className="h-8 w-8 text-cyan" />
            </motion.div>
            <h1 className="mt-6 font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              Submission received.
            </h1>
            <p className="mt-3 text-[14.5px] text-white/55 max-w-md mx-auto">
              Your project discovery has been captured locally. Our team will
              review the requirements and reach out within 1 business day.
            </p>
            {submissionId && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2">
                <span className="text-[11px] uppercase tracking-wider text-white/40">
                  Reference ID
                </span>
                <span className="font-mono text-[12px] text-cyan-soft">
                  {submissionId}
                </span>
              </div>
            )}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
              <PrimaryButton onClick={handleDownload}>
                <Download className="h-4 w-4" />
                Download submission
              </PrimaryButton>
            </div>
            <p className="mt-5 text-[11.5px] text-white/35">
              Tip: keep this reference ID safe. It will sync to the MB Tech Labs
              backend once the Django integration goes live.
            </p>
          </GlassCard>
        </AnimateIn>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AnimateIn>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
            Step 09
          </span>
          <h1 className="mt-5 font-display text-3xl sm:text-4xl md:text-[40px] font-semibold text-white tracking-tight leading-[1.1]">
            Final review &{" "}
            <span className="text-gradient-cyan">submission.</span>
          </h1>
          <p className="mt-3 text-[14.5px] text-white/55 max-w-xl">
            Take a moment to review everything before submitting. You can
            navigate back to any step to make changes. Once submitted, your
            discovery is locked in and ready for our team.
          </p>
        </div>
      </AnimateIn>

      {/* Progress summary */}
      <AnimateIn delay={0.08}>
        <GlassCard strong className="p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="font-display text-[15px] font-semibold text-white">
                Discovery progress
              </p>
              <p className="text-[12.5px] text-white/55 mt-0.5">
                {progress.completion}% complete • Step {progress.currentStep} of{" "}
                {progress.totalSteps}
              </p>
            </div>
            <div className="w-full sm:w-64">
              <div className="h-2 rounded-full bg-white/8 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.completion}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-gradient-to-r from-cyan/70 to-cyan rounded-full"
                />
              </div>
            </div>
          </div>
        </GlassCard>
      </AnimateIn>

      {/* Review sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReviewCard title="Client" delay={0.1}>
          <ReviewRow label="Name" value={session.clientDetails.fullName} />
          <ReviewRow label="Email" value={session.clientDetails.email} />
          <ReviewRow label="Phone" value={session.clientDetails.phone} />
          <ReviewRow label="Company" value={session.clientDetails.company} />
          <ReviewRow
            label="Country"
            value={`${session.clientDetails.country}${
              session.clientDetails.timezone ? " • " + session.clientDetails.timezone : ""
            }`}
          />
        </ReviewCard>

        <ReviewCard title="Business" delay={0.14}>
          <ReviewRow label="Legal name" value={session.businessDetails.legalName} />
          <ReviewRow label="Industry" value={session.businessDetails.industry} />
          <ReviewRow label="Size" value={session.businessDetails.size} />
          <ReviewRow label="Stage" value={session.businessDetails.stage} />
          <ReviewRow label="Budget" value={session.businessDetails.annualBudget} />
          <ReviewRow label="Target launch" value={session.businessDetails.targetLaunch} />
        </ReviewCard>

        <ReviewCard title="Project" delay={0.18}>
          <ReviewRow label="Template" value={template?.name ?? "—"} />
          <ReviewRow label="Primary goal" value={session.projectGoals.primaryGoal} />
          <ReviewRow
            label="Secondary goals"
            value={
              session.projectGoals.secondaryGoals.length > 0
                ? session.projectGoals.secondaryGoals.join(", ")
                : "—"
            }
          />
          <ReviewRow label="Deadline" value={session.projectGoals.deadline} />
          <ReviewRow label="Budget range" value={session.projectGoals.budgetRange} />
        </ReviewCard>

        <ReviewCard title="Discovery Answers" delay={0.22}>
          <p className="text-[12.5px] text-white/55">
            {Object.keys(payload?.answers ?? {}).length} answers captured
            across {template?.sections.length ?? 0} sections.
          </p>
          <div className="mt-3 space-y-1.5 max-h-32 overflow-y-auto">
            {payload?.answers &&
              Object.entries(payload.answers).map(([k, v]) => (
                <div key={k} className="text-[11.5px]">
                  <span className="text-cyan-soft/70 font-mono">{k}:</span>{" "}
                  <span className="text-white/65">
                    {Array.isArray(v) ? v.join(", ") : String(v)}
                  </span>
                </div>
              ))}
          </div>
        </ReviewCard>

        <ReviewCard title="Uploads" delay={0.26}>
          <p className="text-[12.5px] text-white/55">
            {session.uploads.length} file{session.uploads.length === 1 ? "" : "s"} •{" "}
            {formatFileSize(
              session.uploads.reduce((n, u) => n + u.size, 0)
            )}
          </p>
          <div className="mt-3 space-y-1.5 max-h-32 overflow-y-auto">
            {session.uploads.map((u) => (
              <div key={u.id} className="flex items-center justify-between text-[11.5px]">
                <span className="text-white/65 truncate">{u.name}</span>
                <span className="text-white/40 shrink-0 ml-2">
                  {getFileTypeLabel(u.type).split(" ")[0]} • {formatFileSize(u.size)}
                </span>
              </div>
            ))}
            {session.uploads.length === 0 && (
              <p className="text-[11.5px] text-white/40">No files uploaded.</p>
            )}
          </div>
        </ReviewCard>

        <ReviewCard title="Team & Workflow" delay={0.3}>
          <ReviewRow
            label="Team members"
            value={`${session.teamRoles.length} added`}
          />
          <ReviewRow
            label="Active workflows"
            value={Object.values(session.workflow).filter((f) => f.enabled).length + ""}
          />
          <div className="mt-3 space-y-1.5">
            {Object.values(session.workflow)
              .filter((f) => f.enabled)
              .map((f) => (
                <div key={f.type} className="text-[11.5px]">
                  <span className="text-cyan-soft/70">{f.label}:</span>{" "}
                  <span className="text-white/65">
                    {f.stages.map((s) => s.name || "...").join(" → ") || "no stages"}
                  </span>
                </div>
              ))}
          </div>
        </ReviewCard>
      </div>

      {/* JSON payload viewer */}
      <AnimateIn delay={0.34}>
        <GlassCard className="p-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="font-display text-[14px] font-semibold text-white">
                Submission payload (preview)
              </p>
              <p className="text-[12px] text-white/45 mt-0.5">
                This is the exact JSON that will be sent to the Django backend.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowJson((v) => !v)}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/70 hover:bg-white/[0.06]"
              >
                {showJson ? "Hide" : "Show"} JSON
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/70 hover:bg-white/[0.06]"
              >
                {copied ? <Check className="h-3 w-3 text-cyan" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/70 hover:bg-white/[0.06]"
              >
                <Download className="h-3 w-3" />
                Download
              </button>
            </div>
          </div>
          <AnimatePresence>
            {showJson && payload && (
              <motion.pre
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 rounded-xl bg-ink/60 border border-white/8 p-4 overflow-auto max-h-96 text-[11px] leading-relaxed text-white/70 font-mono"
              >
                {JSON.stringify(payload, null, 2)}
              </motion.pre>
            )}
          </AnimatePresence>
        </GlassCard>
      </AnimateIn>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2.5 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-[13px] text-rose-200"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <AnimateIn delay={0.4}>
        <GlassCard strong className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/25 shrink-0">
              <Sparkles className="h-4 w-4 text-cyan" />
            </span>
            <div>
              <p className="font-display text-[14.5px] font-semibold text-white">
                Ready to submit?
              </p>
              <p className="text-[12.5px] text-white/55 mt-0.5">
                Your submission will be stored locally and synced to MB Tech Labs.
              </p>
            </div>
          </div>
          <PrimaryButton
            onClick={handleSubmit}
            disabled={submitting || !payload}
            className="w-full sm:w-auto"
          >
            {submitting ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.span>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Discovery
              </>
            )}
          </PrimaryButton>
        </GlassCard>
      </AnimateIn>
    </div>
  );
}

/* --------------------------- Helpers --------------------------- */

function ReviewCard({
  title,
  children,
  delay,
}: {
  title: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <AnimateIn delay={delay} y={18}>
      <GlassCard className="p-5 h-full">
        <h3 className="font-display text-[12px] font-semibold uppercase tracking-[0.15em] text-cyan-soft/80 mb-3">
          {title}
        </h3>
        <div className="space-y-2">{children}</div>
      </GlassCard>
    </AnimateIn>
  );
}

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
      <span className="text-[11.5px] text-white/40 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-[12.5px] text-white/85 break-words">
        {value || <span className="text-white/30">—</span>}
      </span>
    </div>
  );
}
