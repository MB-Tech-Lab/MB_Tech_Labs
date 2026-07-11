"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, MapPin, GraduationCap, Github, Linkedin, Globe, Award, Check, X, UserCheck, Loader2 } from "lucide-react";
import { hrApi } from "@/lib/api/hr";
import type { Application } from "@/lib/api/careers";

const PIPELINE = ["APPLIED", "RESUME_REVIEWED", "PROJECT_REVIEWED", "TECHNICAL_DISCUSSION", "SELECTED", "OFFER_SENT", "JOINED", "TRAINING", "COMPLETED"];
const STATUS_LABELS: Record<string, string> = {
  APPLIED: "Applied", RESUME_REVIEWED: "Resume Reviewed", PROJECT_REVIEWED: "Project Reviewed",
  TECHNICAL_DISCUSSION: "Technical Discussion", SELECTED: "Selected", OFFER_SENT: "Offer Sent",
  JOINED: "Joined", TRAINING: "Training", COMPLETED: "Completed", REJECTED: "Rejected",
};

function parseJsonArray(str?: string | null): string[] {
  if (!str) return []; try { return JSON.parse(str); } catch { return []; }
}

export default function HRCandidatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hrApi.getApplication(id).then(setApp).catch(() => setApp(null)).finally(() => setLoading(false));
  }, [id]);

  async function updateStatus(status: string) {
    if (!app) return;
    try { await hrApi.updateApplicationStatus(app.id, status); setApp({ ...app, status }); } catch {}
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-cyan" /></div>;
  if (!app) return (
    <div className="text-center py-20">
      <X className="h-8 w-8 text-white/30 mx-auto mb-4" />
      <p className="text-white/50">Application not found</p>
      <Link href="/hr/applications" className="mt-4 text-cyan-soft text-[13px]">← Back to applications</Link>
    </div>
  );

  const candidate = app.candidate;
  const skills = candidate ? parseJsonArray(candidate.skills) : [];
  const currentStageIdx = PIPELINE.indexOf(app.status);

  return (
    <div>
      <Link href="/hr/applications" className="inline-flex items-center gap-1.5 text-[12px] text-white/50 hover:text-white mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to applications
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-wider ${app.status === "REJECTED" ? "border-rose-400/25 bg-rose-400/10 text-rose-300" : "border-cyan/25 bg-cyan/10 text-cyan-soft"}`}>{STATUS_LABELS[app.status] || app.status}</span>
          </div>
          <h1 className="font-display text-xl font-semibold text-white">{candidate?.name}</h1>
          <p className="mt-1 text-[13px] text-white/50">{app.position?.title} · Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => updateStatus("RESUME_REVIEWED")} className="rounded-lg border px-3 py-1.5 text-[12px] text-white/70 hover:bg-white/5" style={{ borderColor: "rgba(255,255,255,0.1)" }}>Mark Reviewed</button>
          <button onClick={() => updateStatus("TECHNICAL_DISCUSSION")} className="rounded-lg border px-3 py-1.5 text-[12px] text-white/70 hover:bg-white/5" style={{ borderColor: "rgba(255,255,255,0.1)" }}>Technical</button>
          <button onClick={() => updateStatus("SELECTED")} className="rounded-lg border px-3 py-1.5 text-[12px] text-white/70 hover:bg-white/5" style={{ borderColor: "rgba(255,255,255,0.1)" }}>Select</button>
          <button onClick={() => updateStatus("REJECTED")} className="rounded-lg border border-rose-400/25 bg-rose-400/10 px-3 py-1.5 text-[12px] text-rose-300 hover:bg-rose-400/20">Reject</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5">
        <div className="space-y-4 min-w-0">
          <div className="rounded-2xl border p-5" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
            <h3 className="font-display text-[13px] font-semibold text-white mb-4">Candidate Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={candidate?.email} />
              <InfoRow icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={candidate?.phone} />
              <InfoRow icon={<MapPin className="h-3.5 w-3.5" />} label="Location" value={`${candidate?.city || ""}, ${candidate?.country || ""}`} />
              <InfoRow icon={<GraduationCap className="h-3.5 w-3.5" />} label="Education" value={`${candidate?.degree || ""} ${candidate?.branch || ""}`} />
              <InfoRow icon={<GraduationCap className="h-3.5 w-3.5" />} label="College" value={candidate?.college} />
              <InfoRow icon={<Award className="h-3.5 w-3.5" />} label="CGPA" value={candidate?.cgpa?.toString()} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {candidate?.githubProfile && <a href={candidate.githubProfile} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] text-white/70 hover:border-cyan/25" style={{ borderColor: "rgba(255,255,255,0.1)" }}><Github className="h-3.5 w-3.5" /> GitHub</a>}
              {candidate?.linkedinProfile && <a href={candidate.linkedinProfile} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] text-white/70 hover:border-cyan/25" style={{ borderColor: "rgba(255,255,255,0.1)" }}><Linkedin className="h-3.5 w-3.5" /> LinkedIn</a>}
            </div>
          </div>

          {skills.length > 0 && (
            <div className="rounded-2xl border p-5" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
              <h3 className="font-display text-[13px] font-semibold text-white mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">{skills.map((s) => <span key={s} className="rounded-full border border-cyan/20 bg-cyan/[0.06] px-3 py-1 text-[12px] text-cyan-soft">{s}</span>)}</div>
            </div>
          )}

          {candidate?.projects && candidate.projects.length > 0 && (
            <div className="rounded-2xl border p-5" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
              <h3 className="font-display text-[13px] font-semibold text-white mb-3">Projects</h3>
              <div className="space-y-3">
                {candidate.projects.map((p, i) => (
                  <div key={i} className="rounded-lg border p-3" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
                    <div className="flex items-start justify-between">
                      <h4 className="font-display text-[13px] font-semibold text-white">{p.name}</h4>
                      {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-soft"><Github className="h-3.5 w-3.5" /></a>}
                    </div>
                    {p.technology && <p className="text-[11px] text-cyan-soft/60 mt-0.5">{p.technology}</p>}
                    {p.description && <p className="text-[12px] text-white/55 mt-1.5">{p.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="rounded-2xl border p-5 sticky top-6" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
            <h3 className="font-display text-[13px] font-semibold text-white mb-4">Recruitment Pipeline</h3>
            <div className="space-y-1">
              {PIPELINE.map((stage, idx) => {
                const isDone = idx < currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                return (
                  <button key={stage} onClick={() => updateStatus(stage)} className="flex items-center gap-2 py-1 w-full text-left group">
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] ${isDone ? "bg-emerald-400/20 text-emerald-300" : isCurrent ? "bg-cyan text-ink" : "bg-white/5 text-white/40"}`}>
                      {isDone ? <Check className="h-2.5 w-2.5" /> : idx + 1}
                    </span>
                    <span className={`text-[12px] group-hover:text-cyan-soft ${isCurrent ? "text-white" : isDone ? "text-white/60" : "text-white/40"}`}>{STATUS_LABELS[stage] || stage}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/35 mb-1">{icon}{label}</p>
      <span className="text-[12.5px] text-white/80">{value || "—"}</span>
    </div>
  );
}
