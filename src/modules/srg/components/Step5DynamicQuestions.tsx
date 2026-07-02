"use client";

import { useSrg } from "../context/SRGContext";
import { Field, TextInput, TextArea, Select, OptionChips, RatingInput, BooleanToggle, GlassCard, AnimateIn } from "./ui";
import { getTemplate } from "../templates";
import {
  isSectionVisible,
  isQuestionVisible,
} from "../engine/runtime";
import { motion, AnimatePresence } from "framer-motion";
import type { SrgQuestion, AnswerValue } from "../types";

export function Step5DynamicQuestions() {
  const { session } = useSrg();
  const template = getTemplate(session.selectedTemplateId);

  if (!template) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-white/60">
          Please select a project template in Step 3 first.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-8">
      <AnimateIn>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
            Step 05
          </span>
          <h1 className="mt-5 font-display text-3xl sm:text-4xl md:text-[40px] font-semibold text-white tracking-tight leading-[1.1]">
            Discovery questions for{" "}
            <span className="text-gradient-cyan">{template.name}</span>
          </h1>
          <p className="mt-3 text-[14.5px] text-white/55 max-w-xl">
            These questions are dynamically loaded from the {template.name}{" "}
            template. Answer based on your current situation — conditional
            questions will appear or hide as you go.
          </p>
        </div>
      </AnimateIn>

      <div className="space-y-6">
        {template.sections.map((section, sIdx) => {
          if (!isSectionVisible(section, session.answers)) return null;
          const visibleQuestions = section.questions.filter((q) =>
            isQuestionVisible(q, session.answers)
          );
          if (visibleQuestions.length === 0) return null;

          return (
            <AnimateIn key={section.id} delay={sIdx * 0.05} y={20}>
              <GlassCard strong className="p-6 sm:p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] text-cyan-soft/70 tabular-nums">
                      {String(sIdx + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-[19px] font-semibold text-white">
                      {section.title}
                    </h2>
                  </div>
                  {section.description && (
                    <p className="mt-1.5 text-[12.5px] text-white/55 ml-7">
                      {section.description}
                    </p>
                  )}
                </div>

                <div className="space-y-5 ml-7">
                  {visibleQuestions.map((q) => (
                    <QuestionRenderer
                      key={q.id}
                      question={q}
                      value={session.answers[q.id]}
                    />
                  ))}
                </div>
              </GlassCard>
            </AnimateIn>
          );
        })}
      </div>
    </div>
  );
}

/* --------------------------- Question renderer --------------------------- */

function QuestionRenderer({
  question,
  value,
}: {
  question: SrgQuestion;
  value: AnswerValue;
}) {
  const { setAnswer } = useSrg();

  function handleChange(v: unknown) {
    setAnswer(question.id, v);
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <Field
          label={question.label}
          htmlFor={question.id}
          required={question.required}
          help={question.help}
          description={question.description}
        >
          <QuestionInput
            question={question}
            value={value}
            onChange={handleChange}
          />
        </Field>
      </motion.div>
    </AnimatePresence>
  );
}

function QuestionInput({
  question,
  value,
  onChange,
}: {
  question: SrgQuestion;
  value: AnswerValue;
  onChange: (v: unknown) => void;
}) {
  switch (question.type) {
    case "text":
    case "tel":
    case "url":
    case "date":
      return (
        <TextInput
          id={question.id}
          type={
            question.type === "text" ? "text" : question.type
          }
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          maxLength={question.maxLength}
        />
      );
    case "email":
      return (
        <TextInput
          id={question.id}
          type="email"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
        />
      );
    case "number":
      return (
        <TextInput
          id={question.id}
          type="number"
          value={value === undefined || value === null ? "" : String(value)}
          onChange={(e) =>
            onChange(e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder={question.placeholder}
          min={question.min}
          max={question.max}
        />
      );
    case "textarea":
      return (
        <TextArea
          id={question.id}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          maxLength={question.maxLength}
        />
      );
    case "select":
    case "radio":
      return (
        <Select
          id={question.id}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Select an option"
          options={question.options ?? []}
        />
      );
    case "multiselect":
    case "checkbox":
      return (
        <OptionChips
          options={question.options ?? []}
          value={value as string[] | undefined}
          onChange={onChange}
          multi
          columns={question.options && question.options.length > 4 ? 2 : 1}
        />
      );
    case "boolean":
      return (
        <BooleanToggle
          value={value as boolean}
          onChange={onChange}
        />
      );
    case "rating":
    case "scale":
      return (
        <RatingInput
          value={(value as number) ?? 0}
          onChange={onChange}
          scale={question.scale ?? 5}
          labels={["1", "2", "3", "4", "5"].slice(0, question.scale ?? 5)}
        />
      );
    default:
      return (
        <TextInput
          id={question.id}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
        />
      );
  }
}
