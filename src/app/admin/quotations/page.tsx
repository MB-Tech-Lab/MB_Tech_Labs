"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calculator,
  ArrowRight,
  TrendingUp,
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
  AnimatedCounter,
} from "@/modules/admin/components/ui";
import type { Quotation } from "@/modules/admin/types";

const QUOTATION_STATUS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  draft: { bg: "#F59E0B1A", border: "#F59E0B40", text: "#F59E0B" },
  sent: { bg: "#3B82F61A", border: "#3B82F640", text: "#3B82F6" },
  accepted: { bg: "#10B9811A", border: "#10B98140", text: "#10B981" },
  rejected: { bg: "#EF44441A", border: "#EF444440", text: "#EF4444" },
};

function formatMoney(amount: number, currency: string): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
}

function computeTotal(q: Quotation): number {
  const subtotal = q.items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
  const discountAmount = (subtotal * q.discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const tax = (taxableAmount * q.taxRate) / 100;
  return taxableAmount + tax;
}

export default function QuotationsPage() {
  const { submissions } = useAdmin();
  const withQuotations = submissions.filter((s) => s.quotation);

  const totalPipeline = withQuotations.reduce(
    (sum, s) => sum + computeTotal(s.quotation!),
    0
  );
  const acceptedValue = withQuotations
    .filter((s) => s.quotation!.status === "accepted")
    .reduce((sum, s) => sum + computeTotal(s.quotation!), 0);
  const pendingValue = withQuotations
    .filter((s) => s.quotation!.status === "sent")
    .reduce((sum, s) => sum + computeTotal(s.quotation!), 0);

  return (
    <PageTransition>
      <PageHeader
        title="Quotations"
        description={`${withQuotations.length} quotation${withQuotations.length === 1 ? "" : "s"} across the pipeline`}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <AdminCard strong className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-[10.5px] uppercase tracking-[0.18em] font-semibold mb-1"
                style={{ color: "var(--admin-text-muted)" }}
              >
                Pipeline Value
              </p>
              <p
                className="font-bold text-[26px] tabular-nums"
                style={{ color: "var(--admin-accent)" }}
              >
                <AnimatedCounter
                  value={totalPipeline}
                  duration={1000}
                  className=""
                />
              </p>
              <p
                className="text-[11px] mt-1"
                style={{ color: "var(--admin-text-muted)" }}
              >
                Across {withQuotations.length} quotations
              </p>
            </div>
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: "var(--admin-surface-2)",
                color: "var(--admin-accent)",
              }}
            >
              <TrendingUp className="h-5 w-5" />
            </span>
          </div>
        </AdminCard>

        <AdminCard className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-[10.5px] uppercase tracking-[0.18em] font-semibold mb-1"
                style={{ color: "var(--admin-text-muted)" }}
              >
                Accepted Value
              </p>
              <p
                className="font-bold text-[26px] tabular-nums"
                style={{ color: "#10B981" }}
              >
                <AnimatedCounter value={acceptedValue} duration={1000} />
              </p>
              <p
                className="text-[11px] mt-1"
                style={{ color: "var(--admin-text-muted)" }}
              >
                Won & signed
              </p>
            </div>
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: "#10B9811A",
                color: "#10B981",
              }}
            >
              <CheckCircle2 className="h-5 w-5" />
            </span>
          </div>
        </AdminCard>

        <AdminCard className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-[10.5px] uppercase tracking-[0.18em] font-semibold mb-1"
                style={{ color: "var(--admin-text-muted)" }}
              >
                Pending Response
              </p>
              <p
                className="font-bold text-[26px] tabular-nums"
                style={{ color: "#F59E0B" }}
              >
                <AnimatedCounter value={pendingValue} duration={1000} />
              </p>
              <p
                className="text-[11px] mt-1"
                style={{ color: "var(--admin-text-muted)" }}
              >
                Awaiting client decision
              </p>
            </div>
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: "#F59E0B1A",
                color: "#F59E0B",
              }}
            >
              <Calculator className="h-5 w-5" />
            </span>
          </div>
        </AdminCard>
      </div>

      {withQuotations.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<Calculator className="h-6 w-6" />}
            title="No quotations yet"
            description="Quotations are created from individual submissions."
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
          {withQuotations.map((s, i) => {
            const q = s.quotation!;
            const total = computeTotal(q);
            const colors = QUOTATION_STATUS_COLORS[q.status];
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              >
                <Link href={`/admin/submissions/${s.id}/quotation`}>
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
                          {q.id.slice(0, 18)}
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
                        {q.status}
                      </span>
                    </div>

                    {/* Items count */}
                    <div
                      className="flex items-center gap-1.5 text-[11px] mb-3"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      <Layers className="h-3 w-3" />
                      {q.items.length} line item{q.items.length === 1 ? "" : "s"}
                    </div>

                    {/* Footer */}
                    <div
                      className="pt-3 border-t flex items-center justify-between"
                      style={{ borderColor: "var(--admin-border)" }}
                    >
                      <div>
                        <p
                          className="text-[10px] uppercase tracking-wider font-medium"
                          style={{ color: "var(--admin-text-muted)" }}
                        >
                          Total
                        </p>
                        <p
                          className="font-bold text-[18px] tabular-nums"
                          style={{ color: "var(--admin-accent)" }}
                        >
                          {formatMoney(total, q.currency)}
                        </p>
                      </div>
                      <span
                        className="inline-flex items-center gap-1 text-[12px] font-medium group-hover:gap-1.5 transition-all"
                        style={{ color: "var(--admin-accent)" }}
                      >
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
