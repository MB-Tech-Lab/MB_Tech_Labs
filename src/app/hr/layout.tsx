"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  Inbox,
  Users,
  FileSearch,
  Calendar,
  FileText,
  GraduationCap,
  BookOpen,
  UserCog,
  Award,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
  Loader2,
} from "lucide-react";
import { tokenStorage } from "@/lib/api/client";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/hr", icon: LayoutDashboard },
  { label: "Recruitment", href: "/hr/recruitment", icon: Briefcase, section: true },
  { label: "Job Posts", href: "/hr/jobs", icon: FileText },
  { label: "Applications", href: "/hr/applications", icon: Inbox },
  { label: "Candidates", href: "/hr/candidates", icon: Users },
  { label: "Resume Reviews", href: "/hr/resume-reviews", icon: FileSearch },
  { label: "Interviews", href: "/hr/interviews", icon: Calendar },
  { label: "Offer Letters", href: "/hr/offers", icon: FileText },
  { label: "Internships", href: "/hr/interns", icon: GraduationCap, section: true },
  { label: "Training", href: "/hr/training", icon: BookOpen },
  { label: "Employees", href: "/hr/employees", icon: UserCog },
  { label: "Certificates", href: "/hr/certificates", icon: Award },
  { label: "Reports", href: "/hr/reports", icon: BarChart3, section: true },
  { label: "Calendar", href: "/hr/calendar", icon: Calendar },
  { label: "Notifications", href: "/hr/notifications", icon: Bell },
  { label: "Settings", href: "/hr/settings", icon: Settings },
];

export default function HRLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => setCollapsed((v) => !v), []);

  useEffect(() => {
    if (pathname === "/hr/login") return;
    if (!tokenStorage.get()) {
      router.replace("/hr/login");
      return;
    }
    queueMicrotask(() => setAuthChecked(true));
  }, [router, pathname]);

  if (pathname === "/hr/login") {
    return <>{children}</>;
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0e1a" }}>
        <Loader2 className="h-8 w-8 animate-spin text-cyan" />
      </div>
    );
  }

  function isActive(href: string): boolean {
    if (href === "/hr") return pathname === "/hr";
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#0a0e1a", color: "#e2e8f0" }}>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col sticky top-0 h-screen shrink-0 transition-all duration-300 border-r",
          collapsed ? "w-[68px]" : "w-[250px]"
        )}
        style={{ background: "#0f1428", borderColor: "rgba(255,255,255,0.06)" }}
      >
        {/* Logo */}
        <div
          className={cn("flex items-center gap-2.5 h-16 shrink-0 border-b px-4", collapsed && "justify-center px-2")}
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan/15 border border-cyan/30 text-cyan">
            <UsersIcon className="h-5 w-5" />
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display font-bold text-[13px] text-white leading-tight">HR Dashboard</p>
              <p className="text-[9px] text-cyan-soft/60 tracking-[0.15em] uppercase mt-0.5">MB Tech Labs</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] font-medium transition-all",
                  collapsed && "justify-center px-2",
                  active
                    ? "bg-cyan/10 text-cyan border border-cyan/20"
                    : "text-white/55 hover:text-white hover:bg-white/[0.04] border border-transparent"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="shrink-0 p-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <button
            onClick={toggleCollapsed}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.04] transition-all"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /> Collapse</>}
          </button>
        </div>

        {/* Logout */}
        <div className="shrink-0 p-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <button
            onClick={() => { tokenStorage.clear(); router.push("/hr/login"); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] text-rose-300 hover:bg-rose-400/10 transition-all"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 top-0 bottom-0 w-[250px] flex flex-col"
              style={{ background: "#0f1428" }}
            >
              <div className="flex items-center justify-between h-16 px-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <span className="font-display font-bold text-[13px] text-white">HR Dashboard</span>
                <button onClick={() => setMobileOpen(false)} className="text-white/40"><X className="h-5 w-5" /></button>
              </div>
              <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] font-medium transition-all",
                        active ? "bg-cyan/10 text-cyan border border-cyan/20" : "text-white/55 hover:text-white hover:bg-white/[0.04] border border-transparent"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <button onClick={() => { tokenStorage.clear(); router.push("/hr/login"); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] text-rose-300 hover:bg-rose-400/10">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col h-screen">
        {/* Top bar */}
        <header className="h-14 shrink-0 flex items-center gap-3 px-4 border-b" style={{ background: "#0f1428", borderColor: "rgba(255,255,255,0.06)" }}>
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-white/60"><Menu className="h-5 w-5" /></button>
          <span className="text-[13px] text-white/50 font-medium">HR Portal</span>
          <div className="ml-auto flex items-center gap-2">
            <button className="relative h-9 w-9 inline-flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/10 text-white/60 hover:text-white">
              <Bell className="h-4 w-4" />
            </button>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyan/15 border border-cyan/30 font-display font-semibold text-[12px] text-cyan-soft">HR</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1300px] px-4 sm:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
