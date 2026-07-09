"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  FolderKanban,
  Target,
  Activity,
} from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  PageTransition,
  PageHeader,
  SectionTitle,
  AnimatedCounter,
} from "@/modules/admin/components/ui";
import {
  AdminAreaChart,
  AdminBarChart,
  AdminDonutChart,
} from "@/modules/admin/components/charts";

const LEADS_DATA = [
  { name: "Jan", value: 12 },
  { name: "Feb", value: 19 },
  { name: "Mar", value: 15 },
  { name: "Apr", value: 22 },
  { name: "May", value: 28 },
  { name: "Jun", value: 24 },
  { name: "Jul", value: 31 },
  { name: "Aug", value: 27 },
  { name: "Sep", value: 35 },
  { name: "Oct", value: 30 },
  { name: "Nov", value: 38 },
  { name: "Dec", value: 42 },
];

const REVENUE_DATA = [
  { name: "Jan", value: 18000 },
  { name: "Feb", value: 22000 },
  { name: "Mar", value: 15000 },
  { name: "Apr", value: 35000 },
  { name: "May", value: 42000 },
  { name: "Jun", value: 38000 },
  { name: "Jul", value: 51000 },
  { name: "Aug", value: 47000 },
  { name: "Sep", value: 58000 },
  { name: "Oct", value: 63000 },
  { name: "Nov", value: 59000 },
  { name: "Dec", value: 72000 },
];

const TOP_INDUSTRIES = [
  { name: "Logistics", value: 8 },
  { name: "Healthcare", value: 6 },
  { name: "FinTech", value: 5 },
  { name: "Retail", value: 4 },
  { name: "Real Estate", value: 3 },
  { name: "Education", value: 2 },
];

const TOP_SERVICES = [
  { name: "ERP System", value: 9 },
  { name: "Web App", value: 7 },
  { name: "Mobile App", value: 6 },
  { name: "E-commerce", value: 4 },
  { name: "AI/ML Solution", value: 3 },
  { name: "SaaS Platform", value: 3 },
];

