"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Globe, MapPin, Building2, Users, FileText, FolderKanban, Activity } from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  PageTransition,
  EmptyState,
  Tabs,
  StatusBadge,
  AdminTextarea,
} from "@/modules/admin/components/ui";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const TABS = [
  { label: "Overview", value: "overview" },
  { label: "Projects", value: "projects" },
  { label: "Requirements", value: "requirements" },
  { label: "Documents", value: "documents" },
  { label: "Communication", value: "communication" },
  { label: "Notes", value: "notes" },
  { label: "Timeline", value: "timeline" },
];

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { clients, submissions, projects, activities, updateNotes } = useAdmin();
  const client = useMemo(() => clients.find((c) => c.id === id), [clients, id]);
  const [activeTab, setActiveTab] = useState("overview");
  const [notes, setNotes] = useState(client?.notes ?? "");

  const clientSubmissions = submissions.filter((s) => client?.submissionIds.includes(s.id));
  const clientProjects = projects.filter((p) => client?.projectIds.includes(p.id));
  const clientActivities = activities.filter((a) => a.entityId === id || client?.submissionIds.includes(a.entityId ?? ""));

  if (!client) {
    return (
      <PageTransition>
        <EmptyState
          title="Client not found"
          action={<Link href="/admin/clients" className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[13px] font-medium" style={{ background: "var(--admin-accent)", color: "#0F172A" }}><ArrowLeft className="h-4 w-4" /> Back to Clients</Link>}
        />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Link href="/admin/clients" className="inline-flex items-center gap-1.5 text-[12.5px] mb-4" style={{ color: "var(--admin-text-secondary)" }}>
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Clients
      </Link>

      <div className="flex items-start gap-4 mb-6">
        <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-bold text-[16px]" style={{ background: "var(--admin-accent)", color: "#0F172A" }}>
          {client.company.split(" ").map((n) => n[0]).slice(0, 2).join("")}
        </span>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold tracking-tight" style={{ color: "var(--admin-text)" }}>{client.company}</h1>
          <p className="mt-1 text-[13px]" style={{ color: "var(--admin-text-secondary)" }}>{client.contactPerson} · {client.industry}</p>
        </div>
      </div>

      <div className="mb-5">
        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AdminCard className="p-5">
            <h3 className="font-semibold text-[15px] mb-4" style={{ color: "var(--admin-text)" }}>Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={<Users className="h-3.5 w-3.5" />} label="Contact Person" value={client.contactPerson} />
              <InfoRow icon={<Building2 className="h-3.5 w-3.5" />} label="Industry" value={client.industry} />
              <InfoRow icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={client.email} href={`mailto:${client.email}`} />
              <InfoRow icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={client.phone} href={`tel:${client.phone}`} />
              <InfoRow icon={<Globe className="h-3.5 w-3.5" />} label="Website" value={client.website} href={client.website} />
              <InfoRow icon={<MapPin className="h-3.5 w-3.5" />} label="Address" value={client.address} />
            </div>
          </AdminCard>
          <AdminCard className="p-5">
            <h3 className="font-semibold text-[15px] mb-4" style={{ color: "var(--admin-text)" }}>Quick Stats</h3>
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="SRGs" value={clientSubmissions.length} icon={<FileText className="h-4 w-4" />} />
              <StatCard label="Projects" value={clientProjects.length} icon={<FolderKanban className="h-4 w-4" />} />
              <StatCard label="Since" value={formatDate(client.createdAt)} icon={<Activity className="h-4 w-4" />} small />
            </div>
          </AdminCard>
        </div>
      )}

      {activeTab === "projects" && (
        <AdminCard className="p-5">
          <h3 className="font-semibold text-[15px] mb-4" style={{ color: "var(--admin-text)" }}>Projects ({clientProjects.length})</h3>
          {clientProjects.length === 0 ? (
            <EmptyState icon={<FolderKanban className="h-5 w-5" />} title="No projects yet" />
          ) : (
            <div className="space-y-2">
              {clientProjects.map((p) => (
                <Link key={p.id} href={`/admin/projects/${p.id}`} className="block rounded-lg border p-3 transition-colors" style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface-2)" }}>
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium" style={{ color: "var(--admin-text)" }}>{p.name}</p>
                    <span className="text-[12px]" style={{ color: "var(--admin-accent)" }}>{p.progress}%</span>
                  </div>
                  <p className="text-[11.5px] mt-0.5" style={{ color: "var(--admin-text-secondary)" }}>{p.status} · {p.techStack.join(", ")}</p>
                </Link>
              ))}
            </div>
          )}
        </AdminCard>
      )}

      {activeTab === "requirements" && (
        <AdminCard className="p-5">
          <h3 className="font-semibold text-[15px] mb-4" style={{ color: "var(--admin-text)" }}>SRG Submissions ({clientSubmissions.length})</h3>
          {clientSubmissions.length === 0 ? (
            <EmptyState icon={<FileText className="h-5 w-5" />} title="No submissions yet" />
          ) : (
            <div className="space-y-2">
              {clientSubmissions.map((s) => (
                <Link key={s.id} href={`/admin/submissions/${s.id}`} className="block rounded-lg border p-3 transition-colors" style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface-2)" }}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-medium truncate" style={{ color: "var(--admin-text)" }}>{s.projectName}</p>
                    <StatusBadge status={s.status} />
                  </div>
                  <p className="text-[11.5px] mt-0.5" style={{ color: "var(--admin-text-secondary)" }}>{s.templateName} · {formatDate(s.submittedAt)}</p>
                </Link>
              ))}
            </div>
          )}
        </AdminCard>
      )}

      {activeTab === "documents" && (
        <AdminCard className="p-5">
          <h3 className="font-semibold text-[15px] mb-4" style={{ color: "var(--admin-text)" }}>Documents</h3>
          <EmptyState icon={<FileText className="h-5 w-5" />} title="No documents uploaded" description="Documents from SRG submissions will appear here." />
        </AdminCard>
      )}

      {activeTab === "communication" && (
        <AdminCard className="p-5">
          <h3 className="font-semibold text-[15px] mb-4" style={{ color: "var(--admin-text)" }}>Communication History</h3>
          <EmptyState icon={<Mail className="h-5 w-5" />} title="No communication logged" />
        </AdminCard>
      )}

      {activeTab === "notes" && (
        <AdminCard className="p-5">
          <h3 className="font-semibold text-[15px] mb-4" style={{ color: "var(--admin-text)" }}>Internal Notes</h3>
          <AdminTextarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => updateNotes(client.id, notes)}
            placeholder="Add private notes about this client..."
          />
        </AdminCard>
      )}

      {activeTab === "timeline" && (
        <AdminCard className="p-5">
          <h3 className="font-semibold text-[15px] mb-4" style={{ color: "var(--admin-text)" }}>Activity Timeline</h3>
          {clientActivities.length === 0 ? (
            <EmptyState icon={<Activity className="h-5 w-5" />} title="No activity yet" />
          ) : (
            <div className="space-y-3">
              {clientActivities.map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <span className="mt-0.5 h-2 w-2 rounded-full shrink-0" style={{ background: "var(--admin-accent)" }} />
                  <div>
                    <p className="text-[12.5px]" style={{ color: "var(--admin-text)" }}>{a.description}</p>
                    <p className="text-[10.5px] mt-0.5" style={{ color: "var(--admin-text-muted)" }}>{formatDate(a.timestamp)} · {a.actor}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      )}
    </PageTransition>
  );
}

function InfoRow({ icon, label, value, href }: { icon?: React.ReactNode; label: string; value?: string; href?: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] mb-1" style={{ color: "var(--admin-text-muted)" }}>{icon}{label}</p>
      {value ? (href ? <a href={href} className="text-[13px] hover:underline" style={{ color: "var(--admin-accent)" }}>{value}</a> : <span className="text-[13px]" style={{ color: "var(--admin-text)" }}>{value}</span>) : <span className="text-[13px]" style={{ color: "var(--admin-text-muted)" }}>—</span>}
    </div>
  );
}

function StatCard({ label, value, icon, small }: { label: string; value: string | number; icon: React.ReactNode; small?: boolean }) {
  return (
    <div className="rounded-lg border p-3 text-center" style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface-2)" }}>
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg mb-2" style={{ background: "var(--admin-surface)", color: "var(--admin-accent)" }}>{icon}</span>
      <p className={`font-bold ${small ? "text-[12px]" : "text-[20px]"}`} style={{ color: "var(--admin-text)" }}>{value}</p>
      <p className="text-[10px] mt-0.5" style={{ color: "var(--admin-text-muted)" }}>{label}</p>
    </div>
  );
}
