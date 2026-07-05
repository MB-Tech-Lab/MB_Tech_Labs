"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FolderKanban, ArrowRight, Code2, CheckCircle2, Trophy } from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import { AdminCard, StatusBadge, PriorityBadge, PageTransition, EmptyState } from "@/modules/admin/components/ui";

const ACTIVE_STATUSES = ["Approved", "Development", "Testing", "Delivered"];

export default function ProjectsPage() {
  const { submissions } = useAdmin();
  const activeProjects = submissions.filter((s) =>
    ACTIVE_STATUSES.includes(s.status)
  );

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Active Projects
        </h1>
        <p className="mt-1.5 text-[13.5px] text-white/55">
          {activeProjects.length} project{activeProjects.length === 1 ? "" : "s"} in delivery
        </p>
      </div>

      {activeProjects.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<FolderKanban className="h-6 w-6" />}
            title="No active projects"
            description="Projects appear here once a submission is approved."
          />
        </AdminCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeProjects.map((p, i) => {
            const teamCount = Object.values(p.assignedTeam).filter(Boolean).length;
            const totalQuotation = p.quotation
              ? p.quotation.items.reduce((s, it) => s + it.qty * it.unitPrice, 0)
              : 0;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={`/admin/submissions/${p.id}`}>
                  <AdminCard strong className="p-5 h-full hover:border-cyan/25 transition-colors group">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <h3 className="font-display text-[15px] font-semibold text-white truncate group-hover:text-cyan-soft transition-colors">
                          {p.projectName}
                        </h3>
                        <p className="text-[11.5px] text-white/45 mt-0.5">
                          {p.client.company} • {p.templateName}
                        </p>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <Stat label="Team" value={`${teamCount}`} icon={<Code2 className="h-3 w-3" />} />
                      <Stat
                        label="Value"
                        value={totalQuotation > 0 ? `$${(totalQuotation / 1000).toFixed(0)}k` : "—"}
                        icon={<Trophy className="h-3 w-3" />}
                      />
                      <Stat
                        label="Priority"
                        value={p.priority}
                        icon={<CheckCircle2 className="h-3 w-3" />}
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <PriorityBadge priority={p.priority} />
                      <span className="inline-flex items-center gap-1 text-[12px] text-cyan-soft group-hover:text-cyan transition-colors">
                        Open
                        <ArrowRight className="h-3 w-3" />
                      </span>
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

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/[0.02] p-2.5">
      <p className="flex items-center gap-1 text-[9.5px] uppercase tracking-wider text-white/40">
        {icon}
        {label}
      </p>
      <p className="text-[13px] font-medium text-white mt-0.5 truncate">{value}</p>
    </div>
  );
}
