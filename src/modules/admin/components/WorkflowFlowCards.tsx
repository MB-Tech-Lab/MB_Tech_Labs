"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, User } from "lucide-react";
import type { WorkflowMap } from "../types";

const FLOW_ACCENTS: Record<string, { bg: string; border: string; text: string }> = {
  customer: { bg: "bg-cyan/10", border: "border-cyan/30", text: "text-cyan-soft" },
  approval: { bg: "bg-emerald-400/10", border: "border-emerald-400/30", text: "text-emerald-200" },
  verification: { bg: "bg-blue-400/10", border: "border-blue-400/30", text: "text-blue-200" },
  payment: { bg: "bg-amber-400/10", border: "border-amber-400/30", text: "text-amber-200" },
  reporting: { bg: "bg-violet-400/10", border: "border-violet-400/30", text: "text-violet-200" },
  staff: { bg: "bg-pink-400/10", border: "border-pink-400/30", text: "text-pink-200" },
};

export function WorkflowFlowCards({ workflow }: { workflow: WorkflowMap }) {
  const flows = Object.values(workflow).filter((f) => f.enabled);
  if (flows.length === 0) {
    return (
      <p className="text-[12.5px] text-white/40 py-4 text-center">
        No workflows enabled.
      </p>
    );
  }
  return (
    <div className="space-y-6">
      {flows.map((flow, fIdx) => {
        const accent =
          FLOW_ACCENTS[flow.type] ?? FLOW_ACCENTS.customer;
        return (
          <div key={flow.type}>
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${accent.bg} border ${accent.border} ${accent.text} text-[11px] font-mono`}
              >
                {String(fIdx + 1).padStart(2, "0")}
              </span>
              <p className="font-display text-[13.5px] font-semibold text-white">
                {flow.label}
              </p>
              <span className="text-[11px] text-white/40">
                {flow.stages.length} stage{flow.stages.length === 1 ? "" : "s"}
              </span>
            </div>
            {/* Flow cards */}
            <div className="flex items-stretch gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {flow.stages.map((stage, sIdx) => (
                <div key={stage.id} className="flex items-center gap-2 shrink-0">
                  <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: fIdx * 0.05 + sIdx * 0.04 }}
                    className={`w-44 rounded-xl border ${accent.border} ${accent.bg} p-3 backdrop-blur-md`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] text-white/40">
                        Step {sIdx + 1}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-white/50">
                        <Clock className="h-2.5 w-2.5" />
                        {stage.slaHours}h
                      </span>
                    </div>
                    <p className="font-display text-[12.5px] font-semibold text-white leading-tight">
                      {stage.name}
                    </p>
                    {stage.owner && (
                      <p className="mt-1.5 flex items-center gap-1 text-[10.5px] text-white/55">
                        <User className="h-2.5 w-2.5" />
                        {stage.owner}
                      </p>
                    )}
                    {stage.description && (
                      <p className="mt-1.5 text-[10.5px] text-white/45 leading-relaxed line-clamp-2">
                        {stage.description}
                      </p>
                    )}
                  </motion.div>
                  {sIdx < flow.stages.length - 1 && (
                    <div className="flex flex-col items-center shrink-0">
                      <ArrowRight className="h-4 w-4 text-white/30" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
