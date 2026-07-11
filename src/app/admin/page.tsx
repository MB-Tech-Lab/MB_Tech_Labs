"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Inbox,
  Users,
  FolderKanban,
  DollarSign,
  FileText,
  Calculator,
  CalendarClock,
  Bell,
  ArrowRight,
  Plus,
  TrendingUp,
  Activity as ActivityIcon,
  Sparkles,
  Inbox as InboxIcon,
} from "lucide-react";
import {
  AdminCard,
  PageTransition,
  EmptyState,
  Skeleton,
} from "@/modules/admin/components/ui";
import { dashboardApi, type DashboardStats, type ActivityItem } from "@/lib/api/dashboard";

const STATS = [
  { label: "Total Clients", key: "totalClients" as const, icon: Users, accent: "from-cyan/15 to-cyan/5", iconColor: "text-cyan" },
  { label: "Active Projects", key: "activeProjects" as const, icon: FolderKanban, accent: "from-blue-400/15 to-blue-400/5", iconColor: "text-blue-200" },
  { label: "Pending SRGs", key: "pendingSRGs" as const, icon: Inbox, accent: "from-violet-400/15 to-violet-400/5", iconColor: "text-violet-200" },
  { label: "Revenue", key: "revenue" as const, icon: DollarSign, accent: "from-emerald-400/15 to-emerald-400/5", iconColor: "text-emerald-200", isMoney: true },
  { label: "Pending Quotations", key: "pendingQuotations" as const, icon: Calculator, accent: "from-amber-400/15 to-amber-400/5", iconColor: "text-amber-200" },
  { label: "Pending Proposals", key: "pendingProposals" as const, icon: FileText, accent: "from-pink-400/15 to-pink-400/5", iconColor: "text-pink-200" },
  { label: "Upcoming Meetings", key: "upcomingMeetings" as const, icon: CalendarClock, accent: "from-teal-400/15 to-teal-400/5", iconColor: "text-teal-200" },
  { label: "New Notifications", key: "newNotifications" as const, icon: Bell, accent: "from-rose-400/15 to-rose-400/5", iconColor: "text-rose-200" },
];

const QUICK_ACTIONS = [
  { label: "Add Client", href: "/admin/clients", icon: Users },
  { label: "Create Project", href: "/admin/projects", icon: FolderKanban },
  { label: "View SRGs", href: "/admin/submissions", icon: Inbox },
  { label: "Create Proposal", href: "/admin/proposals", icon: FileText },
  { label: "Create Quotation", href: "/admin/quotations", icon: Calculator },
  { label: "Export Reports", href: "/admin/analytics", icon: TrendingUp },
];

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [statsData, activityData] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getRecentActivity(10),
        ]);
        setStats(statsData);
        setActivities(activityData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <PageTransition>
      {/* Page header */}
      <div className="mb-7">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
            <Sparkles className="h-3 w-3" />
            Live Data
          </span>
        </div>
        <h1 className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Dashboard
        </h1>
        <p className="mt-1.5 text-[13.5px] text-white/55">
          Real-time metrics from the MB Tech Labs backend.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-[13px] text-rose-200">
          {error}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          const value = stats ? stats[stat.key] : 0;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <AdminCard className="p-4 h-full">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${stat.accent} border border-white/10 ${stat.iconColor}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-3">
                  {loading ? (
                    <Skeleton className="h-7 w-16" />
                  ) : (
                    <div className="font-display text-[26px] font-semibold text-white tabular-nums tracking-tight">
                      {stat.isMoney ? formatMoney(value) : value}
                    </div>
                  )}
                  <p className="mt-0.5 text-[11px] text-white/50 leading-tight">
                    {stat.label}
                  </p>
                </div>
              </AdminCard>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <AdminCard strong className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-[15px] font-semibold text-white">
                  Recent Activity
                </h2>
                <p className="text-[12px] text-white/45 mt-0.5">
                  Latest submissions, projects, and transactions
                </p>
              </div>
              <ActivityIcon className="h-4 w-4 text-cyan" />
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : activities.length === 0 ? (
              <EmptyState
                icon={<ActivityIcon className="h-6 w-6" />}
                title="No activity yet"
                description="When clients submit SRGs or you create projects, activity will appear here."
              />
            ) : (
              <div className="space-y-2">
                {activities.map((act, i) => (
                  <motion.div
                    key={`${act.type}-${act.id}-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3"
                  >
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-cyan/10 border border-cyan/25">
                      <ActivityIcon className="h-3.5 w-3.5 text-cyan" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-medium text-white truncate">
                        {act.title}
                      </p>
                      <p className="text-[11.5px] text-white/55 mt-0.5">
                        {act.description}
                      </p>
                    </div>
                    <span className="text-[10.5px] text-white/40 shrink-0">
                      {timeAgo(act.timestamp)}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </AdminCard>
        </div>

        {/* Quick Actions */}
        <div>
          <AdminCard strong className="p-5">
            <h2 className="font-display text-[15px] font-semibold text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="group flex flex-col items-start gap-2 rounded-xl border border-white/8 bg-white/[0.02] p-3 hover:border-cyan/25 hover:bg-cyan/[0.04] transition-all"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/25 text-cyan group-hover:scale-110 transition-transform">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-[12px] font-medium text-white/80">
                      {action.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </AdminCard>

          {/* Empty data hint */}
          {!loading && stats && stats.totalClients === 0 && stats.activeProjects === 0 && stats.pendingSRGs === 0 && (
            <AdminCard className="mt-4 p-5">
              <div className="text-center">
                <InboxIcon className="h-8 w-8 text-white/30 mx-auto mb-3" />
                <p className="text-[13px] font-medium text-white">
                  Your dashboard is empty
                </p>
                <p className="text-[11.5px] text-white/50 mt-1">
                  Add clients, create projects, or wait for SRG submissions to see real data here.
                </p>
                <Link
                  href="/admin/clients"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-cyan text-ink font-medium text-[12px] px-3 py-1.5 hover:bg-cyan-soft transition-all"
                >
                  <Plus className="h-3 w-3" />
                  Add your first client
                </Link>
              </div>
            </AdminCard>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
