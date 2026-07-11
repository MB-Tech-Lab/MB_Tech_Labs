"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ClipboardList,
  FileText,
  ArrowRight,
  Check,
  ChevronDown,
  Sparkles,
  Phone,
  Layers,
  Code2,
  Plug,
  Palette,
  Clock,
  ShieldCheck,
  Rocket,
  LifeBuoy,
  Wrench,
  TrendingUp,
  Lock,
  Lightbulb,
} from "lucide-react";
import { Section, SectionHeading, Reveal } from "./primitives";
import Link from "next/link";

/* ─── Cards ─── */
const CARDS = [
  {
    icon: Search,
    title: "Discovery & Consultation",
    description:
      "We begin by understanding your business, goals and challenges before recommending the best software solution.",
    features: [
      "Free Discovery Discussion",
      "Business Goal Analysis",
      "Existing Workflow Review",
      "Initial Technical Guidance",
      "Solution Recommendations",
    ],
    cta: "Schedule a Discovery Call",
    ctaHref: "/contact",
    highlight: false,
  },
  {
    icon: ClipboardList,
    title: "Software Requirement Gathering (SRG)",
    description:
      "Our structured SRG process helps us understand exactly what needs to be built before estimating the project.",
    features: [
      "Functional Requirements",
      "Business Workflow Analysis",
      "Feature Planning",
      "Technology Suggestions",
      "Integration Requirements",
      "Project Prioritization",
    ],
    cta: "Start Requirement Analysis",
    ctaHref: "/start-project",
    highlight: true,
  },
  {
    icon: FileText,
    title: "Proposal & Custom Quotation",
    description:
      "After reviewing your SRG, our team prepares a detailed proposal and custom quotation tailored to your project.",
    features: [
      "Technical Architecture",
      "Development Timeline",
      "Cost Breakdown",
      "Milestones",
      "Payment Schedule",
      "Delivery Roadmap",
    ],
    cta: "Receive Custom Proposal",
    ctaHref: "/contact",
    highlight: false,
  },
];

/* ─── Cost Factors ─── */
const COST_FACTORS = [
  { icon: Layers, label: "Business Complexity" },
  { icon: ClipboardList, label: "Features Required" },
  { icon: Code2, label: "Technology Stack" },
  { icon: Plug, label: "Third-party Integrations" },
  { icon: Palette, label: "UI/UX Complexity" },
  { icon: Clock, label: "Timeline" },
  { icon: ShieldCheck, label: "Testing & Quality Assurance" },
  { icon: Rocket, label: "Deployment" },
  { icon: LifeBuoy, label: "Post-launch Support" },
  { icon: Wrench, label: "Maintenance" },
  { icon: TrendingUp, label: "Scalability" },
  { icon: Lock, label: "Security Requirements" },
];

/* ─── Timeline Steps ─── */
const TIMELINE = [
  "Client Enquiry",
  "Discovery Call",
  "Software Requirement Gathering",
  "Technical Analysis",
  "Architecture Planning",
  "Proposal",
  "Custom Quotation",
  "Client Approval",
  "Development Begins",
];

