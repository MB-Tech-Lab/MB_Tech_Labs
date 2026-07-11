"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import {
  AdminCard,
  PageTransition,
  EmptyState,
  Skeleton,
  PageHeader,
} from "@/modules/admin/components/ui";
import { notificationsApi, type Notification } from "@/lib/api/notifications";

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    notificationsApi.list({ pageSize: 100 })
      .then((r) => setNotifications(r.data))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  async function markAsRead(id: string) {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    } catch { /* ignore */ }
  }

  async function markAllAsRead() {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch { /* ignore */ }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <PageTransition>
      <PageHeader
        title="Notifications"
        description={unreadCount > 0 ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}` : "All caught up"}
        action={unreadCount > 0 ? (
          <button onClick={markAllAsRead} className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.03] text-white font-medium text-[13px] px-4 py-2.5 hover:bg-white/[0.07] transition-all">
            <Check className="h-4 w-4" />
            Mark all read
          </button>
        ) : undefined}
      />
      {error && <div className="mb-5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-[13px] text-rose-200">{error}</div>}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => <AdminCard key={i} className="p-4"><Skeleton className="h-14 w-full" /></AdminCard>)}
        </div>
      ) : notifications.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<Bell className="h-6 w-6" />}
            title="No Notifications"
            description="When SRG submissions arrive, proposals are approved, or invoices are paid, notifications will appear here."
          />
        </AdminCard>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <AdminCard key={n.id} className={`p-4 ${!n.isRead ? "border-cyan/20" : ""}`}>
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${n.isRead ? "bg-white/20" : "bg-cyan"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-white">{n.title}</p>
                  <p className="text-[12px] text-white/55 mt-0.5">{n.description}</p>
                  <p className="text-[10.5px] text-white/35 mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.isRead && (
                  <button onClick={() => markAsRead(n.id)} className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-md text-white/40 hover:text-cyan hover:bg-cyan/10 transition-all">
                    <Check className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
