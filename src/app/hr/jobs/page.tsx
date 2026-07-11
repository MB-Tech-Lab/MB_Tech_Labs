"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, Plus, Clock, DollarSign, MapPin, Users, X, Loader2 } from "lucide-react";
import { hrApi } from "@/lib/api/hr";
import type { InternshipPosition } from "@/lib/api/careers";

const DEPARTMENTS = ["FRONTEND", "BACKEND", "FULLSTACK", "AI", "UI_UX", "QA", "DEVOPS", "BA"];

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "border-white/15 bg-white/5 text-white/50",
  PUBLISHED: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  PAUSED: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  ARCHIVED: "border-rose-400/25 bg-rose-400/10 text-rose-300",
};

export default function HRJobsPage() {
  const [jobs, setJobs] = useState<InternshipPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const result = await hrApi.listJobs({ pageSize: 100 });
      setJobs(result.data);
    } catch { setJobs([]); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    try { await hrApi.updateJob(id, { status }); await load(); } catch {}
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-semibold text-white">Job Posts</h1>
          <p className="text-[12.5px] text-white/45 mt-0.5">Create and manage internship positions</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-cyan text-ink font-medium text-[13px] px-4 py-2.5 hover:bg-cyan-soft transition-all">
          <Plus className="h-4 w-4" /> Create Job
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-cyan" /></div>
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border py-16 text-center" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
          <Briefcase className="h-10 w-10 text-white/25 mx-auto mb-4" />
          <h3 className="font-display text-[15px] font-semibold text-white">No job posts yet</h3>
          <p className="mt-2 text-[13px] text-white/45 max-w-sm mx-auto">Create your first internship position. Published jobs appear automatically on the careers page.</p>
          <button onClick={() => setShowCreate(true)} className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-cyan text-ink font-medium text-[13px] px-4 py-2.5 hover:bg-cyan-soft transition-all">
            <Plus className="h-4 w-4" /> Create First Job
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job, i) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.03 }}
              className="rounded-xl border p-4" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/20 text-cyan">
                    <Briefcase className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-white truncate">{job.title}</p>
                    <p className="text-[11px] text-white/40 truncate">{job.department} · {job.openings} opening{job.openings === 1 ? "" : "s"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-white/50 flex-wrap">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{job.duration}</span>
                  {job.stipend && <span className="inline-flex items-center gap-1"><DollarSign className="h-3 w-3" />{job.stipend}</span>}
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{job.mode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-wider ${STATUS_COLORS[job.status] || STATUS_COLORS.DRAFT}`}>{job.status}</span>
                  <select value={job.status} onChange={(e) => updateStatus(job.id, e.target.value)} className="rounded-lg border bg-transparent px-2 py-1 text-[11px] text-white focus:outline-none focus:border-cyan/40" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>
                    <option value="DRAFT" className="bg-ink">Draft</option>
                    <option value="PUBLISHED" className="bg-ink">Publish</option>
                    <option value="PAUSED" className="bg-ink">Pause</option>
                    <option value="ARCHIVED" className="bg-ink">Archive</option>
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showCreate && <CreateJobModal onClose={() => setShowCreate(false)} onCreated={load} />}
    </div>
  );
}

function CreateJobModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ title: "", department: "FRONTEND", duration: "3 months", stipend: "", mode: "REMOTE", openings: 1, description: "", learningOutcome: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!form.title || !form.description) { setError("Title and description are required"); return; }
    setSaving(true); setError(null);
    try { await hrApi.createJob(form); onCreated(); onClose(); }
    catch (e) { setError(e instanceof Error ? e.message : "Failed to create"); }
    finally { setSaving(false); }
  }

  const inputCls = "w-full rounded-lg border px-3 py-2.5 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/40";
  const borderStyle = { borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ background: "#0f1428", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-[16px] font-semibold text-white">Create Job Post</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        {error && <div className="mb-4 rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-[12px] text-rose-200">{error}</div>}
        <div className="space-y-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Job title" className={inputCls} style={borderStyle} />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className={inputCls} style={borderStyle}>
              {DEPARTMENTS.map((d) => <option key={d} value={d} className="bg-ink">{d}</option>)}
            </select>
            <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="3 months" className={inputCls} style={borderStyle} />
            <input value={form.stipend} onChange={(e) => setForm({ ...form, stipend: e.target.value })} placeholder="₹10,000/month" className={inputCls} style={borderStyle} />
            <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className={inputCls} style={borderStyle}>
              <option value="REMOTE" className="bg-ink">Remote</option>
              <option value="ONSITE" className="bg-ink">On-site</option>
              <option value="HYBRID" className="bg-ink">Hybrid</option>
            </select>
          </div>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Job description" className={`${inputCls} resize-y`} style={borderStyle} />
          <textarea value={form.learningOutcome} onChange={(e) => setForm({ ...form, learningOutcome: e.target.value })} rows={2} placeholder="Learning outcome" className={`${inputCls} resize-y`} style={borderStyle} />
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border px-4 py-2 text-[13px] text-white/70 hover:bg-white/5 transition-all" style={{ borderColor: "rgba(255,255,255,0.1)" }}>Cancel</button>
          <button onClick={handleCreate} disabled={saving} className="inline-flex items-center gap-1.5 rounded-lg bg-cyan text-ink font-medium text-[13px] px-4 py-2 hover:bg-cyan-soft disabled:opacity-50">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />} Create
          </button>
        </div>
      </motion.div>
    </div>
  );
}
