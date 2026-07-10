"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Sparkles,
  User,
  GraduationCap,
  Code2,
  Briefcase,
  Trophy,
  Github,
  FileText,
  MessageSquare,
  Eye,
  Plus,
  Trash2,
} from "lucide-react";
import { ShaderBackground } from "@/components/mb-tech-labs/ShaderBackground";
import { FloatingNav } from "@/components/mb-tech-labs/FloatingNav";
import { Footer } from "@/components/mb-tech-labs/Footer";
import { careersApi } from "@/lib/api/careers";

const STEPS = [
  { label: "Personal", icon: User },
  { label: "Education", icon: GraduationCap },
  { label: "Skills", icon: Code2 },
  { label: "Projects", icon: Briefcase },
  { label: "Hackathons", icon: Trophy },
  { label: "Open Source", icon: Github },
  { label: "Portfolio", icon: FileText },
  { label: "Essays", icon: MessageSquare },
  { label: "Review", icon: Eye },
];

const ALL_SKILLS = [
  "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express.js",
  "Prisma", "PostgreSQL", "MySQL", "MongoDB", "Git", "Docker", "Python", "Java", "C++",
  "Flutter", "React Native",
];

const DRAFT_KEY = "mbtl_application_draft";

export default function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load draft from localStorage
  const [form, setForm] = useState(() => {
    if (typeof window === "undefined") return {};
    const saved = localStorage.getItem(DRAFT_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  // Auto-save to localStorage
  function updateForm(patch: Record<string, unknown>) {
    const next = { ...form, ...patch };
    setForm(next);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
  }

  function next() { setStep((s) => Math.min(8, s + 1)); }
  function prev() { setStep((s) => Math.max(0, s - 1)); }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      await careersApi.submitApplication({ ...form, positionId: id });
      setSubmitted(true);
      localStorage.removeItem(DRAFT_KEY);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <ShaderBackground />
        <FloatingNav />
        <main className="flex-1 flex items-center justify-center pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-panel-strong rounded-2xl p-8 max-w-md text-center mx-4"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan/15 border border-cyan/40 mx-auto">
              <Check className="h-8 w-8 text-cyan" />
            </div>
            <h1 className="mt-6 font-display text-2xl font-semibold text-white">Application Submitted!</h1>
            <p className="mt-3 text-[14px] text-white/60 leading-relaxed">
              Thank you for applying. Our team will review your application and get back to you within 5-7 business days.
            </p>
            <div className="mt-6 space-y-2">
              <Link href="/careers" className="block rounded-xl bg-cyan text-ink font-medium text-[13px] py-3 hover:bg-cyan-soft transition-all">
                Back to Careers
              </Link>
              <Link href="/" className="block rounded-xl border border-white/15 bg-white/[0.03] text-white font-medium text-[13px] py-3 hover:bg-white/[0.07] transition-all">
                Go to Home
              </Link>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <ShaderBackground />
      <FloatingNav />
      <main className="relative z-10 flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-[800px] px-5 sm:px-8">
          {/* Header */}
          <Link href={`/careers/${id}`} className="inline-flex items-center gap-1.5 text-[12.5px] text-white/55 hover:text-white transition-colors mb-4">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to job details
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
              <Sparkles className="h-3 w-3" /> Application
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Apply for Internship
          </h1>
          <p className="mt-1.5 text-[13px] text-white/55">
            Step {step + 1} of 9 · Your progress is auto-saved
          </p>

          {/* Progress bar */}
          <div className="mt-5 flex items-center gap-1.5">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isDone = i < step;
              const isCurrent = i === step;
              return (
                <div key={i} className="flex items-center gap-1.5 flex-1">
                  <div
                    className={`flex-1 h-1.5 rounded-full transition-all ${
                      isDone || isCurrent ? "bg-cyan" : "bg-white/10"
                    }`}
                  />
                  <button
                    onClick={() => i < step && setStep(i)}
                    className={`shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full border text-[10px] transition-all ${
                      isCurrent ? "bg-cyan text-ink border-cyan" : isDone ? "bg-cyan/20 text-cyan border-cyan/40" : "bg-white/[0.03] text-white/40 border-white/10"
                    }`}
                  >
                    {isDone ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-[13px] text-rose-200">
              {error}
            </div>
          )}

          {/* Step content */}
          <div className="mt-6 glass-panel rounded-2xl p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {step === 0 && <StepPersonal form={form} update={updateForm} />}
                {step === 1 && <StepEducation form={form} update={updateForm} />}
                {step === 2 && <StepSkills form={form} update={updateForm} />}
                {step === 3 && <StepProjects form={form} update={updateForm} />}
                {step === 4 && <StepHackathons form={form} update={updateForm} />}
                {step === 5 && <StepOpenSource form={form} update={updateForm} />}
                {step === 6 && <StepPortfolio form={form} update={updateForm} />}
                {step === 7 && <StepEssays form={form} update={updateForm} />}
                {step === 8 && <StepReview form={form} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={prev}
              disabled={step === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.03] text-white font-medium text-[13px] px-5 py-3 hover:bg-white/[0.07] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < 8 ? (
              <button
                onClick={next}
                className="inline-flex items-center gap-1.5 rounded-xl bg-cyan text-ink font-semibold text-[13px] px-5 py-3 hover:bg-cyan-soft transition-all"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[13px] px-6 py-3 hover:bg-cyan-soft disabled:opacity-50 transition-all"
              >
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <><Check className="h-4 w-4" /> Submit Application</>}
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ─── Input helpers ─── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-white/70 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "w-full rounded-lg bg-white/[0.04] border border-white/10 px-3.5 py-2.5 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/50 focus:ring-2 focus:ring-cyan/15 transition-all";

function TextInput({ value, onChange, placeholder, type = "text" }: { value?: string; onChange?: (v: string) => void; placeholder?: string; type?: string }) {
  return <input type={type} value={value || ""} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} className={inputClass} />;
}

function TextArea({ value, onChange, placeholder, rows = 4 }: { value?: string; onChange?: (v: string) => void; placeholder?: string; rows?: number }) {
  return <textarea value={value || ""} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} rows={rows} className={`${inputClass} resize-y`} />;
}

/* ─── Steps ─── */
function StepPersonal({ form, update }: { form: Record<string, unknown>; update: (p: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-[17px] font-semibold text-white">Personal Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name *"><TextInput value={form.name as string} onChange={(v) => update({ name: v })} placeholder="John Doe" /></Field>
        <Field label="Email *"><TextInput type="email" value={form.email as string} onChange={(v) => update({ email: v })} placeholder="john@example.com" /></Field>
        <Field label="Phone"><TextInput value={form.phone as string} onChange={(v) => update({ phone: v })} placeholder="+91 98765 43210" /></Field>
        <Field label="Date of Birth"><TextInput type="date" value={form.dateOfBirth as string} onChange={(v) => update({ dateOfBirth: v })} /></Field>
        <Field label="Gender">
          <select value={form.gender as string || ""} onChange={(e) => update({ gender: e.target.value })} className={inputClass}>
            <option value="">Select...</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </Field>
        <Field label="City"><TextInput value={form.city as string} onChange={(v) => update({ city: v })} placeholder="Mumbai" /></Field>
        <Field label="State"><TextInput value={form.state as string} onChange={(v) => update({ state: v })} placeholder="Maharashtra" /></Field>
        <Field label="Country"><TextInput value={form.country as string} onChange={(v) => update({ country: v })} placeholder="India" /></Field>
      </div>
    </div>
  );
}

function StepEducation({ form, update }: { form: Record<string, unknown>; update: (p: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-[17px] font-semibold text-white">Education</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="College"><TextInput value={form.college as string} onChange={(v) => update({ college: v })} placeholder="ABC College of Engineering" /></Field>
        <Field label="University"><TextInput value={form.university as string} onChange={(v) => update({ university: v })} placeholder="Mumbai University" /></Field>
        <Field label="Degree"><TextInput value={form.degree as string} onChange={(v) => update({ degree: v })} placeholder="B.Tech" /></Field>
        <Field label="Branch"><TextInput value={form.branch as string} onChange={(v) => update({ branch: v })} placeholder="Computer Science" /></Field>
        <Field label="CGPA"><TextInput type="number" value={form.cgpa as string} onChange={(v) => update({ cgpa: v ? parseFloat(v) : undefined })} placeholder="8.5" /></Field>
        <Field label="Current Semester"><TextInput type="number" value={form.currentSemester as string} onChange={(v) => update({ currentSemester: v ? parseInt(v) : undefined })} placeholder="6" /></Field>
        <Field label="Graduation Year"><TextInput type="number" value={form.graduationYear as string} onChange={(v) => update({ graduationYear: v ? parseInt(v) : undefined })} placeholder="2025" /></Field>
      </div>
    </div>
  );
}

function StepSkills({ form, update }: { form: Record<string, unknown>; update: (p: Record<string, unknown>) => void }) {
  const skills = (form.skills as string[]) || [];
  function toggle(skill: string) {
    const next = skills.includes(skill) ? skills.filter((s) => s !== skill) : [...skills, skill];
    update({ skills: next });
  }
  return (
    <div className="space-y-4">
      <h2 className="font-display text-[17px] font-semibold text-white">Technical Skills</h2>
      <p className="text-[12.5px] text-white/55">Select all technologies you're comfortable with.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ALL_SKILLS.map((skill) => {
          const active = skills.includes(skill);
          return (
            <button
              key={skill}
              type="button"
              onClick={() => toggle(skill)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-[12.5px] transition-all ${
                active ? "bg-cyan/10 border-cyan/40 text-white" : "bg-white/[0.03] border-white/10 text-white/60 hover:border-white/20"
              }`}
            >
              <span className={`inline-flex h-4 w-4 items-center justify-center rounded border ${active ? "bg-cyan border-cyan text-ink" : "border-white/20"}`}>
                {active && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
              </span>
              {skill}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepProjects({ form, update }: { form: Record<string, unknown>; update: (p: Record<string, unknown>) => void }) {
  const projects = (form.projects as Array<Record<string, string>>) || [];
  function addProject() { update({ projects: [...projects, {}] }); }
  function removeProject(i: number) { update({ projects: projects.filter((_, idx) => idx !== i) }); }
  function updateProject(i: number, patch: Record<string, string>) {
    const next = projects.map((p, idx) => idx === i ? { ...p, ...patch } : p);
    update({ projects: next });
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[17px] font-semibold text-white">Projects</h2>
        <button onClick={addProject} className="inline-flex items-center gap-1.5 rounded-lg bg-cyan/10 border border-cyan/25 text-cyan-soft text-[12px] px-3 py-1.5 hover:bg-cyan/15 transition-all">
          <Plus className="h-3.5 w-3.5" /> Add Project
        </button>
      </div>
      {projects.length === 0 ? (
        <p className="text-[12.5px] text-white/45 py-4 text-center">No projects added yet. Click "Add Project" to add your first.</p>
      ) : (
        <div className="space-y-3">
          {projects.map((p, i) => (
            <div key={i} className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-cyan-soft/60">Project {i + 1}</span>
                <button onClick={() => removeProject(i)} className="text-white/40 hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Name"><TextInput value={p.name} onChange={(v) => updateProject(i, { name: v })} placeholder="E-commerce Website" /></Field>
                <Field label="Technology"><TextInput value={p.technology} onChange={(v) => updateProject(i, { technology: v })} placeholder="React, Node.js" /></Field>
                <Field label="GitHub URL"><TextInput value={p.githubUrl} onChange={(v) => updateProject(i, { githubUrl: v })} placeholder="https://github.com/..." /></Field>
                <Field label="Live Demo"><TextInput value={p.liveDemoUrl} onChange={(v) => updateProject(i, { liveDemoUrl: v })} placeholder="https://..." /></Field>
              </div>
              <Field label="Description"><TextArea value={p.description} onChange={(v) => updateProject(i, { description: v })} placeholder="What does this project do?" rows={2} /></Field>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StepHackathons({ form, update }: { form: Record<string, unknown>; update: (p: Record<string, unknown>) => void }) {
  const hackathons = (form.hackathons as Array<Record<string, string>>) || [];
  function add() { update({ hackathons: [...hackathons, {}] }); }
  function remove(i: number) { update({ hackathons: hackathons.filter((_, idx) => idx !== i) }); }
  function updateH(i: number, patch: Record<string, string>) { update({ hackathons: hackathons.map((h, idx) => idx === i ? { ...h, ...patch } : h) }); }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[17px] font-semibold text-white">Hackathons</h2>
        <button onClick={add} className="inline-flex items-center gap-1.5 rounded-lg bg-cyan/10 border border-cyan/25 text-cyan-soft text-[12px] px-3 py-1.5 hover:bg-cyan/15 transition-all">
          <Plus className="h-3.5 w-3.5" /> Add Hackathon
        </button>
      </div>
      {hackathons.length === 0 ? (
        <p className="text-[12.5px] text-white/45 py-4 text-center">No hackathons added. This is optional but strengthens your application.</p>
      ) : (
        <div className="space-y-3">
          {hackathons.map((h, i) => (
            <div key={i} className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-cyan-soft/60">Hackathon {i + 1}</span>
                <button onClick={() => remove(i)} className="text-white/40 hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Name"><TextInput value={h.name} onChange={(v) => updateH(i, { name: v })} placeholder="Smart India Hackathon" /></Field>
                <Field label="Year"><TextInput type="number" value={h.year} onChange={(v) => updateH(i, { year: v })} placeholder="2024" /></Field>
                <Field label="Rank"><TextInput value={h.rank} onChange={(v) => updateH(i, { rank: v })} placeholder="1st Place" /></Field>
                <Field label="Repository"><TextInput value={h.repositoryUrl} onChange={(v) => updateH(i, { repositoryUrl: v })} placeholder="https://github.com/..." /></Field>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StepOpenSource({ form, update }: { form: Record<string, unknown>; update: (p: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-[17px] font-semibold text-white">Open Source & GitHub</h2>
      <Field label="GitHub Profile URL"><TextInput value={form.githubProfile as string} onChange={(v) => update({ githubProfile: v })} placeholder="https://github.com/username" /></Field>
      <p className="text-[12px] text-white/45">We'll review your repositories, stars, contributions, and pull requests. Quality matters more than quantity.</p>
    </div>
  );
}

function StepPortfolio({ form, update }: { form: Record<string, unknown>; update: (p: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-[17px] font-semibold text-white">Portfolio</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Portfolio Website"><TextInput value={form.portfolioWebsite as string} onChange={(v) => update({ portfolioWebsite: v })} placeholder="https://yourportfolio.com" /></Field>
        <Field label="LinkedIn Profile"><TextInput value={form.linkedinProfile as string} onChange={(v) => update({ linkedinProfile: v })} placeholder="https://linkedin.com/in/..." /></Field>
      </div>
      <Field label="Resume Path (URL)"><TextInput value={form.resumePath as string} onChange={(v) => update({ resumePath: v })} placeholder="https://drive.google.com/..." /></Field>
      <p className="text-[12px] text-white/45">Upload your resume to Google Drive or Dropbox and paste the public link here.</p>
    </div>
  );
}

function StepEssays({ form, update }: { form: Record<string, unknown>; update: (p: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-[17px] font-semibold text-white">Essay Questions</h2>
      <p className="text-[12.5px] text-white/55">Take your time. These answers matter more than your CGPA.</p>
      <Field label="Why do you want to join MB Tech Labs?"><TextArea value={form.whyJoin as string} onChange={(v) => update({ whyJoin: v })} placeholder="Tell us what excites you about joining..." /></Field>
      <Field label="What technologies are you most interested in?"><TextArea value={form.techInterest as string} onChange={(v) => update({ techInterest: v })} placeholder="React, AI, mobile, cloud..." /></Field>
      <Field label="Describe your best project."><TextArea value={form.bestProject as string} onChange={(v) => update({ bestProject: v })} placeholder="What did you build? What was your role? What did you learn?" /></Field>
      <Field label="What are your career goals?"><TextArea value={form.careerGoals as string} onChange={(v) => update({ careerGoals: v })} placeholder="Where do you see yourself in 3 years?" /></Field>
    </div>
  );
}

function StepReview({ form }: { form: Record<string, unknown> }) {
  const skills = (form.skills as string[]) || [];
  const projects = (form.projects as Array<Record<string, string>>) || [];
  const hackathons = (form.hackathons as Array<Record<string, string>>) || [];
  return (
    <div className="space-y-5">
      <h2 className="font-display text-[17px] font-semibold text-white">Review Your Application</h2>
      <p className="text-[12.5px] text-white/55">Please review everything before submitting. You won't be able to edit after submission.</p>

      <ReviewCard title="Personal">
        <ReviewRow label="Name" value={form.name as string} />
        <ReviewRow label="Email" value={form.email as string} />
        <ReviewRow label="Phone" value={form.phone as string} />
        <ReviewRow label="Location" value={`${form.city || ""}, ${form.country || ""}`} />
      </ReviewCard>

      <ReviewCard title="Education">
        <ReviewRow label="College" value={form.college as string} />
        <ReviewRow label="Degree" value={`${form.degree || ""} ${form.branch || ""}`} />
        <ReviewRow label="CGPA" value={form.cgpa as string} />
        <ReviewRow label="Graduation" value={form.graduationYear as string} />
      </ReviewCard>

      <ReviewCard title={`Skills (${skills.length})`}>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => <span key={s} className="rounded border border-cyan/20 bg-cyan/[0.06] px-2 py-0.5 text-[11px] text-cyan-soft">{s}</span>)}
          </div>
        ) : <p className="text-[12px] text-white/40">No skills selected</p>}
      </ReviewCard>

      <ReviewCard title={`Projects (${projects.length})`}>
        {projects.map((p, i) => <ReviewRow key={i} label={p.name || `Project ${i + 1}`} value={p.technology} />)}
      </ReviewCard>

      <ReviewCard title={`Hackathons (${hackathons.length})`}>
        {hackathons.map((h, i) => <ReviewRow key={i} label={h.name || `Hackathon ${i + 1}`} value={h.rank} />)}
      </ReviewCard>

      <ReviewCard title="Portfolio">
        <ReviewRow label="GitHub" value={form.githubProfile as string} />
        <ReviewRow label="LinkedIn" value={form.linkedinProfile as string} />
        <ReviewRow label="Website" value={form.portfolioWebsite as string} />
      </ReviewCard>
    </div>
  );
}

function ReviewCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
      <h3 className="font-display text-[13px] font-semibold text-white mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-2">
      <span className="text-[11.5px] text-white/45">{label}</span>
      <span className="text-[12px] text-white/80">{value || "—"}</span>
    </div>
  );
}
