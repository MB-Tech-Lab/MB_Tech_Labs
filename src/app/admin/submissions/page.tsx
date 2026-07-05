"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Inbox, Search, ArrowRight, Filter, Archive } from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  StatusBadge,
  PriorityBadge,
  PageTransition,
  EmptyState,
  AdminInput,
} from "@/modules/admin/components/ui";
import { OPEN_STATUSES, type ProjectStatus } from "@/modules/admin/types";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const FILTERS: { label: string; value: ProjectStatus | "open" | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "New", value: "New" },
  { label: "Reviewing", value: "Reviewing" },
  { label: "Meeting Scheduled", value: "Meeting Scheduled" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
  { label: "Archived", value: "Archived" },
];

export default function ProjectRequestsPage() {
  const { searchResults, search, setSearch } = useAdmin();
  const [filter, setFilter] = useState<ProjectStatus | "open" | "all">("open");

  const filtered = searchResults.filter((s) => {
    if (filter === "all") return true;
    if (filter === "open") return OPEN_STATUSES.includes(s.status);
    return s.status === filter;
  });

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Project Requests
        </h1>
        <p className="mt-1.5 text-[13.5px] text-white/55">
          {filtered.length} request{filtered.length === 1 ? "" : "s"}
          {filter === "open" && " currently open"}
        </p>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
          <AdminInput
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client, company, project, or request ID..."
            className="pl-9"
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

      {filtered.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title="No requests found"
            description="Try adjusting your search or filter."
          />
        </AdminCard>
      ) : (
        <div className="space-y-3">
          {filtered.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <AdminCard className="p-5 hover:border-cyan/25 transition-colors group">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-5">
                  {/* Left: identity */}
                  <div className="flex items-center gap-3 lg:w-[30%] min-w-0">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan/25 to-cyan/5 border border-cyan/25 font-display font-semibold text-[12px] text-cyan-soft">
                      {sub.client.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-medium text-white truncate">
                        {sub.projectName}
                      </p>
                      <p className="text-[11.5px] text-white/45 truncate">
                        {sub.client.fullName} · {sub.client.company}
                      </p>
                    </div>
                  </div>

                  {/* Middle: meta */}
                  <div className="flex items-center gap-4 lg:gap-6 lg:flex-1 text-[11.5px] text-white/55 flex-wrap">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-white/35">
                        Request ID
                      </p>
                      <p className="font-mono text-cyan-soft/80 text-[11px] truncate">
                        {sub.id.slice(0, 18)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/35">
                        Project Type
                      </p>
                      <p className="text-white/75 text-[11.5px]">
                        {sub.templateName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/35">
                        Submitted
                      </p>
                      <p className="text-white/75 text-[11.5px]">
                        {formatDate(sub.submittedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Right: status + priority + action */}
                  <div className="flex items-center gap-2 lg:ml-auto shrink-0">
                    <PriorityBadge priority={sub.priority} />
                    <StatusBadge status={sub.status} />
                    <Link
                      href={`/admin/submissions/${sub.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-cyan text-ink font-medium text-[12px] px-3 py-1.5 hover:bg-cyan-soft transition-all hover:shadow-[0_6px_20px_-4px_rgba(37,214,255,0.55)]"
                    >
                      Open Request
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