function formatMoney(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function AnalyticsPage() {
  const { submissions, projects, invoices, stats } = useAdmin();

  // Project status distribution
  const projectStatusData = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => {
      counts.set(p.status, (counts.get(p.status) ?? 0) + 1);
    });
    if (counts.size === 0) {
      return [
        { name: "Discovery", value: 1 },
        { name: "Development", value: 1 },
        { name: "Testing", value: 1 },
        { name: "Maintenance", value: 1 },
      ];
    }
    return Array.from(counts.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [projects]);

  // KPIs
  const totalRevenue = invoices
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + i.amount, 0);
  const approvedCount = submissions.filter(
    (s) => s.status === "Approved"
  ).length;
  const conversionRate =
    submissions.length > 0
      ? Math.round((approvedCount / submissions.length) * 100)
      : 0;
  const avgProjectValue =
    projects.length > 0
      ? Math.round(
          projects.reduce((sum, p) => sum + p.budget, 0) / projects.length
        )
      : 0;

  const KPIS = [
    {
      label: "Conversion Rate",
      value: conversionRate,
      suffix: "%",
      icon: Target,
      color: "#8B5CF6",
      hint: `${approvedCount} of ${submissions.length} approved`,
    },
    {
      label: "Avg Project Cost",
      value: avgProjectValue,
      suffix: "",
      icon: DollarSign,
      color: "#10B981",
      isMoney: true,
      hint: `Across ${projects.length} project${projects.length === 1 ? "" : "s"}`,
    },
    {
      label: "Total Revenue",
      value: totalRevenue,
      suffix: "",
      icon: TrendingUp,
      color: "#25D6FF",
      isMoney: true,
      hint: "From paid invoices",
    },
    {
      label: "Active Projects",
      value: stats.activeProjects,
      suffix: "",
      icon: FolderKanban,
      color: "#F59E0B",
      hint: "In delivery",
    },
  ];

  return (
    <PageTransition>
      <PageHeader
        title="Analytics"
        description="Business intelligence across the entire pipeline"
      />

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {KPIS.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
          >
            <AdminCard strong className="p-5 h-full">
              <div className="flex items-start justify-between mb-3">
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ background: `${kpi.color}1A`, color: kpi.color }}
                >
                  <kpi.icon className="h-4 w-4" />
                </span>
              </div>
              <p
                className="text-[10.5px] uppercase tracking-[0.18em] font-semibold mb-1"
                style={{ color: "var(--admin-text-muted)" }}
              >
                {kpi.label}
              </p>
              <p
                className="font-bold text-[24px] tabular-nums"
                style={{ color: "var(--admin-text)" }}
              >
                {kpi.isMoney ? (
                  <>
                    <AnimatedCounter value={kpi.value} duration={1200} />
                  </>
                ) : (
                  <>
                    <AnimatedCounter value={kpi.value} duration={1200} />
                    {kpi.suffix}
                  </>
                )}
              </p>
              <p
                className="text-[10.5px] mt-1"
                style={{ color: "var(--admin-text-muted)" }}
              >
                {kpi.hint}
              </p>
            </AdminCard>
          </motion.div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <AdminCard className="p-5">
          <SectionTitle
            eyebrow="Acquisition"
            title="Monthly Leads"
            description="New submission volume over the past 12 months"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <AdminAreaChart data={LEADS_DATA} dataKey="value" xKey="name" color="#25D6FF" height={240} />
        </AdminCard>

        <AdminCard className="p-5">
          <SectionTitle
            eyebrow="Financials"
            title="Revenue Growth"
            description="Recognized revenue trend (USD)"
            icon={<DollarSign className="h-4 w-4" />}
          />
          <AdminBarChart data={REVENUE_DATA} dataKey="value" xKey="name" color="#10B981" height={240} />
        </AdminCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AdminCard className="p-5">
          <SectionTitle
            eyebrow="Distribution"
            title="Project Status"
            description="Active projects by stage"
            icon={<Activity className="h-4 w-4" />}
          />
          <AdminDonutChart data={projectStatusData} height={240} />
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {projectStatusData.map((s, i) => {
              const colors = ["#25D6FF", "#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#64748B"];
              const color = colors[i % colors.length];
              return (
                <div
                  key={s.name}
                  className="flex items-center gap-1.5 text-[10.5px]"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: color }}
                  />
                  {s.name}
                  <span style={{ color: "var(--admin-text-muted)" }}>
                    ({s.value})
                  </span>
                </div>
              );
            })}
          </div>
        </AdminCard>

        <AdminCard className="p-5">
          <SectionTitle
            eyebrow="Verticals"
            title="Top Industries"
            description="By submission volume"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <AdminBarChart
            data={TOP_INDUSTRIES}
            dataKey="value"
            xKey="name"
            color="#8B5CF6"
            horizontal
            height={240}
          />
        </AdminCard>

        <AdminCard className="p-5">
          <SectionTitle
            eyebrow="Offerings"
            title="Top Services"
            description="By project type"
            icon={<Activity className="h-4 w-4" />}
          />
          <AdminBarChart
            data={TOP_SERVICES}
            dataKey="value"
            xKey="name"
            color="#F59E0B"
            horizontal
            height={240}
          />
        </AdminCard>
      </div>

      {/* Funnel summary */}
      <div className="mt-4">
        <AdminCard className="p-5">
          <SectionTitle
            eyebrow="Pipeline"
            title="Conversion Funnel"
            description="From lead to approved"
            icon={<Target className="h-4 w-4" />}
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: "Total Leads", value: submissions.length, color: "#25D6FF" },
              { label: "New", value: stats.newSubmissions, color: "#3B82F6" },
              { label: "In Review", value: stats.inReview, color: "#8B5CF6" },
              { label: "Proposal", value: stats.proposalPending, color: "#F59E0B" },
              { label: "Approved", value: stats.approved, color: "#10B981" },
              { label: "In Dev", value: stats.activeProjects, color: "#EC4899" },
              { label: "Completed", value: stats.completed, color: "#64748B" },
            ].map((stage, i) => (
              <motion.div
                key={stage.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="rounded-lg border p-3 text-center"
                style={{
                  background: `${stage.color}0D`,
                  borderColor: `${stage.color}33`,
                }}
              >
                <p
                  className="text-[10px] uppercase tracking-wider font-semibold mb-1"
                  style={{ color: stage.color }}
                >
                  {stage.label}
                </p>
                <p
                  className="font-bold text-[20px] tabular-nums"
                  style={{ color: "var(--admin-text)" }}
                >
                  {stage.value}
                </p>
              </motion.div>
            ))}
          </div>
        </AdminCard>
      </div>
    </PageTransition>
  );
}
