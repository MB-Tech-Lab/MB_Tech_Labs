"use client";

import {
  Rocket,
  Boxes,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  Handshake,
} from "lucide-react";
import { Section, SectionHeading, Reveal } from "./primitives";

const REASONS = [
  {
    icon: Rocket,
    title: "Fast Delivery",
    desc: "Senior teams, modern tooling, and weekly demos mean we ship production software in weeks, not quarters — without sacrificing quality.",
  },
  {
    icon: Boxes,
    title: "Scalable Architecture",
    desc: "Cloud-native, event-driven, and horizontally scalable from day one. Systems that hold up at 10x and 100x traffic without rewrites.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    desc: "Zero-trust, encrypted-by-default, and continuously audited. Your data, your customers, and your compliance posture are protected.",
  },
  {
    icon: Sparkles,
    title: "Modern Technologies",
    desc: "We invest in the stack of tomorrow — AI orchestration, edge computing, type-safe end-to-end pipelines — and bring it to you today.",
  },
  {
    icon: MessageSquare,
    title: "Transparent Communication",
    desc: "Shared roadmaps, public commit logs, and direct access to engineers. You always know what is happening, why, and what comes next.",
  },
  {
    icon: Handshake,
    title: "Long-Term Partnership",
    desc: "We measure success in years of partnership, not in projects closed. Most of our clients have been with us for multiple product cycles.",
  },
];

export function WhyChooseUs() {
  return (
    <Section id="why">
      <SectionHeading
        eyebrow="Why MB Tech Labs"
        title={
          <>
            Reasons Teams Choose to{" "}
            <span className="text-gradient-cyan">Build With Us</span>
          </>
        }
        description="Software is a long-term relationship. These are the principles that keep our partners shipping confidently, year after year."
      />

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REASONS.map((r, i) => {
          const Icon = r.icon;
          return (
            <Reveal key={r.title} delay={(i % 3) * 0.06} y={22}>
              <div className="group relative h-full glass-panel rounded-2xl p-7 hover:border-cyan/30 transition-colors duration-500 overflow-hidden">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center gap-3.5">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan/20 to-cyan/5 border border-cyan/25 text-cyan">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-[11px] text-white/30 tabular-nums">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="relative mt-5 font-display font-semibold text-[18px] text-white">
                  {r.title}
                </h3>
                <p className="relative mt-2.5 text-[13.5px] leading-relaxed text-white/55">
                  {r.desc}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
