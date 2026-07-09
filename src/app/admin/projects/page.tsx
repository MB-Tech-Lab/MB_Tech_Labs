"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FolderKanban,
  ArrowRight,
  Plus,
  Code2,
  Calendar,
  Users,
  Filter,
} from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  AdminButton,
  DevStatusBadge,
  PriorityBadge,
  PageTransition,
  PageHeader,
  EmptyState,
  ProgressBar,
  Avatar,
} from "@/modules/admin/components/ui";
import type { DevProjectStatus } from "@/modules/admin/types";

const FILTERS: { label: string; value: string }[] = [
  { label: "All Projects", value: "all" },
  { label: "Active Stages", value: "active" },
  { label: "Maintenance", value: "maintenance" },
];

const ACTIVE_STAGES: DevProjectStatus[] = [
  "Discovery",
  "Planning",
  "UI/UX",
  "Development",
  "Testing",
  "Deployment",
];

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProjectsPage() {
  const { projects, teamMembers } = useAdmin();
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "active") {
      return projects.filter((p) => ACTIVE_STAGES.includes(p.status));
    }
    if (filter === "maintenance") {
      return projects.filter(
        (p) => p.status === "Maintenance" || p.status === "On Hold"
      );
    }
    return projects;
  }, [projects, filter]);

  return (
    <PageTransition>
      <PageHeader
        title="Projects"
        description={`${projects.length} project${projects.length === 1 ? "" : "s"} in delivery`}
        action={
          <Link href="/admin/submissions">
            <AdminButton variant="primary" size="md" icon={<Plus className="h-4 w-4" />}>
              Create Project
            </AdminButton>
          </Link>
        }
      />

      {/* Filter bar */}
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
        {FILTERS.map((f) => {
          const active = filter === f.value;
          const count =
            f.value === "all"
              ? projects.length
              : f.value === "active"
              ? projects.filter((p) => ACTIVE_STAGES.includes(p.status)).length
              : projects.filter(
                  (p) => p.status === "Maintenance" || p.status === "On Hold"
                ).length;
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

      {filtered.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<FolderKanban className="h-6 w-6" />}
            title="No projects found"
            description="Projects appear here once a submission is approved and converted."
            action={
              <Link href="/admin/submissions">
                <AdminButton variant="primary" size="sm">
                  Browse submissions
                </AdminButton>
              </Link>
            }
          />
        </AdminCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p, i) => {
            const teamIds = Object.values(p.assignedTeam).filter(
              Boolean
            ) as string[];
            const members = teamIds
              .map((tid) => teamMembers.find((m) => m.id === tid))
              .filter(Boolean);
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <Link href={`/admin/projects/${p.id}`}>
                  <AdminCard
                    strong
                    className="p-5 h-full hover:translate-y-[-2px] transition-transform group cursor-pointer"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0 flex-1">
                        <h3
                          className="font-semibold text-[15px] tracking-tight truncate"
                          style={{ color: "var(--admin-text)" }}
                        >
                          {p.name}
                        </h3>
                        <p
                          className="text-[11.5px] mt-0.5 truncate"
                          style={{ color: "var(--admin-text-muted)" }}
                        >
                          {p.clientCompany}
                        </p>
                      </div>
                      <DevStatusBadge status={p.status} />
                    </div>

                    {/* Description */}
                    <p
                      className="text-[12px] leading-relaxed line-clamp-2 mb-4"
                      style={{ color: "var(--admin-text-secondary)" }}
                    >
                      {p.description || "No description provided."}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className="text-[10.5px] uppercase tracking-wider font-medium"
                          style={{ color: "var(--admin-text-muted)" }}
                        >
                          Progress
                        </span>
                        <span
                          className="text-[12px] font-semibold tabular-nums"
                          style={{ color: "var(--admin-text)" }}
                        >
                          {p.progress}%
                        </span>
                      </div>
                      <ProgressBar value={p.progress} />
                    </div>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.techStack.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium"
                          style={{
                            background: "var(--admin-surface-2)",
                            borderColor: "var(--admin-border)",
                            color: "var(--admin-text-secondary)",
                          }}
                        >
                          <Code2 className="h-2.5 w-2.5" style={{ color: "var(--admin-accent)" }} />
                          {t}
                        </span>
                      ))}
                      {p.techStack.length > 4 && (
                        <span
                          className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                          style={{ color: "var(--admin-text-muted)" }}
                        >
                          +{p.techStack.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div
                      className="pt-3 border-t flex items-center justify-between"
                      style={{ borderColor: "var(--admin-border)" }}
                    >
                      <div className="flex items-center gap-3">
                        {/* Team avatars */}
                        <div className="flex items-center -space-x-1.5">
                          {members.slice(0, 3).map((m) => (
                            <Avatar
                              key={m!.id}
                              initials={m!.initials}
                              size="sm"
                            />
                          ))}
                          {members.length > 3 && (
                            <span
                              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-semibold border"
                              style={{
                                background: "var(--admin-surface-2)",
                                borderColor: "var(--admin-border)",
                                color: "var(--admin-text-secondary)",
                              }}
                            >
                              +{members.length - 3}
                            </span>
                          )}
                          {members.length === 0 && (
                            <span
                              className="inline-flex h-7 w-7 items-center justify-center rounded-lg border text-[10px]"
                              style={{
                                background: "var(--admin-surface-2)",
                                borderColor: "var(--admin-border)",
                                color: "var(--admin-text-muted)",
                              }}
                            >
                              <Users className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                        <PriorityBadge priority={p.priority} />
                      </div>
                      <span
                        className="inline-flex items-center gap-1 text-[11.5px] font-medium group-hover:gap-1.5 transition-all"
                        style={{ color: "var(--admin-accent)" }}
                      >
                        Open
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>

                    {/* Timeline */}
                    <div
                      className="mt-3 flex items-center gap-1.5 text-[10.5px]"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      <Calendar className="h-3 w-3" />
                      {formatDate(p.startDate)} → {formatDate(p.estimatedEndDate)}
                    </div>
                  </AdminCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </PageTransition>
  );
}
