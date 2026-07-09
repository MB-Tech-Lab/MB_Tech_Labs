"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Mail, Globe, ArrowRight, Plus } from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  PageTransition,
  EmptyState,
  PageHeader,
  AdminButton,
} from "@/modules/admin/components/ui";

const STATUS_COLORS: Record<string, string> = {
  Active: "#10B981",
  Inactive: "#64748B",
  Prospect: "#F59E0B",
  Blacklisted: "#EF4444",
};

export default function ClientsPage() {
  const { clients } = useAdmin();

  return (
    <PageTransition>
      <PageHeader
        title="Clients"
        description={`${clients.length} client${clients.length === 1 ? "" : "s"}`}
        action={
          <AdminButton variant="primary" size="sm" icon={<Plus className="h-3.5 w-3.5" />}>
            Add Client
          </AdminButton>
        }
      />

      {clients.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title="No clients yet"
            description="Clients appear here once they submit a project request."
          />
        </AdminCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client, i) => {
            const color = STATUS_COLORS[client.status] ?? "#64748B";
            return (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Link href={`/admin/clients/${client.id}`}>
                  <AdminCard className="p-5 h-full hover:border-opacity-100 transition-all group" >
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <span
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold text-[13px]"
                        style={{ background: "var(--admin-accent)", color: "#0F172A" }}
                      >
                        {client.company.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-medium"
                        style={{ background: `${color}1A`, borderColor: `${color}40`, color }}
                      >
                        {client.status}
                      </span>
                    </div>
                    <h3 className="font-semibold text-[14.5px] truncate group-hover:text-opacity-80 transition-colors" style={{ color: "var(--admin-text)" }}>
                      {client.company}
                    </h3>
                    <p className="text-[12px] mt-0.5" style={{ color: "var(--admin-text-secondary)" }}>
                      {client.contactPerson}
                    </p>
                    <div className="mt-3 space-y-1.5">
                      <p className="flex items-center gap-2 text-[11.5px]" style={{ color: "var(--admin-text-secondary)" }}>
                        <Mail className="h-3 w-3" style={{ color: "var(--admin-text-muted)" }} />
                        <span className="truncate">{client.email}</span>
                      </p>
                      <p className="flex items-center gap-2 text-[11.5px]" style={{ color: "var(--admin-text-secondary)" }}>
                        <Globe className="h-3 w-3" style={{ color: "var(--admin-text-muted)" }} />
                        <span className="truncate">{client.industry}</span>
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--admin-border)" }}>
                      <div className="flex gap-3 text-[11px]" style={{ color: "var(--admin-text-muted)" }}>
                        <span>{client.submissionIds.length} SRGs</span>
                        <span>{client.projectIds.length} Projects</span>
                      </div>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" style={{ color: "var(--admin-accent)" }} />
                    </div>
                  </AdminCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </PageTransition>
  );
}
