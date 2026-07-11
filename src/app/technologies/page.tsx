"use client";

import { motion } from "framer-motion";
import { Layers, Server, Database, Cloud, Cpu, Workflow, Wrench, Sparkles } from "lucide-react";
import { ShaderBackground } from "@/components/mb-tech-labs/ShaderBackground";
import { FloatingNav } from "@/components/mb-tech-labs/FloatingNav";
import { Footer } from "@/components/mb-tech-labs/Footer";

const CATEGORIES = [
  { icon: Layers, title: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"] },
  { icon: Server, title: "Backend", items: ["Node.js", "NestJS", "Python", "Java", "Express.js"] },
  { icon: Database, title: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Prisma ORM"] },
  { icon: Cloud, title: "Cloud", items: ["AWS", "Google Cloud", "Vercel", "Hostinger VPS", "Cloudflare"] },
  { icon: Cpu, title: "AI", items: ["OpenAI", "Gemini", "Claude", "LangChain", "Vector Databases"] },
  { icon: Workflow, title: "DevOps", items: ["Docker", "Kubernetes", "GitHub Actions", "Terraform", "Nginx"] },
  { icon: Wrench, title: "Tools", items: ["Figma", "Jira", "Linear", "Sentry", "Postman"] },
];

export default function TechnologiesPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <ShaderBackground />
      <FloatingNav />
      <main className="relative z-10 flex-1 pt-32 pb-20">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
              <Sparkles className="h-3 w-3" /> Technology Stack
            </span>
            <h1 className="mt-5 font-display text-3xl sm:text-5xl font-semibold text-white tracking-tight">
              A Modern Toolkit, <span className="text-gradient-cyan">Chosen With Intent</span>
            </h1>
            <p className="mt-5 text-[15px] text-white/60 leading-relaxed max-w-2xl mx-auto">
              Each technology is here because we have shipped production systems with it and would choose it again. No resume-driven development.
            </p>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="glass-panel rounded-2xl p-6">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/25 text-cyan">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display font-semibold text-[14px] uppercase tracking-[0.12em] text-white/90">{cat.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {cat.items.map((item) => (
                      <span key={item} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/80 hover:bg-cyan/10 hover:border-cyan/30 hover:text-cyan-soft transition-all cursor-default">
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
