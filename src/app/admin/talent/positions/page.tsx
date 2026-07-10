"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Plus,
  Clock,
  DollarSign,
  MapPin,
  Users,
  Loader2,
  Search,
  X,
} from "lucide-react";
import {
  AdminCard,
  AdminButton,
  PageTransition,
  EmptyState,
  Skeleton,
  PageHeader,
} from "@/modules/admin/components/ui";
import { careersApi, type InternshipPosition } from "@/lib/api/careers";

const DEPARTMENTS = ["FRONTEND", "BACKEND", "FULLSTACK", "AI", "UI_UX", "QA", "DEVOPS", "BA"];

function formatDept(dept: string): string {
  const map: Record<string, string> = { FRONTEND: "Frontend", BACKEND: "Backend", FULLSTACK: "Full Stack", AI: "AI", UI_UX: "UI/UX", QA: "QA", DEVOPS: "DevOps", BA: "Business Analyst" };
  return map[dept] || dept;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "border-white/15 bg-white/5 text-white/50",
  PUBLISHED: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  PAUSED: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  ARCHIVED: "border-rose-400/25 bg-rose-400/10 text-rose-200",
};

export default function PositionsPage() {
  const [positions, setPositions] = useState<InternshipPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const result = await careersApi.listPositions();
      // Handle both array (public) and paginated (admin) responses
      const positions = Array.isArray(result) ? result : (result as { data: InternshipPosition[] }).data;
      setPositions(positions);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    try {
      await careersApi.updatePosition(id, { status });
      await load();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <PageTransition>
      <PageHeader
        title="Internship Positions"
        description="Create and manage internship job openings"
        action={
          <AdminButton variant="primary" size="sm" onClick={() => setShowCreate(true)} icon={<Plus className="h-3.5 w-3.5" />}>
            Create Position
          </AdminButton>
        }
      />

      {error && <div className="mb-5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-[13px] text-rose-200">{error}</div>}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <AdminCard key={i} className="p-5"><Skeleton className="h-20 w-full" /></AdminCard>)}
        </div>
      ) : positions.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<Briefcase className="h-6 w-6" />}
            title="No positions yet"
            description="Create your first internship position to start receiving applications."
            action={
              <AdminButton variant="primary" size="sm" onClick={() => setShowCreate(true)} icon={<Plus className="h-3.5 w-3.5" />}>
                Create First Position
              </AdminButton>
            }
          />
        </AdminCard>
      ) : (
        <div className="space-y-3">
          {positions.map((pos, i) => (
            <motion.div
              key={pos.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <AdminCard className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-5">
                  <div className="flex items-center gap-3 lg:w-[35%] min-w-0">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/25 text-cyan">
                      <Briefcase className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-medium text-white truncate">{pos.title}</p>
                      <p className="text-[11.5px] text-white/45 truncate">{formatDept(pos.department)} · {pos.openings} opening{pos.openings === 1 ? "" : "s"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 lg:gap-6 lg:flex-1 text-[11.5px] text-white/55 flex-wrap">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{pos.duration}</span>
                    {pos.stipend && <span className="inline-flex items-center gap-1"><DollarSign className="h-3 w-3" />{pos.stipend}</span>}
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{pos.mode}</span>
                    <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{pos._count?.applications || 0} applied</span>
                  </div>

                  <div className="flex items-center gap-2 lg:ml-auto shrink-0">
                    <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-wider ${STATUS_COLORS[pos.status] || STATUS_COLORS.DRAFT}`}>
                      {pos.status}
                    </span>
                    <select
                      value={pos.status}
                      onChange={(e) => updateStatus(pos.id, e.target.value)}
                      className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-white focus:outline-none focus:border-cyan/40"
                    >
                      <option value="DRAFT" className="bg-ink">Draft</option>
                      <option value="PUBLISHED" className="bg-ink">Publish</option>
                      <option value="PAUSED" className="bg-ink">Pause</option>
                      <option value="ARCHIVED" className="bg-ink">Archive</option>
                    </select>
                  </div>
                </div>
              </AdminCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreated={load} />}
    </PageTransition>
  );
}

function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    title: "", department: "FRONTEND", duration: "3 months", stipend: "", mode: "REMOTE",
    location: "", openings: 1, description: "", learningOutcome: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!form.title || !form.description) { setError("Title and description are required"); return; }
    setSaving(true);
    setError(null);
    try {
      await careersApi.createPosition(form);
      onCreated();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative glass-panel-strong rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-[16px] font-semibold text-white">Create Internship Position</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="h-4 w-4" /></button>
        </div>

        {error && <div className="mb-4 rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-[12px] text-rose-200">{error}</div>}

        <div className="space-y-3">
          <div>
            <label className="block text-[12px] text-white/70 mb-1">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Frontend Developer Intern" className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/40" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-white/70 mb-1">Department</label>
              <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-cyan/40">
                {DEPARTMENTS.map((d) => <option key={d} value={d} className="bg-ink">{formatDept(d)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-white/70 mb-1">Duration</label>
              <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-cyan/40" />
            </div>
            <div>
              <label className="block text-[12px] text-white/70 mb-1">Stipend</label>
              <input value={form.stipend} onChange={(e) => setForm({ ...form, stipend: e.target.value })} placeholder="₹10,000/month" className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/40" />
            </div>
            <div>
              <label className="block text-[12px] text-white/70 mb-1">Mode</label>
              <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-cyan/40">
                <option value="REMOTE" className="bg-ink">Remote</option>
                <option value="ONSITE" className="bg-ink">On-site</option>
                <option value="HYBRID" className="bg-ink">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-white/70 mb-1">Openings</label>
              <input type="number" value={form.openings} onChange={(e) => setForm({ ...form, openings: parseInt(e.target.value) || 1 })} className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-cyan/40" />
            </div>
            <div>
              <label className="block text-[12px] text-white/70 mb-1">Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Mumbai, India" className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/40" />
            </div>
          </div>
          <div>
            <label className="block text-[12px] text-white/70 mb-1">Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="What will the intern do?" className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/40 resize-y" />
          </div>
          <div>
            <label className="block text-[12px] text-white/70 mb-1">Learning Outcome</label>
            <textarea value={form.learningOutcome} onChange={(e) => setForm({ ...form, learningOutcome: e.target.value })} rows={2} placeholder="What will the intern learn?" className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/40 resize-y" />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2 text-[13px] text-white/70 hover:bg-white/[0.07] transition-all">Cancel</button>
          <button onClick={handleCreate} disabled={saving} className="inline-flex items-center gap-1.5 rounded-lg bg-cyan text-ink font-medium text-[13px] px-4 py-2 hover:bg-cyan-soft disabled:opacity-50 transition-all">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            Create
          </button>
        </div>
      </motion.div>
    </div>
  );
}
