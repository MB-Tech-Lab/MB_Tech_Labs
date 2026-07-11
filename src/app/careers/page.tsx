"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  GraduationCap,
  Code2,
  Trophy,
  Github,
  Heart,
  Briefcase,
  Clock,
  DollarSign,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Target,
  Rocket,
  Users,
  Award,
  Linkedin,
  Instagram,
  Check,
  ChevronDown,
  MessageSquare,
  PenTool,
  FileText,
  Layers,
  Search,
  Calendar,
  Coffee,
  Lightbulb,
} from "lucide-react";
import { ShaderBackground } from "@/components/mb-tech-labs/ShaderBackground";
import { FloatingNav } from "@/components/mb-tech-labs/FloatingNav";
import { Footer } from "@/components/mb-tech-labs/Footer";
import { careersApi, type InternshipPosition } from "@/lib/api/careers";

/* ──────────────────────────────────────────────
   STATIC CONTENT — future CMS
   ────────────────────────────────────────────── */

const ELIGIBILITY = [
  { icon: GraduationCap, title: "Final Year Students", desc: "Currently in your final year of college and looking to start your career." },
  { icon: Award, title: "Recent Graduates", desc: "Graduated in the last 12 months and passionate about software engineering." },
  { icon: Code2, title: "Students with Projects", desc: "You've built personal projects — web apps, mobile apps, or APIs — on your own." },
  { icon: Trophy, title: "Hackathon Participants", desc: "You've competed in hackathons and know how to build under pressure." },
  { icon: Github, title: "Open Source Contributors", desc: "You've contributed to open source repos, even small PRs count." },
  { icon: Heart, title: "Self Learners", desc: "You learned programming through YouTube, courses, or sheer curiosity." },
];

const WHAT_WE_LOOK_FOR = [
  "Programming Fundamentals", "Problem Solving", "GitHub Portfolio", "Communication",
  "Learning Ability", "Teamwork", "Curiosity",
];

const DOMAINS = [
  { icon: Layers, title: "Frontend", desc: "React, Next.js, TypeScript, Tailwind" },
  { icon: Code2, title: "Backend", desc: "Node.js, Express, PostgreSQL, Prisma" },
  { icon: Briefcase, title: "Full Stack", desc: "End-to-end web application development" },
  { icon: PenTool, title: "UI/UX", desc: "Figma, design systems, user research" },
  { icon: Sparkles, title: "AI", desc: "LLMs, RAG, OpenAI, Gemini, Claude" },
  { icon: Check, title: "QA", desc: "Cypress, Playwright, automated testing" },
  { icon: Target, title: "Business Analyst", desc: "Requirements analysis, process mapping" },
];

const LEARNING_JOURNEY = [
  { period: "Week 1–2", title: "Training", desc: "Company orientation, technology stack training, and development environment setup." },
  { period: "Month 2", title: "Internal Project", desc: "Build features on MB Tech Labs internal tools with mentor code reviews." },
  { period: "Month 3", title: "Client Project", desc: "Ship code to production that real businesses depend on. Your work matters." },
  { period: "Ongoing", title: "Mentorship", desc: "A senior engineer reviews your code daily and unblocks you in minutes, not days." },
  { period: "Weekly", title: "Reviews", desc: "Structured feedback every Friday — what went well, what to improve, what's next." },
  { period: "Completion", title: "Certificate", desc: "Receive a verified internship completion certificate with your achievements." },
  { period: "Top Performers", title: "Full-Time Opportunity", desc: "Best interns receive a full-time job offer as a Junior Software Engineer." },
];

const HIRING_PROCESS = [
  { step: "Application", desc: "Submit your details, projects, and essay responses" },
  { step: "Resume Review", desc: "We review your background, education, and experience" },
  { step: "Project Review", desc: "We evaluate your GitHub repos and live demos" },
  { step: "Technical Discussion", desc: "40-minute conversation about your code and approach" },
  { step: "Final Discussion", desc: "Culture fit, expectations, logistics, and timeline" },
  { step: "Offer", desc: "Formal offer letter with start date and stipend" },
  { step: "Joining", desc: "Welcome to the team — your journey begins!" },
];

