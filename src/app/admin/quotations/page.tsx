"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, ArrowRight, Calculator } from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import { AdminCard, PageTransition, EmptyState } from "@/modules/admin/components/ui";

function formatMoney(amount: number, currency: string): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function computeTotal(q: { items: { qty: number; unitPrice: number }[]; taxRate: number; discount: number }): number {
  const subtotal = q.items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
  const discountAmount = (subtotal * q.discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const tax = (taxableAmount * q.taxRate) / 100;
  return taxableAmount + tax;
}

export default function QuotationsPage() {
  const { submissions } = useAdmin();
  const withQuotations = submissions.filter((s) => s.quotation);

  const totalValue = withQuotations.reduce(
    (sum, s) => sum + computeTotal(s.quotation!),
    0
  );
  const accepted = withQuotations.filter((s) => s.quotation!.status === "accepted");
  const acceptedValue = accepted.reduce(
    (sum, s) => sum + computeTotal(s.quotation!),
    0
  );

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Quotations
        </h1>
        <p className="mt-1.5 text-[13.5px] text-white/55">
          {withQuotations.length} quotation{withQuotations.length === 1 ? "" : "s"} •{" "}
          <span className="text-cyan-soft">
            {formatMoney(totalValue, "USD")}
          </span>{" "}
          total •{" "}
          <span className="text-emerald-300">
            {formatMoney(acceptedValue, "USD")}
          </span>{" "}
          accepted
        </p>
      </div>

      {withQuotations.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<FileText className="h-6 w-6" />}
            title="No quotations yet"
            description="Create quotations from individual submissions."
          />
        </AdminCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {withQuotations.map((s, i) => {
            const total = computeTotal(s.quotation!);
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <Link href={`/admin/submissions/${s.id}/quotation`}>
                  <AdminCard className="p-5 h-full hover:border-cyan/25 transition-colors group">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <p className="text-[10.5px] font-mono text-cyan-soft/60 truncate">
                          {s.quotation!.id}
                        </p>
                        <h3 className="mt-1 font-display text-[14px] font-semibold text-white truncate group-hover:text-cyan-soft transition-colors">
                          {s.projectName}
                        </h3>
                        <p className="text-[11.5px] text-white/45 truncate">
                          {s.client.company}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                          s.quotation!.status === "accepted"
                            ? "bg-emerald-400/10 text-emerald-200 border-emerald-400/25"
                            : s.quotation!.status === "sent"
                            ? "bg-blue-400/10 text-blue-200 border-blue-400/25"
                            : s.quotation!.status === "rejected"
                            ? "bg-rose-400/10 text-rose-200 border-rose-400/25"
                            : "bg-amber-400/10 text-amber-200 border-amber-400/25"
                        }`}
                      >
                        {s.quotation!.status}
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between">
                      <div>
                        <p className="text-[10.5px] uppercase tracking-wider text-white/40">
                          Total
                        </p>
                        <p className="font-display text-[18px] font-bold text-cyan tabular-nums">
                          {formatMoney(total, s.quotation!.currency)}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[12px] text-cyan-soft group-hover:text-cyan transition-colors">
                        <Calculator className="h-3.5 w-3.5" />
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
