"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Calculator,
  Save,
  Eye,
  Download,
  Printer,
} from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  SectionTitle,
  PageTransition,
  EmptyState,
} from "@/modules/admin/components/ui";
import { generateId } from "@/modules/admin/services/storage";
import type { Quotation, QuotationLineItem } from "@/modules/admin/types";

const DEFAULT_ITEMS: { category: string; description: string }[] = [
  { category: "UI/UX", description: "UI/UX Design" },
  { category: "Frontend", description: "Frontend Development" },
  { category: "Backend", description: "Backend Development" },
  { category: "Testing", description: "QA & Testing" },
  { category: "Deployment", description: "Deployment & DevOps" },
  { category: "Hosting", description: "Hosting (annual)" },
  { category: "Maintenance", description: "Maintenance & Support (annual)" },
  { category: "Third-party APIs", description: "Third-party APIs & Licenses" },
];

const CATEGORIES = [
  "UI/UX",
  "Frontend",
  "Backend",
  "Testing",
  "Deployment",
  "Hosting",
  "Maintenance",
  "Third-party APIs",
  "Other",
];

const CURRENCIES = ["USD", "INR", "EUR", "GBP", "AED"];

const STATUS_COLORS: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  draft: { bg: "#F59E0B1A", border: "#F59E0B40", text: "#F59E0B" },
  sent: { bg: "#3B82F61A", border: "#3B82F640", text: "#3B82F6" },
  accepted: { bg: "#10B9811A", border: "#10B98140", text: "#10B981" },
  rejected: { bg: "#EF44441A", border: "#EF444440", text: "#EF4444" },
};

