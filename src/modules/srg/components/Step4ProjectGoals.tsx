"use client";

import { useSrg } from "../context/SRGContext";
import { Field, TextInput, TextArea, GlassCard, AnimateIn, OptionChips, RatingInput } from "./ui";
import { getTemplate } from "../templates";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useState } from "react";

const SECONDARY_GOAL_SUGGESTIONS = [
  "Reduce operational costs",
  "Improve customer experience",
  "Increase sales / revenue",
  "Better data & decision-making",
  "Compliance & security",
  "Automation of manual work",
  "Faster time-to-market",
  "Brand & market positioning",
  "Competitive differentiation",
  "Employee productivity",
];

const DEADLINES = [
  { label: "ASAP (within 4 weeks)", value: "asap" },
  { label: "1–3 months", value: "1_3_months" },
  { label: "3–6 months", value: "3_6_months" },
  { label: "6–12 months", value: "6_12_months" },
  { label: "Flexible / No hard deadline", value: "flexible" },
];

const BUDGETS = [
  { label: "Under $5K / ₹40K", value: "under_5k" },
  { label: "$5K – $15K / ₹40K–₹1.2L", value: "5k_15k" },
  { label: "$15K – $50K / ₹1.2L–₹4L", value: "15k_50k" },
  { label: "$50K – $150K / ₹4L–₹12L", value: "50k_150k" },
  { label: "$150K+ / ₹12L+", value: "above_150k" },
];

export function Step4ProjectGoals() {
  const { session, patchGoals } = useSrg();
  const { projectGoals: g } = session;
  const template = getTemplate(session.selectedTemplateId);
  const [customGoal, setCustomGoal] = useState("");

  function addSecondary(goal: string) {
    if (!goal.trim()) return;
    if (g.secondaryGoals.includes(goal)) return;
    patchGoals({ secondaryGoals: [...g.secondaryGoals, goal] });
  }
  function removeSecondary(goal: string) {
    patchGoals({ secondaryGoals: g.secondaryGoals.filter((x) => x !== goal) });
  }

  const suggestions = (template?.suggestedGoals ?? SECONDARY_GOAL_SUGGESTIONS).filter(
    (s) => !g.secondaryGoals.includes(s)
  );

  return (
    <div className="space-y-8">
      <AnimateIn>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
            Step 04
          </span>
          <h1 className="mt-5 font-display text-3xl sm:text-4xl md:text-[40px] font-semibold text-white tracking-tight leading-[1.1]">
            Define your{" "}
            <span className="text-gradient-cyan">success.</span>
          </h1>
          <p className="mt-3 text-[14.5px] text-white/55 max-w-xl">
            What does success look like 12 months from launch? Be specific —
            measurable goals lead to better architecture decisions.
          </p>
        </div>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <GlassCard strong className="p-6 sm:p-8 space-y-6">
          <Field
            label="Primary Goal"
            htmlFor="primaryGoal"
            required
            description="The single most important outcome of this project"
          >
            <TextArea
              id="primaryGoal"
              value={g.primaryGoal}
              onChange={(e) => patchGoals({ primaryGoal: e.target.value })}
              placeholder="e.g. Launch a patient management platform that reduces OPD wait time by 50% and goes paperless within 6 months."
              maxLength={500}
            />
          </Field>

          <div>
            <Field label="Secondary Goals">
              {g.secondaryGoals.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {g.secondaryGoals.map((goal) => (
                    <motion.span
                      key={goal}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-cyan/10 border border-cyan/30 pl-3 pr-1.5 py-1 text-[12.5px] text-white"
                    >
                      {goal}
                      <button
                        type="button"
                        onClick={() => removeSecondary(goal)}
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-cyan/20 transition-colors"
                        aria-label={`Remove ${goal}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}
              {suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {suggestions.slice(0, 8).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSecondary(s)}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/60 hover:border-cyan/30 hover:text-cyan-soft transition-all"
                    >
                      <Plus className="h-3 w-3" />
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <TextInput
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSecondary(customGoal);
                      setCustomGoal("");
                    }
                  }}
                  placeholder="Add a custom goal and press Enter"
                  className="text-[13px]"
                />
              </div>
            </Field>
          </div>

          <Field
            label="How will you measure success?"
            htmlFor="successMetrics"
            required
            description="Metrics, KPIs, or indicators you will use to evaluate the project"
          >
            <TextArea
              id="successMetrics"
              value={g.successMetrics}
              onChange={(e) => patchGoals({ successMetrics: e.target.value })}
              placeholder="e.g. 30% increase in online donations, sub-2s page load, 90% mobile adoption, $X monthly cost savings..."
              maxLength={800}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Target Deadline" htmlFor="deadline" required>
              <div className="space-y-2">
                {DEADLINES.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => patchGoals({ deadline: d.value })}
                    className={`w-full text-left rounded-xl border px-3.5 py-2.5 text-[13px] transition-all ${
                      g.deadline === d.value
                        ? "bg-cyan/10 border-cyan/40 text-white"
                        : "bg-white/[0.03] border-white/10 text-white/70 hover:border-white/20"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Budget Range" htmlFor="budgetRange" required>
              <div className="space-y-2">
                {BUDGETS.map((b) => (
                  <button
                    key={b.value}
                    type="button"
                    onClick={() => patchGoals({ budgetRange: b.value })}
                    className={`w-full text-left rounded-xl border px-3.5 py-2.5 text-[13px] transition-all ${
                      g.budgetRange === b.value
                        ? "bg-cyan/10 border-cyan/40 text-white"
                        : "bg-white/[0.03] border-white/10 text-white/70 hover:border-white/20"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <Field
            label="Priorities"
            description="Rate each priority on a 1–5 scale (5 = highest priority)"
          >
            <div className="space-y-4 mt-2">
              {(
                [
                  ["speed", "Speed of delivery"],
                  ["cost", "Cost efficiency"],
                  ["quality", "Quality & polish"],
                  ["scalability", "Scalability"],
                  ["innovation", "Innovation"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-3 items-center">
                  <span className="text-[13px] text-white/70">{label}</span>
                  <RatingInput
                    value={g.priorities[key]}
                    onChange={(v) =>
                      patchGoals({ priorities: { ...g.priorities, [key]: v } })
                    }
                    scale={5}
                    labels={["Low", "", "Mid", "", "High"]}
                  />
                </div>
              ))}
            </div>
          </Field>
        </GlassCard>
      </AnimateIn>
    </div>
  );
}
