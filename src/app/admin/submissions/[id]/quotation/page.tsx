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
  FileText,
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
    submission?.quotation?.paymentTerms ?? "40% advance, 30% on MVP, 30% on delivery"
  );
  const [taxRate, setTaxRate] = useState(submission?.quotation?.taxRate ?? 0);
  const [discount, setDiscount] = useState(submission?.quotation?.discount ?? 0);
  const [currency, setCurrency] = useState(submission?.quotation?.currency ?? "USD");
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
    }
  }

  if (!submission) {
    return (
      <PageTransition>
        <EmptyState
          title="Submission not found"
          action={
            <Link href="/admin" className="inline-flex items-center gap-1.5 rounded-xl bg-cyan text-ink font-medium text-[13px] px-4 py-2.5">
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
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

  const subtotal = items.reduce((sum, it) => sum + it.qty * it.unitPrice, 0);
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

  return (
    <PageTransition>
      <Link
        href={`/admin/submissions/${submission.id}`}
        className="inline-flex items-center gap-1.5 text-[12.5px] text-white/55 hover:text-white transition-colors mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to submission
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
              <Calculator className="h-3 w-3" />
              Quotation Builder
            </span>
            <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider ${
              status === "draft"
                ? "bg-amber-400/10 text-amber-200 border-amber-400/25"
                : status === "sent"
                ? "bg-blue-400/10 text-blue-200 border-blue-400/25"
                : status === "accepted"
                ? "bg-emerald-400/10 text-emerald-200 border-emerald-400/25"
                : "bg-rose-400/10 text-rose-200 border-rose-400/25"
            }`}>
              {status}
            </span>
          </div>
          <h1 className="mt-3 font-display text-2xl font-semibold text-white tracking-tight">
            {submission.projectName}
          </h1>
          <p className="mt-1.5 text-[13px] text-white/55">
            Total:{" "}
            <span className="text-white font-medium">
              {formatMoney(total, currency)}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
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
              <div className="hidden sm:grid grid-cols-[1.5fr_2fr_60px_100px_100px_40px] gap-2 px-1 pb-2 text-[10.5px] uppercase tracking-wider text-white/40">
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
                    className="grid grid-cols-1 sm:grid-cols-[1.5fr_2fr_60px_100px_100px_40px] gap-2 items-center bg-white/[0.02] rounded-lg p-2"
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
                        updateItem(item.id, { qty: Math.max(1, Number(e.target.value) || 1) })
                      }
                      className="text-[12px] py-1.5 text-center"
                    />
                    <AdminInput
                      type="number"
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(item.id, { unitPrice: Number(e.target.value) || 0 })
                      }
                      className="text-[12px] py-1.5 text-right"
                    />
                    <span className="text-[12.5px] text-white text-right font-medium tabular-nums">
                      {formatMoney(item.qty * item.unitPrice, currency)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-white/40 hover:text-rose-300 hover:bg-rose-400/10 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button
                onClick={addItem}
                className="w-full rounded-lg border border-dashed border-white/15 py-3 text-[12.5px] text-white/55 hover:border-cyan/40 hover:bg-cyan/[0.04] hover:text-cyan-soft transition-all inline-flex items-center justify-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Line Item
              </button>
            </div>
          </AdminCard>

          {/* Sidebar: terms + summary */}
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
                    <label className="block text-[11px] text-white/50 mb-1">
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
                    <label className="block text-[11px] text-white/50 mb-1">
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
                    <label className="block text-[11px] text-white/50 mb-1">
                      Discount (%)
                    </label>
                    <AdminInput
                      type="number"
                      min={0}
                      max={100}
                      value={discount}
                      onChange={(e) => setDiscount(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                      className="text-[12px] py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-white/50 mb-1">
                      Tax Rate (%)
                    </label>
                    <AdminInput
                      type="number"
                      min={0}
                      max={100}
                      value={taxRate}
                      onChange={(e) => setTaxRate(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                      className="text-[12px] py-1.5"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-white/8 space-y-1.5">
                  <div className="flex justify-between text-[12px]">
                    <span className="text-white/55">Subtotal</span>
                    <span className="text-white tabular-nums">
                      {formatMoney(subtotal, currency)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[12px]">
                      <span className="text-white/55">Discount ({discount}%)</span>
                      <span className="text-emerald-300 tabular-nums">
                        −{formatMoney(discountAmount, currency)}
                      </span>
                    </div>
                  )}
                  {taxRate > 0 && (
                    <div className="flex justify-between text-[12px]">
                      <span className="text-white/55">Tax ({taxRate}%)</span>
                      <span className="text-amber-200 tabular-nums">
                        +{formatMoney(taxAmount, currency)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-white/8">
                    <span className="font-display text-[14px] font-semibold text-white">
                      Total
                    </span>
                    <span className="font-display text-[16px] font-bold text-cyan tabular-nums">
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
        <AdminCard strong className="p-8 sm:p-12 max-w-3xl mx-auto">
          {/* Invoice-style preview */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b border-white/10">
            <div>
              <p className="font-display text-[12px] uppercase tracking-[0.22em] text-cyan-soft/70">
                MB Tech Labs
              </p>
              <h1 className="mt-2 font-display text-2xl font-semibold text-white">
                Quotation
              </h1>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-white/40">Date</p>
              <p className="text-[13px] text-white">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-[11px] text-white/40 mt-2">Valid Until</p>
              <p className="text-[13px] text-white">
                {new Date(validUntil).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-[11px] text-white/40">Prepared for</p>
            <p className="text-[14px] font-medium text-white mt-0.5">
              {submission.client.fullName}
            </p>
            <p className="text-[12.5px] text-white/60">
              {submission.client.company}
            </p>
            <p className="text-[12px] text-white/45">{submission.client.email}</p>
          </div>

          <div className="mb-6">
            <p className="text-[11px] text-white/40">Project</p>
            <p className="text-[14px] font-medium text-white mt-0.5">
              {submission.projectName}
            </p>
          </div>

          {/* Items table */}
          <table className="w-full text-left mb-6">
            <thead>
              <tr className="border-b border-white/10 text-[10.5px] uppercase tracking-wider text-white/40">
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
                  className="border-b border-white/5 text-[12.5px]"
                >
                  <td className="py-3">
                    <p className="text-white/85">{item.description}</p>
                    <p className="text-[10.5px] text-cyan-soft/60 uppercase tracking-wider mt-0.5">
                      {item.category}
                    </p>
                  </td>
                  <td className="py-3 text-center text-white/65 tabular-nums">
                    {item.qty}
                  </td>
                  <td className="py-3 text-right text-white/65 tabular-nums">
                    {formatMoney(item.unitPrice, currency)}
                  </td>
                  <td className="py-3 text-right text-white tabular-nums font-medium">
                    {formatMoney(item.qty * item.unitPrice, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="ml-auto w-full max-w-xs space-y-1.5">
            <div className="flex justify-between text-[12.5px]">
              <span className="text-white/55">Subtotal</span>
              <span className="text-white tabular-nums">
                {formatMoney(subtotal, currency)}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[12.5px]">
                <span className="text-white/55">Discount ({discount}%)</span>
                <span className="text-emerald-300 tabular-nums">
                  −{formatMoney(discountAmount, currency)}
                </span>
              </div>
            )}
            {taxRate > 0 && (
              <div className="flex justify-between text-[12.5px]">
                <span className="text-white/55">Tax ({taxRate}%)</span>
                <span className="text-amber-200 tabular-nums">
                  +{formatMoney(taxAmount, currency)}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-white/10">
              <span className="font-display text-[15px] font-semibold text-white">
                Total
              </span>
              <span className="font-display text-[17px] font-bold text-cyan tabular-nums">
                {formatMoney(total, currency)}
              </span>
            </div>
          </div>

          {/* Terms + notes */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-white/40 mb-1">
                Payment Terms
              </p>
              <p className="text-[12.5px] text-white/75 leading-relaxed">
                {paymentTerms}
              </p>
            </div>
            {notes && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-white/40 mb-1">
                  Notes
                </p>
                <p className="text-[12.5px] text-white/75 leading-relaxed">
                  {notes}
                </p>
              </div>
            )}
          </div>
        </AdminCard>
      )}

      {savedAt && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-[11.5px] text-cyan-soft/70 flex items-center gap-1.5"
        >
          <Check className="h-3 w-3" />
          Saved {new Date(savedAt).toLocaleTimeString()}
        </motion.p>
      )}
    </PageTransition>
  );
}