function formatMoney(amount: number, currency: string): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function QuotationBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { submissions, updateQuotation } = useAdmin();
  const submission = useMemo(
    () => submissions.find((s) => s.id === id || s.sessionId === id),
    [submissions, id]
  );

  const [items, setItems] = useState<QuotationLineItem[]>(() => {
    if (submission?.quotation) return submission.quotation.items;
    return DEFAULT_ITEMS.map((d) => ({
      id: generateId("li"),
      category: d.category,
      description: d.description,
      qty: 1,
      unitPrice: 0,
    }));
  });
  const [paymentTerms, setPaymentTerms] = useState(
    submission?.quotation?.paymentTerms ??
      "40% advance, 30% on MVP, 30% on delivery"
  );
  const [taxRate, setTaxRate] = useState(submission?.quotation?.taxRate ?? 0);
  const [discount, setDiscount] = useState(submission?.quotation?.discount ?? 0);
  const [currency, setCurrency] = useState(
    submission?.quotation?.currency ?? "USD"
  );
  const [validUntil, setValidUntil] = useState(
    submission?.quotation?.validUntil ??
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState(submission?.quotation?.notes ?? "");
  const [status, setStatus] = useState<Quotation["status"]>(
    submission?.quotation?.status ?? "draft"
  );
  const [showPreview, setShowPreview] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [initId, setInitId] = useState<string | undefined>(submission?.id);

  // Re-initialize when submission ID changes
  if (submission && submission.id !== initId) {
    setInitId(submission.id);
    if (submission.quotation) {
      const q = submission.quotation;
      setItems(q.items);
      setPaymentTerms(q.paymentTerms);
      setTaxRate(q.taxRate);
      setDiscount(q.discount);
      setCurrency(q.currency);
      setValidUntil(q.validUntil);
      setNotes(q.notes);
      setStatus(q.status);
    } else {
      setItems(
        DEFAULT_ITEMS.map((d) => ({
          id: generateId("li"),
          category: d.category,
          description: d.description,
          qty: 1,
          unitPrice: 0,
        }))
      );
      setStatus("draft");
    }
  }

  if (!submission) {
    return (
      <PageTransition>
        <EmptyState
          icon={<Calculator className="h-6 w-6" />}
          title="Submission not found"
          description="This submission may have been removed."
          action={
            <Link href="/admin/quotations">
              <AdminButton variant="primary" size="sm" icon={<ArrowLeft className="h-3.5 w-3.5" />}>
                Back to quotations
              </AdminButton>
            </Link>
          }
        />
      </PageTransition>
    );
  }

  function updateItem(itemId: string, patch: Partial<QuotationLineItem>) {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, ...patch } : it))
    );
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        id: generateId("li"),
        category: "Other",
        description: "New line item",
        qty: 1,
        unitPrice: 0,
      },
    ]);
  }

  function removeItem(itemId: string) {
    setItems((prev) => prev.filter((it) => it.id !== itemId));
  }

  const subtotal = items.reduce(
    (sum, it) => sum + it.qty * it.unitPrice,
    0
  );
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  function handleSave(newStatus?: Quotation["status"]) {
    if (!submission) return;
    const quotation: Quotation = {
      id: submission.quotation?.id ?? generateId("quot"),
      createdAt: submission.quotation?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
      status: newStatus ?? status,
      items,
      paymentTerms,
      taxRate,
      discount,
      currency,
      validUntil,
      notes,
    };
    updateQuotation(submission.id, quotation);
    if (newStatus) setStatus(newStatus);
    setSavedAt(Date.now());
  }

  function handleDownload() {
    setShowPreview(true);
    setTimeout(() => window.print(), 400);
  }

  const statusColors = STATUS_COLORS[status];

  return (
    <PageTransition>
      <Link
        href={`/admin/submissions/${submission.id}`}
        className="inline-flex items-center gap-1.5 text-[12.5px] mb-4 transition-opacity hover:opacity-80"
        style={{ color: "var(--admin-text-secondary)" }}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to submission
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.18em]"
              style={{
                background: "var(--admin-surface-2)",
                borderColor: "var(--admin-border)",
                color: "var(--admin-accent)",
              }}
            >
              <Calculator className="h-3 w-3" />
              Quotation Builder
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider"
              style={{
                background: statusColors.bg,
                borderColor: statusColors.border,
                color: statusColors.text,
              }}
            >
              {status}
            </span>
          </div>
          <h1
            className="font-bold text-2xl sm:text-3xl tracking-tight"
            style={{ color: "var(--admin-text)" }}
          >
            {submission.projectName}
          </h1>
          <p
            className="mt-1.5 text-[13px]"
            style={{ color: "var(--admin-text-secondary)" }}
          >
            Total:{" "}
            <span
              className="font-semibold"
              style={{ color: "var(--admin-text)" }}
            >
              {formatMoney(total, currency)}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap print:hidden">
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            icon={<Download className="h-3.5 w-3.5" />}
          >
            PDF
          </AdminButton>
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview((v) => !v)}
            icon={<Eye className="h-3.5 w-3.5" />}
          >
            {showPreview ? "Edit" : "Preview"}
          </AdminButton>
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={() => handleSave()}
            icon={<Save className="h-3.5 w-3.5" />}
          >
            Save Draft
          </AdminButton>
          <AdminButton
            variant="primary"
            size="sm"
            onClick={() => handleSave("sent")}
            icon={<Check className="h-3.5 w-3.5" />}
          >
            Mark as Sent
          </AdminButton>
        </div>
      </div>

      {!showPreview ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
          {/* Line items */}
          <AdminCard className="p-5">
            <SectionTitle title="Line Items" />
            <div className="space-y-2">
              {/* Header */}
              <div
                className="hidden sm:grid grid-cols-[1.5fr_2fr_60px_100px_100px_40px] gap-2 px-1 pb-2 text-[10.5px] uppercase tracking-wider font-medium"
                style={{ color: "var(--admin-text-muted)" }}
              >
                <span>Category</span>
                <span>Description</span>
                <span className="text-center">Qty</span>
                <span className="text-right">Unit Price</span>
                <span className="text-right">Amount</span>
                <span></span>
              </div>
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="grid grid-cols-1 sm:grid-cols-[1.5fr_2fr_60px_100px_100px_40px] gap-2 items-center rounded-lg p-2"
                    style={{ background: "var(--admin-surface-2)" }}
                  >
                    <AdminSelect
                      value={item.category}
                      onChange={(e) =>
                        updateItem(item.id, { category: e.target.value })
                      }
                      options={CATEGORIES.map((c) => ({ label: c, value: c }))}
                      className="text-[12px] py-1.5"
                    />
                    <AdminInput
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, { description: e.target.value })
                      }
                      className="text-[12px] py-1.5"
                    />
                    <AdminInput
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) =>
                        updateItem(item.id, {
                          qty: Math.max(1, Number(e.target.value) || 1),
                        })
                      }
                      className="text-[12px] py-1.5 text-center"
                    />
                    <AdminInput
                      type="number"
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(item.id, {
                          unitPrice: Number(e.target.value) || 0,
                        })
                      }
                      className="text-[12px] py-1.5 text-right"
                    />
                    <span
                      className="text-[12.5px] text-right font-medium tabular-nums"
                      style={{ color: "var(--admin-text)" }}
                    >
                      {formatMoney(item.qty * item.unitPrice, currency)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md transition-all hover:opacity-80"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button
                onClick={addItem}
                className="w-full rounded-lg border border-dashed py-3 text-[12.5px] transition-all inline-flex items-center justify-center gap-1.5 hover:opacity-90"
                style={{
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text-secondary)",
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                Add Line Item
              </button>
            </div>
          </AdminCard>

          {/* Sidebar */}
          <div className="space-y-4">
            <AdminCard className="p-5">
              <SectionTitle title="Payment Terms" />
              <AdminTextarea
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="min-h-[80px] text-[12.5px]"
              />
            </AdminCard>

            <AdminCard className="p-5">
              <SectionTitle title="Summary" />
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      className="block text-[11px] mb-1"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      Currency
                    </label>
                    <AdminSelect
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      options={CURRENCIES.map((c) => ({ label: c, value: c }))}
                      className="text-[12px] py-1.5"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-[11px] mb-1"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      Valid Until
                    </label>
                    <AdminInput
                      type="date"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      className="text-[12px] py-1.5"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-[11px] mb-1"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      Discount (%)
                    </label>
                    <AdminInput
                      type="number"
                      min={0}
                      max={100}
                      value={discount}
                      onChange={(e) =>
                        setDiscount(
                          Math.max(0, Math.min(100, Number(e.target.value) || 0))
                        )
                      }
                      className="text-[12px] py-1.5"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-[11px] mb-1"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      Tax Rate (%)
                    </label>
                    <AdminInput
                      type="number"
                      min={0}
                      max={100}
                      value={taxRate}
                      onChange={(e) =>
                        setTaxRate(
                          Math.max(0, Math.min(100, Number(e.target.value) || 0))
                        )
                      }
                      className="text-[12px] py-1.5"
                    />
                  </div>
                </div>

                <div
                  className="pt-3 border-t space-y-1.5"
                  style={{ borderColor: "var(--admin-border)" }}
                >
                  <div className="flex justify-between text-[12px]">
                    <span style={{ color: "var(--admin-text-secondary)" }}>
                      Subtotal
                    </span>
                    <span
                      className="tabular-nums"
                      style={{ color: "var(--admin-text)" }}
                    >
                      {formatMoney(subtotal, currency)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[12px]">
                      <span style={{ color: "var(--admin-text-secondary)" }}>
                        Discount ({discount}%)
                      </span>
                      <span
                        className="tabular-nums"
                        style={{ color: "#10B981" }}
                      >
                        −{formatMoney(discountAmount, currency)}
                      </span>
                    </div>
                  )}
                  {taxRate > 0 && (
                    <div className="flex justify-between text-[12px]">
                      <span style={{ color: "var(--admin-text-secondary)" }}>
                        Tax ({taxRate}%)
                      </span>
                      <span
                        className="tabular-nums"
                        style={{ color: "#F59E0B" }}
                      >
                        +{formatMoney(taxAmount, currency)}
                      </span>
                    </div>
                  )}
                  <div
                    className="flex justify-between pt-2 border-t"
                    style={{ borderColor: "var(--admin-border)" }}
                  >
                    <span
                      className="font-semibold text-[14px]"
                      style={{ color: "var(--admin-text)" }}
                    >
                      Total
                    </span>
                    <span
                      className="font-bold text-[16px] tabular-nums"
                      style={{ color: "var(--admin-accent)" }}
                    >
                      {formatMoney(total, currency)}
                    </span>
                  </div>
                </div>
              </div>
            </AdminCard>

            <AdminCard className="p-5">
              <SectionTitle title="Notes" />
              <AdminTextarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes for the client..."
                className="min-h-[80px] text-[12.5px]"
              />
            </AdminCard>
          </div>
        </div>
      ) : (
        <AdminCard
          strong
          className="p-8 sm:p-12 max-w-3xl mx-auto print:border-none print:shadow-none"
        >
          {/* Invoice-style preview */}
          <div
            className="flex items-start justify-between mb-8 pb-6 border-b"
            style={{ borderColor: "var(--admin-border)" }}
          >
            <div>
              <p
                className="font-semibold text-[12px] uppercase tracking-[0.22em]"
                style={{ color: "var(--admin-accent)" }}
              >
                MB Tech Labs
              </p>
              <h1
                className="mt-2 font-bold text-2xl"
                style={{ color: "var(--admin-text)" }}
              >
                Quotation
              </h1>
            </div>
            <div className="text-right">
              <p
                className="text-[11px]"
                style={{ color: "var(--admin-text-muted)" }}
              >
                Date
              </p>
              <p
                className="text-[13px]"
                style={{ color: "var(--admin-text)" }}
              >
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p
                className="text-[11px] mt-2"
                style={{ color: "var(--admin-text-muted)" }}
              >
                Valid Until
              </p>
              <p
                className="text-[13px]"
                style={{ color: "var(--admin-text)" }}
              >
                {new Date(validUntil).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p
              className="text-[11px]"
              style={{ color: "var(--admin-text-muted)" }}
            >
              Prepared for
            </p>
            <p
              className="text-[14px] font-medium mt-0.5"
              style={{ color: "var(--admin-text)" }}
            >
              {submission.client.fullName}
            </p>
            <p
              className="text-[12.5px]"
              style={{ color: "var(--admin-text-secondary)" }}
            >
              {submission.client.company}
            </p>
            <p
              className="text-[12px]"
              style={{ color: "var(--admin-text-muted)" }}
            >
              {submission.client.email}
            </p>
          </div>

          <div className="mb-6">
            <p
              className="text-[11px]"
              style={{ color: "var(--admin-text-muted)" }}
            >
              Project
            </p>
            <p
              className="text-[14px] font-medium mt-0.5"
              style={{ color: "var(--admin-text)" }}
            >
              {submission.projectName}
            </p>
          </div>

          {/* Items table */}
          <table className="w-full text-left mb-6">
            <thead>
              <tr
                className="border-b text-[10.5px] uppercase tracking-wider"
                style={{
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text-muted)",
                }}
              >
                <th className="py-2 font-medium">Description</th>
                <th className="py-2 font-medium text-center w-12">Qty</th>
                <th className="py-2 font-medium text-right w-24">Unit Price</th>
                <th className="py-2 font-medium text-right w-28">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b text-[12.5px]"
                  style={{ borderColor: "var(--admin-border)" }}
                >
                  <td className="py-3">
                    <p style={{ color: "var(--admin-text)" }}>
                      {item.description}
                    </p>
                    <p
                      className="text-[10.5px] uppercase tracking-wider mt-0.5"
                      style={{ color: "var(--admin-accent)" }}
                    >
                      {item.category}
                    </p>
                  </td>
                  <td
                    className="py-3 text-center tabular-nums"
                    style={{ color: "var(--admin-text-secondary)" }}
                  >
                    {item.qty}
                  </td>
                  <td
                    className="py-3 text-right tabular-nums"
                    style={{ color: "var(--admin-text-secondary)" }}
                  >
                    {formatMoney(item.unitPrice, currency)}
                  </td>
                  <td
                    className="py-3 text-right tabular-nums font-medium"
                    style={{ color: "var(--admin-text)" }}
                  >
                    {formatMoney(item.qty * item.unitPrice, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="ml-auto w-full max-w-xs space-y-1.5">
            <div className="flex justify-between text-[12.5px]">
              <span style={{ color: "var(--admin-text-secondary)" }}>
                Subtotal
              </span>
              <span
                className="tabular-nums"
                style={{ color: "var(--admin-text)" }}
              >
                {formatMoney(subtotal, currency)}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[12.5px]">
                <span style={{ color: "var(--admin-text-secondary)" }}>
                  Discount ({discount}%)
                </span>
                <span className="tabular-nums" style={{ color: "#10B981" }}>
                  −{formatMoney(discountAmount, currency)}
                </span>
              </div>
            )}
            {taxRate > 0 && (
              <div className="flex justify-between text-[12.5px]">
                <span style={{ color: "var(--admin-text-secondary)" }}>
                  Tax ({taxRate}%)
                </span>
                <span className="tabular-nums" style={{ color: "#F59E0B" }}>
                  +{formatMoney(taxAmount, currency)}
                </span>
              </div>
            )}
            <div
              className="flex justify-between pt-2 border-t"
              style={{ borderColor: "var(--admin-border)" }}
            >
              <span
                className="font-semibold text-[15px]"
                style={{ color: "var(--admin-text)" }}
              >
                Total
              </span>
              <span
                className="font-bold text-[17px] tabular-nums"
                style={{ color: "var(--admin-accent)" }}
              >
                {formatMoney(total, currency)}
              </span>
            </div>
          </div>

          {/* Terms + notes */}
          <div
            className="mt-8 pt-6 border-t space-y-4"
            style={{ borderColor: "var(--admin-border)" }}
          >
            <div>
              <p
                className="text-[11px] uppercase tracking-wider mb-1 font-medium"
                style={{ color: "var(--admin-text-muted)" }}
              >
                Payment Terms
              </p>
              <p
                className="text-[12.5px] leading-relaxed"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                {paymentTerms}
              </p>
            </div>
            {notes && (
              <div>
                <p
                  className="text-[11px] uppercase tracking-wider mb-1 font-medium"
                  style={{ color: "var(--admin-text-muted)" }}
                >
                  Notes
                </p>
                <p
                  className="text-[12.5px] leading-relaxed"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  {notes}
                </p>
              </div>
            )}
          </div>

          <div
            className="mt-10 pt-6 border-t flex items-center justify-between text-[11px]"
            style={{
              borderColor: "var(--admin-border)",
              color: "var(--admin-text-muted)",
            }}
          >
            <span>MB Tech Labs · Confidential</span>
            <span>
              Generated{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </AdminCard>
      )}

      {savedAt && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-[11.5px] flex items-center gap-1.5 print:hidden"
          style={{ color: "var(--admin-accent)" }}
        >
          <Check className="h-3 w-3" />
          Saved {new Date(savedAt).toLocaleTimeString()}
        </motion.p>
      )}

      <div className="print:hidden mt-4">
        <AdminButton
          variant="outline"
          size="sm"
          onClick={handleDownload}
          icon={<Printer className="h-3.5 w-3.5" />}
        >
          Print / Save as PDF
        </AdminButton>
      </div>
    </PageTransition>
  );
}
