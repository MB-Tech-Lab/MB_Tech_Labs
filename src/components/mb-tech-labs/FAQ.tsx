"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Section, SectionHeading, Reveal } from "./primitives";

const FAQS = [
  {
    q: "Why don't you display fixed pricing?",
    a: "Because every software project is unique. A 3-page marketing site and a multi-tenant ERP system require completely different engineering effort, technology, and team composition. Fixed pricing would mean overcharging simple projects and undercharging complex ones. Instead, we analyse your actual requirements through the SRG process and prepare a quotation based on real scope — not generic templates.",
  },
  {
    q: "How does the SRG process work?",
    a: "The Software Requirement Gathering (SRG) is a 9-step online form that captures your business info, project type, goals, functional requirements, workflow, team access, uploads, and budget expectations. It takes 8–15 minutes. After submission, our team reviews it and prepares a detailed proposal with a custom quotation within 3–5 business days.",
  },
  {
    q: "How long does project estimation take?",
    a: "After you submit the SRG form, our team reviews it within 1–2 business days. A detailed proposal with a custom quotation is typically delivered within 3–5 business days. Complex enterprise projects may take up to a week for thorough technical analysis.",
  },
  {
    q: "Do you build custom software?",
    a: "Yes — that's all we do. We don't sell templates, pre-built packages, or SaaS subscriptions. Every project is built from scratch according to your specific business requirements. Whether it's a web app, mobile app, ERP, CRM, or AI solution, the software is engineered around your workflow.",
  },
  {
    q: "Can requirements change later?",
    a: "Yes. We expect scope to evolve as the project progresses. Changes are handled through a structured change-request process: you describe the change, we assess the impact on cost and timeline, and you approve before work begins. No silent scope creep, no surprise invoices.",
  },
  {
    q: "How do I get started?",
    a: "Click 'Start Your Project' anywhere on our website and complete the Software Requirement Gathering (SRG) form. It takes 8–15 minutes. After that, our team will review your requirements and prepare a customised proposal and quotation. No payment is required until you approve the proposal and sign the project agreement.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq">
      <SectionHeading
        eyebrow="FAQ"
        title={
          <>
            Questions, <span className="text-gradient-cyan">Answered.</span>
          </>
        }
        description="Everything you need to know before starting a project with MB Tech Labs. Still have questions? Schedule a consultation — we're happy to talk."
      />
      <div className="mt-12 max-w-3xl mx-auto space-y-3">
        {FAQS.map((faq, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={i} delay={i * 0.04} y={16}>
              <div
                className={`glass-panel rounded-2xl overflow-hidden transition-colors duration-300 ${
                  isOpen ? "border-cyan/25" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full text-left px-5 sm:px-6 py-4 flex items-center justify-between gap-4"
                >
                  <span className="font-display font-medium text-[14.5px] text-white">
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] border border-white/10"
                  >
                    <ChevronDown className="h-4 w-4 text-cyan" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 sm:px-6 pb-5 text-[13.5px] leading-relaxed text-white/60">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
