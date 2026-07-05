"use client";

import { motion } from "framer-motion";
import { Check, Circle, Clock } from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { PROJECT_STATUS_FLOW, type AdminSubmission } from "../types";
import { cn } from "@/lib/utils";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ProjectTimeline({ submission }: { submission: AdminSubmission }) {
  const { setStatusOf } = useAdmin();
  const currentIdx = PROJECT_STATUS_FLOW.indexOf(submission.status);

  return (
    <div className="glass-panel-strong rounded-2xl p-5">
      <div className="mb-4">
        <p className="text-[10.5px] font-display font-semibold uppercase tracking-[0.22em] text-cyan-soft/70 mb-1">
          Project Timeline
        </p>
        <h3 className="font-display text-[15px] font-semibold text-white">
          Lifecycle
        </h3>
        <p className="text-[11.5px] text-white/45 mt-0.5">
          Click a step to update status
        </p>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div
          aria-hidden
          className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan/40 via-white/10 to-transparent"
        />
        <ol className="space-y-0.5">
          {PROJECT_STATUS_FLOW.map((status, idx) => {
            const event = submission.timeline.find((t) => t.status === status);
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const isFuture = idx > currentIdx;
            const isClickable = idx <= currentIdx + 1; // can advance one step at a time

            return (
              <li key={status}>
                <motion.button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && setStatusOf(submission.id, status)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className={cn(
                    "group relative flex items-start gap-3 w-full text-left rounded-lg py-1.5 px-1 transition-colors",
                    isClickable
                      ? "hover:bg-white/[0.04] cursor-pointer"
                      : "cursor-not-allowed"
                  )}
                >
                  {/* Node */}
                  <span
                    className={cn(
                      "relative z-10 mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                      isDone && "bg-cyan border-cyan",
                      isCurrent && "bg-cyan border-cyan ring-4 ring-cyan/20",
                      isFuture && "bg-ink border-white/20"
                    )}
                  >
                    {isDone && <Check className="h-2 w-2 text-ink" strokeWidth={4} />}
                    {isCurrent && (
                      <motion.span
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-cyan/40"
                      />
                    )}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p
                      className={cn(
                        "text-[12.5px] font-medium leading-tight transition-colors",
                        isDone && "text-white/55",
                        isCurrent && "text-white",
                        isFuture && "text-white/35"
                      )}
                    >
                      {status}
                    </p>
                    {event?.timestamp ? (
                      <p className="text-[10.5px] text-white/40 mt-0.5 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {formatDate(event.timestamp)}
                      </p>
                    ) : isFuture ? (
                      <p className="text-[10.5px] text-white/25 mt-0.5">Pending</p>
                    ) : null}
                  </div>
                </motion.button>
              </li>
            );
          })}
        </ol>
      </div>

      {submission.status === "Rejected" && (
        <div className="mt-4 pt-4 border-t border-white/8">
          <p className="text-[11px] text-rose-300 flex items-center gap-1.5">
            <Circle className="h-2.5 w-2.5 fill-rose-400 text-rose-400" />
            Project rejected
          </p>
        </div>
      )}
    </div>
  );
}
