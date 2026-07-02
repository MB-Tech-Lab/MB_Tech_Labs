"use client";

import { useSrg } from "../context/SRGContext";
import { GlassCard, AnimateIn, TextInput } from "./ui";
import { WORKFLOW_FLOW_META } from "../engine/runtime";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCheck,
  CheckSquare,
  ShieldCheck,
  CreditCard,
  BarChart3,
  Users,
  Plus,
  Trash2,
  GripVertical,
  ArrowRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import type { ComponentType } from "react";
import type { WorkflowFlowType } from "../types";

const FLOW_ICONS: Record<WorkflowFlowType, ComponentType<{ className?: string }>> = {
  customer: UserCheck,
  approval: CheckSquare,
  verification: ShieldCheck,
  payment: CreditCard,
  reporting: BarChart3,
  staff: Users,
};

export function Step8WorkflowBuilder() {
  const { session, toggleFlow, addStage, updateStage, removeStage, reorderStage } =
    useSrg();
  const flows = Object.values(session.workflow);

  return (
    <div className="space-y-8">
      <AnimateIn>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
            Step 08
          </span>
          <h1 className="mt-5 font-display text-3xl sm:text-4xl md:text-[40px] font-semibold text-white tracking-tight leading-[1.1]">
            Map your{" "}
            <span className="text-gradient-cyan">workflows.</span>
          </h1>
          <p className="mt-3 text-[14.5px] text-white/55 max-w-xl">
            Enable the flows that apply to your project, then add or reorder
            stages. Each stage can have an owner and an SLA. We've pre-filled
            common defaults based on your template.
          </p>
        </div>
      </AnimateIn>

      <div className="space-y-4">
        {flows.map((flow, idx) => {
          const Icon = FLOW_ICONS[flow.type];
          const meta = WORKFLOW_FLOW_META[flow.type];
          return (
            <AnimateIn key={flow.type} delay={idx * 0.05} y={18}>
              <GlassCard className="overflow-hidden">
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <span
                      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all ${
                        flow.enabled
                          ? "bg-cyan/15 border-cyan/40 text-cyan"
                          : "bg-white/[0.04] border-white/10 text-white/40"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display font-semibold text-[16px] text-white">
                            {meta.label}
                          </h3>
                          <p className="text-[12.5px] text-white/45 mt-0.5">
                            {meta.description}
                          </p>
                        </div>
                        <Toggle
                          checked={flow.enabled}
                          onChange={() => toggleFlow(flow.type)}
                        />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {flow.enabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 pl-0 sm:pl-15">
                          {/* Stage list */}
                          <div className="space-y-2">
                            <AnimatePresence>
                              {flow.stages.map((stage, sIdx) => (
                                <motion.div
                                  key={stage.id}
                                  layout
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, x: -12 }}
                                  transition={{
                                    duration: 0.3,
                                    ease: [0.16, 1, 0.3, 1],
                                  }}
                                  className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-3"
                                >
                                  <div className="flex items-center gap-2.5">
                                    {/* order + reorder controls */}
                                    <div className="flex flex-col items-center gap-0.5 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          sIdx > 0 &&
                                          reorderStage(flow.type, sIdx, sIdx - 1)
                                        }
                                        disabled={sIdx === 0}
                                        className="text-white/30 hover:text-cyan disabled:opacity-20 disabled:cursor-not-allowed"
                                        aria-label="Move up"
                                      >
                                        <ChevronUp className="h-3.5 w-3.5" />
                                      </button>
                                      <GripVertical className="h-3.5 w-3.5 text-white/20" />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          sIdx < flow.stages.length - 1 &&
                                          reorderStage(flow.type, sIdx, sIdx + 1)
                                        }
                                        disabled={sIdx === flow.stages.length - 1}
                                        className="text-white/30 hover:text-cyan disabled:opacity-20 disabled:cursor-not-allowed"
                                        aria-label="Move down"
                                      >
                                        <ChevronDown className="h-3.5 w-3.5" />
                                      </button>
                                    </div>

                                    {/* step number */}
                                    <span className="font-mono text-[11px] text-cyan-soft/60 tabular-nums w-6 text-center shrink-0">
                                      {sIdx + 1}
                                    </span>

                                    {/* name + owner + sla */}
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-[2fr_1.4fr_0.8fr] gap-2">
                                      <TextInput
                                        value={stage.name}
                                        onChange={(e) =>
                                          updateStage(flow.type, stage.id, {
                                            name: e.target.value,
                                          })
                                        }
                                        placeholder="Stage name"
                                        className="text-[13px] py-2"
                                      />
                                      <TextInput
                                        value={stage.owner}
                                        onChange={(e) =>
                                          updateStage(flow.type, stage.id, {
                                            owner: e.target.value,
                                          })
                                        }
                                        placeholder="Owner (role)"
                                        className="text-[13px] py-2"
                                      />
                                      <div className="flex items-center gap-1.5">
                                        <TextInput
                                          type="number"
                                          value={stage.slaHours}
                                          onChange={(e) =>
                                            updateStage(flow.type, stage.id, {
                                              slaHours: Math.max(
                                                1,
                                                Number(e.target.value) || 1
                                              ),
                                            })
                                          }
                                          min={1}
                                          max={720}
                                          className="text-[13px] py-2"
                                        />
                                        <span className="text-[10.5px] text-white/40 shrink-0">
                                          hrs
                                        </span>
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeStage(flow.type, stage.id)
                                      }
                                      aria-label="Remove stage"
                                      className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-rose-300 hover:bg-rose-400/10 transition-all"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>

                          {flow.stages.length > 0 && (
                            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-white/35">
                              <span>{flow.stages[0]?.name || "Start"}</span>
                              {flow.stages.slice(1).map((s, i) => (
                                <span key={i} className="inline-flex items-center gap-2">
                                  <ArrowRight className="h-3 w-3" />
                                  <span>{s.name || "..."}</span>
                                </span>
                              ))}
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => addStage(flow.type)}
                            className="mt-3 w-full rounded-lg border border-dashed border-white/15 py-2.5 text-[12.5px] text-white/55 hover:border-cyan/40 hover:bg-cyan/[0.04] hover:text-cyan-soft transition-all inline-flex items-center justify-center gap-1.5"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add stage
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </GlassCard>
            </AnimateIn>
          );
        })}
      </div>
    </div>
  );
}

/* --------------------------- Toggle --------------------------- */

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
        checked ? "bg-cyan" : "bg-white/15"
      }`}
    >
      <motion.span
        layout
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md ${
          checked ? "right-0.5" : "left-0.5"
        }`}
      />
    </button>
  );
}
