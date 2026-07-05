"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Inbox,
  FileText,
  CheckCircle2,
  Code2,
  Trophy,
  Users,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  Eye,
  UserPlus,
  FileCheck,
  Calculator,
  Sparkles,
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
import type { ProjectStatus } from "@/modules/admin/types";

const STATUS_FILTERS: { label: string; value: ProjectStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "New" },
  { label: "Reviewing", value: "Reviewing" },
  { label: "Proposal", value: "Proposal Ready" },
  { label: "Quotation", value: "Quotation Sent" },
  { label: "Approved", value: "Approved" },
  { label: "Development", value: "Development" },
  { label: "Completed", value: "Completed" },
];

const STATS = [
  {
    label: "Total Leads",
    key: "totalLeads" as const,
    icon: TrendingUp,
    accent: "from-cyan/15 to-cyan/5",
    iconColor: "text-cyan",
  },
  {
    label: "New Submissions",
    key: "newSubmissions" as const,
    icon: Inbox,
    accent: "from-blue-400/15 to-blue-400/5",
    iconColor: "text-blue-200",
  },
  {
    label: "In Review",
    key: "inReview" as const,
    icon: Eye,
    accent: "from-violet-400/15 to-violet-400/5",
    iconColor: "text-violet-200",
  },
  {
    label: "Proposal Pending",
    key: "proposalPending" as const,
    icon: FileText,
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
    label: "In Development",
    key: "inDevelopment" as const,
    icon: Code2,
    accent: "from-cyan/15 to-cyan/5",
    iconColor: "text-cyan-soft",
  },
  {
    label: "Completed",
    key: "completed" as const,
    icon: Trophy,
    accent: "from-teal-400/15 to-teal-400/5",
    iconColor: "text-teal-200",
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

  return (
    <PageTransition>
      {/* Page header */}
      <div className="mb-7">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
            <Sparkles className="h-3 w-3" />
            Control Center
          </span>
        </div>
        <h1 className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Project Control Center
        </h1>
        <p className="mt-1.5 text-[13.5px] text-white/55">
          Review incoming submissions, assign teams, build proposals, and track
          projects from discovery to delivery.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-8">
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

      {/* Recent submissions table */}
      <AdminCard strong className="overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div>
            <h2 className="font-display text-[15px] font-semibold text-white">
              {search ? `Search Results (${searchResults.length})` : "Recent Submissions"}
            </h2>
            <p className="text-[12px] text-white/45 mt-0.5">
              {search
                ? `Matching "${search}"`
                : "Latest project submissions from the SRG portal"}
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

        {searchResults.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title={search ? "No matches found" : "No submissions yet"}
            description={
              search
                ? "Try a different search term."
                : "Submissions from the Project Discovery Portal will appear here."
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/8 text-[10.5px] uppercase tracking-[0.12em] text-white/40">
                  <th className="px-5 py-2.5 font-medium">Submission ID</th>
                  <th className="px-5 py-2.5 font-medium">Client</th>
                  <th className="px-5 py-2.5 font-medium hidden md:table-cell">Project Type</th>
                  <th className="px-5 py-2.5 font-medium">Priority</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                  <th className="px-5 py-2.5 font-medium hidden lg:table-cell">Submitted</th>
                  <th className="px-5 py-2.5 font-medium hidden xl:table-cell">Assigned To</th>
                  <th className="px-5 py-2.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.slice(0, 12).map((sub, i) => {
                  const assignedCount = Object.values(sub.assignedTeam).filter(
                    Boolean
                  ).length;
                  return (
                    <motion.tr
                      key={sub.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/[0.025] transition-colors group"
                    >
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/submissions/${sub.id}`}
                          className="font-mono text-[11.5px] text-cyan-soft hover:text-cyan transition-colors"
                        >
                          {sub.id.slice(0, 14)}…
                        </Link>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-cyan/25 to-cyan/5 border border-cyan/25 font-display font-semibold text-[10.5px] text-cyan-soft">
                            {sub.client.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </span>
                          <div className="min-w-0">
                            <p className="text-[12.5px] font-medium text-white truncate">
                              {sub.client.fullName}
                            </p>
                            <p className="text-[11px] text-white/45 truncate">
                              {sub.client.company}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className="text-[12px] text-white/70">
                          {sub.templateName}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <PriorityBadge priority={sub.priority} />
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        <span className="text-[12px] text-white/55">
                          {formatDate(sub.submittedAt)}
                        </span>
                      </td>
                      <td className="px-5 py-3 hidden xl:table-cell">
                        {assignedCount > 0 ? (
                          <div className="flex items-center gap-1">
                            <div className="flex -space-x-1.5">
                              {Object.values(sub.assignedTeam)
                                .filter(Boolean)
                                .slice(0, 3)
                                .map((id, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan/15 border border-ink text-[9px] font-medium text-cyan-soft"
                                  >
                                    {String.fromCharCode(65 + idx)}
                                  </span>
                                ))}
                            </div>
                            <span className="text-[11px] text-white/55 ml-1">
                              {assignedCount}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-white/30">Unassigned</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/submissions/${sub.id}`}
                            aria-label="View"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-white/50 hover:text-cyan hover:bg-cyan/10 transition-all"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <Link
                            href={`/admin/submissions/${sub.id}/team`}
                            aria-label="Assign team"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-white/50 hover:text-cyan hover:bg-cyan/10 transition-all"
                          >
                            <UserPlus className="h-3.5 w-3.5" />
                          </Link>
                          <Link
                            href={`/admin/submissions/${sub.id}/proposal`}
                            aria-label="Proposal"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-white/50 hover:text-cyan hover:bg-cyan/10 transition-all"
                          >
                            <FileCheck className="h-3.5 w-3.5" />
                          </Link>
                          <Link
                            href={`/admin/submissions/${sub.id}/quotation`}
                            aria-label="Quotation"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-white/50 hover:text-cyan hover:bg-cyan/10 transition-all"
                          >
                            <Calculator className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </PageTransition>
  );
}
