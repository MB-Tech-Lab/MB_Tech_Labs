"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  FileText,
  Calculator,
  Receipt,
  Users,
  Calendar as CalendarIcon,
  FolderKanban,
  Inbox,
  Circle,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  AdminButton,
  PageTransition,
  PageHeader,
  EmptyState,
} from "@/modules/admin/components/ui";
import type { AdminNotification } from "@/modules/admin/types";

const TYPE_CONFIG: Record<
  string,
  { color: string; icon: React.ReactNode; label: string }
> = {
  submission: {
    color: "#25D6FF",
    icon: <Inbox className="h-3.5 w-3.5" />,
    label: "Submission",
  },
  proposal: {
    color: "#8B5CF6",
    icon: <FileText className="h-3.5 w-3.5" />,
    label: "Proposal",
  },
  quotation: {
    color: "#F59E0B",
    icon: <Calculator className="h-3.5 w-3.5" />,
    label: "Quotation",
  },
  invoice: {
    color: "#10B981",
    icon: <Receipt className="h-3.5 w-3.5" />,
    label: "Invoice",
  },
  team: {
    color: "#EC4899",
    icon: <Users className="h-3.5 w-3.5" />,
    label: "Team",
  },
  meeting: {
    color: "#06B6D4",
    icon: <CalendarIcon className="h-3.5 w-3.5" />,
    label: "Meeting",
  },
  project: {
    color: "#3B82F6",
    icon: <FolderKanban className="h-3.5 w-3.5" />,
    label: "Project",
  },
  system: {
    color: "#64748B",
    icon: <Bell className="h-3.5 w-3.5" />,
    label: "System",
  },
};

const FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Submissions", value: "submission" },
  { label: "Proposals", value: "proposal" },
  { label: "Quotations", value: "quotation" },
  { label: "Invoices", value: "invoice" },
  { label: "Meetings", value: "meeting" },
];

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function NotificationsPage() {
  const { notifications, markNotifRead, markAllNotifsRead } = useAdmin();
  const router = useRouter();
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function handleClick(n: AdminNotification) {
    if (!n.read) markNotifRead(n.id);
    if (n.submissionId) {
      router.push(`/admin/submissions/${n.submissionId}`);
    } else if (n.projectId) {
      router.push(`/admin/projects/${n.projectId}`);
    } else if (n.invoiceId) {
      router.push(`/admin/invoices`);
    }
  }

  return (
    <PageTransition>
      <PageHeader
        title="Notifications"
        description={
          unreadCount > 0
            ? `${unreadCount} unread of ${notifications.length} total`
            : `${notifications.length} notification${notifications.length === 1 ? "" : "s"} · all read`
        }
        action={
          <AdminButton
            variant="ghost"
            size="md"
            onClick={markAllNotifsRead}
            disabled={unreadCount === 0}
            icon={<CheckCheck className="h-4 w-4" />}
          >
            Mark all read
          </AdminButton>
        }
      />

      {/* Filter bar */}
      <div
        className="mb-4 flex items-center gap-2 overflow-x-auto rounded-xl border p-1.5"
        style={{
          background: "var(--admin-surface)",
          borderColor: "var(--admin-border)",
        }}
      >
        {FILTERS.map((f) => {
          const active = filter === f.value;
          const count =
            f.value === "all"
              ? notifications.length
              : f.value === "unread"
              ? unreadCount
              : notifications.filter((n) => n.type === f.value).length;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors whitespace-nowrap"
              style={{
                background: active ? "var(--admin-accent)" : "transparent",
                color: active ? "#0F172A" : "var(--admin-text-secondary)",
              }}
            >
              {f.label}
              <span
                className="inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold"
                style={{
                  background: active
                    ? "rgba(15,23,42,0.18)"
                    : "var(--admin-surface-2)",
                  color: active ? "#0F172A" : "var(--admin-text-muted)",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<Bell className="h-6 w-6" />}
            title="No notifications"
            description="You're all caught up. New notifications will appear here."
          />
        </AdminCard>
      ) : (
        <AdminCard className="overflow-hidden">
          <div
            className="divide-y max-h-[calc(100vh-280px)] overflow-y-auto"
            style={{ borderColor: "var(--admin-border)" }}
          >
            <AnimatePresence initial={false}>
              {filtered.map((n, i) => {
                const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.system;
                return (
                  <motion.button
                    key={n.id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.25, delay: i * 0.02 }}
                    onClick={() => handleClick(n)}
                    className="w-full text-left flex items-start gap-3 p-4 transition-colors hover:bg-[var(--admin-surface-2)]"
                    style={{
                      background: n.read ? "transparent" : `${cfg.color}0A`,
                    }}
                  >
                    {/* Type icon */}
                    <span
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${cfg.color}1A`, color: cfg.color }}
                    >
                      {cfg.icon}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p
                            className="text-[13px] font-semibold truncate"
                            style={{
                              color: "var(--admin-text)",
                              opacity: n.read ? 0.8 : 1,
                            }}
                          >
                            {n.title}
                          </p>
                          <p
                            className="text-[12px] mt-0.5 line-clamp-2"
                            style={{ color: "var(--admin-text-secondary)" }}
                          >
                            {n.description}
                          </p>
                        </div>
                        {!n.read && (
                          <span
                            className="h-2 w-2 rounded-full shrink-0 mt-1.5"
                            style={{ background: "var(--admin-accent)" }}
                          />
                        )}
                      </div>
                      <div
                        className="mt-1.5 flex items-center gap-2 text-[10.5px]"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        <span
                          className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-medium uppercase tracking-wider"
                          style={{
                            background: `${cfg.color}1A`,
                            borderColor: `${cfg.color}40`,
                            color: cfg.color,
                          }}
                        >
                          {cfg.label}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {timeAgo(n.timestamp)}
                        </span>
                        {n.read && (
                          <span className="inline-flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Read
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </AdminCard>
      )}

      {/* Quick action card */}
      {unreadCount > 0 && (
        <div className="mt-4">
          <AdminCard className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg"
                style={{
                  background: "var(--admin-accent-soft)",
                  color: "#0F172A",
                }}
              >
                <Mail className="h-4 w-4" />
              </span>
              <div>
                <p
                  className="text-[13px] font-medium"
                  style={{ color: "var(--admin-text)" }}
                >
                  {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
                </p>
                <p
                  className="text-[11.5px]"
                  style={{ color: "var(--admin-text-muted)" }}
                >
                  Stay on top of pipeline changes
                </p>
              </div>
            </div>
            <AdminButton
              variant="primary"
              size="sm"
              onClick={markAllNotifsRead}
              icon={<CheckCheck className="h-3.5 w-3.5" />}
            >
              Mark all read
            </AdminButton>
          </AdminCard>
        </div>
      )}
    </PageTransition>
  );
}
