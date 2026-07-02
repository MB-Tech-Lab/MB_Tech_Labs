"use client";

import { motion } from "framer-motion";
import { ShaderBackground } from "@/components/mb-tech-labs/ShaderBackground";
import { FloatingNav } from "@/components/mb-tech-labs/FloatingNav";
import { Reveal } from "@/components/mb-tech-labs/primitives";
import { Mail, MessageSquare, Handshake, LifeBuoy, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const CONTACT_REASONS = [
  {
    icon: MessageSquare,
    title: "Quick Questions",
    desc: "Pricing, capabilities, or general enquiries about MB Tech Labs.",
    email: "hello@mbtechlabs.com",
  },
  {
    icon: Handshake,
    title: "Partnership",
    desc: "Agencies, freelancers, or technology partners looking to collaborate.",
    email: "partners@mbtechlabs.com",
  },
  {
    icon: LifeBuoy,
    title: "Support",
    desc: "Existing clients needing technical support or account assistance.",
    email: "support@mbtechlabs.com",
  },
];

export default function ContactPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <ShaderBackground />
      <FloatingNav />

      <main className="relative z-10 flex-1 pt-32 pb-20">
        <div className="mx-auto max-w-[1000px] px-5 sm:px-8">
          {/* Header */}
          <Reveal y={20}>
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-cyan-soft">
                <Mail className="h-3.5 w-3.5 text-cyan" />
                Contact Us
              </span>
              <h1 className="mt-6 font-display font-semibold text-white tracking-[-0.025em] text-[36px] sm:text-5xl md:text-[56px] md:leading-[1.05]">
                Quick questions,{" "}
                <span className="text-gradient-cyan">fast answers.</span>
              </h1>
              <p className="mt-5 max-w-xl mx-auto text-[15px] sm:text-[16px] leading-relaxed text-white/60">
                For project onboarding, use our{" "}
                <Link
                  href="/start-project"
                  className="text-cyan-soft hover:text-cyan transition-colors underline underline-offset-2"
                >
                  Project Discovery Portal
                </Link>
                . For everything else, drop us a note below.
              </p>
            </div>
          </Reveal>

          {/* Contact reasons */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
            {CONTACT_REASONS.map((r, i) => {
              const Icon = r.icon;
              return (
                <Reveal key={r.title} delay={i * 0.08} y={20}>
                  <motion.a
                    href={`mailto:${r.email}`}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="group block h-full glass-panel rounded-2xl p-6 hover:border-cyan/30 transition-colors duration-500"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/25 text-cyan group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 font-display font-semibold text-[16px] text-white">
                      {r.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-white/55">
                      {r.desc}
                    </p>
                    <p className="mt-4 text-[12.5px] text-cyan-soft font-mono break-all">
                      {r.email}
                    </p>
                  </motion.a>
                </Reveal>
              );
            })}
          </div>

          {/* Gateway redirect */}
          <Reveal delay={0.2} y={20}>
            <div className="mt-12 glass-panel-strong rounded-2xl p-7 sm:p-8 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
                <Sparkles className="h-3.5 w-3.5 text-cyan" />
                Ready to build?
              </span>
              <h2 className="mt-5 font-display font-semibold text-white text-[22px] sm:text-2xl tracking-tight">
                Start your software project with MB Tech Labs.
              </h2>
              <p className="mt-3 text-[13.5px] text-white/55 max-w-md mx-auto leading-relaxed">
                Our 9-step Project Discovery Portal takes 8–15 minutes and gives
                our engineers everything they need to scope your build.
              </p>
              <Link
                href="/start-project"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[14.5px] px-6 py-3.5 hover:bg-cyan-soft transition-all duration-300 hover:shadow-[0_12px_40px_-8px_rgba(37,214,255,0.65)]"
              >
                Open Project Discovery Portal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </main>
    </div>
  );
}
