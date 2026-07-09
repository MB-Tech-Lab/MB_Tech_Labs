"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Building2,
  Bell,
  Palette,
  Plug,
  Database,
  Trash2,
  Download,
  RefreshCw,
  Check,
  Moon,
  Sun,
  Globe,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Save,
} from "lucide-react";
import { useAdmin } from "@/modules/admin/context/AdminContext";
import {
  AdminCard,
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  SectionTitle,
  PageTransition,
  PageHeader,
  Tabs,
} from "@/modules/admin/components/ui";

const THEME_KEY = "mbtl_admin_theme";
const ACCENT_KEY = "mbtl_admin_accent";

const ACCENT_PRESETS = [
  { name: "Cyan", value: "#25D6FF", dark: "#25D6FF", light: "#0891B2" },
  { name: "Emerald", value: "#10B981", dark: "#10B981", light: "#059669" },
  { name: "Violet", value: "#8B5CF6", dark: "#8B5CF6", light: "#7C3AED" },
  { name: "Amber", value: "#F59E0B", dark: "#F59E0B", light: "#D97706" },
  { name: "Rose", value: "#EC4899", dark: "#EC4899", light: "#DB2777" },
  { name: "Blue", value: "#3B82F6", dark: "#3B82F6", light: "#2563EB" },
];

// Apply accent CSS variables to :root. Module-scope to avoid closure capture.
function applyAccentVars(value: string, mode: "dark" | "light") {
  if (typeof document === "undefined") return;
  const preset = ACCENT_PRESETS.find((p) => p.value === value);
  const accentValue = preset
    ? mode === "light"
      ? preset.light
      : preset.dark
    : value;
  const softValue = preset
    ? mode === "light"
      ? preset.value
      : preset.value
    : value;
  document.documentElement.style.setProperty("--admin-accent", accentValue);
  document.documentElement.style.setProperty("--admin-accent-soft", softValue);
}

const TABS = [
  { label: "Profile", value: "profile" },
  { label: "Company", value: "company" },
  { label: "Notifications", value: "notifications" },
  { label: "Integrations", value: "integrations" },
  { label: "Appearance", value: "appearance" },
];

function Toggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className="relative h-5 w-9 rounded-full transition-colors"
      style={{
        background: on ? "var(--admin-accent)" : "var(--admin-surface-2)",
        border: "1px solid var(--admin-border)",
      }}
      aria-pressed={on}
    >
      <motion.span
        layout
        transition={{ duration: 0.2 }}
        className="absolute top-0.5 h-3.5 w-3.5 rounded-full shadow-md"
        style={{
          background: on ? "#0F172A" : "var(--admin-text-muted)",
          left: on ? "auto" : "2px",
          right: on ? "2px" : "auto",
        }}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { submissions, refresh } = useAdmin();
  const [activeTab, setActiveTab] = useState("profile");
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem(THEME_KEY) as "dark" | "light" | null) ?? "dark";
  });
  const [accent, setAccent] = useState(() => {
    if (typeof window === "undefined") return "#25D6FF";
    return localStorage.getItem(ACCENT_KEY) ?? "#25D6FF";
  });
  const [exported, setExported] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // Profile form
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@mbtechlabs.com",
    role: "Super Admin",
    phone: "+91 98765 43210",
    initials: "AU",
  });

  // Company form
  const [company, setCompany] = useState({
    name: "MB Tech Labs",
    website: "https://mbtechlabs.com",
    address: "Bengaluru, Karnataka, India",
    timezone: "Asia/Kolkata (IST, UTC+5:30)",
    email: "hello@mbtechlabs.com",
    phone: "+91 80 1234 5678",
  });

  // Notification preferences
  const [notifs, setNotifs] = useState({
    newSubmissions: true,
    proposalChanges: true,
    quotationAccepted: true,
    invoiceOverdue: true,
    teamAssignments: false,
    dailyDigest: false,
    weeklyReport: true,
  });

  // Integrations
  const [integrations, setIntegrations] = useState({
    django: false,
    slack: false,
    stripe: false,
    gmail: true,
    github: true,
    figma: false,
  });

  // Apply accent CSS variable whenever it changes (external system sync)
  useEffect(() => {
    applyAccentVars(accent, theme);
  }, [accent, theme]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
    // Reapply accent for the new theme
    const adminRoot = document.querySelector(".admin-bg");
    if (next === "light") {
      adminRoot?.classList.add("admin-light");
    } else {
      adminRoot?.classList.remove("admin-light");
    }
    applyAccentVars(accent, next);
  }

  function pickAccent(value: string) {
    setAccent(value);
    localStorage.setItem(ACCENT_KEY, value);
    applyAccentVars(value, theme);
  }

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

  function handleClearCache() {
    if (
      !confirm(
        "This will clear cached UI preferences (theme, accent). Submission data will be preserved. Continue?"
      )
    )
      return;
    localStorage.removeItem(THEME_KEY);
    localStorage.removeItem(ACCENT_KEY);
    refresh();
  }

  function handleReseed() {
    if (!confirm("This will reset all data back to seed defaults. Continue?")) return;
    localStorage.removeItem("mbtl_seeded_v3");
    localStorage.removeItem("mbtl_submissions");
    localStorage.removeItem("mbtl_notifications");
    refresh();
    setTimeout(() => window.location.reload(), 600);
  }

  function handleSave() {
    setSavedAt(Date.now());
  }

  return (
    <PageTransition>
      <PageHeader
        title="Settings"
        description="Manage your profile, company, and workspace preferences"
        action={
          <AdminButton
            variant="primary"
            size="md"
            onClick={handleSave}
            icon={<Save className="h-4 w-4" />}
          >
            Save Changes
          </AdminButton>
        }
      />

      <div className="mb-6">
        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <AdminCard className="p-5 lg:col-span-2">
                <SectionTitle
                  eyebrow="Account"
                  title="Profile Information"
                  description="Update your personal account details"
                  icon={<User className="h-4 w-4" />}
                />
                <div className="flex items-center gap-4 mb-5 pb-5 border-b" style={{ borderColor: "var(--admin-border)" }}>
                  <span
                    className="inline-flex h-16 w-16 items-center justify-center rounded-2xl font-bold text-[20px]"
                    style={{
                      background: "var(--admin-accent)",
                      color: "#0F172A",
                    }}
                  >
                    {profile.initials}
                  </span>
                  <div>
                    <p
                      className="font-semibold text-[15px]"
                      style={{ color: "var(--admin-text)" }}
                    >
                      {profile.name}
                    </p>
                    <p
                      className="text-[12px]"
                      style={{ color: "var(--admin-text-secondary)" }}
                    >
                      {profile.email}
                    </p>
                    <p
                      className="text-[11px] mt-1"
                      style={{ color: "var(--admin-accent)" }}
                    >
                      {profile.role}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name" icon={<User className="h-3.5 w-3.5" />}>
                    <AdminInput
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Email Address" icon={<Mail className="h-3.5 w-3.5" />}>
                    <AdminInput
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Phone" icon={<Phone className="h-3.5 w-3.5" />}>
                    <AdminInput
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Role" icon={<Briefcase className="h-3.5 w-3.5" />}>
                    <AdminSelect
                      value={profile.role}
                      onChange={(e) =>
                        setProfile({ ...profile, role: e.target.value })
                      }
                      options={[
                        { label: "Super Admin", value: "Super Admin" },
                        { label: "Admin", value: "Admin" },
                        { label: "Project Manager", value: "Project Manager" },
                        { label: "Sales", value: "Sales" },
                        { label: "Developer", value: "Developer" },
                        { label: "Viewer", value: "Viewer" },
                      ]}
                    />
                  </Field>
                </div>
              </AdminCard>

              <AdminCard className="p-5">
                <SectionTitle
                  eyebrow="Preferences"
                  title="Quick Actions"
                  icon={<Globe className="h-4 w-4" />}
                />
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab("appearance")}
                    className="w-full rounded-lg border p-3 text-left transition-all hover:opacity-90"
                    style={{
                      background: "var(--admin-surface-2)",
                      borderColor: "var(--admin-border)",
                    }}
                  >
                    <p
                      className="text-[12.5px] font-medium"
                      style={{ color: "var(--admin-text)" }}
                    >
                      Change Appearance
                    </p>
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      Theme, accent color
                    </p>
                  </button>
                  <button
                    onClick={() => setActiveTab("notifications")}
                    className="w-full rounded-lg border p-3 text-left transition-all hover:opacity-90"
                    style={{
                      background: "var(--admin-surface-2)",
                      borderColor: "var(--admin-border)",
                    }}
                  >
                    <p
                      className="text-[12.5px] font-medium"
                      style={{ color: "var(--admin-text)" }}
                    >
                      Notification Preferences
                    </p>
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      Email and in-app alerts
                    </p>
                  </button>
                  <div
                    className="rounded-lg border p-3"
                    style={{
                      background: "var(--admin-surface-2)",
                      borderColor: "var(--admin-border)",
                    }}
                  >
                    <p
                      className="text-[11px] uppercase tracking-wider font-medium mb-2"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      Storage Used
                    </p>
                    <p
                      className="text-[18px] font-bold tabular-nums"
                      style={{ color: "var(--admin-text)" }}
                    >
                      {Math.round(
                        (JSON.stringify(submissions).length / 1024) * 10
                      ) / 10}{" "}
                      KB
                    </p>
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      {submissions.length} submissions stored
                    </p>
                  </div>
                </div>
              </AdminCard>
            </div>
          )}

          {activeTab === "company" && (
            <AdminCard className="p-5">
              <SectionTitle
                eyebrow="Organization"
                title="Company Information"
                description="Used across proposals, quotations, and invoices"
                icon={<Building2 className="h-4 w-4" />}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Company Name" icon={<Building2 className="h-3.5 w-3.5" />}>
                  <AdminInput
                    value={company.name}
                    onChange={(e) =>
                      setCompany({ ...company, name: e.target.value })
                    }
                  />
                </Field>
                <Field label="Website" icon={<Globe className="h-3.5 w-3.5" />}>
                  <AdminInput
                    value={company.website}
                    onChange={(e) =>
                      setCompany({ ...company, website: e.target.value })
                    }
                  />
                </Field>
                <Field label="Email" icon={<Mail className="h-3.5 w-3.5" />}>
                  <AdminInput
                    type="email"
                    value={company.email}
                    onChange={(e) =>
                      setCompany({ ...company, email: e.target.value })
                    }
                  />
                </Field>
                <Field label="Phone" icon={<Phone className="h-3.5 w-3.5" />}>
                  <AdminInput
                    value={company.phone}
                    onChange={(e) =>
                      setCompany({ ...company, phone: e.target.value })
                    }
                  />
                </Field>
                <Field label="Address" icon={<MapPin className="h-3.5 w-3.5" />}>
                  <AdminInput
                    value={company.address}
                    onChange={(e) =>
                      setCompany({ ...company, address: e.target.value })
                    }
                  />
                </Field>
                <Field label="Timezone" icon={<Globe className="h-3.5 w-3.5" />}>
                  <AdminSelect
                    value={company.timezone}
                    onChange={(e) =>
                      setCompany({ ...company, timezone: e.target.value })
                    }
                    options={[
                      { label: "Asia/Kolkata (IST, UTC+5:30)", value: "Asia/Kolkata (IST, UTC+5:30)" },
                      { label: "America/New_York (EST, UTC-5)", value: "America/New_York (EST, UTC-5)" },
                      { label: "Europe/London (GMT, UTC+0)", value: "Europe/London (GMT, UTC+0)" },
                      { label: "Asia/Dubai (GST, UTC+4)", value: "Asia/Dubai (GST, UTC+4)" },
                      { label: "Asia/Singapore (SGT, UTC+8)", value: "Asia/Singapore (SGT, UTC+8)" },
                    ]}
                  />
                </Field>
              </div>
            </AdminCard>
          )}

          {activeTab === "notifications" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AdminCard className="p-5">
                <SectionTitle
                  eyebrow="In-App"
                  title="Notifications"
                  description="Choose which events trigger in-app alerts"
                  icon={<Bell className="h-4 w-4" />}
                />
                <div className="space-y-3">
                  {[
                    { key: "newSubmissions", label: "New submissions received" },
                    { key: "proposalChanges", label: "Proposal status changes" },
                    { key: "quotationAccepted", label: "Quotation accepted by client" },
                    { key: "invoiceOverdue", label: "Invoice becomes overdue" },
                    { key: "teamAssignments", label: "Team member assignments" },
                  ].map((pref) => (
                    <div
                      key={pref.key}
                      className="flex items-center justify-between"
                    >
                      <span
                        className="text-[12.5px]"
                        style={{ color: "var(--admin-text-secondary)" }}
                      >
                        {pref.label}
                      </span>
                      <Toggle
                        on={notifs[pref.key as keyof typeof notifs]}
                        onChange={(v) =>
                          setNotifs({ ...notifs, [pref.key]: v })
                        }
                      />
                    </div>
                  ))}
                </div>
              </AdminCard>

              <AdminCard className="p-5">
                <SectionTitle
                  eyebrow="Email"
                  title="Email Digests"
                  description="Periodic summary emails"
                  icon={<Mail className="h-4 w-4" />}
                />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-[12.5px]"
                        style={{ color: "var(--admin-text-secondary)" }}
                      >
                        Daily digest
                      </p>
                      <p
                        className="text-[11px] mt-0.5"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        Sent at 9:00 AM IST
                      </p>
                    </div>
                    <Toggle
                      on={notifs.dailyDigest}
                      onChange={(v) => setNotifs({ ...notifs, dailyDigest: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-[12.5px]"
                        style={{ color: "var(--admin-text-secondary)" }}
                      >
                        Weekly report
                      </p>
                      <p
                        className="text-[11px] mt-0.5"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        Every Monday at 8:00 AM IST
                      </p>
                    </div>
                    <Toggle
                      on={notifs.weeklyReport}
                      onChange={(v) => setNotifs({ ...notifs, weeklyReport: v })}
                    />
                  </div>
                </div>
                <div
                  className="mt-5 pt-4 border-t rounded-lg p-3"
                  style={{
                    borderColor: "var(--admin-border)",
                    background: "var(--admin-surface-2)",
                  }}
                >
                  <p
                    className="text-[11px] leading-relaxed"
                    style={{ color: "var(--admin-text-muted)" }}
                  >
                    Email notifications are sent to{" "}
                    <span style={{ color: "var(--admin-text)" }}>
                      {profile.email}
                    </span>
                  </p>
                </div>
              </AdminCard>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { key: "django", name: "Django REST", desc: "Backend sync", icon: <Database className="h-5 w-5" />, color: "#10B981" },
                { key: "slack", name: "Slack", desc: "Team alerts", icon: <Bell className="h-5 w-5" />, color: "#EC4899" },
                { key: "stripe", name: "Stripe", desc: "Payment gateway", icon: <RefreshCw className="h-5 w-5" />, color: "#8B5CF6" },
                { key: "gmail", name: "Gmail", desc: "Email integration", icon: <Mail className="h-5 w-5" />, color: "#F59E0B" },
                { key: "github", name: "GitHub", desc: "Code repository", icon: <Database className="h-5 w-5" />, color: "#64748B" },
                { key: "figma", name: "Figma", desc: "Design handoff", icon: <Palette className="h-5 w-5" />, color: "#3B82F6" },
              ].map((int) => {
                const on = integrations[int.key as keyof typeof integrations];
                return (
                  <AdminCard key={int.key} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ background: `${int.color}1A`, color: int.color }}
                      >
                        {int.icon}
                      </span>
                      <Toggle
                        on={on}
                        onChange={(v) =>
                          setIntegrations({ ...integrations, [int.key]: v })
                        }
                      />
                    </div>
                    <p
                      className="font-semibold text-[13.5px]"
                      style={{ color: "var(--admin-text)" }}
                    >
                      {int.name}
                    </p>
                    <p
                      className="text-[11.5px] mt-0.5"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      {int.desc}
                    </p>
                    <p
                      className="text-[10.5px] mt-2 font-medium uppercase tracking-wider"
                      style={{
                        color: on ? "#10B981" : "var(--admin-text-muted)",
                      }}
                    >
                      {on ? "● Connected" : "○ Not connected"}
                    </p>
                  </AdminCard>
                );
              })}
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AdminCard className="p-5">
                <SectionTitle
                  eyebrow="Theme"
                  title="Color Mode"
                  description="Switch between dark and light appearance"
                  icon={theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                />
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => theme !== "dark" && toggleTheme()}
                    className="rounded-xl border-2 p-4 transition-all text-left"
                    style={{
                      background:
                        theme === "dark"
                          ? "var(--admin-accent)"
                          : "var(--admin-surface-2)",
                      borderColor:
                        theme === "dark"
                          ? "var(--admin-accent)"
                          : "var(--admin-border)",
                      color: theme === "dark" ? "#0F172A" : "var(--admin-text)",
                    }}
                  >
                    <Moon className="h-5 w-5 mb-2" />
                    <p className="text-[13px] font-semibold">Dark</p>
                    <p className="text-[10.5px] mt-0.5 opacity-70">
                      Default theme
                    </p>
                  </button>
                  <button
                    onClick={() => theme !== "light" && toggleTheme()}
                    className="rounded-xl border-2 p-4 transition-all text-left"
                    style={{
                      background:
                        theme === "light"
                          ? "var(--admin-accent)"
                          : "var(--admin-surface-2)",
                      borderColor:
                        theme === "light"
                          ? "var(--admin-accent)"
                          : "var(--admin-border)",
                      color: theme === "light" ? "#0F172A" : "var(--admin-text)",
                    }}
                  >
                    <Sun className="h-5 w-5 mb-2" />
                    <p className="text-[13px] font-semibold">Light</p>
                    <p className="text-[10.5px] mt-0.5 opacity-70">
                      Bright, daytime
                    </p>
                  </button>
                </div>
              </AdminCard>

              <AdminCard className="p-5">
                <SectionTitle
                  eyebrow="Brand"
                  title="Accent Color"
                  description="Highlight color used throughout the admin"
                  icon={<Palette className="h-4 w-4" />}
                />
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {ACCENT_PRESETS.map((preset) => {
                    const active = accent === preset.value;
                    return (
                      <button
                        key={preset.value}
                        onClick={() => pickAccent(preset.value)}
                        className="group relative rounded-xl border-2 p-3 transition-all"
                        style={{
                          borderColor: active
                            ? preset.value
                            : "var(--admin-border)",
                          background: active
                            ? `${preset.value}1A`
                            : "var(--admin-surface-2)",
                        }}
                      >
                        <span
                          className="block h-8 w-full rounded-lg"
                          style={{ background: preset.value }}
                        />
                        <p
                          className="text-[10.5px] mt-1.5 font-medium text-center"
                          style={{
                            color: active
                              ? preset.value
                              : "var(--admin-text-secondary)",
                          }}
                        >
                          {preset.name}
                        </p>
                        {active && (
                          <span
                            className="absolute top-1 right-1 inline-flex h-4 w-4 items-center justify-center rounded-full"
                            style={{ background: preset.value, color: "#0F172A" }}
                          >
                            <Check className="h-2.5 w-2.5" strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div
                  className="mt-4 pt-4 border-t rounded-lg p-3 flex items-center justify-between"
                  style={{
                    borderColor: "var(--admin-border)",
                    background: "var(--admin-surface-2)",
                  }}
                >
                  <div>
                    <p
                      className="text-[11px] uppercase tracking-wider font-medium"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      Current Accent
                    </p>
                    <p
                      className="text-[13px] font-mono font-medium"
                      style={{ color: "var(--admin-text)" }}
                    >
                      {accent}
                    </p>
                  </div>
                  <span
                    className="h-10 w-10 rounded-lg"
                    style={{ background: accent }}
                  />
                </div>
              </AdminCard>

              <AdminCard className="p-5 lg:col-span-2">
                <SectionTitle
                  eyebrow="Data"
                  title="Data Management"
                  description="Export, reset, or clear local cache"
                  icon={<Database className="h-4 w-4" />}
                />
                <div className="flex flex-wrap gap-2">
                  <AdminButton
                    variant="ghost"
                    size="md"
                    onClick={handleExport}
                    icon={
                      exported ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )
                    }
                  >
                    {exported ? "Exported" : "Export Data (JSON)"}
                  </AdminButton>
                  <AdminButton
                    variant="outline"
                    size="md"
                    onClick={handleClearCache}
                    icon={<RefreshCw className="h-4 w-4" />}
                  >
                    Clear Cache
                  </AdminButton>
                  <AdminButton
                    variant="ghost"
                    size="md"
                    onClick={handleReseed}
                    icon={<RefreshCw className="h-4 w-4" />}
                  >
                    Reset Seed Data
                  </AdminButton>
                  <AdminButton
                    variant="danger"
                    size="md"
                    onClick={() => {
                      if (
                        confirm(
                          "This will permanently delete ALL submissions from localStorage. This cannot be undone. Continue?"
                        )
                      ) {
                        localStorage.removeItem("mbtl_submissions");
                        localStorage.removeItem("mbtl_notifications");
                        localStorage.removeItem("mbtl_seeded_v3");
                        refresh();
                        setTimeout(() => window.location.reload(), 600);
                      }
                    }}
                    icon={<Trash2 className="h-4 w-4" />}
                  >
                    Clear All Data
                  </AdminButton>
                </div>
              </AdminCard>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {savedAt && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-[11.5px] flex items-center gap-1.5"
          style={{ color: "var(--admin-accent)" }}
        >
          <Check className="h-3 w-3" />
          Settings saved {new Date(savedAt).toLocaleTimeString()}
        </motion.p>
      )}
    </PageTransition>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-medium mb-1.5"
        style={{ color: "var(--admin-text-muted)" }}
      >
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}
