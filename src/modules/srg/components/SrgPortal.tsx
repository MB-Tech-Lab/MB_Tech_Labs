"use client";

import { SrgProvider, useSrg } from "../context/SRGContext";
import { ShaderBackground } from "@/components/mb-tech-labs/ShaderBackground";
import { FloatingNav } from "@/components/mb-tech-labs/FloatingNav";
import { Step1ClientInfo } from "./Step1ClientInfo";
import { Step2BusinessInfo } from "./Step2BusinessInfo";
import { Step3ProjectType } from "./Step3ProjectType";
import { Step4ProjectGoals } from "./Step4ProjectGoals";
import { Step5DynamicQuestions } from "./Step5DynamicQuestions";
import { Step6DocumentUpload } from "./Step6DocumentUpload";
import { Step7TeamAccess } from "./Step7TeamAccess";
import { Step8WorkflowBuilder } from "./Step8WorkflowBuilder";
import { Step9FinalReview } from "./Step9FinalReview";
import { StepNavigation } from "./StepNavigation";
import { RecoveryBanner, AutoSaveIndicator, SavingIndicator } from "./RecoveryBanner";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, X } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function SrgFlow() {
  const { session } = useSrg();
  const step = session.currentStep;

  return (
    <div className="relative min-h-screen flex flex-col">
      <ShaderBackground />
      <FloatingNav />

      <main className="relative z-10 flex-1 pt-28 pb-16">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[12.5px] text-white/55 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>
            <div className="flex items-center gap-3">
              <SavingIndicator />
              <AutoSaveIndicator />
            </div>
          </div>

          {/* Recovery banner */}
          <RecoveryBanner />

          {/* Header */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
              MB Tech Labs
            </span>
            <h1 className="mt-4 font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Project Discovery Portal
            </h1>
            <p className="mt-2 text-[14px] text-white/55 max-w-2xl">
              Help us understand your vision. The more context we have, the
              better we can architect a solution that scales with your business.
            </p>
          </div>

          {/* Step content with transition */}
          <div className="mb-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {step === 0 && <Step1ClientInfo />}
                {step === 1 && <Step2BusinessInfo />}
                {step === 2 && <Step3ProjectType />}
                {step === 3 && <Step4ProjectGoals />}
                {step === 4 && <Step5DynamicQuestions />}
                {step === 5 && <Step6DocumentUpload />}
                {step === 6 && <Step7TeamAccess />}
                {step === 7 && <Step8WorkflowBuilder />}
                {step === 8 && <Step9FinalReview />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <StepNavigation />
        </div>
      </main>
    </div>
  );
}

export function SrgPortal() {
  return (
    <SrgProvider>
      <SrgFlow />
    </SrgProvider>
  );
}
