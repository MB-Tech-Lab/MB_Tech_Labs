"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  Sun,
  Moon,
  LogOut,
  Settings,
  UserCircle,
  Check,
  Plus,
  FileText,
  Calculator,
  Users,
  FolderKanban,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { usePathname } from "next/navigation";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

const QUICK_ACTIONS = [
  { label: "Create Proposal", href: "/admin/proposals", icon: FileText },
  { label: "Create Quotation", href: "/admin/quotations", icon: Calculator },
  { label: "Add Client", href: "/admin/clients", icon: Users },
  { label: "Create Project", href: "/admin/projects", icon: FolderKanban },
];

export function AdminTopbar({
  onMenuClick,
  theme,
  onToggleTheme,
}: {
  onMenuClick: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}) {
  const { search, setSearch, notifications, markNotifRead, markAllNotifsRead } =
    useAdmin();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const quickRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
      if (quickRef.current && !quickRef.current.contains(e.target as Node))
        setQuickOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 sm:px-6 border-b"
      style={{
        background: "var(--admin-surface)",
        borderColor: "var(--admin-border)",
      }}
    >
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg"
        style={{ color: "var(--admin-text-secondary)" }}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
          style={{ color: "var(--admin-text-muted)" }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients, projects, submissions..."
          className="w-full rounded-lg border pl-10 pr-3 py-2 text-[13px] focus:outline-none focus:ring-2 transition-all"
          style={{
            background: "var(--admin-surface-2)",
            borderColor: "var(--admin-border)",
            color: "var(--admin-text)",
          }}
        />
      </div>

      {/* Quick actions */}
      <div ref={quickRef} className="relative">
        <button
          onClick={() => setQuickOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all"
          style={{
            background: "var(--admin-accent)",
            color: "#0F172A",
          }}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Quick Actions</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <AnimatePresence>
          {quickOpen && (
            <Dropdown>
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    onClick={() => setQuickOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg transition-colors hover:bg-opacity-50"
                    style={{ color: "var(--admin-text-secondary)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--admin-surface-2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <Icon className="h-4 w-4" />
                    {action.label}
                  </Link>
                );
              })}
            </Dropdown>
          )}
        </AnimatePresence>
      </div>

      {/* Theme toggle */}
      <button
        onClick={onToggleTheme}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all"
        style={{
          background: "var(--admin-surface-2)",
          color: "var(--admin-text-secondary)",
        }}
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      {/* Notifications */}
      <div ref={notifRef} className="relative">
        <button
          onClick={() => setNotifOpen((v) => !v)}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all"
          style={{
            background: "var(--admin-surface-2)",
            color: "var(--admin-text-secondary)",
          }}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full text-[9px] font-bold px-1"
              style={{ background: "var(--admin-accent)", color: "#0F172A" }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
        <AnimatePresence>
          {notifOpen && (
            <div
              className="absolute right-0 top-11 w-80 sm:w-96 rounded-xl border shadow-2xl overflow-hidden z-50"
              style={{
                background: "var(--admin-surface)",
                borderColor: "var(--admin-border)",
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: "var(--admin-border)" }}
              >
                <span className="font-semibold text-[14px]" style={{ color: "var(--admin-text)" }}>
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotifsRead}
                    className="text-[11px] font-medium"
                    style={{ color: "var(--admin-accent)" }}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center text-[13px]" style={{ color: "var(--admin-text-muted)" }}>
                    No notifications yet
                  </div>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        markNotifRead(n.id);
                        if (n.submissionId)
                          window.location.href = `/admin/submissions/${n.submissionId}`;
                      }}
                      className="w-full text-left px-4 py-3 border-b transition-colors flex gap-3"
                      style={{
                        borderColor: "var(--admin-border)",
                        background: !n.read ? "rgba(37, 214, 255, 0.04)" : "transparent",
                      }}
                    >
                      <span
                        className="mt-1.5 h-2 w-2 rounded-full shrink-0"
                        style={{ background: n.read ? "var(--admin-text-muted)" : "var(--admin-accent)" }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium" style={{ color: "var(--admin-text)" }}>
                          {n.title}
                        </p>
                        <p className="text-[12px] mt-0.5" style={{ color: "var(--admin-text-secondary)" }}>
                          {n.description}
                        </p>
                        <p className="text-[10.5px] mt-1" style={{ color: "var(--admin-text-muted)" }}>
                          {timeAgo(n.timestamp)}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
              <Link
                href="/admin/notifications"
                onClick={() => setNotifOpen(false)}
                className="block py-2.5 text-center text-[12px] font-medium border-t"
                style={{ color: "var(--admin-accent)", borderColor: "var(--admin-border)" }}
              >
                View all notifications
              </Link>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile */}
      <div ref={profileRef} className="relative">
        <button
          onClick={() => setProfileOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg pl-1 pr-2 py-1 transition-all"
          style={{ background: "var(--admin-surface-2)" }}
        >
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-bold"
            style={{ background: "var(--admin-accent)", color: "#0F172A" }}
          >
            AD
          </span>
          <span className="hidden sm:block text-[13px] font-medium" style={{ color: "var(--admin-text)" }}>
            Admin
          </span>
          <ChevronDown className="h-3.5 w-3.5" style={{ color: "var(--admin-text-muted)" }} />
        </button>
        <AnimatePresence>
          {profileOpen && (
            <div
              className="absolute right-0 top-11 w-56 rounded-xl border shadow-2xl overflow-hidden z-50"
              style={{
                background: "var(--admin-surface)",
                borderColor: "var(--admin-border)",
              }}
            >
              <div className="px-4 py-3 border-b" style={{ borderColor: "var(--admin-border)" }}>
                <p className="font-semibold text-[14px]" style={{ color: "var(--admin-text)" }}>
                  Admin User
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--admin-text-muted)" }}>
                  admin@mbtechlabs.com
                </p>
              </div>
              <div className="py-1">
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-2.5 px-4 py-2 text-[13px] transition-colors"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  <UserCircle className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-2.5 px-4 py-2 text-[13px] transition-colors"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-2.5 px-4 py-2 text-[13px] border-t transition-colors"
                  style={{ color: "#ef4444", borderColor: "var(--admin-border)" }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Link>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function Dropdown({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="absolute right-0 top-11 w-48 rounded-xl border shadow-2xl overflow-hidden z-50 py-1.5 px-1.5"
      style={{
        background: "var(--admin-surface)",
        borderColor: "var(--admin-border)",
      }}
    >
      {children}
    </motion.div>
  );
}
