"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Section, SectionHeading, Reveal } from "./primitives";
import Link from "next/link";

export function Testimonials() {
  return (
    <Section id="testimonials">
      <SectionHeading
        eyebrow="Client Testimonials"
        title={
          <>
            Client Success{" "}
            <span className="text-gradient-cyan">Stories</span>
          </>
        }
      />

      <Reveal y={20}>
        <div className="mt-10 glass-panel-strong rounded-2xl p-10 sm:p-14 text-center max-w-2xl mx-auto">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan/10 border border-cyan/25 text-cyan mx-auto">
            <Sparkles className="h-7 w-7" />
          </span>
          <h3 className="mt-6 font-display text-lg sm:text-xl font-semibold text-white leading-snug max-w-md mx-auto">
            We're currently delivering projects for our clients.
          </h3>
          <p className="mt-3 text-[14px] text-white/55 leading-relaxed max-w-sm mx-auto">
            Client success stories will be published here as projects are
            completed. Every story will be real — no fabricated reviews.
          </p>
          <Link
            href="/start-project"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[14px] px-6 py-3.5 hover:bg-cyan-soft transition-all hover:shadow-[0_10px_30px_-6px_rgba(37,214,255,0.6)] group"
          >
            Start Your Project
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
