"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  Users,
  ArrowRight,
  Loader2,
  Target,
  Eye,
  Rocket,
  Users as UsersIcon,
  Award,
  Linkedin,
  Instagram,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { ShaderBackground } from "@/components/mb-tech-labs/ShaderBackground";
import { FloatingNav } from "@/components/mb-tech-labs/FloatingNav";
import { Footer } from "@/components/mb-tech-labs/Footer";
import { careersApi, type InternshipPosition } from "@/lib/api/careers";

const ELIGIBILITY = [
  { icon: GraduationCap, label: "Final Year Students" },
  { icon: Award, label: "Recent Graduates" },
  { icon: Code2, label: "Third Year Students" },
  { icon: Briefcase, label: "Students with Strong Projects" },
  { icon: Trophy, label: "Hackathon Participants" },
  { icon: Github, label: "Open Source Contributors" },
  { icon: Heart, label: "Passionate Self Learners" },
];

const SKILLS_WE_LOOK_FOR = [
  "Problem Solving", "Programming Fundamentals", "Projects", "GitHub",
  "Hackathons", "Communication", "Learning Attitude", "Teamwork",
  "Modern Web Technologies", "Database Basics",
];

const LEARNING_JOURNEY = [
  { period: "Week 1-2", title: "Company Orientation", desc: "Learn our workflows, tools, and culture" },
  { period: "Week 3-4", title: "Technology Training", desc: "Hands-on training in your assigned stack" },
  { period: "Month 2", title: "Internal Projects", desc: "Build real features on internal products" },
  { period: "Month 3", title: "Real Client Projects", desc: "Ship code that real users depend on" },
  { period: "Evaluation", title: "Performance Review", desc: "Get structured feedback from your mentor" },
  { period: "Certificate", title: "Internship Certificate", desc: "Receive a verified completion certificate" },
  { period: "Top Performers", title: "Full-Time Opportunity", desc: "Best interns get a job offer" },
];

const HIRING_PROCESS = [
  { step: "Application", desc: "Submit your details, projects, and essays" },
  { step: "Resume Review", desc: "We review your background and projects" },
  { step: "Project Review", desc: "We evaluate your GitHub and live demos" },
  { step: "Technical Discussion", desc: "40-min chat about your code and approach" },
  { step: "Final HR Discussion", desc: "Culture fit, expectations, and logistics" },
  { step: "Offer Letter", desc: "Formal offer with start date and stipend" },
  { step: "Joining", desc: "Welcome to the team!" },
  { step: "Training", desc: "Begin your structured learning journey" },
];

function formatDept(dept: string): string {
  const map: Record<string, string> = {
    FRONTEND: "Frontend", BACKEND: "Backend", FULLSTACK: "Full Stack",
    AI: "AI", UI_UX: "UI/UX", QA: "QA", DEVOPS: "DevOps", BA: "Business Analyst",
  };
  return map[dept] || dept;
}

