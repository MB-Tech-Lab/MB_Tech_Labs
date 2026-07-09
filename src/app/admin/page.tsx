"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Inbox,
  Eye,
  CalendarClock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  DollarSign,
  FileText,
  Calculator,
  Users,
  FolderKanban,
  ArrowRight,
  Clock,
  Plus,
  FileCheck,
  Bell,
  Activity as ActivityIcon,
} from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  StatusBadge,
  PriorityBadge,
  AnimatedCounter,
  PageTransition,
  EmptyState,
  PageHeader,
  DevStatusBadge,
} from "@/modules/admin/components/ui";
import {
  AdminAreaChart,
  AdminBarChart,
  AdminDonutChart,
} from "@/modules/admin/components/charts";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function formatMoney(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

const STATS = [
  { label: "Today's Leads", key: "newSubmissions" as const, icon: Inbox, color: "#25D6FF" },
  { label: "Pending SRGs", key: "inReview" as const, icon: Eye, color: "#3B82F6" },
  { label: "Active Projects", key: "activeProjects" as const, icon: FolderKanban, color: "#10B981" },
  { label: "Revenue", key: "totalRevenue" as const, icon: DollarSign, color: "#8B5CF6", isMoney: true },
  { label: "Pending Quotations", key: "pendingQuotations" as const, icon: Calculator, color: "#F59E0B" },
  { label: "Pending Proposals", key: "pendingProposals" as const, icon: FileText, color: "#EC4899" },
  { label: "Upcoming Meetings", key: "upcomingMeetings" as const, icon: CalendarClock, color: "#06B6D4" },
  { label: "Completed", key: "completed" as const, icon: CheckCircle2, color: "#64748B" },
];

// Sample chart data
const LEADS_DATA = [
  { name: "Jan", value: 12 },
  { name: "Feb", value: 19 },
  { name: "Mar", value: 15 },
  { name: "Apr", value: 22 },
  { name: "May", value: 28 },
  { name: "Jun", value: 24 },
  { name: "Jul", value: 31 },
];

const REVENUE_DATA = [
  { name: "Jan", revenue: 18000, target: 20000 },
  { name: "Feb", revenue: 22000, target: 25000 },
  { name: "Mar", revenue: 15000, target: 20000 },
  { name: "Apr", revenue: 35000, target: 30000 },
  { name: "May", revenue: 42000, target: 35000 },
  { name: "Jun", revenue: 38000, target: 40000 },
  { name: "Jul", revenue: 51000, target: 45000 },
];

const PROJECT_STATUS_DATA = [
  { name: "Discovery", value: 1 },
  { name: "Planning", value: 1 },
  { name: "UI/UX", value: 1 },
  { name: "Development", value: 1 },
  { name: "Maintenance", value: 1 },
];

const QUICK_ACTIONS = [
  { label: "Create Proposal", href: "/admin/proposals", icon: FileCheck },
  { label: "Create Quotation", href: "/admin/quotations", icon: Calculator },
  { label: "Add Client", href: "/admin/clients", icon: Users },
  { label: "Assign Team", href: "/admin/team", icon: Users },
  { label: "Create Project", href: "/admin/projects", icon: FolderKanban },
  { label: "Export Reports", href: "/admin/analytics", icon: TrendingUp },
];

export default function AdminDashboard() {
  const { stats, submissions, projects, activities, meetings, invoices } = useAdmin();

  const recentSubmissions = submissions.slice(0, 5);
  const upcomingMeetings = meetings
    .filter((m) => m.status === "scheduled" && m.date >= Date.now())
    .sort((a, b) => a.date - b.date)
    .slice(0, 4);
  const recentInvoices = invoices.slice(0, 4);

  return (
    <PageTransition>
      <PageHeader
        title="Dashboard"
        description="Overview of your software development agency operations"
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <AdminCard className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ background: `${stat.color}1A`, color: stat.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <div className="font-display text-[24px] font-bold tracking-tight" style={{ color: "var(--admin-text)" }}>
                  {stat.isMoney ? (
                    formatMoney(stats[stat.key])
                  ) : (
                    <AnimatedCounter value={stats[stat.key]} />
                  )}
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--admin-text-secondary)" }}>
                  {stat.label}
                </p>
              </AdminCard>
            </motion.div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Monthly Leads */}
        <AdminCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-[15px]" style={{ color: "var(--admin-text)" }}>
                Monthly Leads
              </h3>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--admin-text-secondary)" }}>
                New SRG submissions over time
              </p>
            </div>
            <TrendingUp className="h-4 w-4" style={{ color: "var(--admin-text-muted)" }} />
          </div>
          <AdminAreaChart data={LEADS_DATA} height={220} />
        </AdminCard>

        {/* Project Status donut */}
        <AdminCard className="p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-[15px]" style={{ color: "var(--admin-text)" }}>
              Project Status
            </h3>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--admin-text-secondary)" }}>
              Active projects by stage
            </p>
          </div>
          <AdminDonutChart data={PROJECT_STATUS_DATA} height={180} />
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {PROJECT_STATUS_DATA.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5 text-[11px]">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: ["#25D6FF", "#5EDBFF", "#3B82F6", "#8B5CF6", "#10B981"][i] }}
                />
                <span style={{ color: "var(--admin-text-secondary)" }}>{item.name}</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      {/* Revenue + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <AdminCard className="p-5 lg:col-span-2">
          <div className="mb-4">
            <h3 className="font-semibold text-[15px]" style={{ color: "var(--admin-text)" }}>
              Revenue Growth
            </h3>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--admin-text-secondary)" }}>
              Monthly revenue vs target
            </p>
          </div>
          <AdminBarChart data={REVENUE_DATA} dataKey="revenue" height={220} color="#10B981" />
        </AdminCard>

        {/* Quick Actions */}
        <AdminCard className="p-5">
          <h3 className="font-semibold text-[15px] mb-4" style={{ color: "var(--admin-text)" }}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-all hover:scale-[1.02]"
                  style={{
                    borderColor: "var(--admin-border)",
                    background: "var(--admin-surface-2)",
                  }}
                >
                  <span
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ background: "var(--admin-accent)", color: "#0F172A" }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-[11px] font-medium leading-tight" style={{ color: "var(--admin-text)" }}>
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </AdminCard>
      </div>

      {/* Recent activity + Upcoming meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Recent Activity */}
        <AdminCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[15px]" style={{ color: "var(--admin-text)" }}>
              Recent Activity
            </h3>
            <ActivityIcon className="h-4 w-4" style={{ color: "var(--admin-text-muted)" }} />
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {activities.slice(0, 6).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <span
                  className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold"
                  style={{ background: "var(--admin-surface-2)", color: "var(--admin-accent)" }}
                >
                  {activity.actor?.[0] ?? "S"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px]" style={{ color: "var(--admin-text)" }}>
                    {activity.description}
                  </p>
                  <p className="text-[10.5px] mt-0.5" style={{ color: "var(--admin-text-muted)" }}>
                    {timeAgo(activity.timestamp)} · {activity.actor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Upcoming Meetings */}
        <AdminCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[15px]" style={{ color: "var(--admin-text)" }}>
              Upcoming Meetings
            </h3>
            <Link
              href="/admin/calendar"
              className="text-[12px] font-medium"
              style={{ color: "var(--admin-accent)" }}
            >
              View all
            </Link>
          </div>
          {upcomingMeetings.length === 0 ? (
            <EmptyState icon={<CalendarClock className="h-5 w-5" />} title="No upcoming meetings" />
          ) : (
            <div className="space-y-3">
              {upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                  style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface-2)" }}
                >
                  <div
                    className="flex flex-col items-center justify-center shrink-0 h-12 w-12 rounded-lg"
                    style={{ background: "var(--admin-accent)", color: "#0F172A" }}
                  >
                    <span className="text-[10px] uppercase font-bold">
                      {new Date(meeting.date).toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="text-[16px] font-bold leading-none">
                      {new Date(meeting.date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate" style={{ color: "var(--admin-text)" }}>
                      {meeting.title}
                    </p>
                    <p className="text-[11.5px] mt-0.5" style={{ color: "var(--admin-text-secondary)" }}>
                      {new Date(meeting.date).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}{" "}
                      · {meeting.duration}min · {meeting.location}
                    </p>
                    {meeting.clientName && (
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--admin-text-muted)" }}>
                        {meeting.clientName}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      {/* Latest SRG submissions */}
      <AdminCard className="overflow-hidden mb-6">
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "var(--admin-border)" }}
        >
          <h3 className="font-semibold text-[15px]" style={{ color: "var(--admin-text)" }}>
            Latest SRG Submissions
          </h3>
          <Link
            href="/admin/submissions"
            className="inline-flex items-center gap-1 text-[12px] font-medium"
            style={{ color: "var(--admin-accent)" }}
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {recentSubmissions.length === 0 ? (
          <EmptyState icon={<Inbox className="h-6 w-6" />} title="No submissions yet" />
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
            {recentSubmissions.map((sub) => (
              <Link
                key={sub.id}
                href={`/admin/submissions/${sub.id}`}
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-opacity-50"
                style={{ borderColor: "var(--admin-border)" }}
              >
                <span
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[11px] font-bold"
                  style={{ background: "var(--admin-surface-2)", color: "var(--admin-accent)" }}
                >
                  {sub.client.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: "var(--admin-text)" }}>
                    {sub.projectName}
                  </p>
                  <p className="text-[11.5px] truncate" style={{ color: "var(--admin-text-secondary)" }}>
                    {sub.client.fullName} · {sub.client.company}
                  </p>
                </div>
                <span className="hidden sm:block text-[11.5px]" style={{ color: "var(--admin-text-muted)" }}>
                  {formatDate(sub.submittedAt)}
                </span>
                <PriorityBadge priority={sub.priority} />
                <StatusBadge status={sub.status} />
                <ArrowRight className="h-4 w-4 shrink-0" style={{ color: "var(--admin-text-muted)" }} />
              </Link>
            ))}
          </div>
        )}
      </AdminCard>

      {/* Active Projects + Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdminCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[15px]" style={{ color: "var(--admin-text)" }}>
              Active Projects
            </h3>
            <Link href="/admin/projects" className="text-[12px] font-medium" style={{ color: "var(--admin-accent)" }}>
              View all
            </Link>
          </div>
          {projects.length === 0 ? (
            <EmptyState icon={<FolderKanban className="h-5 w-5" />} title="No projects yet" />
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 4).map((project) => (
                <Link
                  key={project.id}
                  href={`/admin/projects/${project.id}`}
                  className="block rounded-lg border p-3 transition-colors"
                  style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface-2)" }}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-[13px] font-medium truncate" style={{ color: "var(--admin-text)" }}>
                      {project.name}
                    </p>
                    <DevStatusBadge status={project.status} />
                  </div>
                  <p className="text-[11.5px] mb-2" style={{ color: "var(--admin-text-secondary)" }}>
                    {project.clientCompany}
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex-1 h-1.5 rounded-full overflow-hidden"
                      style={{ background: "var(--admin-surface)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${project.progress}%`, background: "var(--admin-accent)" }}
                      />
                    </div>
                    <span className="text-[11px] font-medium tabular-nums" style={{ color: "var(--admin-text-secondary)" }}>
                      {project.progress}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </AdminCard>

        <AdminCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[15px]" style={{ color: "var(--admin-text)" }}>
              Recent Invoices
            </h3>
            <Link href="/admin/invoices" className="text-[12px] font-medium" style={{ color: "var(--admin-accent)" }}>
              View all
            </Link>
          </div>
          {recentInvoices.length === 0 ? (
            <EmptyState icon={<FileText className="h-5 w-5" />} title="No invoices yet" />
          ) : (
            <div className="space-y-2">
              {recentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between gap-2 rounded-lg border p-3"
                  style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface-2)" }}
                >
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-medium truncate" style={{ color: "var(--admin-text)" }}>
                      {invoice.invoiceNumber}
                    </p>
                    <p className="text-[11px] truncate" style={{ color: "var(--admin-text-secondary)" }}>
                      {invoice.clientCompany}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] font-semibold" style={{ color: "var(--admin-text)" }}>
                      {formatMoney(invoice.amount)}
                    </p>
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        background:
                          invoice.status === "Paid"
                            ? "rgba(16,185,129,0.12)"
                            : invoice.status === "Overdue"
                            ? "rgba(239,68,68,0.12)"
                            : invoice.status === "Pending"
                            ? "rgba(245,158,11,0.12)"
                            : "rgba(100,116,139,0.12)",
                        color:
                          invoice.status === "Paid"
                            ? "#10B981"
                            : invoice.status === "Overdue"
                            ? "#EF4444"
                            : invoice.status === "Pending"
                            ? "#F59E0B"
                            : "#64748B",
                      }}
                    >
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </PageTransition>
  );
}
