"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Mail, Globe, ArrowRight } from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import { AdminCard, PageTransition, EmptyState } from "@/modules/admin/components/ui";

export default function ClientsPage() {
  const { submissions } = useAdmin();
  // Group by company
  const clientsMap = new Map<string, {
    company: string;
    contact: string;
    email: string;
    country: string;
    website: string;
    projectCount: number;
    submissionIds: string[];
  }>();

  submissions.forEach((s) => {
    const key = s.client.company || s.client.email;
    const existing = clientsMap.get(key);
    if (existing) {
      existing.projectCount++;
      existing.submissionIds.push(s.id);
    } else {
      clientsMap.set(key, {
        company: s.client.company,
        contact: s.client.fullName,
        email: s.client.email,
        country: s.client.country,
        website: s.business.website,
        projectCount: 1,
        submissionIds: [s.id],
      });
    }
  });

  const clients = Array.from(clientsMap.values()).sort((a, b) =>
    b.projectCount - a.projectCount
  );

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Clients
        </h1>
        <p className="mt-1.5 text-[13.5px] text-white/55">
          {clients.length} unique client{clients.length === 1 ? "" : "s"}
        </p>
      </div>

      {clients.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title="No clients yet"
            description="Clients appear here once they submit a project."
          />
        </AdminCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {clients.map((c, i) => (
            <motion.div
              key={c.email}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <Link href={`/admin/submissions/${c.submissionIds[0]}`}>
                <AdminCard className="p-5 h-full hover:border-cyan/25 transition-colors group">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan/25 to-cyan/5 border border-cyan/25 font-display font-semibold text-[13px] text-cyan-soft">
                      {c.company
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-[14px] font-semibold text-white truncate group-hover:text-cyan-soft transition-colors">
                        {c.company}
                      </h3>
                      <p className="text-[11.5px] text-white/45 truncate">{c.contact}</p>
                    </div>
                    {c.projectCount > 1 && (
                      <span className="inline-flex items-center justify-center rounded-md bg-cyan/15 border border-cyan/25 px-1.5 py-0.5 text-[10px] font-medium text-cyan-soft">
                        {c.projectCount}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 space-y-1.5">
                    <p className="flex items-center gap-2 text-[11.5px] text-white/55">
                      <Mail className="h-3 w-3 text-cyan/60" />
                      <span className="truncate">{c.email}</span>
                    </p>
                    <p className="flex items-center gap-2 text-[11.5px] text-white/55">
                      <Globe className="h-3 w-3 text-cyan/60" />
                      <span className="truncate">{c.country}</span>
                    </p>
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
