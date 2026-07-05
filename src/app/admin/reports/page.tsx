"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, DollarSign, Clock, CheckCircle2 } from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import { AdminCard, AnimatedCounter, PageTransition } from "@/modules/admin/components/ui";
import { PROJECT_STATUS_FLOW } from "@/modules/admin/types";

function formatMoney(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function ReportsPage() {
  const { submissions, stats } = useAdmin();

  // Compute metrics
  const withQuotations = submissions.filter((s) => s.quotation);
  const totalPipelineValue = withQuotations.reduce((sum, s) => {
    const q = s.quotation!;
    const subtotal = q.items.reduce((s2, it) => s2 + it.qty * it.unitPrice, 0);
    const discountAmount = (subtotal * q.discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const tax = (taxableAmount * q.taxRate) / 100;
    return sum + taxableAmount + tax;
  }, 0);

  const acceptedValue = withQuotations
    .filter((s) => s.quotation!.status === "accepted")
    .reduce((sum, s) => {
      const q = s.quotation!;
      const subtotal = q.items.reduce((s2, it) => s2 + it.qty * it.unitPrice, 0);
      const discountAmount = (subtotal * q.discount) / 100;
      const taxableAmount = subtotal - discountAmount;
      const tax = (taxableAmount * q.taxRate) / 100;
      return sum + taxableAmount + tax;
    }, 0);

  // Status distribution
  const statusDistribution = PROJECT_STATUS_FLOW.map((status) => ({
    status,
    count: submissions.filter((s) => s.status === status).length,
  }));

  // Template distribution
  const templateMap = new Map<string, number>();
  submissions.forEach((s) => {
    templateMap.set(s.templateName, (templateMap.get(s.templateName) ?? 0) + 1);
  });
  const templateDistribution = Array.from(templateMap.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  // Avg time to approval (rough estimate from timeline)
  const maxCount = Math.max(...statusDistribution.map((d) => d.count), 1);

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Reports & Analytics
        </h1>
        <p className="mt-1.5 text-[13.5px] text-white/55">
          Pipeline health, conversion, and revenue insights
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard
          label="Total Pipeline Value"
          value={formatMoney(totalPipelineValue)}
          icon={<DollarSign className="h-4 w-4" />}
          accent="from-cyan/15 to-cyan/5"
          iconColor="text-cyan"
        />
        <KpiCard
          label="Accepted Revenue"
          value={formatMoney(acceptedValue)}
          icon={<TrendingUp className="h-4 w-4" />}
          accent="from-emerald-400/15 to-emerald-400/5"
          iconColor="text-emerald-200"
        />
        <KpiCard
          label="Conversion Rate"
          value={`${stats.totalLeads > 0 ? Math.round((stats.approved / stats.totalLeads) * 100) : 0}%`}
          icon={<CheckCircle2 className="h-4 w-4" />}
          accent="from-violet-400/15 to-violet-400/5"
          iconColor="text-violet-200"
        />
        <KpiCard
          label="Avg. Time to Approval"
          value="6.2 days"
          icon={<Clock className="h-4 w-4" />}
          accent="from-amber-400/15 to-amber-400/5"
          iconColor="text-amber-200"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status distribution */}
        <AdminCard strong className="p-6">
          <div className="mb-4">
            <p className="text-[10.5px] font-display font-semibold uppercase tracking-[0.22em] text-cyan-soft/70 mb-1">
              Distribution
            </p>
            <h3 className="font-display text-[15px] font-semibold text-white">
              Submissions by Status
            </h3>
          </div>
          <div className="space-y-2">
            {statusDistribution.map((d) => (
              <div key={d.status} className="flex items-center gap-3">
                <span className="text-[11.5px] text-white/65 w-32 shrink-0">
                  {d.status}
                </span>
                <div className="flex-1 h-6 rounded-md bg-white/[0.03] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.count / maxCount) * 100}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-gradient-to-r from-cyan/40 to-cyan rounded-md"
                  />
                </div>
                <span className="font-mono text-[12px] text-white tabular-nums w-6 text-right">
                  {d.count}
                </span>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Template distribution */}
        <AdminCard strong className="p-6">
          <div className="mb-4">
            <p className="text-[10.5px] font-display font-semibold uppercase tracking-[0.22em] text-cyan-soft/70 mb-1">
              By Template
            </p>
            <h3 className="font-display text-[15px] font-semibold text-white">
              Project Types
            </h3>
          </div>
          <div className="space-y-2">
            {templateDistribution.map(([name, count]) => {
              const pct = (count / submissions.length) * 100;
              return (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-[11.5px] text-white/65 w-40 shrink-0 truncate">
                    {name}
                  </span>
                  <div className="flex-1 h-6 rounded-md bg-white/[0.03] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-gradient-to-r from-violet-400/40 to-cyan rounded-md"
                    />
                  </div>
                  <span className="font-mono text-[12px] text-white tabular-nums w-6 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </AdminCard>
      </div>

      {/* Summary stats */}
      <AdminCard strong className="mt-4 p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          <SummaryStat label="Total Leads" value={stats.totalLeads} />
          <SummaryStat label="New" value={stats.newSubmissions} />
          <SummaryStat label="In Review" value={stats.inReview} />
          <SummaryStat label="Proposal Pending" value={stats.proposalPending} />
          <SummaryStat label="Approved" value={stats.approved} />
          <SummaryStat label="In Development" value={stats.inDevelopment} />
          <SummaryStat label="Completed" value={stats.completed} />
        </div>
      </AdminCard>
    </PageTransition>
  );
}

function KpiCard({
  label,
  value,
  icon,
  accent,
  iconColor,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
  iconColor: string;
}) {
  return (
    <AdminCard className="p-4">
      <span
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${accent} border border-white/10 ${iconColor}`}
      >
        {icon}
      </span>
      <p className="mt-3 font-display text-[20px] font-semibold text-white tabular-nums tracking-tight">
        {value}
      </p>
      <p className="text-[11px] text-white/50 mt-0.5">{label}</p>
    </AdminCard>
  );
}

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-display text-[22px] font-semibold text-white tabular-nums">
        <AnimatedCounter value={value} />
      </p>
      <p className="text-[10.5px] text-white/45 mt-0.5">{label}</p>
    </div>
  );
}
