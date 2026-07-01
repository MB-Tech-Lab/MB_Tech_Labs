"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, ArrowUpRight, Sparkles } from "lucide-react";
import { Section, SectionHeading, Reveal } from "./primitives";

const ROLES = [
  {
    title: "Senior Full-Stack Engineer",
    team: "Platform",
    location: "Remote / Hybrid",
    type: "Full-time",
  },
  {
    title: "AI / ML Engineer",
    team: "Applied AI",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Product Designer",
    team: "Design Systems",
    location: "Remote / Hybrid",
    type: "Full-time",
  },
  {
    title: "DevOps / Platform Engineer",
    team: "Infrastructure",
    location: "Remote",
    type: "Full-time",
  },
];

export function Careers() {
  return (
    <Section id="careers">
      <SectionHeading
        eyebrow="Careers"
        title={
          <>
            Build the Future{" "}
            <span className="text-gradient-cyan">With Us</span>
          </>
        }
        description="We hire senior, curious, kind engineers who want to do the best work of their career. No bureaucracy, no juniors learning on clients — just sharp people shipping meaningful software together."
      />

      <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pitch */}
        <Reveal className="lg:col-span-5" y={24}>
          <div className="glass-panel-strong rounded-3xl p-8 h-full flex flex-col">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/25 text-cyan">
              <Sparkles className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-display text-2xl font-semibold text-white leading-tight">
              Engineering culture, not corporate ladder.
            </h3>
            <p className="mt-4 text-[14px] leading-relaxed text-white/60">
              We are a small, senior team. Every engineer ships to production
              in their first week, owns architecture decisions, and talks to
              the client directly. We invest in tooling, learning budgets, and
              deep work — and we protect all three fiercely.
            </p>
            <ul className="mt-6 space-y-2.5">
              {[
                "Remote-first, async-friendly culture",
                "Quarterly learning & conference budget",
                "Meaningful equity for every full-time role",
                "Hardware budget — pick the tools you want",
                "No estimate theatre, no status meetings",
              ].map((perk) => (
                <li
                  key={perk}
                  className="flex items-start gap-2.5 text-[13.5px] text-white/70"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan shrink-0" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Open roles */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {ROLES.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.06} y={18}>
              <motion.a
                href="#contact"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-center justify-between gap-4 glass-panel rounded-2xl p-5 hover:border-cyan/30 transition-colors duration-500"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 text-cyan group-hover:bg-cyan group-hover:text-ink transition-all duration-300 shrink-0">
                    <Briefcase className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-display font-semibold text-[15.5px] text-white truncate">
                      {r.title}
                    </h4>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-white/45">
                      <span>{r.team}</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {r.location}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10.5px]">
                        {r.type}
                      </span>
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/30 group-hover:text-cyan transition-colors shrink-0" />
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
