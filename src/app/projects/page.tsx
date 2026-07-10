"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FolderKanban, ArrowRight, Sparkles } from "lucide-react";
import { ShaderBackground } from "@/components/mb-tech-labs/ShaderBackground";
import { FloatingNav } from "@/components/mb-tech-labs/FloatingNav";
import { Footer } from "@/components/mb-tech-labs/Footer";

type ProjectCategory = "all" | "saas" | "client";

const SEGMENTS: { label: string; value: ProjectCategory }[] = [
  { label: "All Projects", value: "all" },
  { label: "SAAS Products", value: "saas" },
  { label: "Client Projects", value: "client" },
];

export default function ProjectsPage() {
  const [active, setActive] = useState<ProjectCategory>("all");

  return (
    <div className="relative min-h-screen flex flex-col">
      <ShaderBackground />
      <FloatingNav />
      <main className="relative z-10 flex-1 pt-32 pb-20">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
              <Sparkles className="h-3 w-3" /> Portfolio
            </span>
            <h1 className="mt-5 font-display text-3xl sm:text-5xl font-semibold text-white tracking-tight">
              Projects & <span className="text-gradient-cyan">Case Studies</span>
            </h1>
            <p className="mt-5 text-[15px] text-white/60 leading-relaxed">
              Real software built for real businesses.
            </p>
          </motion.div>

          {/* Segmented Control */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
              {SEGMENTS.map((seg) => (
                <button
                  key={seg.value}
                  onClick={() => setActive(seg.value)}
                  className={`relative rounded-lg px-4 py-2 text-[12.5px] font-medium transition-all duration-300 ${
                    active === seg.value
                      ? "bg-cyan text-ink"
                      : "text-white/55 hover:text-white"
                  }`}
                >
                  {seg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Empty State — no projects yet */}
          <div className="mt-10 glass-panel rounded-2xl py-20 text-center max-w-xl mx-auto">
            <FolderKanban className="h-10 w-10 text-white/30 mx-auto mb-4" />
            <h3 className="font-display text-[17px] font-semibold text-white">
              Projects Coming Soon
            </h3>
            <p className="mt-2 text-[13.5px] text-white/50 max-w-sm mx-auto leading-relaxed">
              We're currently delivering software for our clients. Case studies
              with full technical details, screenshots, and business outcomes
              will be published here as projects are completed.
            </p>
            <Link
              href="/start-project"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[13.5px] px-5 py-3 hover:bg-cyan-soft transition-all"
            >
              Start Your Project <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
