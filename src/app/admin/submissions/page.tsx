"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Inbox, Search, ArrowRight, Filter, Download } from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  StatusBadge,
  PriorityBadge,
  PageTransition,
  EmptyState,
  AdminInput,
  AdminButton,
  PageHeader,
} from "@/modules/admin/components/ui";
import { SRG_STATUS_FLOW, OPEN_STATUSES, type SrgStatus } from "@/modules/admin/types";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const FILTERS: { label: string; value: SrgStatus | "open" | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  ...SRG_STATUS_FLOW.filter((s) => s !== "Archived").map((s) => ({ label: s, value: s as SrgStatus })),
  { label: "Archived", value: "Archived" },
];

export default function SrgSubmissionsPage() {
  const { searchResults, search, setSearch } = useAdmin();
  const [filter, setFilter] = useState<SrgStatus | "open" | "all">("open");

  const filtered = searchResults.filter((s) => {
    if (filter === "all") return true;
    if (filter === "open") return OPEN_STATUSES.includes(s.status);
    return s.status === filter;
  });

  return (
    <PageTransition>
      <PageHeader
        title="SRG Submissions"
        description={`${filtered.length} submission${filtered.length === 1 ? "" : "s"}`}
        action={
          <AdminButton variant="ghost" size="sm" icon={<Download className="h-3.5 w-3.5" />}>
            Export CSV
          </AdminButton>
        }
      />

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "var(--admin-text-muted)" }} />
          <AdminInput
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client, company, project, or submission ID..."
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <Filter className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--admin-text-muted)" }} />
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-all"
              style={{
                background: filter === f.value ? "var(--admin-accent)" : "var(--admin-surface-2)",
                borderColor: filter === f.value ? "var(--admin-accent)" : "var(--admin-border)",
                color: filter === f.value ? "#0F172A" : "var(--admin-text-secondary)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title="No submissions found"
            description="Try adjusting your search or filter."
          />
        </AdminCard>
      ) : (
        <AdminCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-[10.5px] uppercase tracking-[0.12em]" style={{ borderColor: "var(--admin-border)", color: "var(--admin-text-muted)" }}>
                  <th className="px-4 py-3 font-medium">Submission ID</th>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Project Type</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Submitted</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub, i) => (
                  <motion.tr
                    key={sub.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    className="border-b transition-colors hover:bg-opacity-50"
                    style={{ borderColor: "var(--admin-border)" }}
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/submissions/${sub.id}`}
                        className="font-mono text-[11.5px] hover:underline"
                        style={{ color: "var(--admin-accent)" }}
                      >
                        {sub.id.slice(0, 16)}…
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold"
                          style={{ background: "var(--admin-surface-2)", color: "var(--admin-accent)" }}
                        >
                          {sub.client.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[12.5px] font-medium truncate" style={{ color: "var(--admin-text)" }}>
                            {sub.client.fullName}
                          </p>
                          <p className="text-[11px] truncate" style={{ color: "var(--admin-text-secondary)" }}>
                            {sub.client.company}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-[12px]" style={{ color: "var(--admin-text-secondary)" }}>
                        {sub.templateName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={sub.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-[12px]" style={{ color: "var(--admin-text-secondary)" }}>
                        {formatDate(sub.submittedAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/submissions/${sub.id}`}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all"
                        style={{ background: "var(--admin-accent)", color: "#0F172A" }}
                      >
                        Open
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}
    </PageTransition>
  );
}
