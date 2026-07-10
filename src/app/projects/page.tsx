"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FolderKanban,
  Search,
  ArrowRight,
  ArrowUpRight,
  Filter,
  Sparkles,
} from "lucide-react";
import { ShaderBackground } from "@/components/mb-tech-labs/ShaderBackground";
import { FloatingNav } from "@/components/mb-tech-labs/FloatingNav";
import { Footer } from "@/components/mb-tech-labs/Footer";

const INDUSTRIES = ["All", "Healthcare", "Education", "Retail", "Finance", "Manufacturing", "Logistics", "Hospitality", "Real Estate", "Government", "Startups"];
const PROJECT_TYPES = ["All", "Web Application", "Mobile App", "Enterprise Software", "AI Solution", "ERP", "CRM", "E-commerce"];
const STATUSES = ["All", "Completed", "In Development", "Planning"];

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All");
  const [projectType, setProjectType] = useState("All");
  const [status, setStatus] = useState("All");

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

          {/* Search + Filters */}
          <div className="mt-10 space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 pl-10 pr-4 py-2.5 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/40 focus:ring-2 focus:ring-cyan/15 transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <FilterGroup label="Industry" options={INDUSTRIES} value={industry} onChange={setIndustry} />
              <FilterGroup label="Type" options={PROJECT_TYPES} value={projectType} onChange={setProjectType} />
              <FilterGroup label="Status" options={STATUSES} value={status} onChange={setStatus} />
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

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
      <span className="text-[10.5px] uppercase tracking-wider text-white/35 shrink-0 mr-1">{label}:</span>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-all ${
            value === opt
              ? "bg-cyan/15 border-cyan/40 text-white"
              : "bg-white/[0.03] border-white/10 text-white/55 hover:border-white/20"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
