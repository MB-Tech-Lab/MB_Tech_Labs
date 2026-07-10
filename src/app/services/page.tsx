"use client";

import { motion } from "framer-motion";
import { Globe, Building2, Network, Brain, Smartphone, Cloud, Code2, PenTool, Workflow, Wrench, Sparkles } from "lucide-react";
import { ShaderBackground } from "@/components/mb-tech-labs/ShaderBackground";
import { FloatingNav } from "@/components/mb-tech-labs/FloatingNav";
import { Footer } from "@/components/mb-tech-labs/Footer";

const SERVICES = [
  { icon: Globe, title: "Custom Website Development", desc: "Conversion-engineered marketing sites and platforms built with React, Next.js, and edge-rendered performance budgets." },
  { icon: Building2, title: "Enterprise Software", desc: "Multi-tenant platforms with role-based access, audit trails, and operational tooling your teams actually need." },
  { icon: Network, title: "ERP Systems", desc: "Unified ERP backbones integrating finance, inventory, HR, and operations for your specific industry workflow." },
  { icon: Brain, title: "AI Solutions", desc: "RAG pipelines, autonomous agents, fine-tuned models, and LLM guardrails that turn AI into measurable business outcomes." },
  { icon: Smartphone, title: "Mobile Apps", desc: "Native-feel iOS and Android experiences from a single React Native codebase, with offline-first data sync." },
  { icon: Cloud, title: "Cloud Solutions", desc: "Cloud-native infrastructure on AWS, GCP, and Vercel — autoscaling, observability, and cost guardrails included." },
  { icon: Code2, title: "API Development", desc: "Versioned, documented, rate-limited REST and GraphQL APIs with SDKs, webhooks, and a developer portal." },
  { icon: PenTool, title: "UI/UX Design", desc: "Research-driven product design — design systems, prototyping, and accessibility baked in from the first pixel." },
  { icon: Workflow, title: "Automation", desc: "Workflow engines, internal tooling, and integrations that eliminate manual ops and reclaim hundreds of hours monthly." },
  { icon: Wrench, title: "Maintenance", desc: "Long-term care plans — monitoring, security patching, dependency upgrades, and continuous performance tuning." },
];

export default function ServicesPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <ShaderBackground />
      <FloatingNav />
      <main className="relative z-10 flex-1 pt-32 pb-20">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
              <Sparkles className="h-3 w-3" /> Our Services
            </span>
            <h1 className="mt-5 font-display text-3xl sm:text-5xl font-semibold text-white tracking-tight">
              Premium Services, <span className="text-gradient-cyan">Engineered End-to-End</span>
            </h1>
            <p className="mt-5 text-[15px] text-white/60 leading-relaxed max-w-2xl mx-auto">
              From the first architecture diagram to the last line of production observability, we own the full engineering lifecycle.
            </p>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.04 }} className="glass-panel rounded-2xl p-6 hover:border-cyan/25 transition-colors">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/25 text-cyan">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display font-semibold text-[16px] text-white">{s.title}</h3>
                  <p className="mt-2.5 text-[13px] text-white/55 leading-relaxed">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mt-16 glass-panel-strong rounded-2xl p-8 text-center">
            <h2 className="font-display text-xl font-semibold text-white">Ready to start your project?</h2>
            <p className="mt-3 text-[14px] text-white/55">Tell us about your vision through our Project Discovery Portal.</p>
            <a href="/start-project" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[14px] px-6 py-3.5 hover:bg-cyan-soft transition-all">
              Start Your Project
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
