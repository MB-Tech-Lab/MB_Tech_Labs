"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  ArrowRight,
  Clock,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  AdminButton,
  PageTransition,
  PageHeader,
  EmptyState,
} from "@/modules/admin/components/ui";

const PROPOSAL_STATUS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  draft: { bg: "#F59E0B1A", border: "#F59E0B40", text: "#F59E0B" },
  sent: { bg: "#3B82F61A", border: "#3B82F640", text: "#3B82F6" },
  accepted: { bg: "#10B9811A", border: "#10B98140", text: "#10B981" },
  rejected: { bg: "#EF44441A", border: "#EF444440", text: "#EF4444" },
};

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProposalsPage() {
  const { submissions } = useAdmin();
  const withProposals = submissions.filter((s) => s.proposal !== null);

  const counts = withProposals.reduce(
    (acc, s) => {
      const st = s.proposal!.status;
      acc[st] = (acc[st] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <PageTransition>
      <PageHeader
        title="Proposals"
        description={`${withProposals.length} proposal${withProposals.length === 1 ? "" : "s"} drafted`}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {(["draft", "sent", "accepted", "rejected"] as const).map((status) => {
          const colors = PROPOSAL_STATUS_COLORS[status];
          const count = counts[status] ?? 0;
          return (
            <AdminCard key={status} className="p-4">
              <div className="flex items-center justify-between">
                <span
                  className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider"
                  style={{
                    background: colors.bg,
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                >
                  {status}
                </span>
                <span
                  className="text-[24px] font-bold tabular-nums"
                  style={{ color: "var(--admin-text)" }}
                >
                  {count}
                </span>
              </div>
            </AdminCard>
          );
        })}
      </div>

      {withProposals.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<FileText className="h-6 w-6" />}
            title="No proposals yet"
            description="Proposals are created from individual submissions. Open a submission to draft one."
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {withProposals.map((s, i) => {
            const proposal = s.proposal!;
            const colors = PROPOSAL_STATUS_COLORS[proposal.status];
            const filledSections = proposal.sections.filter(
              (sec) => sec.content.trim().length > 0
            ).length;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              >
                <Link href={`/admin/submissions/${s.id}/proposal`}>
                  <AdminCard
                    strong
                    className="p-5 h-full hover:translate-y-[-2px] transition-transform group cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-[10px] font-mono uppercase tracking-wider truncate"
                          style={{ color: "var(--admin-text-muted)" }}
                        >
                          {proposal.id.slice(0, 18)}
                        </p>
                        <h3
                          className="mt-1 font-semibold text-[14px] truncate group-hover:opacity-90 transition-opacity"
                          style={{ color: "var(--admin-text)" }}
                        >
                          {s.projectName}
                        </h3>
                        <p
                          className="text-[11.5px] truncate mt-0.5"
                          style={{ color: "var(--admin-text-muted)" }}
                        >
                          {s.client.company}
                        </p>
                      </div>
                      <span
                        className="shrink-0 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                        style={{
                          background: colors.bg,
                          borderColor: colors.border,
                          color: colors.text,
                        }}
                      >
                        {proposal.status}
                      </span>
                    </div>

                    {/* Sections progress */}
                    <div className="mb-3">
                      <div
                        className="flex items-center justify-between mb-1.5"
                      >
                        <span
                          className="inline-flex items-center gap-1 text-[10.5px] uppercase tracking-wider font-medium"
                          style={{ color: "var(--admin-text-muted)" }}
                        >
                          <Layers className="h-3 w-3" />
                          Sections
                        </span>
                        <span
                          className="text-[11.5px] font-semibold tabular-nums"
                          style={{ color: "var(--admin-text)" }}
                        >
                          {filledSections}/{proposal.sections.length}
                        </span>
                      </div>
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: "var(--admin-surface-2)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${
                              proposal.sections.length === 0
                                ? 0
                                : (filledSections / proposal.sections.length) * 100
                            }%`,
                            background: "var(--admin-accent)",
                          }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div
                      className="pt-3 border-t flex items-center justify-between"
                      style={{ borderColor: "var(--admin-border)" }}
                    >
                      <span
                        className="inline-flex items-center gap-1 text-[11px]"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        <Clock className="h-3 w-3" />
                        {formatDate(proposal.updatedAt)}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 text-[12px] font-medium group-hover:gap-1.5 transition-all"
                        style={{ color: "var(--admin-accent)" }}
                      >
                        {proposal.status === "sent" || proposal.status === "accepted" ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : null}
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