const LIFE_AT_MB = [
  { icon: Coffee, title: "Office Culture", desc: "Open, collaborative, and judgement-free. Questions are encouraged, not dismissed." },
  { icon: Trophy, title: "Hackathons", desc: "We participate in and host hackathons. Innovation nights with pizza and code." },
  { icon: Lightbulb, title: "Learning Sessions", desc: "Weekly tech talks, code reviews, and knowledge-sharing sessions." },
  { icon: Users, title: "Mentorship", desc: "Every intern gets a dedicated mentor. You're never stuck alone." },
  { icon: Rocket, title: "Real Projects", desc: "No toy projects. You build software that real businesses use." },
  { icon: Github, title: "Open Source", desc: "We contribute to open source and encourage interns to do the same." },
];

const FAQS = [
  {
    q: "Do I need previous internship experience?",
    a: "No. We specifically look for students and fresh graduates without previous corporate experience. If you've built projects on your own, participated in hackathons, or contributed to open source, you're exactly who we're looking for.",
  },
  {
    q: "What's the internship duration?",
    a: "Our internships typically run for 3 to 6 months, depending on the role and your availability. We can discuss part-time options if you're still in college.",
  },
  {
    q: "Is the internship paid?",
    a: "Yes. All our internships come with a monthly stipend. The exact amount depends on the role, your skills, and the project. Details are mentioned in each position's listing.",
  },
  {
    q: "Can I apply if I'm in my third year?",
    a: "Absolutely. Third-year students are welcome to apply, especially if you've built projects or participated in hackathons. We can accommodate your college schedule.",
  },
  {
    q: "What happens after the internship?",
    a: "Top-performing interns receive a full-time job offer as a Junior Software Engineer. Even if you're not converted, you leave with real project experience, a certificate, and a strong portfolio.",
  },
  {
    q: "What technologies will I work with?",
    a: "Our primary stack is React, Next.js, TypeScript, Node.js, PostgreSQL, and Prisma. Depending on your domain, you may also work with AI APIs (OpenAI, Gemini), mobile frameworks (React Native), or cloud platforms (AWS, GCP).",
  },
];

/* ──────────────────────────────────────────────
   HELPER
   ────────────────────────────────────────────── */

function formatDept(dept: string): string {
  const map: Record<string, string> = {
    FRONTEND: "Frontend", BACKEND: "Backend", FULLSTACK: "Full Stack",
    AI: "AI", UI_UX: "UI/UX", QA: "QA", DEVOPS: "DevOps", BA: "Business Analyst",
  };
  return map[dept] || dept;
}

/* ──────────────────────────────────────────────
   PAGE COMPONENT
   ────────────────────────────────────────────── */

