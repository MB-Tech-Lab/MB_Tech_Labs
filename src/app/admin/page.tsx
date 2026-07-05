"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Inbox,
  Eye,
  CalendarClock,
  CheckCircle2,
  XCircle,
  Archive,
  Sparkles,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  StatusBadge,
  PriorityBadge,
  AnimatedCounter,
  PageTransition,
  EmptyState,
} from "@/modules/admin/components/ui";

/* --------------------------- Phase 1 stat cards --------------------------- */

const STATS = [
  {
    label: "Total Project Requests",
    key: "totalLeads" as const,
    icon: Inbox,
    accent: "from-cyan/15 to-cyan/5",
    iconColor: "text-cyan",
  },
  {
    label: "New Requests",
    key: "newSubmissions" as const,
    icon: Sparkles,
    accent: "from-blue-400/15 to-blue-400/5",
    iconColor: "text-blue-200",
  },
  {
    label: "Under Review",
    key: "inReview" as const,
    icon: Eye,
    accent: "from-violet-400/15 to-violet-400/5",
    iconColor: "text-violet-200",
  },
  {
    label: "Meeting Scheduled",
    key: "proposalPending" as const,
    icon: CalendarClock,
    accent: "from-amber-400/15 to-amber-400/5",
    iconColor: "text-amber-200",
  },
  {
    label: "Approved",
    key: "approved" as const,
    icon: CheckCircle2,
    accent: "from-emerald-400/15 to-emerald-400/5",
    iconColor: "text-emerald-200",
  },
  {
    label: "Rejected",
    key: "inDevelopment" as const,
    icon: XCircle,
    accent: "from-rose-400/15 to-rose-400/5",
    iconColor: "text-rose-200",
  },
];

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminHome() {
  const { stats, searchResults, search } = useAdmin();

  // Hide archived requests from the dashboard list by default
  const visibleRequests = search
    ? searchResults
    : searchResults.filter((s) => s.status !== "Archived");

  return (
    <PageTransition>
      {/* Page header */}
      <div className="mb-7">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
            <Sparkles className="h-3 w-3" />
            Phase 1 · Request Inbox
          </span>
        </div>
        <h1 className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Project Request Dashboard
        </h1>
        <p className="mt-1.5 text-[13.5px] text-white/55">
          Review incoming software project requests from clients. Decisions
          about team, proposals, quotations, and development happen in later
          phases.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <AdminCard className="p-4 h-full hover:border-cyan/25 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${stat.accent} border border-white/10 ${stat.iconColor}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-3">
                  <div className="font-display text-[26px] font-semibold text-white tabular-nums tracking-tight">
                    <AnimatedCounter value={stats[stat.key]} />
                  </div>
                  <p className="mt-0.5 text-[11px] text-white/50 leading-tight">
                    {stat.label}
                  </p>
                </div>
              </AdminCard>
            </motion.div>
          );
        })}
      </div>

      {/* Project Requests list */}
      <AdminCard strong className="overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div>
            <h2 className="font-display text-[15px] font-semibold text-white">
              {search ? `Search Results (${visibleRequests.length})` : "Project Requests"}
            </h2>
            <p className="text-[12px] text-white/45 mt-0.5">
              {search
                ? `Matching "${search}"`
                : "Latest client project requests awaiting review"}
            </p>
          </div>
          <Link
            href="/admin/submissions"
            className="inline-flex items-center gap-1 text-[12px] text-cyan-soft hover:text-cyan transition-colors"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {visibleRequests.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title={search ? "No matches found" : "No project requests yet"}
            description={
              search
                ? "Try a different search term."
                : "When clients submit the SRG form, their requests will appear here."
            }
          />
        ) : (
          <div className="divide-y divide-white/5">
            {visibleRequests.slice(0, 12).map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="px-5 py-4 hover:bg-white/[0.025] transition-colors group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-5">
                  {/* Left: identity */}
                  <div className="flex items-center gap-3 lg:w-[28%] min-w-0">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-cyan/25 to-cyan/5 border border-cyan/25 font-display font-semibold text-[11px] text-cyan-soft">
                      {sub.client.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-white truncate">
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
                      <p className="text-white/75 text-[11.5px] flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
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
              </motion.div>
            ))}
          </div>
        )}
      </AdminCard>
    </PageTransition>
  );
}
