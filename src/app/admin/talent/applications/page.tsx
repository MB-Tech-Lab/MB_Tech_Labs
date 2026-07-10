"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Inbox, Search, ArrowRight, Filter } from "lucide-react";
import {
  AdminCard,
  PageTransition,
  EmptyState,
  Skeleton,
  PageHeader,
} from "@/modules/admin/components/ui";
import { careersApi, type Application } from "@/lib/api/careers";

const STATUS_COLORS: Record<string, string> = {
  APPLIED: "border-blue-400/25 bg-blue-400/10 text-blue-200",
  RESUME_REVIEWED: "border-violet-400/25 bg-violet-400/10 text-violet-200",
  PROJECT_REVIEWED: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  TECHNICAL_DISCUSSION: "border-cyan/25 bg-cyan/10 text-cyan-soft",
  SELECTED: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  OFFER_SENT: "border-teal-400/25 bg-teal-400/10 text-teal-200",
  JOINED: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  TRAINING: "border-cyan/25 bg-cyan/10 text-cyan-soft",
  COMPLETED: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  REJECTED: "border-rose-400/25 bg-rose-400/10 text-rose-200",
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
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    careersApi.listApplications({ search: search || undefined, status: filter || undefined, pageSize: 100 })
      .then((r) => setApplications(r.data))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [search, filter]);

  return (
    <PageTransition>
      <PageHeader title="Applications" description="Review candidate applications" />

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or position..."
            className="w-full rounded-xl bg-white/[0.04] border border-white/10 pl-10 pr-4 py-2.5 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/40 focus:ring-2 focus:ring-cyan/15 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <Filter className="h-3.5 w-3.5 text-white/40 shrink-0" />
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-all ${
                filter === f.value ? "bg-cyan/15 border-cyan/40 text-white" : "bg-white/[0.03] border-white/10 text-white/55 hover:border-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mb-5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-[13px] text-rose-200">{error}</div>}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <AdminCard key={i} className="p-5"><Skeleton className="h-16 w-full" /></AdminCard>)}
        </div>
      ) : applications.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title="No applications yet"
            description="When students apply for internships via the career page, their applications will appear here."
          />
        </AdminCard>
      ) : (
        <div className="space-y-3">
          {applications.map((app, i) => (
            <motion.div key={app.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.03 }}>
              <Link href={`/admin/talent/applications/${app.id}`}>
                <AdminCard className="p-5 hover:border-cyan/25 transition-colors group cursor-pointer">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-5">
                    <div className="flex items-center gap-3 lg:w-[40%] min-w-0">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan/25 to-cyan/5 border border-cyan/25 font-display font-semibold text-[12px] text-cyan-soft">
                        {app.candidate?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("") || "?"}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-medium text-white truncate">{app.candidate?.name}</p>
                        <p className="text-[11.5px] text-white/45 truncate">{app.candidate?.email} · {app.position?.title}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 lg:gap-6 lg:flex-1 text-[11.5px] text-white/55 flex-wrap">
                      {app.candidate?.college && <span>{app.candidate.college}</span>}
                      {app.candidate?.graduationYear && <span>Class of {app.candidate.graduationYear}</span>}
                      <span>Applied {formatDate(app.appliedAt)}</span>
                    </div>

                    <div className="flex items-center gap-2 lg:ml-auto shrink-0">
                      {app.totalScore > 0 && (
                        <span className="rounded-md border border-cyan/25 bg-cyan/10 px-2 py-0.5 text-[10.5px] font-mono text-cyan-soft">
                          Score: {app.totalScore}/100
                        </span>
                      )}
                      <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-wider ${STATUS_COLORS[app.status] || STATUS_COLORS.APPLIED}`}>
                        {app.status.replace(/_/g, " ")}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[12px] text-cyan-soft group-hover:text-cyan">
                        Review <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </AdminCard>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
