"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, Clock, Video, MapPin } from "lucide-react";
import {
  AdminCard,
  PageTransition,
  EmptyState,
  Skeleton,
  PageHeader,
} from "@/modules/admin/components/ui";
import { meetingsApi, type Meeting } from "@/lib/api/meetings";

function formatDateTime(ts: string): string {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function CalendarPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    meetingsApi.list({ pageSize: 100 })
      .then((r) => setMeetings(r.data))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <PageHeader
        title="Calendar"
        description="Meetings, deadlines, and events"
        action={
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-cyan text-ink font-medium text-[13px] px-4 py-2.5 hover:bg-cyan-soft transition-all">
            <Plus className="h-4 w-4" />
            Schedule Meeting
          </button>
        }
      />
      {error && <div className="mb-5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-[13px] text-rose-200">{error}</div>}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <AdminCard key={i} className="p-5"><Skeleton className="h-20 w-full" /></AdminCard>)}
        </div>
      ) : meetings.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<Calendar className="h-6 w-6" />}
            title="No Meetings Scheduled"
            description="Schedule meetings with clients and team members. They will appear on your calendar."
          />
        </AdminCard>
      ) : (
        <div className="space-y-3">
          {meetings.map((m) => (
            <AdminCard key={m.id} className="p-5 hover:border-cyan/25 transition-colors">
              <div className="flex items-center gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/25 text-cyan">
                  {m.type === "VIDEO" ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-medium text-white">{m.title}</p>
                  <p className="text-[11.5px] text-white/55 mt-0.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDateTime(m.startTime)}
                    {m.project && ` · ${m.project.name}`}
                  </p>
                </div>
                <span className="rounded-md border border-cyan/25 bg-cyan/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-cyan-soft">
                  {m.status}
                </span>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
