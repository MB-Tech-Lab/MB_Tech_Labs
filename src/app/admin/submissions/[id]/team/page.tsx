"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  UserPlus,
  Check,
  Mail,
  Briefcase,
  Clock,
  Sparkles,
  Users,
  Search,
} from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  AdminButton,
  AdminInput,
  SectionTitle,
  PageTransition,
  EmptyState,
  Avatar,
} from "@/modules/admin/components/ui";
import type { TeamRole, TeamMember } from "@/modules/admin/types";

const ROLES_TO_ASSIGN: TeamRole[] = [
  "Project Manager",
  "Frontend Developer",
  "Backend Developer",
  "UI Designer",
  "QA Engineer",
  "DevOps",
  "Business Analyst",
];

const ROLE_COLORS: Record<string, string> = {
  "Project Manager": "#25D6FF",
  "Frontend Developer": "#3B82F6",
  "Backend Developer": "#8B5CF6",
  "UI Designer": "#EC4899",
  "QA Engineer": "#F59E0B",
  DevOps: "#10B981",
  "Business Analyst": "#06B6D4",
};

export default function TeamAssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { submissions, teamMembers, assignTeam } = useAdmin();
  const submission = useMemo(
    () => submissions.find((s) => s.id === id || s.sessionId === id),
    [submissions, id]
  );
  const [assigned, setAssigned] = useState<Record<string, string | null>>(
    submission?.assignedTeam ?? {}
  );
  const [search, setSearch] = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);

  if (!submission) {
    return (
      <PageTransition>
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="Submission not found"
          description="This submission may have been removed."
          action={
            <Link href="/admin/submissions">
              <AdminButton variant="primary" size="sm" icon={<ArrowLeft className="h-3.5 w-3.5" />}>
                Back to submissions
              </AdminButton>
            </Link>
          }
        />
      </PageTransition>
    );
  }

  function toggleAssign(role: TeamRole, memberId: string) {
    setAssigned((prev) => {
      const current = prev[role];
      const next = { ...prev };
      if (current === memberId) {
        next[role] = null;
      } else {
        next[role] = memberId;
      }
      return next;
    });
  }

  function handleSave() {
    assignTeam(submission!.id, assigned);
    setSavedAt(Date.now());
  }

  function getCandidatesForRole(role: TeamRole): TeamMember[] {
    let candidates = teamMembers.filter((m) => m.role === role);
    // Fallback: if no exact matches, include members with overlapping skills
    if (candidates.length === 0) {
      candidates = teamMembers.filter((m) =>
        m.skills.some((s) =>
          role.toLowerCase().includes(s.toLowerCase().split(" ")[0])
        )
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      candidates = candidates.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    return candidates;
  }

  const assignedCount = Object.values(assigned).filter(Boolean).length;

  return (
    <PageTransition>
      <Link
        href={`/admin/submissions/${submission.id}`}
        className="inline-flex items-center gap-1.5 text-[12.5px] mb-4 transition-opacity hover:opacity-80"
        style={{ color: "var(--admin-text-secondary)" }}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to submission
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.18em]"
              style={{
                background: "var(--admin-surface-2)",
                borderColor: "var(--admin-border)",
                color: "var(--admin-accent)",
              }}
            >
              <UserPlus className="h-3 w-3" />
              Team Assignment
            </span>
          </div>
          <h1
            className="font-bold text-2xl sm:text-3xl tracking-tight"
            style={{ color: "var(--admin-text)" }}
          >
            {submission.projectName}
          </h1>
          <p
            className="mt-1.5 text-[13px]"
            style={{ color: "var(--admin-text-secondary)" }}
          >
            Assign internal team members to this project
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="rounded-lg border px-3 py-2 text-[12px]"
            style={{
              background: "var(--admin-surface-2)",
              borderColor: "var(--admin-border)",
              color: "var(--admin-text-secondary)",
            }}
          >
            {assignedCount}/{ROLES_TO_ASSIGN.length} assigned
          </span>
          <AdminButton
            variant="primary"
            size="md"
            onClick={handleSave}
            icon={<Check className="h-4 w-4" />}
          >
            Save Assignment
          </AdminButton>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: "var(--admin-text-muted)" }}
          />
          <AdminInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team by name, email, or skill..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Roles */}
      <div className="space-y-4">
        {ROLES_TO_ASSIGN.map((role) => {
          const assignedId = assigned[role];
          const assignedMember = teamMembers.find((m) => m.id === assignedId);
          const candidates = getCandidatesForRole(role);
          const color = ROLE_COLORS[role] ?? "var(--admin-accent)";

          return (
            <AdminCard key={role} className="p-5">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ background: `${color}1A`, color }}
                  >
                    <Briefcase className="h-4 w-4" />
                  </span>
                  <div>
                    <h3
                      className="font-semibold text-[14px]"
                      style={{ color: "var(--admin-text)" }}
                    >
                      {role}
                    </h3>
                    <p
                      className="text-[11.5px]"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      {candidates.length} candidate
                      {candidates.length === 1 ? "" : "s"} available
                    </p>
                  </div>
                </div>
                {assignedMember && (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px]"
                    style={{
                      background: "#10B9811A",
                      borderColor: "#10B98140",
                      color: "#10B981",
                    }}
                  >
                    <Check className="h-3 w-3" />
                    {assignedMember.name}
                  </span>
                )}
              </div>

              {candidates.length === 0 ? (
                <p
                  className="text-[12px] py-6 text-center"
                  style={{ color: "var(--admin-text-muted)" }}
                >
                  No team members available for this role.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {candidates.map((member) => {
                    const isAssigned = assignedId === member.id;
                    return (
                      <motion.button
                        key={member.id}
                        type="button"
                        onClick={() => toggleAssign(role, member.id)}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                        className="text-left rounded-xl border p-3 transition-all"
                        style={{
                          borderColor: isAssigned
                            ? `${color}80`
                            : "var(--admin-border)",
                          background: isAssigned
                            ? `${color}1A`
                            : "var(--admin-surface-2)",
                        }}
                      >
                        <div className="flex items-start gap-2.5">
                          <Avatar
                            initials={member.initials}
                            size="md"
                            color={isAssigned ? color : undefined}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-[12.5px] font-medium truncate"
                              style={{ color: "var(--admin-text)" }}
                            >
                              {member.name}
                            </p>
                            <p
                              className="text-[10.5px] truncate flex items-center gap-1 mt-0.5"
                              style={{ color: "var(--admin-text-muted)" }}
                            >
                              <Mail className="h-2.5 w-2.5" />
                              {member.email}
                            </p>
                            <div
                              className="mt-1.5 flex items-center gap-1.5 text-[10.5px]"
                              style={{ color: "var(--admin-text-muted)" }}
                            >
                              <Clock className="h-2.5 w-2.5" />
                              {member.capacity}h/week
                            </div>
                          </div>
                          {isAssigned && (
                            <span
                              className="inline-flex h-5 w-5 items-center justify-center rounded-full"
                              style={{ background: color, color: "#0F172A" }}
                            >
                              <Check className="h-3 w-3" strokeWidth={3} />
                            </span>
                          )}
                        </div>
                        {/* Skills */}
                        {member.skills.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1">
                            {member.skills.slice(0, 3).map((s) => (
                              <span
                                key={s}
                                className="rounded border px-1.5 py-0.5 text-[9.5px]"
                                style={{
                                  background: isAssigned
                                    ? `${color}10`
                                    : "var(--admin-surface)",
                                  borderColor: "var(--admin-border)",
                                  color: "var(--admin-text-secondary)",
                                }}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </AdminCard>
          );
        })}
      </div>

      {/* Summary */}
      <AdminCard strong className="mt-6 p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                background: "var(--admin-accent)",
                color: "#0F172A",
              }}
            >
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p
                className="font-semibold text-[13.5px]"
                style={{ color: "var(--admin-text)" }}
              >
                Assignment Summary
              </p>
              <p
                className="text-[11.5px]"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                {assignedCount} of {ROLES_TO_ASSIGN.length} roles assigned
              </p>
            </div>
          </div>
          <AdminButton
            variant="primary"
            size="md"
            onClick={handleSave}
            icon={<Check className="h-4 w-4" />}
          >
            Save Assignment
          </AdminButton>
        </div>
        {savedAt && (
          <p
            className="mt-3 text-[11px] flex items-center gap-1.5"
            style={{ color: "var(--admin-accent)" }}
          >
            <Check className="h-3 w-3" />
            Assignment saved {new Date(savedAt).toLocaleTimeString()}
          </p>
        )}
      </AdminCard>
    </PageTransition>
  );
}
