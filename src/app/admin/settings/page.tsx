"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Database, Bell, Shield, Trash2, Download, RefreshCw, Check } from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  AdminButton,
  SectionTitle,
  PageTransition,
} from "@/modules/admin/components/ui";

export default function SettingsPage() {
  const { submissions, refresh } = useAdmin();
  const [exported, setExported] = useState(false);
  const [cleared, setCleared] = useState(false);

  function handleExport() {
    const data = JSON.stringify(submissions, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mbtl_submissions_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }

  function handleClearAll() {
    if (
      !confirm(
        "This will delete ALL submissions from localStorage. This cannot be undone. Continue?"
      )
    )
      return;
    localStorage.removeItem("mbtl_submissions");
    localStorage.removeItem("mbtl_notifications");
    localStorage.removeItem("mbtl_seeded_v1");
    setCleared(true);
    refresh();
    setTimeout(() => window.location.reload(), 800);
  }

  function handleReseed() {
    localStorage.removeItem("mbtl_seeded_v1");
    localStorage.removeItem("mbtl_submissions");
    localStorage.removeItem("mbtl_notifications");
    refresh();
    setTimeout(() => window.location.reload(), 800);
  }

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Settings
        </h1>
        <p className="mt-1.5 text-[13.5px] text-white/55">
          Manage local data and runtime preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Storage */}
        <AdminCard className="p-6">
          <SectionTitle
            eyebrow="Storage"
            title="Local Data"
            description="All data is stored in your browser's localStorage."
            icon={<Database className="h-4 w-4 text-cyan" />}
          />
          <div className="space-y-3">
            <DataRow
              label="Submissions"
              value={`${submissions.length} records`}
            />
            <DataRow
              label="Storage Key"
              value="mbtl_submissions"
              mono
            />
            <DataRow
              label="Approx. Size"
              value={`${Math.round(
                (JSON.stringify(submissions).length / 1024).toFixed(2) as unknown as number
              )} KB`}
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <AdminButton
              variant="ghost"
              size="sm"
              onClick={handleExport}
              icon={exported ? <Check className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
            >
              {exported ? "Exported" : "Export JSON"}
            </AdminButton>
            <AdminButton
              variant="ghost"
              size="sm"
              onClick={handleReseed}
              icon={<RefreshCw className="h-3.5 w-3.5" />}
            >
              Reset Seed Data
            </AdminButton>
            <AdminButton
              variant="danger"
              size="sm"
              onClick={handleClearAll}
              icon={<Trash2 className="h-3.5 w-3.5" />}
            >
              {cleared ? "Clearing…" : "Clear All Data"}
            </AdminButton>
          </div>
        </AdminCard>

        {/* Django Integration */}
        <AdminCard className="p-6">
          <SectionTitle
            eyebrow="Backend"
            title="Django Integration"
            description="Connect to Django REST Framework when ready."
            icon={<Shield className="h-4 w-4 text-cyan" />}
          />
          <div className="space-y-3">
            <DataRow label="API Base URL" value="Not configured" />
            <DataRow label="Auth Mode" value="Local (no auth)" />
            <DataRow label="Sync Status" value="Offline mode" />
          </div>
          <div className="mt-5 rounded-lg border border-amber-400/25 bg-amber-400/[0.06] p-3">
            <p className="text-[12px] text-amber-200 leading-relaxed">
              The dashboard currently runs entirely in the browser via
              JavaScript Runtime. When Django is ready, set{" "}
              <code className="font-mono text-amber-100">
                NEXT_PUBLIC_ADMIN_API_BASE
              </code>{" "}
              and the storage engine will sync to DRF endpoints.
            </p>
          </div>
        </AdminCard>

        {/* Notifications */}
        <AdminCard className="p-6">
          <SectionTitle
            eyebrow="Preferences"
            title="Notifications"
            icon={<Bell className="h-4 w-4 text-cyan" />}
          />
          <div className="space-y-3">
            {[
              { label: "New submissions", on: true },
              { label: "Proposal status changes", on: true },
              { label: "Quotation accepted", on: true },
              { label: "Team assignments", on: false },
              { label: "Daily digest email", on: false },
            ].map((pref) => (
              <div
                key={pref.label}
                className="flex items-center justify-between"
              >
                <span className="text-[12.5px] text-white/75">{pref.label}</span>
                <span
                  className={`relative h-5 w-9 rounded-full transition-colors ${
                    pref.on ? "bg-cyan" : "bg-white/15"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-md transition-all ${
                      pref.on ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </span>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* About */}
        <AdminCard className="p-6">
          <SectionTitle
            eyebrow="System"
            title="About"
            icon={<Settings className="h-4 w-4 text-cyan" />}
          />
          <div className="space-y-3">
            <DataRow label="Version" value="1.0.0" mono />
            <DataRow label="Runtime" value="JavaScript (browser)" />
            <DataRow label="Framework" value="Next.js 16 + React 19" />
            <DataRow label="Storage" value="localStorage" />
            <DataRow label="Schema" value="mbtl_submissions v1" mono />
          </div>
        </AdminCard>
      </div>
    </PageTransition>
  );
}

function DataRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[12px] text-white/55">{label}</span>
      <span
        className={`text-[12.5px] text-white/85 ${
          mono ? "font-mono text-cyan-soft/80" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
