"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Mail, Sparkles } from "lucide-react";
import { Reveal } from "./primitives";

export function CTA() {
  return (
    <section id="contact" className="relative py-24 sm:py-28 md:py-36">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal y={30}>
          <div className="relative overflow-hidden rounded-[28px] glass-panel-strong px-6 sm:px-12 md:px-20 py-14 md:py-20 text-center">
            {/* glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[80%] rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(37,214,255,0.25), transparent 70%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                maskImage:
                  "radial-gradient(ellipse at center, black 30%, transparent 75%)",
              }}
            />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-cyan-soft">
                <Sparkles className="h-3.5 w-3.5 text-cyan" />
                Let's Build
              </span>

              <h2 className="mt-7 font-display font-semibold text-white tracking-[-0.025em] text-[34px] sm:text-5xl md:text-[60px] md:leading-[1.05]">
                Let's Build Something{" "}
                <span className="text-gradient-cyan gradient-drift">
                  Amazing Together.
                </span>
              </h2>

              <p className="mt-6 max-w-2xl mx-auto text-[15px] sm:text-[17px] leading-relaxed text-white/65">
                Whether you're building a startup, enterprise platform, ERP
                system, AI application, or digital product, MB Tech Labs is
                ready to help turn your vision into reality.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[14.5px] px-6 py-3.5 hover:bg-cyan-soft transition-all duration-300 hover:shadow-[0_12px_40px_-8px_rgba(37,214,255,0.65)]"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule Consultation
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] backdrop-blur-md text-white font-medium text-[14.5px] px-6 py-3.5 hover:bg-white/[0.07] hover:border-white/25 transition-all duration-300"
                >
                  <Mail className="h-4 w-4 text-cyan" />
                  Contact Us
                </a>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[12px] text-white/40">
                <span>Senior engineers, no juniors</span>
                <span className="hidden sm:inline">•</span>
                <span>Weekly demos from day one</span>
                <span className="hidden sm:inline">•</span>
                <span>Long-term partnership</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
