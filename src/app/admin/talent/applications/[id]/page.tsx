"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Github,
  Linkedin,
  Globe,
  Award,
  Code2,
  Trophy,
  Briefcase,
  FileText,
  Check,
  X,
  UserCheck,
  Loader2,
} from "lucide-react";
import {
  AdminCard,
  AdminButton,
  PageTransition,
  EmptyState,
  Skeleton,
  SectionTitle,
} from "@/modules/admin/components/ui";
import { careersApi, type Application } from "@/lib/api/careers";

const PIPELINE = [
  "APPLIED", "RESUME_REVIEWED", "PROJECT_REVIEWED", "TECHNICAL_DISCUSSION",
  "SELECTED", "OFFER_SENT", "JOINED", "TRAINING", "COMPLETED",
];

const STATUS_LABELS: Record<string, string> = {
  APPLIED: "Applied", RESUME_REVIEWED: "Resume Reviewed", PROJECT_REVIEWED: "Project Reviewed",
  TECHNICAL_DISCUSSION: "Technical Discussion", SELECTED: "Selected", OFFER_SENT: "Offer Sent",
  JOINED: "Joined", TRAINING: "Training", COMPLETED: "Completed", REJECTED: "Rejected",
};

function parseJsonArray(str?: string | null): string[] {
  if (!str) return [];
  try { return JSON.parse(str); } catch { return []; }
}

