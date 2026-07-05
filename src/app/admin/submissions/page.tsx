"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Inbox, Search, Eye, ArrowRight, Filter } from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  StatusBadge,
  PriorityBadge,
  PageTransition,
  EmptyState,
  AdminInput,
} from "@/modules/admin/components/ui";
import { PROJECT_STATUS_FLOW } from "@/modules/admin/types";
import type { ProjectStatus } from "@/modules/admin/types";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function SubmissionsPage() {
  const { searchResults, search, setSearch } = useAdmin();
  const [filter, setFilter] = useState<ProjectStatus | "all">("all");

  const filtered =
    filter === "all"
      ? searchResults
      : searchResults.filter((s) => s.status === filter);

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          All Submissions
        </h1>
        <p className="mt-1.5 text-[13.5px] text-white/55">
          {searchResults.length} total submission{searchResults.length === 1 ? "" : "s"}
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
            placeholder="Search by client, company, project, or submission ID..."
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <Filter className="h-3.5 w-3.5 text-white/40 shrink-0" />
          {(["all", ...PROJECT_STATUS_FLOW.filter((s) => s !== "Rejected")] as const).map(
            (s) => (
              <button
                key={s}
                onClick={() => setFilter(s as ProjectStatus | "all")}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-all ${
                  filter === s
                    ? "bg-cyan/15 border-cyan/40 text-white"
                    : "bg-white/[0.03] border-white/10 text-white/55 hover:border-white/20"
                }`}
              >
                {s === "all" ? "All" : s}
              </button>
            )
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title="No submissions found"
            description="Try adjusting your search or filter."
            action={
              <Link
                href="/start-project"
                className="inline-flex items-center gap-1.5 rounded-xl bg-cyan text-ink font-medium text-[13px] px-4 py-2.5"
              >
                Open SRG Portal
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
        </AdminCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
            >
              <Link href={`/admin/submissions/${sub.id}`}>
                <AdminCard className="p-5 h-full hover:border-cyan/25 transition-colors group cursor-pointer">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10.5px] font-mono text-cyan-soft/60 truncate">
                        {sub.id}
                      </p>
                      <h3 className="mt-1 font-display text-[14.5px] font-semibold text-white truncate group-hover:text-cyan-soft transition-colors">
                        {sub.projectName}
                      </h3>
                    </div>
                    <Eye className="h-4 w-4 text-white/30 group-hover:text-cyan transition-colors shrink-0" />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-cyan/25 to-cyan/5 border border-cyan/25 font-display font-semibold text-[10px] text-cyan-soft">
                      {sub.client.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-white truncate">
                        {sub.client.fullName}
                      </p>
                      <p className="text-[11px] text-white/45 truncate">
                        {sub.client.company}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <StatusBadge status={sub.status} />
                      <PriorityBadge priority={sub.priority} />
                    </div>
                    <span className="text-[10.5px] text-white/40">
                      {formatDate(sub.submittedAt)}
                    </span>
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
