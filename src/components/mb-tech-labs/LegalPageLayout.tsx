"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { ShaderBackground } from "@/components/mb-tech-labs/ShaderBackground";
import { FloatingNav } from "@/components/mb-tech-labs/FloatingNav";
import { Footer } from "@/components/mb-tech-labs/Footer";

export interface LegalSection {
  id: string;
  number: number;
  title: string;
  content: React.ReactNode;
}

export interface LegalFAQ {
  question: string;
  answer: string;
}

export interface LegalPageData {
  eyebrow: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: LegalSection[];
  faqs: LegalFAQ[];
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaHref: string;
}

export function LegalPageLayout({ data }: { data: LegalPageData }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="relative min-h-screen flex flex-col">
      <ShaderBackground />
      <FloatingNav />
      <main className="relative z-10 flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-[900px] px-5 sm:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[12px] text-white/45 mb-6">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/70">{data.eyebrow}</span>
          </nav>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
              <FileText className="h-3 w-3" /> {data.eyebrow}
            </span>
            <h1 className="mt-5 font-display text-3xl sm:text-4xl md:text-[44px] font-semibold text-white tracking-tight leading-[1.1]">
              {data.title}
            </h1>
            <p className="mt-4 text-[14.5px] text-white/55 leading-relaxed max-w-2xl">
              {data.subtitle}
            </p>
            <p className="mt-3 text-[12px] text-white/35">
              Last updated: {data.lastUpdated}
            </p>
          </motion.div>

          {/* Table of Contents */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 glass-panel rounded-2xl p-5"
          >
            <p className="font-display text-[12px] font-semibold uppercase tracking-[0.15em] text-cyan-soft/70 mb-3">
              Table of Contents
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
              {data.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-2 text-[12.5px] text-white/60 hover:text-cyan-soft transition-colors py-0.5"
                >
                  <span className="font-mono text-[10px] text-cyan-soft/50 tabular-nums">{String(section.number).padStart(2, "0")}</span>
                  {section.title}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Content Sections */}
          <div className="mt-10 space-y-10">
            {data.sections.map((section, i) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.02 }}
                className="scroll-mt-28"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="font-mono text-[12px] text-cyan-soft/50 tabular-nums">
                    {String(section.number).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-[18px] font-semibold text-white">
                    {section.title}
                  </h2>
                </div>
                <div className="pl-7 text-[13.5px] text-white/65 leading-relaxed space-y-3">
                  {section.content}
                </div>
              </motion.section>
            ))}
          </div>

          {/* FAQ */}
          {data.faqs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-16"
            >
              <h2 className="font-display text-xl font-semibold text-white mb-5">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {data.faqs.map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div
                      key={i}
                      className={`glass-panel rounded-xl overflow-hidden transition-colors ${
                        isOpen ? "border-cyan/25" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                      >
                        <span className="font-display font-medium text-[13.5px] text-white">
                          {faq.question}
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/[0.04] border border-white/10"
                        >
                          <ChevronDown className="h-3.5 w-3.5 text-cyan" />
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="px-5 pb-4 text-[13px] leading-relaxed text-white/60">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 glass-panel-strong rounded-2xl p-8 text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
              <Sparkles className="h-3 w-3" /> {data.ctaTitle}
            </span>
            <p className="mt-4 text-[14px] text-white/60 max-w-md mx-auto">
              {data.ctaDescription}
            </p>
            <Link
              href={data.ctaHref}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[14px] px-6 py-3.5 hover:bg-cyan-soft transition-all hover:shadow-[0_10px_30px_-6px_rgba(37,214,255,0.6)]"
            >
              {data.ctaButtonText} <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ─── Reusable content helpers ─── */

export function LegalP({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

export function LegalBullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan/60 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

export function LegalList({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-2">{children}</ul>;
}

export function LegalCallout({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "success";
  children: React.ReactNode;
}) {
  const styles = {
    info: "border-cyan/25 bg-cyan/[0.06] text-cyan-soft",
    warning: "border-amber-400/25 bg-amber-400/[0.06] text-amber-200",
    success: "border-emerald-400/25 bg-emerald-400/[0.06] text-emerald-200",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-[13px] leading-relaxed ${styles[type]}`}>
      {children}
    </div>
  );
}

export function LegalNumbered({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="font-mono text-[11px] text-cyan-soft/60 tabular-nums mt-0.5 shrink-0">
            {i + 1}.
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}
