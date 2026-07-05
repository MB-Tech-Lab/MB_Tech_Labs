"use client";

import { motion } from "framer-motion";
import { Mail, Clock, Briefcase } from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import { AdminCard, PageTransition } from "@/modules/admin/components/ui";

export default function TeamPage() {
  const { teamMembers, submissions } = useAdmin();

  // Compute assignment counts per member
  const assignmentCounts = new Map<string, number>();
  submissions.forEach((s) => {
    Object.values(s.assignedTeam).forEach((memberId) => {
      if (memberId) {
        assignmentCounts.set(memberId, (assignmentCounts.get(memberId) ?? 0) + 1);
      }
    });
  });

  // Group by role
  const byRole = new Map<string, typeof teamMembers>();
  teamMembers.forEach((m) => {
    const arr = byRole.get(m.role) ?? [];
    arr.push(m);
    byRole.set(m.role, arr);
  });

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Team
        </h1>
        <p className="mt-1.5 text-[13.5px] text-white/55">
          {teamMembers.length} member{teamMembers.length === 1 ? "" : "s"} across {byRole.size} roles
        </p>
      </div>

      <div className="space-y-6">
        {Array.from(byRole.entries()).map(([role, members]) => (
          <div key={role}>
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="h-4 w-4 text-cyan" />
              <h2 className="font-display text-[14px] font-semibold text-white">{role}</h2>
              <span className="text-[11.5px] text-white/40">({members.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {members.map((m, i) => {
                const count = assignmentCounts.get(m.id) ?? 0;
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    <AdminCard className="p-4 h-full">
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan/25 to-cyan/5 border border-cyan/25 font-display font-semibold text-[13px] text-cyan-soft">
                          {m.initials}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-[13.5px] font-semibold text-white truncate">
                            {m.name}
                          </p>
                          <p className="text-[11px] text-cyan-soft/70">{m.role}</p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1.5">
                        <p className="flex items-center gap-1.5 text-[11.5px] text-white/55">
                          <Mail className="h-3 w-3 text-cyan/60" />
                          <span className="truncate">{m.email}</span>
                        </p>
                        <p className="flex items-center gap-1.5 text-[11.5px] text-white/55">
                          <Clock className="h-3 w-3 text-cyan/60" />
                          {m.capacity}h/week capacity
                        </p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/8 flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {m.skills.slice(0, 2).map((s) => (
                            <span
                              key={s}
                              className="rounded border border-white/8 bg-white/[0.03] px-1.5 py-0.5 text-[9.5px] text-white/45"
                            >
                              {s}
                            </span>
                          ))}
                          {m.skills.length > 2 && (
                            <span className="text-[9.5px] text-white/40">
                              +{m.skills.length - 2}
                            </span>
                          )}
                        </div>
                        <span className="rounded-md bg-cyan/10 border border-cyan/25 px-1.5 py-0.5 text-[10px] text-cyan-soft">
                          {count} active
                        </span>
                      </div>
                    </AdminCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </PageTransition>
  );
}