export default function CareersPage() {
  const [positions, setPositions] = useState<InternshipPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    let cancelled = false;
    careersApi.listPositions()
      .then((result) => {
        if (cancelled) return;
        const data = Array.isArray(result) ? result : (result as { data: InternshipPosition[] })?.data;
        setPositions(data || []);
      })
      .catch(() => {
        if (cancelled) return;
        setPositions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const hasActivePositions = !loading && positions.length > 0;

  return (
    <div className="relative min-h-screen flex flex-col">
      <ShaderBackground />
      <FloatingNav />

      <main className="relative z-10 flex-1 pt-28 pb-20">
        {/* ─── 1. HERO ─── */}
        <section className="px-5 sm:px-8">
          <div className="mx-auto max-w-[1000px]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-cyan-soft">
                <GraduationCap className="h-3.5 w-3.5 text-cyan" />
                Internship & Graduate Program
              </span>
              <h1 className="mt-6 font-display font-semibold text-white tracking-[-0.025em] text-[36px] sm:text-5xl md:text-[60px] md:leading-[1.05]">
                Start Your{" "}
                <span className="text-gradient-cyan">Software Engineering</span>{" "}
                Journey
              </h1>
              <p className="mt-6 text-[15px] sm:text-[18px] leading-relaxed text-white/60 max-w-2xl mx-auto">
                No previous internship required. No corporate experience required.
                If you've built projects, participated in hackathons, or love
                building software, MB Tech Labs is where you can start your career.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="#program"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[14.5px] px-6 py-3.5 hover:bg-cyan-soft transition-all hover:shadow-[0_12px_40px_-8px_rgba(37,214,255,0.65)]"
                >
                  Explore Internship Program
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#positions"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] backdrop-blur-md text-white font-medium text-[14.5px] px-6 py-3.5 hover:bg-white/[0.07] hover:border-white/25 transition-all"
                >
                  View Open Positions
                  <ArrowUpRight className="h-4 w-4 text-cyan" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── 2. ABOUT THE PROGRAM ─── */}
        <section id="program" className="mt-24 px-5 sm:px-8">
          <div className="mx-auto max-w-[800px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-[11px] font-display font-semibold uppercase tracking-[0.22em] text-cyan-soft/70">
                Our Philosophy
              </span>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-tight">
                "We don't hire experience.{" "}
                <span className="text-gradient-cyan">We build experience.</span>"
              </h2>
              <div className="mt-6 space-y-4 text-[14.5px] text-white/60 leading-relaxed">
                <p>
                  Most companies ask for 2–3 years of experience for an entry-level
                  role. We think that's broken. How can a fresh graduate have
                  experience if no one gives them their first opportunity?
                </p>
                <p>
                  At MB Tech Labs, we do things differently. We hire students and
                  fresh graduates based on <strong className="text-white/80">potential</strong>,
                  not pedigree. If you've built projects, solved problems, and
                  show a genuine passion for software engineering, we want to meet you.
                </p>
                <p>
                  Every intern gets a dedicated mentor, works on real client
                  projects (not toy assignments), and receives structured weekly
                  feedback. By month 3, you'll be shipping code that real
                  businesses depend on.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── 3. WHO CAN APPLY ─── */}
        <section className="mt-24 px-5 sm:px-8">
          <div className="mx-auto max-w-[1100px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                Who Can <span className="text-gradient-cyan">Apply?</span>
              </h2>
              <p className="mt-3 text-[14px] text-white/50 max-w-lg mx-auto">
                You don't need a fancy resume. You need passion and proof that you build things.
              </p>
            </motion.div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ELIGIBILITY.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="glass-panel rounded-2xl p-6 hover:border-cyan/25 transition-colors"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/25 text-cyan">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-display font-semibold text-[15px] text-white">{item.title}</h3>
                    <p className="mt-2 text-[13px] text-white/55 leading-relaxed">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── 4. WHAT WE LOOK FOR ─── */}
        <section className="mt-24 px-5 sm:px-8">
          <div className="mx-auto max-w-[800px] text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                What We <span className="text-gradient-cyan">Look For</span>
              </h2>
              <p className="mt-3 text-[14px] text-white/50">
                Instead of years of experience, we evaluate these 7 signals.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2.5">
                {WHAT_WE_LOOK_FOR.map((skill, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-4 py-2.5 text-[13px] text-white/80"
                  >
                    <Check className="h-3.5 w-3.5 text-cyan" strokeWidth={3} />
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── 5. INTERNSHIP DOMAINS ─── */}
        <section className="mt-24 px-5 sm:px-8">
          <div className="mx-auto max-w-[1100px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                Internship <span className="text-gradient-cyan">Domains</span>
              </h2>
              <p className="mt-3 text-[14px] text-white/50">
                Choose a domain that matches your interests. You can switch later.
              </p>
            </motion.div>
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {DOMAINS.map((d, i) => {
                const Icon = d.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="glass-panel rounded-2xl p-5 text-center hover:border-cyan/25 transition-colors group"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/25 text-cyan group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-3 font-display font-semibold text-[14px] text-white">{d.title}</h3>
                    <p className="mt-1.5 text-[11.5px] text-white/45">{d.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── 6. LEARNING JOURNEY ─── */}
        <section className="mt-24 px-5 sm:px-8">
          <div className="mx-auto max-w-[800px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                Your <span className="text-gradient-cyan">Learning Journey</span>
              </h2>
              <p className="mt-3 text-[14px] text-white/50">
                A structured path from your first day to a potential full-time offer.
              </p>
            </motion.div>
            <div className="mt-12">
              {LEARNING_JOURNEY.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="relative flex gap-5 pb-8 last:pb-0"
                >
                  {i < LEARNING_JOURNEY.length - 1 && (
                    <div className="absolute left-[19px] top-12 bottom-0 w-px bg-gradient-to-b from-cyan/30 to-transparent" />
                  )}
                  <span className="relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan/15 border-2 border-cyan/30 text-cyan text-[12px] font-mono font-semibold">
                    {i + 1}
                  </span>
                  <div className="pt-1">
                    <p className="text-[10.5px] uppercase tracking-[0.15em] text-cyan-soft/70 font-semibold">{step.period}</p>
                    <h3 className="font-display font-semibold text-[15px] text-white mt-0.5">{step.title}</h3>
                    <p className="text-[13px] text-white/55 mt-1.5 leading-relaxed max-w-md">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 7. HIRING PROCESS ─── */}
        <section className="mt-24 px-5 sm:px-8">
          <div className="mx-auto max-w-[1000px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                Hiring <span className="text-gradient-cyan">Process</span>
              </h2>
              <p className="mt-3 text-[14px] text-white/50">
                7 steps from application to joining. No surprises.
              </p>
            </motion.div>
            <div className="mt-12 flex flex-wrap justify-center gap-2.5">
              {HIRING_PROCESS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="flex items-center gap-2.5"
                >
                  <div className="glass-panel rounded-xl px-4 py-3 text-center min-w-[130px]">
                    <p className="font-mono text-[10px] text-cyan-soft/60">Step {i + 1}</p>
                    <p className="text-[12.5px] font-medium text-white mt-0.5">{step.step}</p>
                    <p className="text-[10px] text-white/40 mt-0.5">{step.desc}</p>
                  </div>
                  {i < HIRING_PROCESS.length - 1 && (
                    <ArrowRight className="h-3.5 w-3.5 text-white/25 shrink-0" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 8. OPEN POSITIONS (database-driven) ─── */}
        <section id="positions" className="mt-24 px-5 sm:px-8">
          <div className="mx-auto max-w-[1100px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                Open <span className="text-gradient-cyan">Positions</span>
              </h2>
              <p className="mt-3 text-[14px] text-white/50">
                {hasActivePositions
                  ? `${positions.length} internship${positions.length === 1 ? "" : "s"} currently open.`
                  : "Check back soon for new opportunities."}
              </p>
            </motion.div>

            {loading ? (
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-panel rounded-2xl p-5 animate-pulse">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-2">
                        <div className="h-5 w-20 rounded-md bg-white/10" />
                        <div className="h-4 w-40 rounded bg-white/10" />
                      </div>
                      <div className="h-5 w-12 rounded-md bg-white/10" />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="h-3 w-24 rounded bg-white/8" />
                      <div className="h-3 w-32 rounded bg-white/8" />
                    </div>
                  </div>
                ))}
              </div>
            ) : hasActivePositions ? (
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {positions.map((pos, i) => (
                  <motion.div
                    key={pos.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                  >
                    <Link href={`/careers/${pos.id}`}>
                      <div className="glass-panel rounded-2xl p-5 h-full hover:border-cyan/25 transition-colors group cursor-pointer">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="rounded-md bg-cyan/10 border border-cyan/25 px-2 py-0.5 text-[9.5px] uppercase tracking-wider text-cyan-soft">
                              {formatDept(pos.department)}
                            </span>
                            <h3 className="mt-2 font-display font-semibold text-[15px] text-white group-hover:text-cyan-soft transition-colors">
                              {pos.title}
                            </h3>
                          </div>
                          {pos.openings > 0 && (
                            <span className="rounded-md bg-emerald-400/10 border border-emerald-400/25 px-1.5 py-0.5 text-[9.5px] text-emerald-200">
                              {pos.openings} open
                            </span>
                          )}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-white/55">
                          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{pos.duration}</span>
                          {pos.stipend && <span className="inline-flex items-center gap-1"><DollarSign className="h-3 w-3" />{pos.stipend}</span>}
                          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{pos.mode}</span>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-[11px] text-white/40">
                            {pos._count?.applications || 0} applied
                          </span>
                          <span className="inline-flex items-center gap-1 text-[12px] text-cyan-soft group-hover:text-cyan transition-colors">
                            View & Apply <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="mt-10 glass-panel rounded-2xl py-16 text-center max-w-xl mx-auto">
                <Briefcase className="h-10 w-10 text-white/30 mx-auto mb-4" />
                <h3 className="font-display text-[16px] font-semibold text-white">
                  No internship openings at the moment.
                </h3>
                <p className="mt-2 text-[13.5px] text-white/50 max-w-sm mx-auto leading-relaxed">
                  We're not actively hiring right now, but we're always interested
                  in connecting with talented students and fresh graduates.
                  Follow MB Tech Labs for future internship opportunities.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="https://linkedin.com/company/mbtechlabs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[13px] px-5 py-2.5 hover:bg-cyan-soft transition-all"
                  >
                    <Linkedin className="h-4 w-4" />
                    Follow on LinkedIn
                  </a>
                  <a
                    href="https://instagram.com/mbtechlabs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] text-white font-medium text-[13px] px-5 py-2.5 hover:bg-white/[0.07] transition-all"
                  >
                    <Instagram className="h-4 w-4 text-cyan" />
                    Follow on Instagram
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ─── 9. LIFE AT MB TECH LABS ─── */}
        <section className="mt-24 px-5 sm:px-8">
          <div className="mx-auto max-w-[1100px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                Life at <span className="text-gradient-cyan">MB Tech Labs</span>
              </h2>
              <p className="mt-3 text-[14px] text-white/50">
                More than just code. Here's what it's like to be part of our team.
              </p>
            </motion.div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {LIFE_AT_MB.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="glass-panel rounded-2xl p-6 hover:border-cyan/25 transition-colors"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/25 text-cyan">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-display font-semibold text-[14px] text-white">{item.title}</h3>
                    <p className="mt-2 text-[12.5px] text-white/55 leading-relaxed">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── 10. FAQ ─── */}
        <section className="mt-24 px-5 sm:px-8">
          <div className="mx-auto max-w-[800px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                Frequently Asked{" "}
                <span className="text-gradient-cyan">Questions</span>
              </h2>
            </motion.div>
            <div className="mt-10 space-y-3">
              {FAQS.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className={`glass-panel rounded-xl overflow-hidden transition-colors duration-300 ${
                      isOpen ? "border-cyan/25" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                    >
                      <span className="font-display font-medium text-[13.5px] text-white">
                        {faq.q}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/[0.04] border border-white/10"
                      >
                        <ChevronDown className="h-3.5 w-3.5 text-cyan" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-4 text-[13px] leading-relaxed text-white/60">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── 11. FINAL CTA ─── */}
        <section className="mt-24 px-5 sm:px-8">
          <div className="mx-auto max-w-[700px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="glass-panel-strong rounded-2xl p-8 sm:p-12 text-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
                <Rocket className="h-3.5 w-3.5 text-cyan" />
                Start Your Career
              </span>
              <h2 className="mt-5 font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                Ready to Start Your Career?
              </h2>
              <p className="mt-4 text-[14px] text-white/55 max-w-md mx-auto leading-relaxed">
                Don't wait for the "perfect" moment. If you love building things,
                apply when positions open — or follow us to stay connected.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                {hasActivePositions ? (
                  <a
                    href="#positions"
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[14.5px] px-6 py-3.5 hover:bg-cyan-soft transition-all hover:shadow-[0_10px_30px_-6px_rgba(37,214,255,0.6)]"
                  >
                    Apply Today
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ) : (
                  <a
                    href="https://linkedin.com/company/mbtechlabs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[14.5px] px-6 py-3.5 hover:bg-cyan-soft transition-all"
                  >
                    <Linkedin className="h-4 w-4" />
                    Follow MB Tech Labs
                  </a>
                )}
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] text-white font-medium text-[14.5px] px-6 py-3.5 hover:bg-white/[0.07] transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
