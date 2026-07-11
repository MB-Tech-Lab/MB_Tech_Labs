"use client";

import { motion } from "framer-motion";
import {
  Search,
  Microscope,
  Map,
  PencilRuler,
  Code,
  ShieldCheck,
  Rocket,
  LifeBuoy,
} from "lucide-react";
import { Section, SectionHeading, Reveal } from "./primitives";

const STEPS = [
  {
    icon: Search,
    title: "Discovery",
    desc: "We start by understanding the business, the users, and the constraints. Stakeholder interviews, success metrics, and a clear problem statement before a single pixel.",
  },
  {
    icon: Microscope,
    title: "Research",
    desc: "Competitive teardowns, user research, technical feasibility, and risk mapping. We de-risk decisions with evidence instead of opinion.",
  },
  {
    icon: Map,
    title: "Planning",
    desc: "Roadmap, milestones, architecture diagrams, and a delivery cadence. You see exactly what is shipping, when, and why — before code is written.",
  },
  {
    icon: PencilRuler,
    title: "UI/UX Design",
    desc: "Information architecture, wireframes, interactive prototypes, and a design system. Accessibility and performance budgets are set here.",
  },
  {
    icon: Code,
    title: "Development",
    desc: "Senior engineers ship in vertical slices with weekly demos. Type-safe, tested, peer-reviewed, and continuously integrated from day one.",
  },
  {
    icon: ShieldCheck,
    title: "Testing",
    desc: "Unit, integration, end-to-end, performance, and security testing — automated in CI. Nothing reaches production without passing the gate.",
  },
  {
    icon: Rocket,
    title: "Deployment",
    desc: "Blue-green or canary releases, infrastructure-as-code, observability, and rollback plans. Launches are calm, reversible, and instrumented.",
  },
  {
    icon: LifeBuoy,
    title: "Support",
    desc: "SLAs, monitoring, on-call, and continuous improvement. We stay on the hook long after launch — software is a long-term relationship.",
  },
];

export function Process() {
  return (
    <Section id="process">
      <SectionHeading
        eyebrow="Our Process"
        title={
          <>
            From Discovery to{" "}
            <span className="text-gradient-cyan">Long-Term Support</span>
          </>
        }
        description="A disciplined, transparent engineering process. Every phase has a clear deliverable, an owner, and a definition of done."
      />

      <div className="mt-16 relative">
        {/* Vertical line */}
        <div
          aria-hidden
          className="absolute left-[27px] sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan/30 to-transparent"
        />

        <div className="flex flex-col gap-10 sm:gap-14">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isLeft = i % 2 === 0;
            return (
              <Reveal key={step.title} y={30}>
                <div
                  className={`relative flex items-start gap-6 sm:gap-0 ${
                    isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* Node */}
                  <div className="relative z-10 shrink-0 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{
                        duration: 0.5,
                        delay: 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="inline-flex h-14 w-14 items-center justify-center rounded-2xl glass-panel-strong text-cyan border-cyan/30"
                    >
                      <Icon className="h-5 w-5" />
                    </motion.span>
                  </div>

                  {/* Card */}
                  <div
                    className={`flex-1 ${
                      isLeft
                        ? "sm:pr-16 sm:text-right"
                        : "sm:pl-16 sm:text-left"
                    } sm:max-w-[50%] ${
                      isLeft ? "sm:mr-auto" : "sm:ml-auto"
                    }`}
                  >
                    <div className="glass-panel rounded-2xl p-6 hover:border-cyan/30 transition-colors duration-500">
                      <div
                        className={`flex items-center gap-3 ${
                          isLeft ? "sm:justify-end" : ""
                        }`}
                      >
                        <span className="font-mono text-[11px] tabular-nums text-cyan-soft/70">
                          {String(i + 1).padStart(2, "0")} / 08
                        </span>
                      </div>
                      <h3 className="mt-2 font-display font-semibold text-[20px] text-white">
                        {step.title}
                      </h3>
                      <p className="mt-2.5 text-[13.5px] leading-relaxed text-white/55">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
