"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FolderKanban, ListTodo, Calendar, CheckCircle2, Clock, ArrowRight, Sparkles } from "lucide-react";
import { api } from "@/lib/api/client";

interface Task { id: string; title: string; status: string; priority: string; dueDate?: string | null; project?: { name: string } }
interface Meeting { id: string; title: string; startTime: string; status: string }

export default function EmployeeDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ data: Task[] }>("/api/tasks?pageSize=10").catch(() => ({ data: [] as Task[] })),
      api.get<{ data: Meeting[] }>("/api/meetings?pageSize=5").catch(() => ({ data: [] as Meeting[] })),
    ]).then(([t, m]) => { setTasks(t.data || []); setMeetings(m.data || []); }).finally(() => setLoading(false));
  }, []);

  const pendingTasks = tasks.filter((t) => t.status !== "DONE");
  const doneTasks = tasks.filter((t) => t.status === "DONE");

  return (
    <div>
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-soft"><Sparkles className="h-3 w-3" /> Employee Portal</span>
        <h1 className="mt-3 font-display text-xl font-semibold text-white">My Dashboard</h1>
        <p className="text-[12.5px] text-white/45 mt-0.5">Your projects, tasks, and upcoming meetings.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard icon={FolderKanban} label="Projects" value={new Set(tasks.map((t) => t.project?.name)).size} color="text-cyan" />
        <StatCard icon={Clock} label="Pending Tasks" value={pendingTasks.length} color="text-amber-300" />
        <StatCard icon={CheckCircle2} label="Completed" value={doneTasks.length} color="text-emerald-300" />
        <StatCard icon={Calendar} label="Meetings" value={meetings.length} color="text-violet-300" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border p-5" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[14px] font-semibold text-white">My Tasks</h2>
            <Link href="/employee/tasks" className="text-[12px] text-cyan-soft hover:text-cyan">View all</Link>
          </div>
          {loading ? <div className="h-20 rounded-lg bg-white/5 animate-pulse" /> : tasks.length === 0 ? (
            <p className="text-[13px] text-white/40 py-4 text-center">No tasks assigned yet.</p>
          ) : (
            <div className="space-y-2">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center gap-3 rounded-lg border p-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded text-[9px] ${task.status === "DONE" ? "bg-emerald-400/20 text-emerald-300" : task.status === "IN_PROGRESS" ? "bg-cyan/20 text-cyan" : "bg-white/5 text-white/40"}`}>
                    {task.status === "DONE" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <ListTodo className="h-3.5 w-3.5" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] text-white truncate">{task.title}</p>
                    <p className="text-[10px] text-white/40">{task.project?.name || "No project"} · {task.priority}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border p-5" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[14px] font-semibold text-white">Upcoming Meetings</h2>
            <Link href="/employee/meetings" className="text-[12px] text-cyan-soft hover:text-cyan">View all</Link>
          </div>
          {loading ? <div className="h-20 rounded-lg bg-white/5 animate-pulse" /> : meetings.length === 0 ? (
            <p className="text-[13px] text-white/40 py-4 text-center">No meetings scheduled.</p>
          ) : (
            <div className="space-y-2">
              {meetings.map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-lg border p-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <Calendar className="h-4 w-4 text-cyan shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] text-white truncate">{m.title}</p>
                    <p className="text-[10px] text-white/40">{new Date(m.startTime).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border p-4" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
      <Icon className={`h-5 w-5 ${color}`} />
      <div className="mt-3 font-display text-[22px] font-semibold text-white tabular-nums">{value}</div>
      <p className="text-[10px] text-white/45 mt-0.5">{label}</p>
    </div>
  );
}