export default function CareersPage() {
  const [positions, setPositions] = useState<InternshipPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    careersApi.listPositions()
      .then((result) => {
        // Handle both array (public) and paginated (admin) responses
        const data = Array.isArray(result) ? result : (result as { data: InternshipPosition[] }).data;
        setPositions(data || []);
      })
      .catch(() => {
        // API failed — treat as no positions
        setPositions([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const hasActivePositions = !loading && !error && positions.length > 0;

  return (
    <div className="relative min-h-screen flex flex-col">
      <ShaderBackground />
      <FloatingNav />
      <main className="relative z-10 flex-1 pt-32 pb-20">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-cyan-soft">
              <Sparkles className="h-3.5 w-3.5 text-cyan" />
              Internship & Graduate Program
            </span>
            <h1 className="mt-6 font-display font-semibold text-white tracking-[-0.025em] text-[36px] sm:text-5xl md:text-[64px] md:leading-[1.05]">
              Start Your{" "}
              <span className="text-gradient-cyan">Software Engineering</span>{" "}
              Journey
            </h1>
            <p className="mt-6 text-[15px] sm:text-[17px] leading-relaxed text-white/65 max-w-2xl mx-auto">
              No previous internship required. No corporate experience required.
              If you have built projects, love programming, and want to work on
              real client software, MB Tech Labs is the right place to begin your career.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              {hasActivePositions ? (
                <a href="#openings" className="inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[14.5px] px-6 py-3.5 hover:bg-cyan-soft transition-all">
                  View Internship Openings <ArrowRight className="h-4 w-4" />
                </a>
              ) : (
                <a href="#stay-connected" className="inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[14.5px] px-6 py-3.5 hover:bg-cyan-soft transition-all">
                  Stay Connected <ArrowRight className="h-4 w-4" />
                </a>
              )}
              <a href="#learning" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] text-white font-medium text-[14.5px] px-6 py-3.5 hover:bg-white/[0.07] transition-all">
                Explore Learning Journey
              </a>
            </div>
          </motion.div>

          {/* MISSION */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-24 max-w-4xl mx-auto text-center"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              Why <span className="text-gradient-cyan">MB Tech Labs?</span>
            </h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: Target, title: "We train future engineers", desc: "You don't need to know everything on day one. We teach you the stack, the patterns, and the standards." },
                { icon: Code2, title: "Practical experience > resumes", desc: "A GitHub with 3 real projects beats a resume with 3 internships. We look at what you've built, not where you've been." },
                { icon: Rocket, title: "Real client products", desc: "Every intern ships code to production. You'll work on software that real businesses depend on from month 2." },
                { icon: UsersIcon, title: "Mentor for every intern", desc: "You're assigned a senior engineer who reviews your code daily and unblocks you within minutes, not days." },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="glass-panel rounded-2xl p-6 text-left"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/25 text-cyan">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-display font-semibold text-[15px] text-white">{item.title}</h3>
                    <p className="mt-2 text-[13px] text-white/55 leading-relaxed">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* WHO CAN APPLY */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-24"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight text-center">
              Who Can <span className="text-gradient-cyan">Apply?</span>
            </h2>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
              {ELIGIBILITY.map((e, i) => {
                const Icon = e.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                    className="glass-panel rounded-xl p-4 text-center"
                  >
                    <Icon className="h-5 w-5 text-cyan mx-auto" />
                    <p className="mt-2 text-[12px] text-white/75 font-medium">{e.label}</p>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-6 max-w-2xl mx-auto rounded-xl border border-amber-400/25 bg-amber-400/[0.06] px-5 py-4 text-center">
              <p className="text-[13px] text-amber-200">
                <CheckCircle2 className="inline h-4 w-4 mr-1.5" />
                Previous internship experience is <strong>NOT</strong> required.
                Professional company experience is <strong>NOT</strong> required.
              </p>
            </div>
          </motion.div>

          {/* WHAT WE LOOK FOR */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-24"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight text-center">
              What We <span className="text-gradient-cyan">Look For</span>
            </h2>
            <p className="mt-3 text-[14px] text-white/55 text-center max-w-xl mx-auto">
              Instead of years of experience, we evaluate these 10 signals.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {SKILLS_WE_LOOK_FOR.map((skill, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="rounded-full border border-cyan/25 bg-cyan/[0.06] px-4 py-2 text-[12.5px] text-white/80"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* LEARNING JOURNEY */}
          <motion.div
            id="learning"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-24"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight text-center">
              Your <span className="text-gradient-cyan">Learning Journey</span>
            </h2>
            <div className="mt-12 max-w-2xl mx-auto">
              {LEARNING_JOURNEY.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="relative flex gap-4 pb-8 last:pb-0"
                >
                  {i < LEARNING_JOURNEY.length - 1 && (
                    <div className="absolute left-[15px] top-10 bottom-0 w-px bg-gradient-to-b from-cyan/30 to-transparent" />
                  )}
                  <span className="relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan/15 border border-cyan/30 text-cyan text-[11px] font-mono">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[10.5px] uppercase tracking-wider text-cyan-soft/70">{step.period}</p>
                    <h3 className="font-display font-semibold text-[14px] text-white mt-0.5">{step.title}</h3>
                    <p className="text-[12.5px] text-white/55 mt-1">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* HIRING PROCESS */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-24"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight text-center">
              Hiring <span className="text-gradient-cyan">Process</span>
            </h2>
            <div className="mt-10 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {HIRING_PROCESS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="flex items-center gap-2"
                >
                  <div className="glass-panel rounded-xl px-3 py-2 text-center">
                    <p className="font-mono text-[9.5px] text-cyan-soft/60">Step {i + 1}</p>
                    <p className="text-[12px] font-medium text-white mt-0.5">{step.step}</p>
                    <p className="text-[10px] text-white/45 mt-0.5 max-w-[120px]">{step.desc}</p>
                  </div>
                  {i < HIRING_PROCESS.length - 1 && <ArrowRight className="h-3 w-3 text-white/30 shrink-0" />}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* OPEN POSITIONS — State 1 (No Active Hiring) or State 2 (Active Hiring) */}
          <motion.div
            id="openings"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-24"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight text-center">
              Open <span className="text-gradient-cyan">Positions</span>
            </h2>

            {loading ? (
              <div className="mt-10 flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-cyan" />
              </div>
            ) : hasActivePositions ? (
              /* State 2: Active Hiring */
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
              /* State 1: No Active Hiring */
              <div id="stay-connected" className="mt-10 glass-panel-strong rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan/10 border border-cyan/25 text-cyan mx-auto">
                  <GraduationCap className="h-7 w-7" />
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold text-white">
                  We're not actively hiring right now
                </h3>
                <p className="mt-3 text-[14px] text-white/55 leading-relaxed max-w-md mx-auto">
                  We'd love to stay connected. Follow MB Tech Labs to be notified
                  when new internship opportunities open.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
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
                  <a
                    href="https://github.com/mbtechlabs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] text-white font-medium text-[13px] px-5 py-2.5 hover:bg-white/[0.07] transition-all"
                  >
                    <Github className="h-4 w-4 text-cyan" />
                    View GitHub
                  </a>
                </div>
                <a
                  href="mailto:careers@mbtechlabs.com?subject=Subscribe for internship updates"
                  className="mt-3 inline-flex items-center gap-2 text-[12.5px] text-cyan-soft/70 hover:text-cyan transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Subscribe for Updates
                </a>
              </div>
            )}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-24 glass-panel-strong rounded-2xl p-8 text-center max-w-3xl mx-auto"
          >
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
              "We don't hire experience. We build experience."
            </h2>
            <p className="mt-3 text-[14px] text-white/55 max-w-md mx-auto">
              Don't wait for the "perfect" moment. If you love building things, apply when positions open.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              {hasActivePositions ? (
                <a href="#openings" className="inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[14px] px-6 py-3.5 hover:bg-cyan-soft transition-all">
                  Browse Open Positions <ArrowRight className="h-4 w-4" />
                </a>
              ) : (
                <a href="https://linkedin.com/company/mbtechlabs" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[14px] px-6 py-3.5 hover:bg-cyan-soft transition-all">
                  <Linkedin className="h-4 w-4" />
                  Follow MB Tech Labs
                </a>
              )}
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] text-white font-medium text-[14px] px-6 py-3.5 hover:bg-white/[0.07] transition-all">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
