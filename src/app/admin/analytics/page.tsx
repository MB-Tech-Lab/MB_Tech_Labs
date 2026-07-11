"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, DollarSign, Target, PieChart } from "lucide-react";
import {
  AdminCard,
  PageTransition,
  EmptyState,
  Skeleton,
  PageHeader,
  AnimatedCounter,
} from "@/modules/admin/components/ui";
import { analyticsApi, type AnalyticsData } from "@/lib/api/analytics";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    analyticsApi.get()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const maxRevenue = data ? Math.max(...data.monthlyRevenue.map((m) => m.revenue), 1) : 1;
  const maxProjectTypes = data ? Math.max(...data.projectTypes.map((p) => p.count), 1) : 1;
  const maxIndustries = data ? Math.max(...data.industryDistribution.map((i) => i.count), 1) : 1;

  return (
    <PageTransition>
      <PageHeader title="Analytics" description="Real business insights from your database" />

      {error && <div className="mb-5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-[13px] text-rose-200">{error}</div>}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <AdminCard className="p-4">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan/10 border border-white/10 text-cyan">
            <Target className="h-4 w-4" />
          </span>
          <p className="mt-3 font-display text-[24px] font-semibold text-white tabular-nums">
            {loading ? <Skeleton className="h-6 w-12" /> : <AnimatedCounter value={data?.leadConversion.total || 0} />}
          </p>
          <p className="text-[11px] text-white/50">Total Leads</p>
        </AdminCard>
        <AdminCard className="p-4">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 border border-white/10 text-emerald-200">
            <TrendingUp className="h-4 w-4" />
          </span>
          <p className="mt-3 font-display text-[24px] font-semibold text-white tabular-nums">
            {loading ? <Skeleton className="h-6 w-12" /> : `${data?.leadConversion.rate || 0}%`}
          </p>
          <p className="text-[11px] text-white/50">Conversion Rate</p>
        </AdminCard>
        <AdminCard className="p-4">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10 border border-white/10 text-amber-200">
            <DollarSign className="h-4 w-4" />
          </span>
          <p className="mt-3 font-display text-[24px] font-semibold text-white tabular-nums">
            {loading ? <Skeleton className="h-6 w-16" /> : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(data?.monthlyRevenue.reduce((s, m) => s + m.revenue, 0) || 0)}
          </p>
          <p className="text-[11px] text-white/50">Revenue (12mo)</p>
        </AdminCard>
        <AdminCard className="p-4">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/10 border border-white/10 text-violet-200">
            <BarChart3 className="h-4 w-4" />
          </span>
          <p className="mt-3 font-display text-[24px] font-semibold text-white tabular-nums">
            {loading ? <Skeleton className="h-6 w-12" /> : <AnimatedCounter value={data?.leadConversion.approved || 0} />}
          </p>
          <p className="text-[11px] text-white/50">Approved Leads</p>
        </AdminCard>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AdminCard className="p-5"><Skeleton className="h-64 w-full" /></AdminCard>
          <AdminCard className="p-5"><Skeleton className="h-64 w-full" /></AdminCard>
        </div>
      ) : !data || (data.leadConversion.total === 0 && data.monthlyRevenue.every((m) => m.revenue === 0)) ? (
        <AdminCard>
          <EmptyState
            icon={<PieChart className="h-6 w-6" />}
            title="No Analytics Available"
            description="Analytics will appear here once you have SRG submissions, projects, and payments in the database."
          />
        </AdminCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Monthly Revenue */}
          <AdminCard className="p-5">
            <h3 className="font-display text-[14px] font-semibold text-white mb-4">Monthly Revenue</h3>
            <div className="flex items-end gap-1.5 h-40">
              {data.monthlyRevenue.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-white/[0.03] rounded-t-md overflow-hidden flex-1 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-cyan/40 to-cyan rounded-t-md transition-all"
                      style={{ height: `${(m.revenue / maxRevenue) * 100}%`, minHeight: m.revenue > 0 ? "4px" : "0" }}
                    />
                  </div>
                  <span className="text-[9px] text-white/40">{m.month}</span>
                </div>
              ))}
            </div>
          </AdminCard>

          {/* Projects by Status */}
          <AdminCard className="p-5">
            <h3 className="font-display text-[14px] font-semibold text-white mb-4">Projects by Status</h3>
            <div className="space-y-2">
              {data.projectsByStatus.length === 0 ? (
                <p className="text-[12px] text-white/40 py-4 text-center">No projects yet</p>
              ) : (
                data.projectsByStatus.map((p) => (
                  <div key={p.status} className="flex items-center gap-3">
                    <span className="text-[11px] text-white/65 w-28 shrink-0">{p.status}</span>
                    <div className="flex-1 h-5 rounded-md bg-white/[0.03] overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan/40 to-cyan rounded-md" style={{ width: `${(p.count / Math.max(...data.projectsByStatus.map((s) => s.count), 1)) * 100}%` }} />
                    </div>
                    <span className="font-mono text-[11px] text-white w-6 text-right">{p.count}</span>
                  </div>
                ))
              )}
            </div>
          </AdminCard>

          {/* Project Types */}
          <AdminCard className="p-5">
            <h3 className="font-display text-[14px] font-semibold text-white mb-4">Project Types</h3>
            <div className="space-y-2">
              {data.projectTypes.length === 0 ? (
                <p className="text-[12px] text-white/40 py-4 text-center">No SRG submissions yet</p>
              ) : (
                data.projectTypes.map((p) => (
                  <div key={p.type} className="flex items-center gap-3">
                    <span className="text-[11px] text-white/65 w-40 shrink-0 truncate">{p.type}</span>
                    <div className="flex-1 h-5 rounded-md bg-white/[0.03] overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-400/40 to-cyan rounded-md" style={{ width: `${(p.count / maxProjectTypes) * 100}%` }} />
                    </div>
                    <span className="font-mono text-[11px] text-white w-6 text-right">{p.count}</span>
                  </div>
                ))
              )}
            </div>
          </AdminCard>

          {/* Industry Distribution */}
          <AdminCard className="p-5">
            <h3 className="font-display text-[14px] font-semibold text-white mb-4">Industry Distribution</h3>
            <div className="space-y-2">
              {data.industryDistribution.length === 0 ? (
                <p className="text-[12px] text-white/40 py-4 text-center">No clients yet</p>
              ) : (
                data.industryDistribution.map((i) => (
                  <div key={i.industry} className="flex items-center gap-3">
                    <span className="text-[11px] text-white/65 w-40 shrink-0 truncate">{i.industry}</span>
                    <div className="flex-1 h-5 rounded-md bg-white/[0.03] overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400/40 to-cyan rounded-md" style={{ width: `${(i.count / maxIndustries) * 100}%` }} />
                    </div>
                    <span className="font-mono text-[11px] text-white w-6 text-right">{i.count}</span>
                  </div>
                ))
              )}
            </div>
          </AdminCard>
        </div>
      )}
    </PageTransition>
  );
}
