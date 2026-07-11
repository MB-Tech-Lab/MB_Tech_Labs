"use client";

import { useState, useEffect } from "react";
import { Receipt, Plus } from "lucide-react";
import {
  AdminCard,
  PageTransition,
  EmptyState,
  Skeleton,
  PageHeader,
} from "@/modules/admin/components/ui";
import { invoicesApi, type Invoice } from "@/lib/api/invoices";

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency === "USD" ? "INR" : currency, maximumFractionDigits: 0 }).format(amount);
}

function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const STATUS_COLORS: Record<string, string> = {
  PAID: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  PENDING: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  OVERDUE: "border-rose-400/25 bg-rose-400/10 text-rose-200",
  CANCELLED: "border-white/15 bg-white/5 text-white/50",
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    invoicesApi.list({ pageSize: 100 })
      .then((r) => setInvoices(r.data))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <PageHeader
        title="Invoices"
        description="Manage client invoices and payments"
        action={
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-cyan text-ink font-medium text-[13px] px-4 py-2.5 hover:bg-cyan-soft transition-all">
            <Plus className="h-4 w-4" />
            Create Invoice
          </button>
        }
      />
      {error && <div className="mb-5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-[13px] text-rose-200">{error}</div>}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <AdminCard key={i} className="p-5"><Skeleton className="h-16 w-full" /></AdminCard>)}
        </div>
      ) : invoices.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<Receipt className="h-6 w-6" />}
            title="No Invoices Yet"
            description="Create invoices from quotations or projects. They will appear here."
          />
        </AdminCard>
      ) : (
        <AdminCard className="overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/8 text-[10.5px] uppercase tracking-[0.12em] text-white/40">
                <th className="px-5 py-2.5 font-medium">Invoice #</th>
                <th className="px-5 py-2.5 font-medium">Client</th>
                <th className="px-5 py-2.5 font-medium">Amount</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5 font-medium">Issue Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-white/5 hover:bg-white/[0.025] transition-colors">
                  <td className="px-5 py-3 font-mono text-[12px] text-cyan-soft">{inv.number}</td>
                  <td className="px-5 py-3 text-[12.5px] text-white">{inv.client?.companyName || "—"}</td>
                  <td className="px-5 py-3 text-[12.5px] text-white tabular-nums">{formatMoney(inv.totalAmount, inv.currency)}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10.5px] uppercase tracking-wider ${STATUS_COLORS[inv.status] || STATUS_COLORS.PENDING}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[12px] text-white/55">{formatDate(inv.issueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>
      )}
    </PageTransition>
  );
}
