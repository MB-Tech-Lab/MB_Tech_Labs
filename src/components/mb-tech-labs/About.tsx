"use client";

import { motion } from "framer-motion";
import {
  Cpu,
  Layers,
  ShieldCheck,
  Gauge,
  Boxes,
  Cloud,
  BrainCircuit,
} from "lucide-react";
import { Reveal, Section, SectionHeading } from "./primitives";

const PILLARS = [
  {
    icon: Cpu,
    title: "Innovation",
    desc: "We engineer with emerging technology first — from AI orchestration to edge runtimes — so your product ships ahead of the curve, not behind it.",
  },
  {
    icon: Boxes,
    title: "Scalability",
    desc: "Cloud-native architectures designed for 10x growth. Every system we build is load-tested, sharded, and ready for millions of concurrent users.",
  },
  {
    icon: ShieldCheck,
    title: "Security",
    desc: "Zero-trust by default. SOC2-aligned practices, encrypted data planes, and continuous penetration testing baked into the engineering workflow.",
  },
  {
    icon: Gauge,
    title: "Performance",
    desc: "Sub-second interactions, edge-cached delivery, and instrumented observability. We treat milliseconds as a product feature, not an afterthought.",
  },
  {
    icon: Layers,
    title: "Modern Architecture",
    desc: "Hexagonal, event-driven, and domain-isolated. Clean boundaries mean your codebase stays legible and shippable five years from now.",
  },
  {
    icon: Cloud,
    title: "Cloud",
    desc: "Multi-cloud fluency across AWS, GCP, and Vercel. Infrastructure-as-code, autoscaling, and cost-guardrails shipped with every deployment.",
  },
  {
    icon: BrainCircuit,
    title: "Artificial Intelligence",
    desc: "Production AI — RAG pipelines, fine-tuned models, autonomous agents, and LLM guardrails. We turn models into measurable business outcomes.",
  },
];

export function About() {
  return (
    <Section id="about">
      <SectionHeading
        eyebrow="About MB Tech Labs"
        title={
          <>
            Engineering Tomorrow's{" "}
            <span className="text-gradient-cyan">Digital Experiences</span>
          </>
        }
        description="We are a focused team of senior engineers, architects, and designers building the systems that power ambitious companies. Our mission is to translate complex business requirements into elegant, scalable, and secure software that compounds in value over time."
      />

      {/* Mission block */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Reveal className="lg:col-span-7" y={28}>
          <div className="glass-panel-strong rounded-3xl p-8 sm:p-10 h-full">
            <span className="text-[11px] uppercase tracking-[0.2em] text-cyan-soft/80">
              Our Mission
            </span>
            <h3 className="mt-4 font-display text-2xl sm:text-3xl font-semibold text-white leading-tight">
              Build software that earns trust at scale.
            </h3>
            <p className="mt-5 text-[15px] leading-relaxed text-white/65">
              Every line of code we ship is judged against a single standard:
              would we trust it to run a business we depend on? That bar shapes
              how we design architecture, how we write tests, how we document
              systems, and how we communicate with the people who own the
              outcome. We do not chase trends — we engineer for the long arc,
              for systems that remain fast, secure, and maintainable years after
              they ship.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-white/65">
              From early-stage startups validating their first product to
              enterprises modernizing legacy ERP systems, our partners choose us
              because we treat their roadmap as if it were our own. We embed
              deeply, communicate transparently, and take ownership of the
              outcomes — not just the deliverables.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {[
                "Senior-only engineering",
                "Transparent communication",
                "Long-term partnership",
                "Outcome ownership",
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[12px] text-white/70"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Pillar grid */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={i * 0.06} y={20}>
                <div className="group glass-panel rounded-2xl p-5 h-full hover:border-cyan/30 transition-colors duration-500">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/25 text-cyan group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h4 className="mt-3.5 font-display font-semibold text-[15px] text-white">
                    {p.title}
                  </h4>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/55">
                    {p.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
