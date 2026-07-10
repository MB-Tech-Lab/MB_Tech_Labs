"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FolderKanban, Search, ArrowRight, Plus, Filter } from "lucide-react";
import {
  AdminCard,
  PageTransition,
  EmptyState,
  Skeleton,
  PageHeader,
  DevStatusBadge,
} from "@/modules/admin/components/ui";
import { projectsApi, type Project } from "@/lib/api/projects";

const FILTERS = [
  { label: "All", value: "" },
  { label: "Discovery", value: "DISCOVERY" },
  { label: "Planning", value: "PLANNING" },
  { label: "Development", value: "DEVELOPMENT" },
  { label: "Testing", value: "TESTING" },
  { label: "Deployment", value: "DEPLOYMENT" },
  { label: "Maintenance", value: "MAINTENANCE" },
];

function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await projectsApi.list({
          search: search || undefined,
          status: filter || undefined,
          pageSize: 100,
        });
        setProjects(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load projects");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search, filter]);

  return (
    <PageTransition>
      <PageHeader
        title="Projects"
        description="Active software development projects"
        action={
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-cyan text-ink font-medium text-[13px] px-4 py-2.5 hover:bg-cyan-soft transition-all">
            <Plus className="h-4 w-4" />
            Create Project
          </button>
        }
      />

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-xl bg-white/[0.04] border border-white/10 pl-10 pr-4 py-2.5 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/40 focus:ring-2 focus:ring-cyan/15 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <Filter className="h-3.5 w-3.5 text-white/40 shrink-0" />
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-all ${
                filter === f.value
                  ? "bg-cyan/15 border-cyan/40 text-white"
                  : "bg-white/[0.03] border-white/10 text-white/55 hover:border-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-[13px] text-rose-200">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <AdminCard key={i} className="p-5">
              <Skeleton className="h-5 w-40 mb-3" />
              <Skeleton className="h-3 w-28 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </AdminCard>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<FolderKanban className="h-6 w-6" />}
            title="No Projects Available"
            description="Projects are created when SRG submissions are approved. Approve a submission to create your first project."
          />
        </AdminCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Link href={`/admin/projects/${project.id}`}>
                <AdminCard className="p-5 h-full hover:border-cyan/25 transition-colors group cursor-pointer">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <h3 className="font-display text-[15px] font-semibold text-white truncate group-hover:text-cyan-soft transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-[11.5px] text-white/45 mt-0.5">
                        {project.client?.companyName || "No client"} · {formatDate(project.createdAt)}
                      </p>
                    </div>
                    <DevStatusBadge status={project.status} />
                  </div>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[10.5px] text-white/45 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan/60 to-cyan rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-white/45">{project.currentStage}</span>
                    <span className="inline-flex items-center gap-1 text-[12px] text-cyan-soft group-hover:text-cyan transition-colors">
                      Open
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </AdminCard>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
