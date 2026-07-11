"use client";

import { useState, useEffect } from "react";
import { UserCircle, Plus, Mail } from "lucide-react";
import {
  AdminCard,
  PageTransition,
  EmptyState,
  Skeleton,
  PageHeader,
} from "@/modules/admin/components/ui";
import { teamApi, type TeamMember } from "@/lib/api/team";

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "border-rose-400/25 bg-rose-400/10 text-rose-200",
  ADMIN: "border-cyan/25 bg-cyan/10 text-cyan-soft",
  PROJECT_MANAGER: "border-violet-400/25 bg-violet-400/10 text-violet-200",
  SALES: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  DEVELOPER: "border-blue-400/25 bg-blue-400/10 text-blue-200",
  VIEWER: "border-white/15 bg-white/5 text-white/50",
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    teamApi.list({ pageSize: 100 })
      .then((r) => setMembers(r.data))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <PageHeader
        title="Team"
        description="Manage team members and their roles"
        action={
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-cyan text-ink font-medium text-[13px] px-4 py-2.5 hover:bg-cyan-soft transition-all">
            <Plus className="h-4 w-4" />
            Add Member
          </button>
        }
      />
      {error && <div className="mb-5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-[13px] text-rose-200">{error}</div>}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <AdminCard key={i} className="p-5"><Skeleton className="h-24 w-full" /></AdminCard>)}
        </div>
      ) : members.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<UserCircle className="h-6 w-6" />}
            title="No Team Members Yet"
            description="Add team members to assign them to projects and tasks."
          />
        </AdminCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => (
            <AdminCard key={m.id} className="p-5">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan/25 to-cyan/5 border border-cyan/25 font-display font-semibold text-[13px] text-cyan-soft">
                  {m.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-[14px] font-semibold text-white truncate">{m.name}</p>
                  <p className="text-[11.5px] text-white/45 truncate flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {m.email}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-wider ${ROLE_COLORS[m.role] || ROLE_COLORS.VIEWER}`}>
                  {m.role.replace("_", " ")}
                </span>
                {m._count && (
                  <span className="text-[11px] text-white/45">
                    {m._count.assignedProjects + m._count.managedProjects} projects
                  </span>
                )}
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
