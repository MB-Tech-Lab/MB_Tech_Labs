"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Mail, Globe, ArrowRight, Plus, Search, Loader2 } from "lucide-react";
import {
  AdminCard,
  PageTransition,
  EmptyState,
  PageHeader,
  Skeleton,
} from "@/modules/admin/components/ui";
import { clientsApi, type Client } from "@/lib/api/clients";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await clientsApi.list({ search: search || undefined, pageSize: 100 });
        setClients(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load clients");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search]);

  return (
    <PageTransition>
      <PageHeader
        title="Clients"
        description="Manage your client relationships"
        action={
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-cyan text-ink font-medium text-[13px] px-4 py-2.5 hover:bg-cyan-soft transition-all">
            <Plus className="h-4 w-4" />
            Add Client
          </button>
        }
      />

      {/* Search */}
      <div className="relative mb-5">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients by name, company, or email..."
          className="w-full rounded-xl bg-white/[0.04] border border-white/10 pl-10 pr-4 py-2.5 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/40 focus:ring-2 focus:ring-cyan/15 transition-all"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-[13px] text-rose-200">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <AdminCard key={i} className="p-5">
              <div className="flex items-start gap-3">
                <Skeleton className="h-11 w-11 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </AdminCard>
          ))}
        </div>
      ) : clients.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title="No Clients Found"
            description="When clients submit SRGs or you add them manually, they will appear here."
            action={
              <button className="inline-flex items-center gap-1.5 rounded-xl bg-cyan text-ink font-medium text-[13px] px-4 py-2.5 hover:bg-cyan-soft transition-all">
                <Plus className="h-4 w-4" />
                Add Your First Client
              </button>
            }
          />
        </AdminCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client, i) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <Link href={`/admin/clients/${client.id}`}>
                <AdminCard className="p-5 h-full hover:border-cyan/25 transition-colors group cursor-pointer">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan/25 to-cyan/5 border border-cyan/25 font-display font-semibold text-[13px] text-cyan-soft">
                      {client.companyName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-[14px] font-semibold text-white truncate group-hover:text-cyan-soft transition-colors">
                        {client.companyName}
                      </h3>
                      <p className="text-[11.5px] text-white/45 truncate">{client.contactName}</p>
                    </div>
                    {client._count && client._count.projects > 0 && (
                      <span className="inline-flex items-center justify-center rounded-md bg-cyan/15 border border-cyan/25 px-1.5 py-0.5 text-[10px] font-medium text-cyan-soft">
                        {client._count.projects}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 space-y-1.5">
                    <p className="flex items-center gap-2 text-[11.5px] text-white/55">
                      <Mail className="h-3 w-3 text-cyan/60" />
                      <span className="truncate">{client.email}</span>
                    </p>
                    {client.country && (
                      <p className="flex items-center gap-2 text-[11.5px] text-white/55">
                        <Globe className="h-3 w-3 text-cyan/60" />
                        <span className="truncate">{client.country}</span>
                      </p>
                    )}
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
