"use client";

import { useSrg } from "../context/SRGContext";
import { GlassCard, AnimateIn, TextInput, Select } from "./ui";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Mail, ShieldCheck } from "lucide-react";
import type { TeamRole } from "../types";

const ROLES = [
  "Product Owner",
  "Project Manager",
  "CTO / Technical Lead",
  "Designer",
  "Developer",
  "QA / Tester",
  "Marketing Lead",
  "Finance / Admin",
  "Operations",
  "Viewer / Read-only",
  "Custom",
];

const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Finance",
  "Operations",
  "HR",
  "Legal",
  "Leadership",
  "Other",
];

const PERMISSIONS = [
  "View project",
  "Comment on tasks",
  "Edit requirements",
  "Approve milestones",
  "Manage team",
  "Access financials",
  "Manage uploads",
  "Admin access",
];

export function Step7TeamAccess() {
  const { session, addTeamRole, updateTeamRole, removeTeamRole } = useSrg();
  const roles = session.teamRoles;

  return (
    <div className="space-y-8">
      <AnimateIn>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
            Step 07
          </span>
          <h1 className="mt-5 font-display text-3xl sm:text-4xl md:text-[40px] font-semibold text-white tracking-tight leading-[1.1]">
            Who needs{" "}
            <span className="text-gradient-cyan">access?</span>
          </h1>
          <p className="mt-3 text-[14.5px] text-white/55 max-w-xl">
            Add the team members who should have access to this project. You
            can grant view, edit, or admin permissions per person. Team members
            will receive an invite once the project kicks off.
          </p>
        </div>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] text-white/55">
            {roles.length} team member{roles.length === 1 ? "" : "s"} added
          </p>
          <button
            type="button"
            onClick={() => addTeamRole()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-cyan text-ink font-medium text-[13px] px-4 py-2.5 hover:bg-cyan-soft transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Team Member
          </button>
        </div>
      </AnimateIn>

      {roles.length === 0 ? (
        <AnimateIn delay={0.15}>
          <GlassCard className="p-12 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan/10 border border-cyan/25 mx-auto">
              <Mail className="h-6 w-6 text-cyan" />
            </div>
            <p className="mt-4 font-display text-[15px] font-medium text-white">
              No team members yet
            </p>
            <p className="mt-1 text-[13px] text-white/45 max-w-sm mx-auto">
              Add at least one team member. You can always invite more later —
              this just helps us scope access controls.
            </p>
            <button
              type="button"
              onClick={() => addTeamRole()}
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-cyan/30 bg-cyan/10 text-cyan-soft font-medium text-[13px] px-4 py-2.5 hover:bg-cyan/15 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add first member
            </button>
          </GlassCard>
        </AnimateIn>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {roles.map((role, i) => (
              <RoleRow
                key={role.id}
                role={role}
                index={i}
                onUpdate={(patch) => updateTeamRole(role.id, patch)}
                onRemove={() => removeTeamRole(role.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimateIn delay={0.2}>
        <GlassCard strong className="p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-cyan shrink-0 mt-0.5" />
            <div>
              <p className="font-display text-[13.5px] font-medium text-white">
                Access control policy
              </p>
              <p className="text-[12.5px] text-white/55 mt-1 leading-relaxed">
                All team members will receive email invitations after project
                kickoff. Permissions can be adjusted at any time during the
                engagement. Sensitive financial and legal documents are
                restricted to admin roles by default.
              </p>
            </div>
          </div>
        </GlassCard>
      </AnimateIn>
    </div>
  );
}

/* --------------------------- Role row --------------------------- */

function RoleRow({
  role,
  index,
  onUpdate,
  onRemove,
}: {
  role: TeamRole;
  index: number;
  onUpdate: (patch: Partial<TeamRole>) => void;
  onRemove: () => void;
}) {
  function togglePermission(p: string) {
    const has = role.permissions.includes(p);
    onUpdate({
      permissions: has
        ? role.permissions.filter((x) => x !== p)
        : [...role.permissions, p],
    });
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <span className="font-mono text-[11px] text-cyan-soft/70 tabular-nums mt-3">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <TextInput
              value={role.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Full name"
              className="text-[13px]"
            />
            <TextInput
              type="email"
              value={role.email}
              onChange={(e) => onUpdate({ email: e.target.value })}
              placeholder="email@company.com"
              className="text-[13px]"
            />
            <Select
              value={role.role}
              onChange={(e) => onUpdate({ role: e.target.value })}
              placeholder="Role"
              options={ROLES.map((r) => ({ label: r, value: r }))}
            />
            <Select
              value={role.department}
              onChange={(e) => onUpdate({ department: e.target.value })}
              placeholder="Department"
              options={DEPARTMENTS.map((d) => ({ label: d, value: d }))}
            />
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove team member"
            className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/40 hover:text-rose-300 hover:bg-rose-400/10 transition-all mt-2"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 pl-7">
          {PERMISSIONS.map((p) => {
            const active = role.permissions.includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => togglePermission(p)}
                className={`rounded-full border px-2.5 py-1 text-[11px] transition-all ${
                  active
                    ? "bg-cyan/10 border-cyan/40 text-cyan-soft"
                    : "bg-white/[0.03] border-white/10 text-white/50 hover:border-white/20"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </GlassCard>
    </motion.div>
  );
}
