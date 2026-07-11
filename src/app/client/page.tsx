"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FolderKanban, FileText, Receipt, Calendar, Sparkles } from "lucide-react";
import { api } from "@/lib/api/client";

export default function ClientDashboard() {
  const [stats, setStats] = useState({ projects: 0, invoices: 0, documents: 0, meetings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ data: unknown[] }>("/api/projects?pageSize=100").catch(() => ({ data: [] })),
      api.get<{ data: unknown[] }>("/api/invoices?pageSize=100").catch(() => ({ data: [] })),
      api.get<unknown[]>("/api/files").catch(() => []),
      api.get<{ data: unknown[] }>("/api/meetings?pageSize=100").catch(() => ({ data: [] })),
    ]).then(([p, i, f, m]) => {
      setStats({
        projects: Array.isArray(p) ? p.length : p.data?.length || 0,
        invoices: Array.isArray(i) ? i.length : i.data?.length || 0,
        documents: Array.isArray(f) ? f.length : 0,
        meetings: Array.isArray(m) ? m.length : m.data?.length || 0,
      });
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-soft"><Sparkles className="h-3 w-3" /> Client Portal</span>
        <h1 className="mt-3 font-display text-xl font-semibold text-white">Dashboard</h1>
        <p className="text-[12.5px] text-white/45 mt-0.5">Track your projects, documents, and invoices.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: FolderKanban, label: "Projects", value: stats.projects, color: "text-cyan" },
          { icon: FileText, label: "Documents", value: stats.documents, color: "text-violet-300" },
          { icon: Receipt, label: "Invoices", value: stats.invoices, color: "text-amber-300" },
          { icon: Calendar, label: "Meetings", value: stats.meetings, color: "text-emerald-300" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.04 }} className="rounded-2xl border p-4" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
              <Icon className={`h-5 w-5 ${stat.color}`} />
              <div className="mt-3 font-display text-[22px] font-semibold text-white tabular-nums">{loading ? "..." : stat.value}</div>
              <p className="text-[10px] text-white/45 mt-0.5">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>
      <div className="rounded-2xl border p-8 text-center" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-[13px] text-white/50">Welcome to your client portal. Project details, timelines, and invoices will appear here as your project progresses.</p>
      </div>
    </div>
  );
}
