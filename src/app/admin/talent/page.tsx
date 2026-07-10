"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  Inbox,
  Eye,
  Calendar,
  GraduationCap,
  Award,
  Users,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  AdminCard,
  PageTransition,
  EmptyState,
  Skeleton,
  PageHeader,
} from "@/modules/admin/components/ui";
import { careersApi, type TalentStats } from "@/lib/api/careers";

const STATS = [
  { label: "Open Positions", key: "openPositions" as const, icon: Briefcase, accent: "from-cyan/15 to-cyan/5", iconColor: "text-cyan" },
  { label: "New Applications", key: "newApplications" as const, icon: Inbox, accent: "from-blue-400/15 to-blue-400/5", iconColor: "text-blue-200" },
  { label: "Pending Reviews", key: "pendingReviews" as const, icon: Eye, accent: "from-violet-400/15 to-violet-400/5", iconColor: "text-violet-200" },
  { label: "Interviews Scheduled", key: "interviewsScheduled" as const, icon: Calendar, accent: "from-amber-400/15 to-amber-400/5", iconColor: "text-amber-200" },
  { label: "Interns in Training", key: "internsInTraining" as const, icon: GraduationCap, accent: "from-emerald-400/15 to-emerald-400/5", iconColor: "text-emerald-200" },
  { label: "Certificates Issued", key: "certificatesIssued" as const, icon: Award, accent: "from-teal-400/15 to-teal-400/5", iconColor: "text-teal-200" },
  { label: "Converted Employees", key: "convertedEmployees" as const, icon: Users, accent: "from-pink-400/15 to-pink-400/5", iconColor: "text-pink-200" },
];

export default function TalentDashboardPage() {
  const [stats, setStats] = useState<TalentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    careersApi.getStats()
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <PageHeader
        title="Talent Dashboard"
        description="Internship applications, training progress, and conversions"
      />

      {error && <div className="mb-5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-[13px] text-rose-200">{error}</div>}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-8">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          const value = stats ? stats[stat.key] : 0;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
            >
              <AdminCard className="p-4 h-full">
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${stat.accent} border border-white/10 ${stat.iconColor}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="mt-3">
                  {loading ? <Skeleton className="h-7 w-12" /> : (
                    <div className="font-display text-[24px] font-semibold text-white tabular-nums">{value}</div>
                  )}
                  <p className="text-[10.5px] text-white/50 mt-0.5">{stat.label}</p>
                </div>
              </AdminCard>
            </motion.div>
          );
        })}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/talent/positions">
          <AdminCard className="p-5 hover:border-cyan/25 transition-colors group cursor-pointer">
            <Briefcase className="h-5 w-5 text-cyan" />
            <h3 className="mt-3 font-display text-[14px] font-semibold text-white">Internship Positions</h3>
            <p className="text-[12px] text-white/50 mt-1">Create, publish, and manage job openings</p>
            <span className="mt-3 inline-flex items-center gap-1 text-[12px] text-cyan-soft group-hover:text-cyan">
              Manage <ArrowRight className="h-3 w-3" />
            </span>
          </AdminCard>
        </Link>
        <Link href="/admin/talent/applications">
          <AdminCard className="p-5 hover:border-cyan/25 transition-colors group cursor-pointer">
            <Inbox className="h-5 w-5 text-cyan" />
            <h3 className="mt-3 font-display text-[14px] font-semibold text-white">Applications</h3>
            <p className="text-[12px] text-white/50 mt-1">Review candidates and their projects</p>
            <span className="mt-3 inline-flex items-center gap-1 text-[12px] text-cyan-soft group-hover:text-cyan">
              Review <ArrowRight className="h-3 w-3" />
            </span>
          </AdminCard>
        </Link>
        <AdminCard className="p-5">
          <GraduationCap className="h-5 w-5 text-cyan" />
          <h3 className="mt-3 font-display text-[14px] font-semibold text-white">Training & Certificates</h3>
          <p className="text-[12px] text-white/50 mt-1">Coming soon — intern training batches and certificates</p>
        </AdminCard>
      </div>

      {/* Empty state hint */}
      {!loading && stats && stats.openPositions === 0 && stats.newApplications === 0 && (
        <AdminCard className="mt-6 p-6">
          <EmptyState
            icon={<Sparkles className="h-6 w-6" />}
            title="Talent acquisition is ready"
            description="Create your first internship position to start receiving applications from students and fresh graduates."
            action={
              <Link href="/admin/talent/positions" className="inline-flex items-center gap-1.5 rounded-xl bg-cyan text-ink font-medium text-[13px] px-4 py-2.5 hover:bg-cyan-soft transition-all">
                Create Position <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
        </AdminCard>
      )}
    </PageTransition>
  );
}
