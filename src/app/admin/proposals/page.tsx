"use client";

import { useState, useEffect } from "react";
import { FileText, Plus, Search } from "lucide-react";
import {
  AdminCard,
  PageTransition,
  EmptyState,
  Skeleton,
  PageHeader,
} from "@/modules/admin/components/ui";
import { proposalsApi, type Proposal } from "@/lib/api/proposals";

function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    proposalsApi.list({ pageSize: 100 })
      .then((r) => setProposals(r.data))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <PageHeader
        title="Proposals"
        description="Project proposals sent to clients"
        action={
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-cyan text-ink font-medium text-[13px] px-4 py-2.5 hover:bg-cyan-soft transition-all">
            <Plus className="h-4 w-4" />
            Create Proposal
          </button>
        }
      />
      {error && <div className="mb-5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-[13px] text-rose-200">{error}</div>}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <AdminCard key={i} className="p-5"><Skeleton className="h-16 w-full" /></AdminCard>)}
        </div>
      ) : proposals.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<FileText className="h-6 w-6" />}
            title="No Proposals Yet"
            description="Create proposals from SRG submissions or projects. They will appear here."
          />
        </AdminCard>
      ) : (
        <div className="space-y-3">
          {proposals.map((p) => (
            <AdminCard key={p.id} className="p-5 hover:border-cyan/25 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-[14px] font-semibold text-white">{p.title}</h3>
                  <p className="text-[11.5px] text-white/45 mt-0.5">
                    {p.project?.name || "No project"} · Updated {formatDate(p.updatedAt)}
                  </p>
                </div>
                <span className="rounded-md border border-amber-400/25 bg-amber-400/10 px-2 py-0.5 text-[10.5px] text-amber-200 uppercase tracking-wider">
                  {p.status}
                </span>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
