"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Inbox, Search, ArrowRight, Filter, Loader2 } from "lucide-react";
import { hrApi } from "@/lib/api/hr";
import type { Application } from "@/lib/api/careers";

const STATUS_COLORS: Record<string, string> = {
  APPLIED: "border-blue-400/25 bg-blue-400/10 text-blue-300",
  RESUME_REVIEWED: "border-violet-400/25 bg-violet-400/10 text-violet-300",
  PROJECT_REVIEWED: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  TECHNICAL_DISCUSSION: "border-cyan/25 bg-cyan/10 text-cyan-soft",
  SELECTED: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  OFFER_SENT: "border-teal-400/25 bg-teal-400/10 text-teal-300",
  JOINED: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  TRAINING: "border-cyan/25 bg-cyan/10 text-cyan-soft",
  COMPLETED: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  REJECTED: "border-rose-400/25 bg-rose-400/10 text-rose-300",
};

const FILTERS = [
  { label: "All", value: "" },
  { label: "New", value: "APPLIED" },
  { label: "Reviewing", value: "RESUME_REVIEWED" },
  { label: "Technical", value: "TECHNICAL_DISCUSSION" },
  { label: "Selected", value: "SELECTED" },
  { label: "Joined", value: "JOINED" },
  { label: "Rejected", value: "REJECTED" },
];

function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function HRApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    hrApi.listApplications({ search: search || undefined, status: filter || undefined, pageSize: 100 })
      .then((r) => setApplications(r.data))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, [search, filter]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-xl font-semibold text-white">Applications</h1>
        <p className="text-[12.5px] text-white/45 mt-0.5">Review and manage candidate applications</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates..."
            className="w-full rounded-lg border pl-10 pr-4 py-2.5 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/40"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <Filter className="h-3.5 w-3.5 text-white/40 shrink-0" />
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all ${filter === f.value ? "bg-cyan/15 border-cyan/40 text-white" : "bg-white/[0.03] border-white/10 text-white/55 hover:border-white/20"}`}
              style={filter === f.value ? {} : { borderColor: "rgba(255,255,255,0.1)" }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-cyan" /></div>
      ) : applications.length === 0 ? (
        <div className="rounded-2xl border py-16 text-center" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
          <Inbox className="h-10 w-10 text-white/25 mx-auto mb-4" />
          <h3 className="font-display text-[15px] font-semibold text-white">No applications yet</h3>
          <p className="mt-2 text-[13px] text-white/45 max-w-sm mx-auto">When students apply for internships via the careers page, their applications will appear here automatically.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {applications.map((app, i) => (
            <motion.div key={app.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.02 }}>
              <Link href={`/hr/applications/${app.id}`}>
                <div className="rounded-xl border p-4 hover:border-cyan/20 transition-colors group cursor-pointer" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/20 font-display font-semibold text-[11px] text-cyan-soft">
                        {app.candidate?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("") || "?"}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-white truncate">{app.candidate?.name}</p>
                        <p className="text-[11px] text-white/40 truncate">{app.candidate?.email} · {app.position?.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-white/50 flex-wrap">
                      {app.candidate?.college && <span>{app.candidate.college}</span>}
                      <span>{formatDate(app.appliedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-wider ${STATUS_COLORS[app.status] || STATUS_COLORS.APPLIED}`}>{app.status.replace(/_/g, " ")}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-cyan-soft group-hover:text-cyan" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
