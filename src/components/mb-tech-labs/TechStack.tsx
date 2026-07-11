"use client";

import { motion } from "framer-motion";
import {
  Layers,
  Server,
  Database,
  Cloud,
  BrainCircuit,
} from "lucide-react";
import { Section, SectionHeading, Reveal, staggerContainer, staggerItem } from "./primitives";

const STACKS = [
  {
    icon: Layers,
    category: "Frontend",
    color: "from-cyan/20 to-cyan/5",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    icon: Server,
    category: "Backend",
    color: "from-cyan/20 to-cyan/5",
    items: ["Node.js", "NestJS", "Python", "Java"],
  },
  {
    icon: Database,
    category: "Databases",
    color: "from-cyan/20 to-cyan/5",
    items: ["PostgreSQL", "Supabase", "MongoDB"],
  },
  {
    icon: Cloud,
    category: "Cloud",
    color: "from-cyan/20 to-cyan/5",
    items: ["AWS", "Google Cloud", "Hostinger VPS", "Vercel"],
  },
  {
    icon: BrainCircuit,
    category: "Artificial Intelligence",
    color: "from-cyan/20 to-cyan/5",
    items: ["OpenAI", "Gemini", "Claude"],
  },
];

export function TechStack() {
  return (
    <Section id="technologies">
      <SectionHeading
        eyebrow="Technology Stack"
        title={
          <>
            A Modern Toolkit,{" "}
            <span className="text-gradient-cyan">Chosen With Intent</span>
          </>
        }
        description="We are polyglots by necessity — each technology below is here because we have shipped production systems with it and would choose it again. No resume-driven development."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {STACKS.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.category}
              variants={staggerItem}
              className={`group relative glass-panel rounded-2xl p-6 overflow-hidden hover:border-cyan/30 transition-colors duration-500 ${
                s.category === "Artificial Intelligence"
                  ? "md:col-span-2 lg:col-span-1"
                  : ""
              }`}
            >
              <div
                className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${s.color} blur-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-500`}
              />
              <div className="relative flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/25 text-cyan">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display font-semibold text-[15px] uppercase tracking-[0.12em] text-white/90">
                  {s.category}
                </h3>
              </div>
              <div className="relative mt-5 flex flex-wrap gap-2">
                {s.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[13px] font-medium text-white/80 hover:bg-cyan/10 hover:border-cyan/30 hover:text-cyan-soft transition-all duration-300 cursor-default"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Tech marquee */}
      <Reveal delay={0.2} className="mt-12">
        <div className="glass-panel rounded-2xl py-5 overflow-hidden">
          <div className="relative flex overflow-hidden">
            <div className="flex marquee-track gap-12 pr-12 shrink-0">
              {[...MARQUEE, ...MARQUEE].map((t, i) => (
                <span
                  key={i}
                  className="font-display text-[15px] font-medium text-white/35 hover:text-cyan transition-colors whitespace-nowrap"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

const MARQUEE = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "NestJS",
  "Python",
  "PostgreSQL",
  "Supabase",
  "MongoDB",
  "AWS",
  "Google Cloud",
  "Vercel",
  "OpenAI",
  "Gemini",
  "Claude",
  "Tailwind CSS",
  "Docker",
  "Kubernetes",
];
