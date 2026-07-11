"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Inbox,
  Users,
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Sparkles,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useAdmin } from "../context/AdminContext";

/**
 * Phase 1 navigation — a focused Project Request Inbox.
 * Only Dashboard, Project Requests, and Clients. Team, Quotations,
 * Reports, and Settings will return in later phases.
 */
const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Project Requests", href: "/admin/submissions", icon: Inbox },
  { label: "Clients", href: "/admin/clients", icon: Users },
];

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export function AdminNav() {
  const pathname = usePathname();
  const { search, setSearch, notifications, markNotifRead, markAllNotifsRead } =
    useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // close popovers on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Mobile drawer auto-closes when a nav link is clicked (via onClick handlers).
  // No effect needed — route changes are triggered by user clicks, not programmatic.

  function isActive(href: string): boolean {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <>
      <header className="sticky top-0 z-40">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
          <div className="mt-3 glass-nav rounded-2xl px-3 sm:px-4 h-14 flex items-center gap-2 sm:gap-3">
            {/* Logo */}
            <Link
              href="/admin"
              className="flex items-center gap-2.5 shrink-0 group"
            >
              <div className="relative h-8 w-8 rounded-lg overflow-hidden ring-1 ring-white/10 bg-white/5">
                <Image
                  src="/MBTechLabsLogo.png"
                  alt="MB Tech Labs"
                  fill
                  className="object-contain p-1"
                  sizes="32px"
                />
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-display font-semibold text-[13px] text-white tracking-tight">
                  MB Tech Labs
                </span>
                <span className="text-[9px] text-cyan-soft/60 tracking-[0.18em] uppercase mt-0.5">
                  Control Center
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5 ml-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-all",
                      active
                        ? "text-white"
                        : "text-white/55 hover:text-white hover:bg-white/[0.04]"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg bg-cyan/10 border border-cyan/25 -z-10"
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Search */}
              <div
                className={cn(
                  "relative hidden md:flex items-center transition-all duration-300",
                  searchFocused ? "w-64" : "w-44"
                )}
              >
                <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-white/40" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search submissions..."
                  className="w-full rounded-lg bg-white/[0.04] border border-white/10 pl-9 pr-3 py-2 text-[12.5px] text-white placeholder:text-white/35 focus:outline-none focus:border-cyan/40 focus:ring-2 focus:ring-cyan/15 transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2 inline-flex h-5 w-5 items-center justify-center rounded text-white/40 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Notifications */}
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => setNotifOpen((v) => !v)}
                  aria-label="Notifications"
                  className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.08] transition-all"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan text-ink text-[9px] font-bold px-1">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 top-11 w-80 sm:w-96 glass-panel-strong rounded-xl overflow-hidden z-50"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                        <span className="font-display text-[13px] font-semibold text-white">
                          Notifications
                        </span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllNotifsRead}
                            className="text-[11px] text-cyan-soft hover:text-cyan transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-10 text-center text-[12.5px] text-white/40">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.slice(0, 10).map((n) => (
                            <button
                              key={n.id}
                              onClick={() => {
                                markNotifRead(n.id);
                                if (n.submissionId) {
                                  window.location.href = `/admin/submissions/${n.submissionId}`;
                                }
                              }}
                              className={cn(
                                "w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/[0.04] transition-colors flex gap-3",
                                !n.read && "bg-cyan/[0.04]"
                              )}
                            >
                              <span
                                className={cn(
                                  "mt-1.5 h-2 w-2 rounded-full shrink-0",
                                  n.read ? "bg-white/20" : "bg-cyan"
                                )}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-[12.5px] font-medium text-white">
                                  {n.title}
                                </p>
                                <p className="text-[11.5px] text-white/55 mt-0.5">
                                  {n.description}
                                </p>
                                <p className="text-[10.5px] text-white/35 mt-1">
                                  {timeAgo(n.timestamp)}
                                </p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/[0.04] border border-white/10 pl-1 pr-2 py-1 hover:bg-white/[0.08] transition-all"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-cyan/30 to-cyan/5 border border-cyan/25 font-display font-semibold text-[11px] text-cyan-soft">
                    AD
                  </span>
                  <span className="hidden sm:block text-[12px] text-white/80 font-medium">
                    Admin
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 top-11 w-56 glass-panel-strong rounded-xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="font-display text-[13px] font-semibold text-white">
                          Admin User
                        </p>
                        <p className="text-[11px] text-white/50 mt-0.5">
                          admin@mbtechlabs.com
                        </p>
                      </div>
                      <div className="py-1">
                        <div className="px-4 py-2 text-[11px] uppercase tracking-wider text-white/40">
                          Phase 1 · Request Inbox
                        </div>
                        <Link
                          href="/"
                          className="flex items-center gap-2.5 px-4 py-2 text-[12.5px] text-rose-300 hover:bg-rose-400/10 transition-colors border-t border-white/5"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Logout
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/10 text-white"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-ink/80 backdrop-blur-xl"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 bottom-0 w-72 glass-panel-strong p-4 flex flex-col"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="font-display text-[14px] font-semibold text-white">
                  Navigation
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/[0.05]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {/* mobile search */}
              <div className="relative mb-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-lg bg-white/[0.04] border border-white/10 pl-9 pr-3 py-2 text-[12.5px] text-white placeholder:text-white/35 focus:outline-none focus:border-cyan/40"
                />
              </div>
              <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "inline-flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all",
                        active
                          ? "bg-cyan/10 border border-cyan/25 text-white"
                          : "text-white/65 hover:text-white hover:bg-white/[0.04] border border-transparent"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="pt-4 border-t border-white/10 mt-4">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-rose-300 hover:bg-rose-400/10 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
