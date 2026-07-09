"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Video,
  Plus,
  Coffee,
  Presentation,
  RefreshCw,
} from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  AdminButton,
  PageTransition,
  PageHeader,
  EmptyState,
} from "@/modules/admin/components/ui";
import type { Meeting } from "@/modules/admin/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MEETING_TYPE_COLORS: Record<string, string> = {
  client: "#25D6FF",
  internal: "#8B5CF6",
  review: "#F59E0B",
  kickoff: "#10B981",
  "follow-up": "#EC4899",
};

const MEETING_TYPE_ICONS: Record<string, React.ReactNode> = {
  client: <Presentation className="h-3 w-3" />,
  internal: <Coffee className="h-3 w-3" />,
  review: <RefreshCw className="h-3 w-3" />,
  kickoff: <Video className="h-3 w-3" />,
  "follow-up": <Users className="h-3 w-3" />,
};

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function CalendarPage() {
  const { meetings } = useAdmin();
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const today = new Date();

  // Build calendar days for the current month view
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: { date: Date; inMonth: boolean }[] = [];
    // Previous month trailing days
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, inMonth: false });
    }
    // Current month
    for (let d = 1; d <= totalDays; d++) {
      days.push({ date: new Date(year, month, d), inMonth: true });
    }
    // Next month leading days (fill to 42 cells)
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ date: new Date(year, month + 1, d), inMonth: false });
    }
    return days;
  }, [currentMonth]);

  // Meetings by day
  const meetingsByDay = useMemo(() => {
    const map = new Map<string, Meeting[]>();
    meetings.forEach((m) => {
      const d = new Date(m.date);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const arr = map.get(key) ?? [];
      arr.push(m);
      map.set(key, arr);
    });
    return map;
  }, [meetings]);

  // Upcoming meetings (next 30 days)
  const upcoming = useMemo(() => {
    const now = Date.now();
    const cutoff = now + 30 * 24 * 60 * 60 * 1000;
    return meetings
      .filter((m) => m.date >= now && m.date <= cutoff && m.status === "scheduled")
      .sort((a, b) => a.date - b.date)
      .slice(0, 8);
  }, [meetings]);

  // Selected day meetings
  const selectedDayMeetings = useMemo(() => {
    if (!selectedDate) return [];
    const key = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
    return (meetingsByDay.get(key) ?? []).sort((a, b) => a.date - b.date);
  }, [selectedDate, meetingsByDay]);

  function prevMonth() {
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function nextMonth() {
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }
  function goToday() {
    const t = new Date();
    setCurrentMonth(new Date(t.getFullYear(), t.getMonth(), 1));
    setSelectedDate(t);
  }

  return (
    <PageTransition>
      <PageHeader
        title="Calendar"
        description={`${upcoming.length} upcoming meeting${upcoming.length === 1 ? "" : "s"} in the next 30 days`}
        action={
          <AdminButton
            variant="primary"
            size="md"
            icon={<Plus className="h-4 w-4" />}
          >
            New Meeting
          </AdminButton>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        {/* Calendar */}
        <AdminCard className="p-5">
          {/* Calendar header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                className="font-semibold text-[18px]"
                style={{ color: "var(--admin-text)" }}
              >
                {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <p
                className="text-[11.5px] mt-0.5"
                style={{ color: "var(--admin-text-muted)" }}
              >
                {meetings.length} total meeting{meetings.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <AdminButton variant="ghost" size="sm" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </AdminButton>
              <AdminButton variant="outline" size="sm" onClick={goToday}>
                Today
              </AdminButton>
              <AdminButton variant="ghost" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </AdminButton>
            </div>
          </div>

          {/* Weekday header */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[10.5px] font-semibold uppercase tracking-wider py-2"
                style={{ color: "var(--admin-text-muted)" }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(({ date, inMonth }, idx) => {
              const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
              const dayMeetings = meetingsByDay.get(key) ?? [];
              const isToday = isSameDay(date, today);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              return (
                <motion.button
                  key={idx}
                  onClick={() => setSelectedDate(date)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative aspect-square sm:aspect-[4/3] rounded-lg border p-1.5 text-left transition-all flex flex-col"
                  style={{
                    background: isSelected
                      ? "var(--admin-accent)"
                      : inMonth
                      ? "var(--admin-surface)"
                      : "var(--admin-surface-2)",
                    borderColor: isToday
                      ? "var(--admin-accent)"
                      : "var(--admin-border)",
                    opacity: inMonth ? 1 : 0.4,
                  }}
                >
                  <span
                    className="text-[11px] sm:text-[12px] font-semibold tabular-nums"
                    style={{
                      color: isSelected
                        ? "#0F172A"
                        : isToday
                        ? "var(--admin-accent)"
                        : "var(--admin-text)",
                    }}
                  >
                    {date.getDate()}
                  </span>
                  {/* Meeting dots */}
                  <div className="mt-auto flex flex-wrap gap-0.5">
                    {dayMeetings.slice(0, 3).map((m) => (
                      <span
                        key={m.id}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          background: isSelected
                            ? "rgba(15,23,42,0.6)"
                            : MEETING_TYPE_COLORS[m.type] ?? "var(--admin-accent)",
                        }}
                      />
                    ))}
                    {dayMeetings.length > 3 && (
                      <span
                        className="text-[8px] font-bold"
                        style={{
                          color: isSelected
                            ? "#0F172A"
                            : "var(--admin-text-muted)",
                        }}
                      >
                        +{dayMeetings.length - 3}
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Legend */}
          <div
            className="mt-4 pt-3 border-t flex flex-wrap items-center gap-3"
            style={{ borderColor: "var(--admin-border)" }}
          >
            {Object.entries(MEETING_TYPE_COLORS).map(([type, color]) => (
              <div
                key={type}
                className="inline-flex items-center gap-1.5 text-[10.5px]"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: color }}
                />
                <span className="capitalize">{type}</span>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Selected day */}
          <AdminCard className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p
                  className="text-[10.5px] uppercase tracking-[0.18em] font-semibold"
                  style={{ color: "var(--admin-text-muted)" }}
                >
                  Selected Day
                </p>
                <h3
                  className="font-semibold text-[15px] mt-0.5"
                  style={{ color: "var(--admin-text)" }}
                >
                  {selectedDate
                    ? selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })
                    : "—"}
                </h3>
              </div>
              <CalendarIcon
                className="h-5 w-5"
                style={{ color: "var(--admin-accent)" }}
              />
            </div>
            {selectedDayMeetings.length === 0 ? (
              <p
                className="text-[12.5px] py-4 text-center"
                style={{ color: "var(--admin-text-muted)" }}
              >
                No meetings scheduled for this day.
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {selectedDayMeetings.map((m) => (
                  <MeetingRow key={m.id} meeting={m} compact />
                ))}
              </div>
            )}
          </AdminCard>

          {/* Upcoming */}
          <AdminCard className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3
                className="font-semibold text-[14px]"
                style={{ color: "var(--admin-text)" }}
              >
                Upcoming
              </h3>
              <span
                className="text-[11px]"
                style={{ color: "var(--admin-text-muted)" }}
              >
                Next 30 days
              </span>
            </div>
            {upcoming.length === 0 ? (
              <EmptyState
                icon={<CalendarIcon className="h-6 w-6" />}
                title="No upcoming meetings"
                description="Schedule meetings from submissions to populate the calendar."
              />
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {upcoming.map((m) => (
                  <MeetingRow key={m.id} meeting={m} />
                ))}
              </div>
            )}
          </AdminCard>
        </div>
      </div>
    </PageTransition>
  );
}

function MeetingRow({
  meeting,
  compact = false,
}: {
  meeting: Meeting;
  compact?: boolean;
}) {
  const color = MEETING_TYPE_COLORS[meeting.type] ?? "var(--admin-accent)";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border p-3"
      style={{
        background: "var(--admin-surface-2)",
        borderColor: "var(--admin-border)",
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <p
          className="text-[13px] font-medium truncate"
          style={{ color: "var(--admin-text)" }}
        >
          {meeting.title}
        </p>
        <span
          className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider whitespace-nowrap"
          style={{
            background: `${color}1A`,
            borderColor: `${color}40`,
            color,
          }}
        >
          {MEETING_TYPE_ICONS[meeting.type]}
          {meeting.type}
        </span>
      </div>
      <div
        className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px]"
        style={{ color: "var(--admin-text-muted)" }}
      >
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {compact ? formatTime(meeting.date) : formatDateTime(meeting.date)}
          <span>· {meeting.duration}m</span>
        </span>
        {meeting.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {meeting.location}
          </span>
        )}
      </div>
      {!compact && meeting.attendees.length > 0 && (
        <div
          className="mt-1.5 flex items-center gap-1 text-[10.5px]"
          style={{ color: "var(--admin-text-muted)" }}
        >
          <Users className="h-3 w-3" />
          {meeting.attendees.length} attendee
          {meeting.attendees.length === 1 ? "" : "s"}
          {meeting.clientName && (
            <span style={{ color: "var(--admin-text-secondary)" }}>
              · {meeting.clientName}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
