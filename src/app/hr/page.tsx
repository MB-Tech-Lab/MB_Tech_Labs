"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  Inbox,
  FileSearch,
  Calendar,
  FileText,
  GraduationCap,
  UserCog,
  BookOpen,
  Award,
  ArrowRight,
  Plus,
  Users,
  Sparkles,
} from "lucide-react";
import { hrApi, type HRStats } from "@/lib/api/hr";

const STATS = [
  { label: "Active Job Posts", key: "activeJobPosts" as const, icon: Briefcase, color: "text-cyan" },
  { label: "Applications", key: "applicationsReceived" as const, icon: Inbox, color: "text-blue-300" },
  { label: "Pending Reviews", key: "pendingResumeReviews" as const, icon: FileSearch, color: "text-violet-300" },
  { label: "Interviews", key: "interviewsScheduled" as const, icon: Calendar, color: "text-amber-300" },
  { label: "Offers Sent", key: "offersSent" as const, icon: FileText, color: "text-teal-300" },
  { label: "Active Interns", key: "activeInterns" as const, icon: GraduationCap, color: "text-emerald-300" },
  { label: "Employees", key: "employees" as const, icon: UserCog, color: "text-pink-300" },
  { label: "Certificates", key: "certificatesIssued" as const, icon: Award, color: "text-rose-300" },
];

const QUICK_ACTIONS = [
  { label: "Create Job Post", href: "/hr/jobs", icon: Plus },
  { label: "Review Applications", href: "/hr/applications", icon: FileSearch },
  { label: "Schedule Interview", href: "/hr/interviews", icon: Calendar },
  { label: "Add Intern", href: "/hr/interns", icon: GraduationCap },
  { label: "Generate Offer", href: "/hr/offers", icon: FileText },
  { label: "View Reports", href: "/hr/reports", icon: BarChart3Icon },
];

function BarChart3Icon(props: { className?: string }) {
  return <Award {...props} />;
}

export default function HRDashboard() {
  const [stats, setStats] = useState<HRStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hrApi.getStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
            <Sparkles className="h-3 w-3" /> HR Portal
          </span>
        </div>
        <h1 className="mt-3 font-display text-2xl font-semibold text-white tracking-tight">
          HR Dashboard
        </h1>
        <p className="mt-1 text-[13px] text-white/50">
          Recruitment, internships, and employee management — all in one place.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          const value = stats ? stats[stat.key] : 0;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="rounded-2xl border p-4"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
            >
              <Icon className={`h-5 w-5 ${stat.color}`} />
              <div className="mt-3">
                {loading ? (
                  <div className="h-7 w-12 rounded bg-white/10 animate-pulse" />
                ) : (
                  <div className="font-display text-[24px] font-semibold text-white tabular-nums">{value}</div>
                )}
                <p className="text-[10.5px] text-white/45 mt-0.5">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="font-display text-[14px] font-semibold text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="group flex flex-col items-center gap-2 rounded-xl border p-4 hover:border-cyan/25 transition-colors"
                style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/20 text-cyan group-hover:scale-110 transition-transform">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-[11px] text-white/60 text-center">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Empty state hint */}
      {!loading && stats && stats.activeJobPosts === 0 && stats.applicationsReceived === 0 && (
        <div className="rounded-2xl border p-8 text-center" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
          <Users className="h-10 w-10 text-white/25 mx-auto mb-4" />
          <h3 className="font-display text-[15px] font-semibold text-white">Welcome to your HR Dashboard</h3>
          <p className="mt-2 text-[13px] text-white/45 max-w-sm mx-auto">
            Start by creating internship job posts. Published jobs automatically appear on the careers page.
            Applications from students will flow directly into this dashboard.
          </p>
          <Link
            href="/hr/jobs"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[13px] px-5 py-2.5 hover:bg-cyan-soft transition-all"
          >
            <Plus className="h-4 w-4" />
            Create Your First Job Post
          </Link>
        </div>
      )}
    </div>
  );
}
