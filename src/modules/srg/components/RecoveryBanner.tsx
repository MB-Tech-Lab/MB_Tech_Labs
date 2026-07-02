"use client";

import { useSrg } from "../context/SRGContext";
import { hasDraftSession, getDraftAge } from "../services/storage";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Clock, RotateCcw, X, CheckCircle2, Save } from "lucide-react";

export function RecoveryBanner() {
  const { isHydrated, session, lastSavedAt, goToStep } = useSrg();
  const [dismissed, setDismissed] = useState(false);
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (!isHydrated) return;
    const id = setInterval(() => forceTick((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, [isHydrated]);

  const draftAge = isHydrated ? getDraftAge() : null;

  const hasRecoverableData =
    isHydrated &&
    hasDraftSession() &&
    (session.clientDetails.fullName ||
      session.clientDetails.email ||
      session.selectedTemplateId) &&
    session.currentStep > 0 &&
    !dismissed;

  return (
    <AnimatePresence>
      {hasRecoverableData && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel-strong rounded-2xl p-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan/15 border border-cyan/30 text-cyan shrink-0">
              <RotateCcw className="h-4 w-4" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display text-[13.5px] font-medium text-white">
                Welcome back — we recovered your draft.
              </p>
              <p className="text-[12px] text-white/55 mt-0.5">
                {draftAge != null && draftAge > 60000
                  ? `Last saved ${Math.round(draftAge / 60000)} min ago • `
                  : "Just now • "}
                You were on step {session.currentStep + 1} of 9.
              </p>
            </div>
            <button
              type="button"
              onClick={() => goToStep(session.currentStep)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-cyan text-ink font-medium text-[12.5px] px-3.5 py-2 hover:bg-cyan-soft transition-all shrink-0"
            >
              Resume
            </button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss"
              className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AutoSaveIndicator() {
  const { lastSavedAt } = useSrg();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(id);
  }, []);

  if (!lastSavedAt) return null;

  const ago = Math.max(0, now - lastSavedAt);
  const label =
    ago < 30000 ? "Saved just now" : `Saved ${Math.round(ago / 60000)}m ago`;

  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-white/40">
      <CheckCircle2 className="h-3 w-3 text-cyan/60" />
      {label}
    </span>
  );
}

export function SavingIndicator() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-white/40">
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      >
        <Save className="h-3 w-3 text-cyan/60" />
      </motion.span>
      Auto-save active
    </span>
  );
}
