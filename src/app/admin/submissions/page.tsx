"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Inbox, Search, ArrowRight, Filter, Loader2 } from "lucide-react";
import {
  AdminCard,
  StatusBadge,
  PriorityBadge,
  PageTransition,
  EmptyState,
  Skeleton,
  PageHeader,
} from "@/modules/admin/components/ui";
import { srgApi, type SRGSubmission } from "@/lib/api/srg";

const FILTERS = [
  { label: "All", value: "" },
  { label: "New", value: "NEW" },
  { label: "Reviewing", value: "REVIEWING" },
  { label: "Meeting Scheduled", value: "MEETING_SCHEDULED" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Archived", value: "ARCHIVED" },
];

function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function SrgSubmissionsPage() {
  const [submissions, setSubmissions] = useState<SRGSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await srgApi.list({
          search: search || undefined,
          status: filter || undefined,
          pageSize: 100,
        });
        setSubmissions(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load submissions");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search, filter]);

  return (
    <PageTransition>
      <PageHeader
        title="SRG Submissions"
        description="Software Requirement Gathering submissions from clients"
      />

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by project name, template, or session ID..."
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
                filter === f.value
                  ? "bg-cyan/15 border-cyan/40 text-white"
                  : "bg-white/[0.03] border-white/10 text-white/55 hover:border-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-[13px] text-rose-200">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <AdminCard key={i} className="p-5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </AdminCard>
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title="No SRG Submissions"
            description="When clients submit the Software Requirement Gathering form at /start-project, their submissions will appear here."
          />
        </AdminCard>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <AdminCard className="p-5 hover:border-cyan/25 transition-colors group">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-5">
                  <div className="flex items-center gap-3 lg:w-[35%] min-w-0">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan/25 to-cyan/5 border border-cyan/25 font-display font-semibold text-[12px] text-cyan-soft">
                      {sub.client?.companyName?.split(" ").map((n) => n[0]).slice(0, 2).join("") || "?"}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-medium text-white truncate">
                        {sub.projectName}
                      </p>
                      <p className="text-[11.5px] text-white/45 truncate">
                        {sub.client?.companyName || "Unknown company"} · {sub.templateName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 lg:gap-6 lg:flex-1 text-[11.5px] text-white/55 flex-wrap">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/35">Submitted</p>
                      <p className="text-white/75 text-[11.5px]">{formatDate(sub.submittedAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 lg:ml-auto shrink-0">
                    <PriorityBadge priority={sub.priority as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"} />
                    <StatusBadge status={sub.status as "New" | "Reviewing" | "Meeting Scheduled" | "Approved" | "Rejected" | "Archived"} />
                    <Link
                      href={`/admin/submissions/${sub.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-cyan text-ink font-medium text-[12px] px-3 py-1.5 hover:bg-cyan-soft transition-all"
                    >
                      Open
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </AdminCard>
            </motion.div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
