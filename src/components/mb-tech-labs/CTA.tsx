"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Mail,
  Sparkles,
  Clock,
  Check,
  ShieldCheck,
  FileText,
  Users,
  Workflow,
  Code2,
  Send,
  FolderArchive,
  Search,
} from "lucide-react";
import { Reveal } from "./primitives";

const PROCESS_STEPS = [
  { label: "Requirements", icon: Search },
  { label: "Assets", icon: FolderArchive },
  { label: "Workflow", icon: Workflow },
  { label: "Team Access", icon: Users },
  { label: "Review", icon: Check },
  { label: "Submit", icon: Send },
];

const TRUST_LABELS = [
  { label: "Secure Document Uploads", icon: ShieldCheck },
  { label: "Business Requirement Mapping", icon: FileText },
  { label: "Team Role Planning", icon: Users },
  { label: "Workflow Analysis", icon: Workflow },
  { label: "Technical Review Included", icon: Code2 },
];

export function CTA() {
  return (
    <section id="contact" className="relative py-24 sm:py-28 md:py-36">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal y={30}>
          <div className="relative overflow-hidden rounded-[28px] px-6 sm:px-12 md:px-16 py-14 md:py-20 text-center cta-gateway-card">
            {/* Soft cyan ambient glow — top */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-72 w-[85%] rounded-full blur-[100px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(37,214,255,0.22), transparent 70%)",
              }}
            />
            {/* Soft cyan ambient glow — bottom left */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-72 rounded-full blur-[90px] opacity-60"
              style={{
                background:
                  "radial-gradient(circle, rgba(94,219,255,0.18), transparent 70%)",
              }}
            />
            {/* Soft cyan ambient glow — bottom right */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -right-16 h-56 w-64 rounded-full blur-[80px] opacity-50"
              style={{
                background:
                  "radial-gradient(circle, rgba(37,214,255,0.15), transparent 70%)",
              }}
            />
            {/* Subtle grid overlay */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.22]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
                maskImage:
                  "radial-gradient(ellipse at center, black 28%, transparent 78%)",
              }}
            />
            {/* Hairline inner border for depth */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[28px]"
              style={{
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,0.14), inset 0 0 0 1px rgba(255,255,255,0.06)",
              }}
            />

            <div className="relative">
              {/* Eyebrow */}
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-cyan-soft backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-cyan" />
                Project Discovery Gateway
              </span>

              {/* Heading */}
              <h2 className="mt-7 font-display font-semibold text-white tracking-[-0.025em] text-[34px] sm:text-5xl md:text-[60px] md:leading-[1.05]">
                Let's Build Something{" "}
                <span className="text-gradient-cyan gradient-drift">
                  Amazing Together.
                </span>
              </h2>

              {/* Supporting text */}
              <p className="mt-6 max-w-2xl mx-auto text-[15px] sm:text-[17px] leading-relaxed text-white/65">
                Tell us about your business, your vision, and your project
                requirements. Our Project Discovery Portal helps us understand
                exactly what you need so we can build the right solution for
                you.
              </p>

              {/* Time estimate pill */}
              <div className="mt-7 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-[12px] text-white/65 backdrop-blur-md">
                  <Clock className="h-3.5 w-3.5 text-cyan" />
                  Estimated Time:{" "}
                  <span className="text-white/85 font-medium">8–15 Minutes</span>
                </span>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-xl mx-auto">
                <motion.a
                  href="/start-project"
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[15px] px-6 py-4 hover:bg-cyan-soft transition-colors duration-300"
                  style={{
                    boxShadow:
                      "0 10px 30px -10px rgba(37,214,255,0.55), inset 0 1px 0 0 rgba(255,255,255,0.25)",
                  }}
                >
                  {/* Hover glow halo */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      boxShadow:
                        "0 0 0 1px rgba(37,214,255,0.45), 0 18px 50px -10px rgba(37,214,255,0.75)",
                    }}
                  />
                  <Sparkles className="relative h-4 w-4" />
                  Start Your Project
                  <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.a>

                <Link
                  href="/contact"
                  className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] backdrop-blur-md text-white font-medium text-[14.5px] px-6 py-4 hover:bg-white/[0.07] hover:border-white/25 transition-all duration-300"
                >
                  <Mail className="h-4 w-4 text-cyan" />
                  Contact Us
                </Link>
              </div>

              <p className="mt-4 text-[11.5px] text-white/40 max-w-md mx-auto leading-relaxed">
                <span className="text-cyan-soft/80">Start Your Project</span>{" "}
                opens our 9-step onboarding portal.{" "}
                <span className="text-white/55">Contact Us</span> is for quick
                questions, partnerships, and support.
              </p>

              {/* Process indicator */}
              <div className="mt-12">
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45 mb-4">
                  Project Discovery Process
                </p>
                <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-2 -mx-2 px-2 sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0">
                  {PROCESS_STEPS.map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.label}
                        className="flex items-center gap-1.5 shrink-0"
                      >
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 backdrop-blur-md">
                          <span className="font-mono text-[10px] tabular-nums text-cyan-soft/70">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <Icon className="h-3 w-3 text-cyan" />
                          <span className="text-[11.5px] font-medium text-white/75 whitespace-nowrap">
                            {step.label}
                          </span>
                        </div>
                        {i < PROCESS_STEPS.length - 1 && (
                          <ArrowRight className="h-3 w-3 text-white/25 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trust labels */}
              <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-2.5 max-w-3xl mx-auto">
                {TRUST_LABELS.map((t) => {
                  const Icon = t.icon;
                  return (
                    <div
                      key={t.label}
                      className="flex items-center gap-2 text-left sm:justify-center"
                    >
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan/12 border border-cyan/25">
                        <Check className="h-3 w-3 text-cyan" strokeWidth={3} />
                      </span>
                      <span className="text-[12.5px] text-white/65">
                        {t.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom meta row */}
              <div className="mt-10 pt-6 border-t border-white/8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[12px] text-white/40">
                <span>Senior engineers, no juniors</span>
                <span className="hidden sm:inline">•</span>
                <span>Weekly demos from day one</span>
                <span className="hidden sm:inline">•</span>
                <span>Long-term partnership</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
