"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Receipt,
  DollarSign,
  Clock,
  AlertTriangle,
  Filter,
  Download,
  FileText,
} from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  AdminButton,
  InvoiceStatusBadge,
  PageTransition,
  PageHeader,
  EmptyState,
  AnimatedCounter,
} from "@/modules/admin/components/ui";
import type { Invoice } from "@/modules/admin/types";

const FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Paid", value: "Paid" },
  { label: "Pending", value: "Pending" },
  { label: "Overdue", value: "Overdue" },
  { label: "Draft", value: "Draft" },
];

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMoney(amount: number, currency: string): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
}

export default function InvoicesPage() {
  const { invoices } = useAdmin();
  const [filter, setFilter] = useState("all");

  const stats = useMemo(() => {
    const paid = invoices
      .filter((i) => i.status === "Paid")
      .reduce((sum, i) => sum + i.amount, 0);
    const pending = invoices
      .filter((i) => i.status === "Pending")
      .reduce((sum, i) => sum + i.amount, 0);
    const overdue = invoices
      .filter((i) => i.status === "Overdue")
      .reduce((sum, i) => sum + i.amount, 0);
    return { paid, pending, overdue };
  }, [invoices]);

  const filtered = useMemo(() => {
    if (filter === "all") return invoices;
    return invoices.filter((i) => i.status === filter);
  }, [invoices, filter]);

  function handleExport() {
    const headers = [
      "Invoice Number",
      "Client",
      "Amount",
      "Currency",
      "Status",
      "Issue Date",
      "Due Date",
    ];
    const rows = filtered.map((i) => [
      i.invoiceNumber,
      i.clientCompany,
      String(i.amount),
      i.currency,
      i.status,
      formatDate(i.issueDate),
      formatDate(i.dueDate),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${c}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mbtl_invoices_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <PageTransition>
      <PageHeader
        title="Invoices"
        description={`${invoices.length} invoice${invoices.length === 1 ? "" : "s"} issued`}
        action={
          <AdminButton
            variant="ghost"
            size="md"
            onClick={handleExport}
            icon={<Download className="h-4 w-4" />}
          >
            Export CSV
          </AdminButton>
        }
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
                Total Revenue (Paid)
              </p>
              <p
                className="font-bold text-[26px] tabular-nums"
                style={{ color: "#10B981" }}
              >
                <AnimatedCounter value={stats.paid} duration={1200} />
              </p>
              <p
                className="text-[11px] mt-1"
                style={{ color: "var(--admin-text-muted)" }}
              >
                Collected from {invoices.filter((i) => i.status === "Paid").length} invoices
              </p>
            </div>
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "#10B9811A", color: "#10B981" }}
            >
              <DollarSign className="h-5 w-5" />
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
                Pending Amount
              </p>
              <p
                className="font-bold text-[26px] tabular-nums"
                style={{ color: "#F59E0B" }}
              >
                <AnimatedCounter value={stats.pending} duration={1200} />
              </p>
              <p
                className="text-[11px] mt-1"
                style={{ color: "var(--admin-text-muted)" }}
              >
                Awaiting payment
              </p>
            </div>
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "#F59E0B1A", color: "#F59E0B" }}
            >
              <Clock className="h-5 w-5" />
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
                Overdue Amount
              </p>
              <p
                className="font-bold text-[26px] tabular-nums"
                style={{ color: "#EF4444" }}
              >
                <AnimatedCounter value={stats.overdue} duration={1200} />
              </p>
              <p
                className="text-[11px] mt-1"
                style={{ color: "var(--admin-text-muted)" }}
              >
                Requires follow-up
              </p>
            </div>
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "#EF44441A", color: "#EF4444" }}
            >
              <AlertTriangle className="h-5 w-5" />
            </span>
          </div>
        </AdminCard>
      </div>

      {/* Filter bar */}
      <div
        className="mb-4 flex items-center gap-2 overflow-x-auto rounded-xl border p-1.5"
        style={{
          background: "var(--admin-surface)",
          borderColor: "var(--admin-border)",
        }}
      >
        <span
          className="inline-flex items-center gap-1.5 pl-2 pr-1 text-[11.5px] font-medium"
          style={{ color: "var(--admin-text-muted)" }}
        >
          <Filter className="h-3.5 w-3.5" />
        </span>
        {FILTERS.map((f) => {
          const active = filter === f.value;
          const count =
            f.value === "all"
              ? invoices.length
              : invoices.filter((i) => i.status === f.value).length;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors whitespace-nowrap"
              style={{
                background: active ? "var(--admin-accent)" : "transparent",
                color: active ? "#0F172A" : "var(--admin-text-secondary)",
              }}
            >
              {f.label}
              <span
                className="inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold"
                style={{
                  background: active
                    ? "rgba(15,23,42,0.18)"
                    : "var(--admin-surface-2)",
                  color: active ? "#0F172A" : "var(--admin-text-muted)",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<Receipt className="h-6 w-6" />}
            title="No invoices found"
            description="Invoices will appear here once they are issued."
          />
        </AdminCard>
      ) : (
        <AdminCard className="overflow-hidden">
          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className="border-b"
                  style={{ borderColor: "var(--admin-border)" }}
                >
                  {[
                    "Invoice #",
                    "Client",
                    "Amount",
                    "Status",
                    "Issue Date",
                    "Due Date",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-3 px-4 text-[10.5px] uppercase tracking-wider font-semibold"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv, i) => (
                  <motion.tr
                    key={inv.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.02 }}
                    className="border-b last:border-b-0 hover:bg-[var(--admin-surface-2)] transition-colors"
                    style={{ borderColor: "var(--admin-border)" }}
                  >
                    <td className="py-3.5 px-4">
                      <span
                        className="font-mono text-[12px] font-medium"
                        style={{ color: "var(--admin-text)" }}
                      >
                        {inv.invoiceNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p
                        className="text-[13px] font-medium"
                        style={{ color: "var(--admin-text)" }}
                      >
                        {inv.clientCompany}
                      </p>
                      <p
                        className="text-[11px]"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        {inv.clientName}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className="font-semibold tabular-nums text-[13px]"
                        style={{ color: "var(--admin-text)" }}
                      >
                        {formatMoney(inv.amount, inv.currency)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <InvoiceStatusBadge status={inv.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className="text-[12px]"
                        style={{ color: "var(--admin-text-secondary)" }}
                      >
                        {formatDate(inv.issueDate)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className="text-[12px]"
                        style={{
                          color:
                            inv.status === "Overdue"
                              ? "#EF4444"
                              : "var(--admin-text-secondary)",
                        }}
                      >
                        {formatDate(inv.dueDate)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden divide-y" style={{ borderColor: "var(--admin-border)" }}>
            {filtered.map((inv) => (
              <div key={inv.id} className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p
                      className="font-mono text-[12px] font-medium"
                      style={{ color: "var(--admin-text)" }}
                    >
                      {inv.invoiceNumber}
                    </p>
                    <p
                      className="text-[13px] font-medium truncate mt-0.5"
                      style={{ color: "var(--admin-text)" }}
                    >
                      {inv.clientCompany}
                    </p>
                    <p
                      className="text-[11px] truncate"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      {inv.clientName}
                    </p>
                  </div>
                  <InvoiceStatusBadge status={inv.status} />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span
                    className="font-semibold tabular-nums text-[15px]"
                    style={{ color: "var(--admin-accent)" }}
                  >
                    {formatMoney(inv.amount, inv.currency)}
                  </span>
                  <div
                    className="text-right text-[10.5px]"
                    style={{ color: "var(--admin-text-muted)" }}
                  >
                    <p>Issued {formatDate(inv.issueDate)}</p>
                    <p
                      style={{
                        color:
                          inv.status === "Overdue"
                            ? "#EF4444"
                            : "var(--admin-text-muted)",
                      }}
                    >
                      Due {formatDate(inv.dueDate)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      )}
    </PageTransition>
  );
}
