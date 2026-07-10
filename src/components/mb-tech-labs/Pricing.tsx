"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Section, SectionHeading, Reveal } from "./primitives";

const TIERS = [
  {
    name: "MVP",
    tagline: "Validate your idea fast",
    price: "$5K – $25K",
    duration: "4 – 8 weeks",
    features: [
      "Discovery + UX design",
      "Core feature set (3–5 modules)",
      "Web or mobile (one platform)",
      "Standard auth + user management",
      "Payment gateway integration",
      "30 days post-launch support",
      "Source code + documentation",
    ],
    highlight: false,
  },
  {
    name: "Growth",
    tagline: "Scale with confidence",
    price: "$25K – $100K",
    duration: "3 – 5 months",
    features: [
      "Everything in MVP, plus:",
      "Full multi-module platform",
      "Web + mobile + API",
      "Admin dashboard + CRM",
      "Third-party integrations (5+)",
      "AI/ML capabilities",
      "Cloud infrastructure setup",
      "90 days post-launch support",
      "Team training + handover",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    tagline: "Mission-critical systems",
    price: "$100K+",
    duration: "6 – 12 months",
    features: [
      "Everything in Growth, plus:",
      "Custom ERP / CRM / SaaS",
      "Multi-tenant architecture",
      "Compliance (HIPAA, SOC2, ISO 27001)",
      "Legacy system migration",
      "Dedicated team (5+ engineers)",
      "On-prem or hybrid deployment",
      "12 months SLA-backed support",
      "Quarterly security audits",
    ],
    highlight: false,
  },
];

export function Pricing() {
  return (
    <Section id="pricing">
      <SectionHeading
        eyebrow="Pricing Approach"
        title={
          <>
            Transparent Engagement{" "}
            <span className="text-gradient-cyan">Models.</span>
          </>
        }
        description="No hidden fees. No surprise invoices. Pick the tier that matches your stage — every project starts with a free discovery call and a fixed-scope proposal."
      />

      <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {TIERS.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 0.08} y={22}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`relative h-full rounded-2xl p-6 sm:p-7 overflow-hidden ${
                tier.highlight
                  ? "glass-panel-strong border-cyan/40 ring-1 ring-cyan/20"
                  : "glass-panel"
              }`}
            >
              {tier.highlight && (
                <div className="absolute top-0 right-0">
                  <div className="bg-cyan text-ink text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
                    Most Popular
                  </div>
                </div>
              )}
              <div className="relative">
                <h3 className="font-display text-[18px] font-semibold text-white">
                  {tier.name}
                </h3>
                <p className="text-[12.5px] text-cyan-soft/70 mt-0.5">
                  {tier.tagline}
                </p>
                <div className="mt-5">
                  <p className="font-display text-[28px] font-bold text-white tracking-tight">
                    {tier.price}
                  </p>
                  <p className="text-[12px] text-white/45 mt-1">
                    Typical timeline: {tier.duration}
                  </p>
                </div>
                <div className="mt-6 space-y-2.5">
                  {tier.features.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan/15 border border-cyan/30">
                        <Check className="h-2.5 w-2.5 text-cyan" strokeWidth={3} />
                      </span>
                      <span
                        className={`text-[12.5px] leading-relaxed ${
                          f.endsWith(":") ? "text-white font-medium" : "text-white/60"
                        }`}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
                <a
                  href="/start-project"
                  className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl font-semibold text-[13.5px] px-5 py-3 transition-all duration-300 group ${
                    tier.highlight
                      ? "bg-cyan text-ink hover:bg-cyan-soft hover:shadow-[0_10px_30px_-6px_rgba(37,214,255,0.6)]"
                      : "border border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.07] hover:border-white/25"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Start Your Project
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3}>
        <p className="mt-8 text-center text-[12px] text-white/40 max-w-xl mx-auto">
          All prices are indicative ranges. Final pricing is determined after the
          Software Requirement Gathering (SRG) process — you'll receive a
          detailed quotation with line items before any work begins.
        </p>
      </Reveal>
    </Section>
  );
}