/* ─── FAQs ─── */
const FAQS = [
  {
    q: "Why don't you display fixed pricing?",
    a: "Because every software project is unique. A 3-page marketing site and a multi-tenant ERP system require completely different engineering effort, technology, and team composition. Fixed pricing would mean overcharging simple projects and undercharging complex ones. Instead, we analyse your actual requirements through the SRG process and prepare a quotation based on real scope — not generic templates.",
  },
  {
    q: "Why is the SRG process important?",
    a: "The Software Requirement Gathering (SRG) process is the foundation of every successful project. It captures your business goals, functional requirements, workflow, budget expectations, timeline, and technical preferences. Without it, any estimate is a guess. The SRG ensures our proposal reflects what you actually need — not what we assume you need.",
  },
  {
    q: "How long does project estimation take?",
    a: "After you submit the SRG form, our team reviews it within 1–2 business days. A detailed proposal with a custom quotation is typically delivered within 3–5 business days. Complex enterprise projects may take up to a week for thorough technical analysis.",
  },
  {
    q: "Is the discovery call free?",
    a: "Yes. The initial discovery call is completely free with no obligation. It's a 30-minute conversation where we understand your vision, answer your questions, and recommend the best path forward. You only pay when you sign a project agreement and we begin development.",
  },
  {
    q: "Will I receive a detailed quotation?",
    a: "Absolutely. Every quotation includes a line-item cost breakdown (UI/UX, frontend, backend, testing, deployment, hosting, maintenance), development timeline, milestone schedule, payment terms, and technology stack. No hidden costs, no surprise invoices. Everything is transparent before you commit.",
  },
  {
    q: "Can requirements change later?",
    a: "Yes. We expect scope to evolve as the project progresses. Changes are handled through a structured change-request process: you describe the change, we assess the impact on cost and timeline, and you approve before work begins. No silent scope creep, ever.",
  },
];

