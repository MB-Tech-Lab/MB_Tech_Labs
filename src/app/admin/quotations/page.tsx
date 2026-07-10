"use client";

import { useState, useEffect } from "react";
import { Calculator, Plus } from "lucide-react";
import {
  AdminCard,
  PageTransition,
  EmptyState,
  Skeleton,
  PageHeader,
} from "@/modules/admin/components/ui";
import { quotationsApi, type Quotation } from "@/lib/api/quotations";

function formatMoney(amount: number, currency: string): string {
  return amount.toLocaleString("en-US", { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    quotationsApi.list({ pageSize: 100 })
      .then((r) => setQuotations(r.data))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const total = quotations.reduce((sum, q) => sum + q.totalAmount, 0);

  return (
    <PageTransition>
      <PageHeader
        title="Quotations"
        description={quotations.length > 0 ? `${quotations.length} quotations · ${formatMoney(total, "USD")} total` : "Manage client quotations"}
        action={
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-cyan text-ink font-medium text-[13px] px-4 py-2.5 hover:bg-cyan-soft transition-all">
            <Plus className="h-4 w-4" />
            Create Quotation
          </button>
        }
      />
      {error && <div className="mb-5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-[13px] text-rose-200">{error}</div>}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => <AdminCard key={i} className="p-5"><Skeleton className="h-24 w-full" /></AdminCard>)}
        </div>
      ) : quotations.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<Calculator className="h-6 w-6" />}
            title="No Quotations Yet"
            description="Create quotations from SRG submissions or projects. They will appear here."
          />
        </AdminCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {quotations.map((q) => (
            <AdminCard key={q.id} className="p-5 hover:border-cyan/25 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <h3 className="font-display text-[14px] font-semibold text-white truncate">{q.title}</h3>
                </div>
                <span className="shrink-0 rounded-md border border-amber-400/25 bg-amber-400/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-200">
                  {q.status}
                </span>
              </div>
              <p className="font-display text-[18px] font-bold text-cyan tabular-nums">
                {formatMoney(q.totalAmount, q.currency)}
              </p>
            </AdminCard>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
