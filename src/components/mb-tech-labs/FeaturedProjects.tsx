"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading, Reveal } from "./primitives";

type Project = {
  name: string;
  category: string;
  description: string;
  stack: string[];
  visual: React.ReactNode;
};

/* Each project gets a hand-crafted abstract visual that reads like a
   product screenshot — premium, professional, never Behance-y. */
function V1() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 80% 0%, rgba(37,214,255,0.25), transparent 55%), linear-gradient(135deg, #1B2454 0%, #151D3B 100%)",
        }}
      />
      <div className="absolute inset-6 flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="ml-3 h-2 w-32 rounded-full bg-white/10" />
        </div>
        <div className="flex-1 grid grid-cols-3 gap-2 mt-2">
          <div className="rounded-lg bg-cyan/15 border border-cyan/25 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-cyan/40 blur-md" />
          </div>
          <div className="col-span-2 rounded-lg bg-white/[0.04] border border-white/10 p-3 flex flex-col gap-1.5">
            <div className="h-1.5 w-20 rounded-full bg-cyan/60" />
            <div className="h-1.5 w-28 rounded-full bg-white/15" />
            <div className="h-1.5 w-24 rounded-full bg-white/10" />
            <div className="mt-auto flex gap-1.5">
              <div className="h-3 w-10 rounded-md bg-cyan/30" />
              <div className="h-3 w-10 rounded-md bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function V2() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(100% 80% at 20% 100%, rgba(94,219,255,0.22), transparent 55%), linear-gradient(135deg, #1B2454 0%, #151D3B 100%)",
        }}
      />
      <div className="absolute inset-6 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="h-2 w-24 rounded-full bg-white/15" />
          <div className="h-5 w-12 rounded-md bg-cyan/40" />
        </div>
        <div className="mt-3 flex-1 rounded-lg bg-white/[0.03] border border-white/10 p-3 flex items-end gap-1.5">
          {[40, 65, 35, 80, 55, 90, 70].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 rounded-t bg-gradient-to-t from-cyan/30 to-cyan/70"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function V3() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 50%, rgba(37,214,255,0.18), transparent 60%), linear-gradient(135deg, #1B2454 0%, #151D3B 100%)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-28 w-28">
          <div className="absolute inset-0 rounded-full border border-cyan/30" />
          <div className="absolute inset-3 rounded-full border border-cyan/20" />
          <div className="absolute inset-6 rounded-full border border-cyan/15" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-cyan shadow-[0_0_12px_rgba(37,214,255,0.8)]" />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-[10px] uppercase tracking-[0.2em] text-cyan-soft">
              AI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const PROJECTS: Project[] = [
  {
    name: "Helios ERP",
    category: "Enterprise Platform",
    description:
      "A unified ERP backbone for a logistics operator — finance, inventory, and HR consolidated onto a single real-time data plane, replacing 14 legacy systems.",
    stack: ["Next.js", "NestJS", "PostgreSQL", "AWS"],
    visual: <V1 />,
  },
  {
    name: "Atlas Analytics",
    category: "SaaS Platform",
    description:
      "A product analytics SaaS processing 2B+ events daily with sub-second query latency, dashboards, and AI-generated insight summaries.",
    stack: ["React", "Node.js", "ClickHouse", "GCP"],
    visual: <V2 />,
  },
  {
    name: "Nova AI Assistant",
    category: "AI Solution",
    description:
      "A retrieval-augmented assistant for a legal firm — ingests 50k+ case documents, cites sources, and ships answers with verifiable provenance.",
    stack: ["Next.js", "Python", "OpenAI", "Pinecone"],
    visual: <V3 />,
  },
];

export function FeaturedProjects() {
  return (
    <Section id="portfolio">
      <SectionHeading
        eyebrow="Featured Projects"
        title={
          <>
            Selected Work,{" "}
            <span className="text-gradient-cyan">Built to Last</span>
          </>
        }
        description="A snapshot of recent engagements. Each project below is in production today, serving real users at scale — not a portfolio render."
      />

      <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.1} y={28}>
            <motion.article
              whileHover={{ y: -6 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="group h-full glass-panel rounded-2xl overflow-hidden hover:border-cyan/30 transition-colors duration-500"
            >
              {/* Visual */}
              <div className="relative aspect-[16/10] overflow-hidden">
                {p.visual}
                <div className="absolute bottom-3 left-3">
                  <span className="rounded-full bg-ink/60 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-cyan-soft">
                    {p.category}
                  </span>
                </div>
              </div>
              {/* Body */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display font-semibold text-[19px] text-white">
                    {p.name}
                  </h3>
                  <a
                    href="#contact"
                    aria-label={`View ${p.name}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/60 group-hover:bg-cyan group-hover:text-ink group-hover:border-cyan transition-all duration-300"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
                <p className="mt-3 text-[13.5px] leading-relaxed text-white/55">
                  {p.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {p.stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-white/8 bg-white/[0.03] px-2 py-0.5 text-[10.5px] font-mono text-white/45"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
