"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Section, SectionHeading, Reveal } from "./primitives";

const FAQS = [
  {
    q: "How long does a typical project take?",
    a: "A focused MVP takes 8–12 weeks. Full enterprise platforms take 4–6 months. We ship in weekly sprints with demos every Friday, so you see progress continuously and can course-correct early. Complex ERP or AI-heavy systems may take longer — we'll give you an honest estimate after the discovery call.",
  },
  {
    q: "Do you work with startups or only enterprises?",
    a: "Both. We've built MVPs for pre-revenue startups and modernized legacy systems for enterprises with 1000+ employees. Our engagement models flex to your stage — fixed-scope for MVPs, dedicated teams for scaling products, and milestone-based for enterprise modernizations.",
  },
  {
    q: "Who owns the source code and IP?",
    a: "You do — 100%. All source code, designs, documentation, and infrastructure credentials are yours from day one. We hand over a private Git repository at project kickoff and never lock you into our tooling. We're happy to sign an NDA before any technical discussion.",
  },
  {
    q: "What happens after launch?",
    a: "We offer optional maintenance and support plans (SLA-backed) covering bug fixes, security patches, dependency upgrades, and performance tuning. Most clients stay with us for 6–12 months post-launch, then transition to their own team with our help. We never hold your system hostage.",
  },
  {
    q: "Can you integrate with our existing systems?",
    a: "Yes — we've integrated with Salesforce, SAP, Tally, custom PHP backends, legacy on-prem databases, and everything in between. We use a clean API-first approach so new systems talk to old ones without rip-and-replace. During the SRG (Software Requirement Gathering), we map every integration point.",
  },
  {
    q: "Do you sign NDAs and handle sensitive data?",
    a: "Absolutely. We sign mutual NDAs before any technical discussion. Our team is trained on DPDP, GDPR, HIPAA, and ISO 27001 practices. All client data is encrypted in transit and at rest. We can deploy on your cloud, your on-prem, or our managed infrastructure — your choice.",
  },
  {
    q: "What if I'm not technical? Will I understand what's happening?",
    a: "Yes. We translate engineering into business outcomes. You get weekly demos in plain English, a shared roadmap you can read, and direct access to the project lead. No jargon, no black boxes. If something is risky or delayed, you'll hear it from us first — not discover it later.",
  },
  {
    q: "How do you handle changes in scope?",
    a: "We expect scope to evolve — that's normal. We use a structured change-request process: you describe the change, we assess impact (cost, timeline, risk), and you approve before we start. No silent scope creep, no surprise invoices. Everything is documented in your project workspace.",
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
