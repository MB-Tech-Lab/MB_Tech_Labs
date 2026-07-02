"use client";

import { useSrg } from "../context/SRGContext";
import { GlassCard, AnimateIn } from "./ui";
import { TEMPLATES } from "../templates";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Stethoscope,
  UtensilsCrossed,
  Users,
  Boxes,
  ContactRound,
  Lightbulb,
  Check,
  FileText,
  Upload as UploadIcon,
  Workflow,
} from "lucide-react";
import type { ComponentType } from "react";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Heart,
  Stethoscope,
  UtensilsCrossed,
  Users,
  Boxes,
  ContactRound,
  Lightbulb,
};

export function Step3ProjectType() {
  const { session, setTemplate } = useSrg();

  return (
    <div className="space-y-8">
      <AnimateIn>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
            Step 03
          </span>
          <h1 className="mt-5 font-display text-3xl sm:text-4xl md:text-[40px] font-semibold text-white tracking-tight leading-[1.1]">
            What are you{" "}
            <span className="text-gradient-cyan">building?</span>
          </h1>
          <p className="mt-3 text-[14.5px] text-white/55 max-w-xl">
            Pick the template that best matches your project. Each template
            loads tailored discovery questions, required uploads, and workflow
            presets. You can override anything in later steps.
          </p>
        </div>
      </AnimateIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((t, i) => {
          const Icon = ICONS[t.icon] ?? Lightbulb;
          const isActive = session.selectedTemplateId === t.id;
          return (
            <AnimateIn key={t.id} delay={i * 0.06} y={20}>
              <motion.button
                type="button"
                onClick={() => setTemplate(t.id, t.name)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative text-left w-full h-full glass-panel rounded-2xl p-6 overflow-hidden transition-colors duration-300 ${
                  isActive
                    ? "border-cyan/50 ring-1 ring-cyan/30"
                    : "hover:border-cyan/30"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="template-active-glow"
                    className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-cyan/15 blur-3xl"
                  />
                )}
                <div className="relative flex items-start justify-between">
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border transition-all ${
                      isActive
                        ? "bg-cyan/15 border-cyan/40 text-cyan"
                        : "bg-white/[0.04] border-white/10 text-white/70 group-hover:text-cyan group-hover:border-cyan/30"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  {isActive && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan text-ink"
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </motion.span>
                  )}
                </div>
                <h3 className="relative mt-5 font-display font-semibold text-[17px] text-white">
                  {t.name}
                </h3>
                <p className="relative mt-1 text-[12.5px] text-cyan-soft/70">
                  {t.tagline}
                </p>
                <p className="relative mt-3 text-[12.5px] text-white/55 leading-relaxed">
                  {t.description}
                </p>

                {/* footer stats */}
                <div className="relative mt-5 pt-4 border-t border-white/8 flex items-center gap-4 text-[11px] text-white/45">
                  <span className="inline-flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {t.sections.reduce((n, s) => n + s.questions.length, 0)} questions
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <UploadIcon className="h-3 w-3" />
                    {t.uploadRequirements.length} uploads
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Workflow className="h-3 w-3" />
                    {t.workflowRequirements.length} flows
                  </span>
                </div>
              </motion.button>
            </AnimateIn>
          );
        })}
      </div>

      {/* Selected template preview */}
      <AnimatePresence>
        {session.selectedTemplateId && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlassCard strong className="p-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-cyan/15 border border-cyan/30">
                  <Check className="h-4 w-4 text-cyan" strokeWidth={3} />
                </span>
                <div className="flex-1">
                  <p className="font-display text-[14px] font-semibold text-white">
                    Template loaded:{" "}
                    {TEMPLATES.find((t) => t.id === session.selectedTemplateId)?.name}
                  </p>
                  <p className="mt-1 text-[12.5px] text-white/55">
                    The next steps will be tailored to this template. You can
                    switch templates at any time — your answers will reset, but
                    client and business info will be preserved.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
