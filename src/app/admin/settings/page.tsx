"use client";

import { Settings, Database, Shield, Download, RefreshCw } from "lucide-react";
import {
  AdminCard,
  PageTransition,
  PageHeader,
} from "@/modules/admin/components/ui";
import { tokenStorage } from "@/lib/api/client";

export default function SettingsPage() {
  function handleLogout() {
    tokenStorage.clear();
    window.location.href = "/admin/login";
  }

  return (
    <PageTransition>
      <PageHeader title="Settings" description="Manage your account and system configuration" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdminCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-cyan" />
            <h3 className="font-display text-[14px] font-semibold text-white">Account</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/55">Logged in as</span>
              <span className="text-[12.5px] text-white/85">Admin User</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/55">Role</span>
              <span className="text-[12.5px] text-white/85">SUPER_ADMIN</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 w-full rounded-xl border border-rose-400/25 bg-rose-400/10 text-rose-200 font-medium text-[13px] py-2.5 hover:bg-rose-400/20 transition-all"
          >
            Logout
          </button>
        </AdminCard>

        <AdminCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-4 w-4 text-cyan" />
            <h3 className="font-display text-[14px] font-semibold text-white">System</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/55">Database</span>
              <span className="text-[12.5px] text-cyan-soft font-mono">PostgreSQL (Prisma)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/55">API</span>
              <span className="text-[12.5px] text-white/85">REST (Next.js API Routes)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/55">Auth</span>
              <span className="text-[12.5px] text-white/85">JWT + bcrypt</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/55">Version</span>
              <span className="text-[12.5px] text-white/85 font-mono">Phase 2 · v2.0.0</span>
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-4 w-4 text-cyan" />
            <h3 className="font-display text-[14px] font-semibold text-white">Architecture</h3>
          </div>
          <div className="space-y-2 text-[12px] text-white/55">
            <p>Routes → Controllers → Services → Repositories → Prisma</p>
            <p>Frontend communicates only through REST APIs</p>
            <p>No direct Prisma calls inside React components</p>
            <p>Zod validation on every endpoint</p>
            <p>JWT auth with role-based access control</p>
          </div>
        </AdminCard>

        <AdminCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Download className="h-4 w-4 text-cyan" />
            <h3 className="font-display text-[14px] font-semibold text-white">Migration</h3>
          </div>
          <div className="space-y-2 text-[12px] text-white/55">
            <p>To swap SQLite → PostgreSQL:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Change <code className="text-cyan-soft">provider</code> in <code className="text-cyan-soft">prisma/schema.prisma</code></li>
              <li>Set <code className="text-cyan-soft">DATABASE_URL</code> in <code className="text-cyan-soft">.env</code></li>
              <li>Run <code className="text-cyan-soft">prisma migrate dev</code></li>
            </ol>
            <p className="mt-2 text-[11px] text-white/40">No application code changes required.</p>
          </div>
        </AdminCard>
      </div>
    </PageTransition>
  );
}
