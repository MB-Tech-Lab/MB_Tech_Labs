"use client";

import { useSrg } from "../context/SRGContext";
import { SRG_STEPS } from "../types";
import { motion } from "framer-motion";
import { Check, AlertCircle, ArrowLeft, ArrowRight, Send } from "lucide-react";
import { validateStep } from "../engine/runtime";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function StepNavigation() {
  const { session, goToStep, nextStep, prevStep, progress } = useSrg();
  const [attemptedNext, setAttemptedNext] = useState(false);

  const validation = validateStep(session.currentStep, session);
  const isLastStep = session.currentStep === SRG_STEPS.length - 1;
  const isFirstStep = session.currentStep === 0;
  const showErrors = attemptedNext && !validation.ok;

  function handleNext() {
    if (!validation.ok) {
      setAttemptedNext(true);
      return;
    }
    setAttemptedNext(false);
    nextStep();
  }

  function handleStepClick(idx: number) {
    setAttemptedNext(false);
    goToStep(idx);
  }

  return (
    <div className="space-y-4">
      {/* Step pills */}
      <div className="overflow-x-auto -mx-2 px-2 pb-1">
        <div className="flex items-center gap-2 min-w-max">
          {SRG_STEPS.map((label, idx) => {
            const isCurrent = idx === session.currentStep;
            const isPast = idx < session.currentStep;
            const stepValid = validateStep(idx, session).ok;
            return (
              <button
                key={label}
                type="button"
                onClick={() => handleStepClick(idx)}
                className={cn(
                  "group flex items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] font-medium transition-all duration-200",
                  isCurrent
                    ? "bg-cyan/15 border-cyan/40 text-white"
                    : isPast
                    ? "bg-white/[0.04] border-white/10 text-white/55 hover:border-white/20"
                    : "bg-white/[0.02] border-white/8 text-white/35 hover:text-white/60"
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono shrink-0",
                    isCurrent
                      ? "bg-cyan text-ink"
                      : isPast
                      ? stepValid
                        ? "bg-cyan/20 text-cyan-soft"
                        : "bg-amber-400/20 text-amber-300"
                      : "bg-white/8 text-white/40"
                  )}
                >
                  {isPast && stepValid ? (
                    <Check className="h-3 w-3" strokeWidth={3} />
                  ) : (
                    idx + 1
                  )}
                </span>
                <span className="whitespace-nowrap">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 rounded-full bg-white/8 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress.completion}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-gradient-to-r from-cyan/60 to-cyan rounded-full"
          />
        </div>
        <span className="font-mono text-[11px] text-white/45 tabular-nums">
          {progress.completion}%
        </span>
      </div>

      {/* Validation errors */}
      {showErrors && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2.5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-[12.5px] text-amber-200"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Please complete this step before continuing:</p>
            <ul className="mt-1.5 space-y-0.5 list-disc list-inside text-[11.5px]">
              {Object.entries(validation.errors).map(([k, v]) => (
                <li key={k}>{v}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Nav buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={prevStep}
          disabled={isFirstStep}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/[0.03] px-5 py-3 text-[13px] font-medium text-white/75 hover:bg-white/[0.06] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <span className="text-[11.5px] text-white/40 font-mono">
          {session.currentStep + 1} / {SRG_STEPS.length}
        </span>
        {!isLastStep ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 rounded-xl bg-cyan text-ink font-semibold text-[13px] px-5 py-3 hover:bg-cyan-soft transition-all hover:shadow-[0_8px_30px_-6px_rgba(37,214,255,0.6)]"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            disabled
            className="inline-flex items-center gap-1.5 rounded-xl bg-cyan/40 text-ink/60 font-semibold text-[13px] px-5 py-3 cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            Final Step
          </button>
        )}
      </div>
    </div>
  );
}
