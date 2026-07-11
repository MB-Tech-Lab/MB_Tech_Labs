"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  DollarSign,
  MapPin,
  Users,
  Code2,
  CheckCircle2,
  GraduationCap,
  Target,
  Award,
  Briefcase,
  Calendar,
  Loader2,
} from "lucide-react";
import { ShaderBackground } from "@/components/mb-tech-labs/ShaderBackground";
import { FloatingNav } from "@/components/mb-tech-labs/FloatingNav";
import { Footer } from "@/components/mb-tech-labs/Footer";
import { careersApi, type InternshipPosition } from "@/lib/api/careers";

function formatDept(dept: string): string {
  const map: Record<string, string> = {
    FRONTEND: "Frontend", BACKEND: "Backend", FULLSTACK: "Full Stack",
    AI: "AI", UI_UX: "UI/UX", QA: "QA", DEVOPS: "DevOps", BA: "Business Analyst",
  };
  return map[dept] || dept;
}

function parseJsonArray(str?: string | null): string[] {
  if (!str) return [];
  try { return JSON.parse(str); } catch { return []; }
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [position, setPosition] = useState<InternshipPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    careersApi.getPosition(id)
      .then(setPosition)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <ShaderBackground />
        <Loader2 className="h-8 w-8 animate-spin text-cyan" />
      </div>
    );
  }

  if (error || !position) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <ShaderBackground />
        <FloatingNav />
        <div className="flex-1 flex items-center justify-center pt-32">
          <div className="text-center">
            <h1 className="font-display text-2xl font-semibold text-white">Position not found</h1>
            <p className="mt-2 text-[13px] text-white/55">{error || "This position may have been archived."}</p>
            <Link href="/careers" className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-cyan-soft hover:text-cyan">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to careers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const responsibilities = parseJsonArray(position.responsibilities);
  const skills = parseJsonArray(position.skillsRequired);
  const eligibility = parseJsonArray(position.eligibility);
  const techStack = parseJsonArray(position.techStack);
  const benefits = parseJsonArray(position.benefits);
  const selectionProcess = parseJsonArray(position.selectionProcess);

  return (
    <div className="relative min-h-screen flex flex-col">
      <ShaderBackground />
      <FloatingNav />
      <main className="relative z-10 flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-[900px] px-5 sm:px-8">
          {/* Breadcrumb */}
          <Link href="/careers" className="inline-flex items-center gap-1.5 text-[12.5px] text-white/55 hover:text-white transition-colors mb-6">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to all positions
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="rounded-md bg-cyan/10 border border-cyan/25 px-2 py-0.5 text-[10.5px] uppercase tracking-wider text-cyan-soft">
                {formatDept(position.department)}
              </span>
              <span className="rounded-md bg-emerald-400/10 border border-emerald-400/25 px-2 py-0.5 text-[10.5px] text-emerald-200">
                {position.openings} opening{position.openings === 1 ? "" : "s"}
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              {position.title}
            </h1>
            <p className="mt-3 text-[14px] text-white/55">
              {position.description.substring(0, 160)}{position.description.length > 160 ? "..." : ""}
            </p>

            {/* Quick info */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <InfoChip icon={Clock} label="Duration" value={position.duration} />
              <InfoChip icon={DollarSign} label="Stipend" value={position.stipend || "Unpaid"} />
              <InfoChip icon={MapPin} label="Location" value={position.mode} />
              <InfoChip icon={Users} label="Applied" value={`${position._count?.applications || 0}`} />
            </div>
          </motion.div>

          {/* Apply button */}
          {position.status === "PUBLISHED" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6"
            >
              <Link
                href={`/careers/${position.id}/apply`}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[14px] px-6 py-3.5 hover:bg-cyan-soft transition-all hover:shadow-[0_10px_30px_-6px_rgba(37,214,255,0.6)]"
              >
                Apply Now <ArrowRight className="h-4 w-4" />
              </Link>
              {position.applicationDeadline && (
                <p className="mt-2 text-[11.5px] text-white/45 inline-flex items-center gap-1.5 ml-3">
                  <Calendar className="h-3 w-3" />
                  Deadline: {new Date(position.applicationDeadline).toLocaleDateString()}
                </p>
              )}
            </motion.div>
          )}

          {/* Content sections */}
          <div className="mt-10 space-y-8">
            {/* Overview */}
            <Section title="Overview" icon={Briefcase}>
              <p className="text-[13.5px] text-white/70 leading-relaxed">{position.description}</p>
            </Section>

            {/* Responsibilities */}
            {responsibilities.length > 0 && (
              <Section title="Responsibilities" icon={Target}>
                <ul className="space-y-2">
                  {responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-white/70">
                      <CheckCircle2 className="h-4 w-4 text-cyan shrink-0 mt-0.5" />
                      {r}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <Section title="Skills Required" icon={Code2}>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <span key={i} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/75">
                      {s}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* Eligibility */}
            {eligibility.length > 0 && (
              <Section title="Eligibility" icon={GraduationCap}>
                <ul className="space-y-2">
                  {eligibility.map((e, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-white/70">
                      <CheckCircle2 className="h-4 w-4 text-cyan shrink-0 mt-0.5" />
                      {e}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Tech Stack */}
            {techStack.length > 0 && (
              <Section title="Technology Stack" icon={Code2}>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((t, i) => (
                    <span key={i} className="rounded-md border border-cyan/20 bg-cyan/[0.06] px-2.5 py-1 text-[12px] text-cyan-soft">
                      {t}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* Learning Outcome */}
            {position.learningOutcome && (
              <Section title="Learning Outcome" icon={Award}>
                <p className="text-[13.5px] text-white/70 leading-relaxed">{position.learningOutcome}</p>
              </Section>
            )}

            {/* Benefits */}
            {benefits.length > 0 && (
              <Section title="Benefits" icon={Award}>
                <ul className="space-y-2">
                  {benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-white/70">
                      <CheckCircle2 className="h-4 w-4 text-cyan shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Selection Process */}
            {selectionProcess.length > 0 && (
              <Section title="Selection Process" icon={Users}>
                <div className="flex flex-wrap items-center gap-2">
                  {selectionProcess.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="glass-panel rounded-lg px-3 py-1.5 text-[12px] text-white/75">
                        <span className="font-mono text-[10px] text-cyan-soft/60 mr-1.5">{i + 1}</span>
                        {s}
                      </span>
                      {i < selectionProcess.length - 1 && <ArrowRight className="h-3 w-3 text-white/30" />}
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Bottom CTA */}
          {position.status === "PUBLISHED" && (
            <div className="mt-10 glass-panel-strong rounded-2xl p-6 text-center">
              <h3 className="font-display text-[18px] font-semibold text-white">Ready to apply?</h3>
              <p className="mt-2 text-[13px] text-white/55">
                The application takes 10-15 minutes. You can save and resume later.
              </p>
              <Link
                href={`/careers/${position.id}/apply`}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[14px] px-6 py-3.5 hover:bg-cyan-soft transition-all"
              >
                Start Application <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function InfoChip({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="glass-panel rounded-xl p-3">
      <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/40">
        <Icon className="h-3 w-3" /> {label}
      </p>
      <p className="text-[13px] text-white/85 mt-0.5">{value}</p>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/25 text-cyan">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="font-display text-[16px] font-semibold text-white">{title}</h2>
      </div>
      <div className="pl-10">{children}</div>
    </motion.div>
  );
}
