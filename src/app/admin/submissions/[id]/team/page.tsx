"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  UserPlus,
  Check,
  X,
  Mail,
  Briefcase,
  Clock,
  Sparkles,
} from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  AdminButton,
  SectionTitle,
  PageTransition,
  EmptyState,
} from "@/modules/admin/components/ui";
import type { TeamRole } from "@/modules/admin/types";

const ROLES_TO_ASSIGN: TeamRole[] = [
  "Project Manager",
  "Frontend Developer",
  "Backend Developer",
  "UI Designer",
  "QA Engineer",
  "DevOps",
  "Business Analyst",
];

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

  if (!submission) {
    return (
      <PageTransition>
        <EmptyState
          title="Submission not found"
          action={
            <Link href="/admin" className="inline-flex items-center gap-1.5 rounded-xl bg-cyan text-ink font-medium text-[13px] px-4 py-2.5">
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
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
    assignTeam(submission.id, assigned);
  }

  const assignedCount = Object.values(assigned).filter(Boolean).length;

  return (
    <PageTransition>
      <Link
        href={`/admin/submissions/${submission.id}`}
        className="inline-flex items-center gap-1.5 text-[12.5px] text-white/55 hover:text-white transition-colors mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to submission
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white tracking-tight">
            Team Assignment
          </h1>
          <p className="mt-1.5 text-[13.5px] text-white/55">
            Assign internal team members to{" "}
            <span className="text-white/80">{submission.projectName}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/65">
            {assignedCount} assigned
          </span>
          <AdminButton
            variant="primary"
            size="sm"
            onClick={handleSave}
            icon={<Check className="h-3.5 w-3.5" />}
          >
            Save Assignment
          </AdminButton>
        </div>
      </div>

      {/* Roles grid */}
      <div className="space-y-4">
        {ROLES_TO_ASSIGN.map((role) => {
          const assignedId = assigned[role];
          const assignedMember = teamMembers.find((m) => m.id === assignedId);
          const candidates = teamMembers.filter(
            (m) => m.role === role || role === "Project Manager" // PM candidates are PMs
          );
          // For other roles, show members with matching role + a few flexible ones
          const candidatesForRole =
            candidates.length > 0
              ? candidates
              : teamMembers.filter(
                  (m) =>
                    m.role === role ||
                    (role === "Frontend Developer" &&
                      (m.role === "Frontend Developer")) ||
                    (role === "Backend Developer" &&
                      (m.role === "Backend Developer"))
                );

          return (
            <AdminCard key={role} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/25 text-cyan">
                    <Briefcase className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-display text-[14px] font-semibold text-white">
                      {role}
                    </h3>
                    <p className="text-[11.5px] text-white/45">
                      {candidatesForRole.length} candidate
                      {candidatesForRole.length === 1 ? "" : "s"} available
                    </p>
                  </div>
                </div>
                {assignedMember && (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-400/10 border border-emerald-400/25 px-2 py-1 text-[11px] text-emerald-200">
                    <Check className="h-3 w-3" />
                    {assignedMember.name}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {candidatesForRole.map((member) => {
                  const isAssigned = assignedId === member.id;
                  return (
                    <motion.button
                      key={member.id}
                      type="button"
                      onClick={() => toggleAssign(role, member.id)}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                      className={`text-left rounded-xl border p-3 transition-all ${
                        isAssigned
                          ? "border-cyan/50 bg-cyan/10 ring-1 ring-cyan/30"
                          : "border-white/8 bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-display font-semibold text-[11px] transition-colors ${
                            isAssigned
                              ? "bg-cyan text-ink"
                              : "bg-gradient-to-br from-cyan/25 to-cyan/5 border border-cyan/25 text-cyan-soft"
                          }`}
                        >
                          {member.initials}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12.5px] font-medium text-white truncate">
                            {member.name}
                          </p>
                          <p className="text-[10.5px] text-white/45 truncate">
                            {member.email}
                          </p>
                          <div className="mt-1.5 flex items-center gap-1.5 text-[10.5px] text-white/45">
                            <Clock className="h-2.5 w-2.5" />
                            {member.capacity}h/week
                          </div>
                        </div>
                        {isAssigned && (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan text-ink">
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
                              className="rounded border border-white/8 bg-white/[0.03] px-1.5 py-0.5 text-[9.5px] text-white/45"
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
            </AdminCard>
          );
        })}
      </div>

      {/* Summary */}
      <AdminCard strong className="mt-6 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/25 text-cyan">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="font-display text-[13.5px] font-semibold text-white">
                Assignment Summary
              </p>
              <p className="text-[11.5px] text-white/55">
                {assignedCount} of {ROLES_TO_ASSIGN.length} roles assigned
              </p>
            </div>
          </div>
          <AdminButton
            variant="primary"
            size="sm"
            onClick={handleSave}
            icon={<Check className="h-3.5 w-3.5" />}
          >
            Save Assignment
          </AdminButton>
        </div>
      </AdminCard>
    </PageTransition>
  );
}
