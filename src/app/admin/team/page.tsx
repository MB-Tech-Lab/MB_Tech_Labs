"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Mail,
  Clock,
  Briefcase,
  Filter,
  CheckCircle2,
  XCircle,
  Calendar,
} from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  PageTransition,
  PageHeader,
  EmptyState,
  Avatar,
  ProgressBar,
} from "@/modules/admin/components/ui";
import type { TeamMember } from "@/modules/admin/types";

const STATUS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Available: { bg: "#10B9811A", border: "#10B98140", text: "#10B981" },
  Busy: { bg: "#F59E0B1A", border: "#F59E0B40", text: "#F59E0B" },
  "On Leave": { bg: "#64748B1A", border: "#64748B40", text: "#64748B" },
};

export default function TeamPage() {
  const { teamMembers, submissions, projects } = useAdmin();
  const [roleFilter, setRoleFilter] = useState("all");

  // Compute assignment counts per member from submissions AND projects
  const assignmentCounts = useMemo(() => {
    const counts = new Map<string, number>();
    submissions.forEach((s) => {
      Object.values(s.assignedTeam).forEach((memberId) => {
        if (memberId) {
          counts.set(memberId, (counts.get(memberId) ?? 0) + 1);
        }
      });
    });
    projects.forEach((p) => {
      Object.values(p.assignedTeam).forEach((memberId) => {
        if (memberId) {
          counts.set(memberId, (counts.get(memberId) ?? 0) + 1);
        }
      });
    });
    return counts;
  }, [submissions, projects]);

  const roles = useMemo(() => {
    const set = new Set<string>();
    teamMembers.forEach((m) => set.add(m.role));
    return Array.from(set).sort();
  }, [teamMembers]);

  const filtered = useMemo(() => {
    if (roleFilter === "all") return teamMembers;
    return teamMembers.filter((m) => m.role === roleFilter);
  }, [teamMembers, roleFilter]);

  // Group by role for display
  const grouped = useMemo(() => {
    const map = new Map<string, TeamMember[]>();
    filtered.forEach((m) => {
      const arr = map.get(m.role) ?? [];
      arr.push(m);
      map.set(m.role, arr);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <PageTransition>
      <PageHeader
        title="Team"
        description={`${teamMembers.length} member${teamMembers.length === 1 ? "" : "s"} across ${roles.length} roles`}
      />

      {/* Role filter */}
      <div
        className="mb-6 flex items-center gap-2 overflow-x-auto rounded-xl border p-1.5"
        style={{
          background: "var(--admin-surface)",
          borderColor: "var(--admin-border)",
        }}
      >
        <span
          className="inline-flex items-center gap-1.5 pl-2 pr-1 text-[11.5px] font-medium"
          style={{ color: "var(--admin-text-muted)" }}
        >
          <Filter className="h-3.5 w-3.5" />
        </span>
        <button
          onClick={() => setRoleFilter("all")}
          className="rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors whitespace-nowrap"
          style={{
            background: roleFilter === "all" ? "var(--admin-accent)" : "transparent",
            color: roleFilter === "all" ? "#0F172A" : "var(--admin-text-secondary)",
          }}
        >
          All Roles
          <span
            className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold"
            style={{
              background:
                roleFilter === "all"
                  ? "rgba(15,23,42,0.18)"
                  : "var(--admin-surface-2)",
              color:
                roleFilter === "all" ? "#0F172A" : "var(--admin-text-muted)",
            }}
          >
            {teamMembers.length}
          </span>
        </button>
        {roles.map((r) => {
          const active = roleFilter === r;
          const count = teamMembers.filter((m) => m.role === r).length;
          return (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className="rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors whitespace-nowrap"
              style={{
                background: active ? "var(--admin-accent)" : "transparent",
                color: active ? "#0F172A" : "var(--admin-text-secondary)",
              }}
            >
              {r}
              <span
                className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold"
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

      {filtered.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title="No team members"
            description="Team members will appear here once configured."
          />
        </AdminCard>
      ) : (
        <div className="space-y-6">
          {grouped.map(([role, members]) => (
            <div key={role}>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{
                    background: "var(--admin-surface-2)",
                    color: "var(--admin-accent)",
                  }}
                >
                  <Briefcase className="h-3.5 w-3.5" />
                </span>
                <h2
                  className="font-semibold text-[14px]"
                  style={{ color: "var(--admin-text)" }}
                >
                  {role}
                </h2>
                <span
                  className="text-[11.5px]"
                  style={{ color: "var(--admin-text-muted)" }}
                >
                  ({members.length})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {members.map((m, i) => {
                  const count = assignmentCounts.get(m.id) ?? 0;
                  const utilization = Math.min(
                    100,
                    Math.round((count / Math.max(1, m.capacity / 10)) * 100)
                  );
                  const statusColors = STATUS_COLORS[m.status ?? "Available"];
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                    >
                      <AdminCard className="p-4 h-full">
                        <div className="flex items-start gap-3">
                          <Avatar initials={m.initials} size="lg" />
                          <div className="flex-1 min-w-0">
                            <p
                              className="font-semibold text-[13.5px] truncate"
                              style={{ color: "var(--admin-text)" }}
                            >
                              {m.name}
                            </p>
                            <p
                              className="text-[11.5px]"
                              style={{ color: "var(--admin-accent)" }}
                            >
                              {m.role}
                            </p>
                            <span
                              className="mt-1.5 inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider"
                              style={{
                                background: statusColors.bg,
                                borderColor: statusColors.border,
                                color: statusColors.text,
                              }}
                            >
                              {m.status === "Available" && (
                                <CheckCircle2 className="h-2.5 w-2.5" />
                              )}
                              {m.status === "Busy" && (
                                <Clock className="h-2.5 w-2.5" />
                              )}
                              {m.status === "On Leave" && (
                                <XCircle className="h-2.5 w-2.5" />
                              )}
                              {m.status ?? "Available"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 space-y-1.5">
                          <p
                            className="flex items-center gap-1.5 text-[11.5px]"
                            style={{ color: "var(--admin-text-secondary)" }}
                          >
                            <Mail
                              className="h-3 w-3"
                              style={{ color: "var(--admin-text-muted)" }}
                            />
                            <span className="truncate">{m.email}</span>
                          </p>
                          <p
                            className="flex items-center gap-1.5 text-[11.5px]"
                            style={{ color: "var(--admin-text-secondary)" }}
                          >
                            <Clock
                              className="h-3 w-3"
                              style={{ color: "var(--admin-text-muted)" }}
                            />
                            {m.capacity}h/week capacity
                          </p>
                        </div>

                        {/* Skills */}
                        <div className="mt-3 flex flex-wrap gap-1">
                          {m.skills.slice(0, 3).map((s) => (
                            <span
                              key={s}
                              className="rounded border px-1.5 py-0.5 text-[9.5px]"
                              style={{
                                background: "var(--admin-surface-2)",
                                borderColor: "var(--admin-border)",
                                color: "var(--admin-text-secondary)",
                              }}
                            >
                              {s}
                            </span>
                          ))}
                          {m.skills.length > 3 && (
                            <span
                              className="text-[9.5px]"
                              style={{ color: "var(--admin-text-muted)" }}
                            >
                              +{m.skills.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Utilization */}
                        <div
                          className="mt-3 pt-3 border-t"
                          style={{ borderColor: "var(--admin-border)" }}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span
                              className="inline-flex items-center gap-1 text-[10.5px] uppercase tracking-wider font-medium"
                              style={{ color: "var(--admin-text-muted)" }}
                            >
                              <Calendar className="h-3 w-3" />
                              Active Assignments
                            </span>
                            <span
                              className="text-[12px] font-semibold tabular-nums"
                              style={{ color: "var(--admin-text)" }}
                            >
                              {count}
                            </span>
                          </div>
                          <ProgressBar
                            value={utilization}
                            color={
                              utilization > 80
                                ? "#EF4444"
                                : utilization > 50
                                ? "#F59E0B"
                                : "var(--admin-accent)"
                            }
                          />
                        </div>
                      </AdminCard>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
