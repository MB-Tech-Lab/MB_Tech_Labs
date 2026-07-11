"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Building2,
  Network,
  Brain,
  Smartphone,
  Cloud,
  Code2,
  PenTool,
  Workflow,
  Wrench,
  ArrowUpRight,
} from "lucide-react";
import { Section, SectionHeading, Reveal } from "./primitives";

const SERVICES = [
  {
    icon: Globe,
    title: "Custom Website Development",
    desc: "Conversion-engineered marketing sites and platforms built with React, Next.js, and edge-rendered performance budgets.",
    tags: ["Next.js", "Edge", "SEO"],
  },
  {
    icon: Building2,
    title: "Enterprise Software",
    desc: "Multi-tenant platforms with role-based access, audit trails, and the operational tooling your teams actually need.",
    tags: ["Multi-tenant", "RBAC", "Audit"],
  },
  {
    icon: Network,
    title: "ERP Systems",
    desc: "Unified ERP backbones integrating finance, inventory, HR, and operations — designed for your specific industry workflow.",
    tags: ["Finance", "Inventory", "HR"],
  },
  {
    icon: Brain,
    title: "AI Solutions",
    desc: "RAG pipelines, autonomous agents, fine-tuned models, and LLM guardrails that turn AI into measurable business outcomes.",
    tags: ["RAG", "Agents", "LLMs"],
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    desc: "Native-feel iOS and Android experiences from a single React Native codebase, with offline-first data sync.",
    tags: ["React Native", "iOS", "Android"],
  },
  {
    icon: Cloud,
    title: "Cloud Solutions",
    desc: "Cloud-native infrastructure on AWS, GCP, and Vercel — autoscaling, observability, and cost guardrails included.",
    tags: ["AWS", "GCP", "Vercel"],
  },
  {
    icon: Code2,
    title: "API Development",
    desc: "Versioned, documented, rate-limited REST and GraphQL APIs with SDKs, webhooks, and a developer portal.",
    tags: ["REST", "GraphQL", "SDKs"],
  },
  {
    icon: PenTool,
    title: "UI/UX Design",
    desc: "Research-driven product design — design systems, prototyping, and accessibility baked in from the first pixel.",
    tags: ["Design Systems", "A11y", "Prototype"],
  },
  {
    icon: Workflow,
    title: "Automation",
    desc: "Workflow engines, internal tooling, and integrations that eliminate manual ops and reclaim hundreds of hours monthly.",
    tags: ["Workflows", "Integrations", "Ops"],
  },
  {
    icon: Wrench,
    title: "Maintenance",
    desc: "Long-term care plans — monitoring, security patching, dependency upgrades, and continuous performance tuning.",
    tags: ["SLA", "Patching", "Tuning"],
  },
];

export function Services() {
  return (
    <Section id="services">
      <SectionHeading
        eyebrow="What We Build"
        title={
          <>
            Premium Services,{" "}
            <span className="text-gradient-cyan">Engineered End-to-End</span>
          </>
        }
        description="From the first architecture diagram to the last line of production observability, we own the full engineering lifecycle. Every service below is delivered by senior practitioners — no juniors learning on your dollar."
      />

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal key={s.title} delay={(i % 3) * 0.06} y={22}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="group relative h-full glass-panel rounded-2xl p-6 overflow-hidden hover:border-cyan/30 transition-colors duration-500"
              >
                {/* hover glow */}
                <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "radial-gradient(400px circle at 50% 0%, rgba(37,214,255,0.10), transparent 60%)",
                  }}
                />
                <div className="relative flex items-start justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/25 text-cyan group-hover:scale-110 group-hover:bg-cyan/15 transition-all duration-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-white/25 group-hover:text-cyan group-hover:rotate-12 transition-all duration-300" />
                </div>
                <h3 className="relative mt-5 font-display font-semibold text-[17px] text-white">
                  {s.title}
                </h3>
                <p className="relative mt-2.5 text-[13.5px] leading-relaxed text-white/55">
                  {s.desc}
                </p>
                <div className="relative mt-5 flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-white/8 bg-white/[0.03] px-2 py-0.5 text-[10.5px] font-mono text-white/45 tracking-tight"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