export function ProjectEstimation() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <Section id="estimation">
      <SectionHeading
        eyebrow="Project Estimation"
        title={
          <>
            How We Estimate{" "}
            <span className="text-gradient-cyan">Your Project</span>
          </>
        }
        description={
          <>
            Every software project is unique. Instead of fixed packages, we
            prepare a custom proposal and quotation after understanding your
            business requirements through our Software Requirement Gathering
            (SRG) process. Our goal is to provide accurate estimates,
            transparent pricing and the best technical solution for your
            business.
          </>
        }
      />

      {/* ─── 3 Cards ─── */}
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
        {CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <Reveal key={i} delay={i * 0.08} y={20}>
              <div
                className={`group relative h-full rounded-2xl p-6 overflow-hidden transition-colors duration-500 ${
                  card.highlight
                    ? "glass-panel-strong border-cyan/40 ring-1 ring-cyan/20"
                    : "glass-panel hover:border-cyan/25"
                }`}
              >
                {card.highlight && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-cyan text-ink text-[9.5px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
                      Core Process
                    </div>
                  </div>
                )}
                {/* Hover glow */}
                <div
                  className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: card.highlight
                      ? "radial-gradient(400px circle at 50% 0%, rgba(37,214,255,0.12), transparent 60%)"
                      : "radial-gradient(400px circle at 50% 0%, rgba(37,214,255,0.08), transparent 60%)",
                  }}
                />
                <div className="relative">
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 ${
                      card.highlight
                        ? "bg-cyan/15 border-cyan/40 text-cyan"
                        : "bg-cyan/10 border-cyan/25 text-cyan group-hover:scale-110"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display font-semibold text-[16px] text-white leading-tight">
                    {card.title}
                  </h3>
                  <p className="mt-2.5 text-[13px] text-white/55 leading-relaxed">
                    {card.description}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {card.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-[12.5px] text-white/65"
                      >
                        <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan/15 border border-cyan/30">
                          <Check className="h-2.5 w-2.5 text-cyan" strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={card.ctaHref}
                    className={`mt-6 inline-flex items-center gap-1.5 rounded-xl font-semibold text-[13px] px-5 py-2.5 transition-all duration-300 group/btn ${
                      card.highlight
                        ? "bg-cyan text-ink hover:bg-cyan-soft hover:shadow-[0_8px_30px_-6px_rgba(37,214,255,0.6)]"
                        : "border border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.07] hover:border-white/25"
                    }`}
                  >
                    {card.cta}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* ─── How We Calculate Cost ─── */}
      <div className="mt-20">
        <Reveal y={20}>
          <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight text-center">
            How We Calculate{" "}
            <span className="text-gradient-cyan">Project Cost</span>
          </h3>
          <p className="mt-4 text-[14px] text-white/55 leading-relaxed text-center max-w-2xl mx-auto">
            Every project is unique. Instead of predefined packages, pricing is
            calculated after reviewing your project requirements. The quotation
            is based on the actual scope of work rather than generic templates.
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {COST_FACTORS.map((factor, i) => {
            const Icon = factor.icon;
            return (
              <Reveal key={i} delay={(i % 4) * 0.04} y={14}>
                <div className="glass-panel rounded-xl p-4 flex items-center gap-3 hover:border-cyan/25 transition-colors duration-300">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/25 text-cyan">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-[12.5px] text-white/70 font-medium">
                    {factor.label}
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* ─── Workflow Timeline ─── */}
      <div className="mt-20">
        <Reveal y={20}>
          <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight text-center mb-10">
            Our Estimation{" "}
            <span className="text-gradient-cyan">Workflow</span>
          </h3>
        </Reveal>
        <div className="flex items-center gap-2 overflow-x-auto pb-3 -mx-2 px-2">
          {TIMELINE.map((step, i) => (
            <Reveal key={i} delay={i * 0.04} y={12}>
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className={`rounded-xl border px-3.5 py-2.5 text-center min-w-[140px] ${
                    step === "Software Requirement Gathering"
                      ? "bg-cyan/10 border-cyan/40"
                      : "glass-panel"
                  }`}
                >
                  <span className="font-mono text-[9.5px] text-cyan-soft/50 block">
                    Step {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-[11.5px] font-medium ${
                      step === "Software Requirement Gathering"
                        ? "text-white"
                        : "text-white/65"
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {i < TIMELINE.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 text-white/25 shrink-0" />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ─── Transparent Pricing Info Box ─── */}
      <Reveal delay={0.1} y={20}>
        <div className="mt-16 glass-panel-strong rounded-2xl p-8 sm:p-10">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan/15 border border-cyan/30 text-cyan">
              <Lightbulb className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-[18px] font-semibold text-white">
                Transparent Pricing Policy
              </h3>
              <p className="mt-3 text-[14px] text-white/60 leading-relaxed">
                We believe every business deserves a solution built around its
                unique requirements. Instead of offering fixed packages, we
                carefully analyse every project before preparing a quotation.
              </p>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {[
                  "Fair pricing",
                  "Accurate timelines",
                  "Transparent milestones",
                  "No unnecessary features",
                  "No hidden charges",
                  "No surprise invoices",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-[13px] text-white/70"
                  >
                    <Check
                      className="h-4 w-4 text-cyan shrink-0"
                      strokeWidth={3}
                    />
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[13px] text-cyan-soft/70 leading-relaxed">
                Every quotation is generated only after completing the Software
                Requirement Gathering (SRG) process.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ─── FAQ ─── */}
      <div className="mt-16">
        <Reveal y={20}>
          <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight text-center mb-8">
            Frequently Asked{" "}
            <span className="text-gradient-cyan">Questions</span>
          </h3>
        </Reveal>
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <Reveal key={i} delay={i * 0.03} y={12}>
                <div
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
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* ─── CTA ─── */}
      <Reveal delay={0.1} y={20}>
        <div className="mt-16 glass-panel-strong rounded-2xl p-8 sm:p-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
            <Sparkles className="h-3.5 w-3.5 text-cyan" />
            Let's Build Together
          </span>
          <h3 className="mt-5 font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Ready to Build Your Software?
          </h3>
          <p className="mt-4 text-[14px] text-white/55 leading-relaxed max-w-md mx-auto">
            Tell us about your business and we'll analyse your requirements
            before preparing a tailored proposal and quotation.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/start-project"
              className="group inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[14.5px] px-6 py-3.5 hover:bg-cyan-soft transition-all duration-300 hover:shadow-[0_12px_40px_-8px_rgba(37,214,255,0.65)]"
            >
              Start Software Requirement Gathering
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] text-white font-medium text-[14.5px] px-6 py-3.5 hover:bg-white/[0.07] hover:border-white/25 transition-all duration-300"
            >
              <Phone className="h-4 w-4 text-cyan" />
              Book Discovery Call
            </Link>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