export default function CandidateProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scores, setScores] = useState({ scoreProgramming: 0, scoreProjects: 0, scoreHackathons: 0, scoreGithub: 0, scoreCommunication: 0, scoreAttitude: 0 });
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    careersApi.getApplication(id)
      .then((data) => {
        setApp(data);
        setScores({
          scoreProgramming: data.scoreProgramming,
          scoreProjects: data.scoreProjects,
          scoreHackathons: data.scoreHackathons,
          scoreGithub: data.scoreGithub,
          scoreCommunication: data.scoreCommunication,
          scoreAttitude: data.scoreAttitude,
        });
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  async function updateStatus(status: string) {
    if (!app) return;
    try {
      await careersApi.updateApplication(app.id, { status });
      setApp({ ...app, status });
    } catch (e) { console.error(e); }
  }

  async function saveScorecard() {
    if (!app) return;
    setSaving(true);
    try {
      await careersApi.updateApplication(app.id, scores);
      const updated = await careersApi.getApplication(app.id);
      setApp(updated);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  }

  async function addNote() {
    if (!app || !note.trim()) return;
    try {
      await careersApi.updateApplication(app.id, { note });
      setNote("");
      const updated = await careersApi.getApplication(app.id);
      setApp(updated);
    } catch (e) { console.error(e); }
  }

  async function convertToEmployee() {
    if (!app) return;
    if (!confirm("Convert this candidate to a team member? This will create a User account with DEVELOPER role.")) return;
    try {
      await careersApi.updateApplication(app.id, { convertToEmployee: true });
      alert("Candidate converted to team member! A User account has been created.");
      const updated = await careersApi.getApplication(app.id);
      setApp(updated);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Conversion failed");
    }
  }

  if (loading) {
    return <PageTransition><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-cyan" /></div></PageTransition>;
  }

  if (error || !app) {
    return (
      <PageTransition>
        <EmptyState
          icon={<X className="h-6 w-6" />}
          title="Application not found"
          action={<Link href="/admin/talent/applications" className="text-cyan-soft text-[13px]">← Back to applications</Link>}
        />
      </PageTransition>
    );
  }

  const candidate = app.candidate;
  const skills = candidate ? parseJsonArray(candidate.skills) : [];
  const totalScore = scores.scoreProgramming + scores.scoreProjects + scores.scoreHackathons + scores.scoreGithub + scores.scoreCommunication + scores.scoreAttitude;
  const currentStageIdx = PIPELINE.indexOf(app.status);

  return (
    <PageTransition>
      <Link href="/admin/talent/applications" className="inline-flex items-center gap-1.5 text-[12.5px] text-white/55 hover:text-white transition-colors mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to applications
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10.5px] uppercase tracking-wider ${app.status === "REJECTED" ? "border-rose-400/25 bg-rose-400/10 text-rose-200" : "border-cyan/25 bg-cyan/10 text-cyan-soft"}`}>
              {STATUS_LABELS[app.status] || app.status}
            </span>
            {app.totalScore > 0 && <span className="rounded-md border border-cyan/25 bg-cyan/10 px-2 py-0.5 text-[10.5px] font-mono text-cyan-soft">Score: {app.totalScore}/100</span>}
          </div>
          <h1 className="font-display text-2xl font-semibold text-white tracking-tight">{candidate?.name}</h1>
          <p className="mt-1 text-[13px] text-white/55">{app.position?.title} · Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AdminButton variant="ghost" size="sm" onClick={() => updateStatus("RESUME_REVIEWED")}>Mark Reviewed</AdminButton>
          <AdminButton variant="ghost" size="sm" onClick={() => updateStatus("TECHNICAL_DISCUSSION")}>Technical Discussion</AdminButton>
          <AdminButton variant="ghost" size="sm" onClick={() => updateStatus("SELECTED")}>Select</AdminButton>
          <AdminButton variant="danger" size="sm" onClick={() => updateStatus("REJECTED")}>Reject</AdminButton>
          {app.status === "COMPLETED" && (
            <AdminButton variant="primary" size="sm" onClick={convertToEmployee} icon={<UserCheck className="h-3.5 w-3.5" />}>
              Convert to Employee
            </AdminButton>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-5 min-w-0">
          {/* Candidate Info */}
          <AdminCard className="p-6">
            <SectionTitle eyebrow="Profile" title="Candidate Information" icon={<Briefcase className="h-4 w-4 text-cyan" />} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={candidate?.email} />
              <InfoRow icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={candidate?.phone} />
              <InfoRow icon={<MapPin className="h-3.5 w-3.5" />} label="Location" value={`${candidate?.city || ""}, ${candidate?.country || ""}`} />
              <InfoRow icon={<GraduationCap className="h-3.5 w-3.5" />} label="Education" value={`${candidate?.degree || ""} ${candidate?.branch || ""}`} />
              <InfoRow icon={<GraduationCap className="h-3.5 w-3.5" />} label="College" value={candidate?.college} />
              <InfoRow icon={<Award className="h-3.5 w-3.5" />} label="CGPA" value={candidate?.cgpa?.toString()} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {candidate?.githubProfile && <a href={candidate.githubProfile} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/70 hover:border-cyan/25"><Github className="h-3.5 w-3.5" /> GitHub</a>}
              {candidate?.linkedinProfile && <a href={candidate.linkedinProfile} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/70 hover:border-cyan/25"><Linkedin className="h-3.5 w-3.5" /> LinkedIn</a>}
              {candidate?.portfolioWebsite && <a href={candidate.portfolioWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/70 hover:border-cyan/25"><Globe className="h-3.5 w-3.5" /> Portfolio</a>}
            </div>
          </AdminCard>

          {/* Skills */}
          {skills.length > 0 && (
            <AdminCard className="p-6">
              <SectionTitle eyebrow="Technical" title="Skills" icon={<Code2 className="h-4 w-4 text-cyan" />} />
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => <span key={s} className="rounded-full border border-cyan/20 bg-cyan/[0.06] px-3 py-1 text-[12px] text-cyan-soft">{s}</span>)}
              </div>
            </AdminCard>
          )}

          {/* Projects */}
          {candidate?.projects && candidate.projects.length > 0 && (
            <AdminCard className="p-6">
              <SectionTitle eyebrow="Portfolio" title="Projects" icon={<Briefcase className="h-4 w-4 text-cyan" />} />
              <div className="space-y-3">
                {candidate.projects.map((p, i) => (
                  <div key={i} className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-display text-[14px] font-semibold text-white">{p.name}</h4>
                      {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-soft hover:text-cyan"><Github className="h-4 w-4" /></a>}
                    </div>
                    {p.technology && <p className="text-[11.5px] text-cyan-soft/70 mt-1">{p.technology}</p>}
                    {p.description && <p className="text-[12.5px] text-white/60 mt-2">{p.description}</p>}
                    {p.liveDemoUrl && <a href={p.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[11.5px] text-cyan-soft hover:text-cyan"><Globe className="h-3 w-3" /> Live Demo</a>}
                  </div>
                ))}
              </div>
            </AdminCard>
          )}

          {/* Hackathons */}
          {candidate?.hackathons && candidate.hackathons.length > 0 && (
            <AdminCard className="p-6">
              <SectionTitle eyebrow="Achievements" title="Hackathons" icon={<Trophy className="h-4 w-4 text-cyan" />} />
              <div className="space-y-2">
                {candidate.hackathons.map((h, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2.5">
                    <div>
                      <p className="text-[13px] text-white">{h.name}</p>
                      {h.year && <p className="text-[11px] text-white/45">{h.year}</p>}
                    </div>
                    {h.rank && <span className="rounded-md bg-amber-400/10 border border-amber-400/25 px-2 py-0.5 text-[10.5px] text-amber-200">{h.rank}</span>}
                  </div>
                ))}
              </div>
            </AdminCard>
          )}

          {/* Essays */}
          {(candidate?.whyJoin || candidate?.bestProject || candidate?.careerGoals) && (
            <AdminCard className="p-6">
              <SectionTitle eyebrow="Essays" title="Essay Responses" icon={<FileText className="h-4 w-4 text-cyan" />} />
              <div className="space-y-4">
                {candidate?.whyJoin && <EssayBlock label="Why MB Tech Labs?" content={candidate.whyJoin} />}
                {candidate?.bestProject && <EssayBlock label="Best Project" content={candidate.bestProject} />}
                {candidate?.careerGoals && <EssayBlock label="Career Goals" content={candidate.careerGoals} />}
              </div>
            </AdminCard>
          )}

          {/* Notes */}
          <AdminCard className="p-6">
            <SectionTitle eyebrow="Internal" title="Notes" />
            <div className="flex gap-2">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addNote()}
                placeholder="Add a note..."
                className="flex-1 rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/40"
              />
              <AdminButton variant="primary" size="sm" onClick={addNote}>Add</AdminButton>
            </div>
          </AdminCard>
        </div>

        {/* Sidebar: Scorecard + Pipeline */}
        <div className="space-y-4">
          {/* Scorecard */}
          <AdminCard className="p-5">
            <h3 className="font-display text-[13px] font-semibold text-white mb-4">Candidate Scorecard</h3>
            <div className="space-y-3">
              <ScoreInput label="Programming Fundamentals" max={30} value={scores.scoreProgramming} onChange={(v) => setScores({ ...scores, scoreProgramming: v })} />
              <ScoreInput label="Projects" max={25} value={scores.scoreProjects} onChange={(v) => setScores({ ...scores, scoreProjects: v })} />
              <ScoreInput label="Hackathons" max={15} value={scores.scoreHackathons} onChange={(v) => setScores({ ...scores, scoreHackathons: v })} />
              <ScoreInput label="GitHub Quality" max={10} value={scores.scoreGithub} onChange={(v) => setScores({ ...scores, scoreGithub: v })} />
              <ScoreInput label="Communication" max={10} value={scores.scoreCommunication} onChange={(v) => setScores({ ...scores, scoreCommunication: v })} />
              <ScoreInput label="Learning Attitude" max={10} value={scores.scoreAttitude} onChange={(v) => setScores({ ...scores, scoreAttitude: v })} />
            </div>
            <div className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between">
              <span className="text-[12px] text-white/55">Total Score</span>
              <span className="font-display text-[20px] font-bold text-cyan tabular-nums">{totalScore}/100</span>
            </div>
            <AdminButton variant="primary" size="sm" className="w-full mt-3" onClick={saveScorecard} disabled={saving}>
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Save Scorecard
            </AdminButton>
          </AdminCard>

          {/* Pipeline */}
          <AdminCard className="p-5">
            <h3 className="font-display text-[13px] font-semibold text-white mb-4">Recruitment Pipeline</h3>
            <div className="space-y-1">
              {PIPELINE.map((stage, idx) => {
                const isDone = idx < currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                return (
                  <div key={stage} className="flex items-center gap-2 py-1">
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] ${
                      isDone ? "bg-emerald-400/20 text-emerald-200" : isCurrent ? "bg-cyan text-ink" : "bg-white/5 text-white/40"
                    }`}>
                      {isDone ? <Check className="h-2.5 w-2.5" /> : idx + 1}
                    </span>
                    <span className={`text-[12px] ${isCurrent ? "text-white" : isDone ? "text-white/60" : "text-white/40"}`}>
                      {STATUS_LABELS[stage] || stage}
                    </span>
                  </div>
                );
              })}
            </div>
          </AdminCard>
        </div>
      </div>
    </PageTransition>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-white/40 mb-1">{icon}{label}</p>
      <span className="text-[13px] text-white/85">{value || "—"}</span>
    </div>
  );
}

function EssayBlock({ label, content }: { label: string; content: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-cyan-soft/70 mb-1">{label}</p>
      <p className="text-[13px] text-white/70 leading-relaxed">{content}</p>
    </div>
  );
}

function ScoreInput({ label, max, value, onChange }: { label: string; max: number; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11.5px] text-white/70">{label}</span>
        <span className="text-[10.5px] text-white/40">/ {max}</span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-cyan"
      />
      <span className="text-[11px] text-cyan-soft font-mono">{value}</span>
    </div>
  );
}
