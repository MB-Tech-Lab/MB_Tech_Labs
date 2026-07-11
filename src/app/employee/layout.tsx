"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, FolderKanban, ListTodo, Calendar, Bell, UserCog, LogOut, Menu, X, Loader2 } from "lucide-react";
import { tokenStorage } from "@/lib/api/client";
import { api } from "@/lib/api/client";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/employee", icon: LayoutDashboard },
  { label: "My Projects", href: "/employee/projects", icon: FolderKanban },
  { label: "My Tasks", href: "/employee/tasks", icon: ListTodo },
  { label: "Meetings", href: "/employee/meetings", icon: Calendar },
  { label: "Notifications", href: "/employee/notifications", icon: Bell },
  { label: "Profile", href: "/employee/profile", icon: UserCog },
];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/employee/login") return;
    if (!tokenStorage.get()) { router.replace("/employee/login"); return; }
    queueMicrotask(() => setAuthChecked(true));
  }, [router, pathname]);

  if (pathname === "/employee/login") return <>{children}</>;
  if (!authChecked) return <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0e1a" }}><Loader2 className="h-8 w-8 animate-spin text-cyan" /></div>;

  function isActive(href: string) { return href === "/employee" ? pathname === "/employee" : pathname.startsWith(href); }

  return (
    <div className="min-h-screen flex" style={{ background: "#0a0e1a", color: "#e2e8f0" }}>
      <aside className="hidden lg:flex flex-col sticky top-0 h-screen w-[240px] shrink-0 border-r" style={{ background: "#0f1428", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2.5 h-16 px-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan/15 border border-cyan/30 text-cyan"><UserCog className="h-5 w-5" /></span>
          <div><p className="font-display font-bold text-[13px] text-white">Employee Portal</p><p className="text-[9px] text-cyan-soft/60 uppercase tracking-wider">MB Tech Labs</p></div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => { const Icon = item.icon; const active = isActive(item.href); return (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] font-medium transition-all", active ? "bg-cyan/10 text-cyan border border-cyan/20" : "text-white/55 hover:text-white hover:bg-white/[0.04] border border-transparent")}>
              <Icon className="h-4 w-4 shrink-0" /><span>{item.label}</span>
            </Link>
          ); })}
        </nav>
        <div className="p-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <button onClick={() => { tokenStorage.clear(); router.push("/employee/login"); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] text-rose-300 hover:bg-rose-400/10"><LogOut className="h-4 w-4" /> Logout</button>
        </div>
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }} className="absolute left-0 top-0 bottom-0 w-[240px] flex flex-col" style={{ background: "#0f1428" }}>
              <div className="flex items-center justify-between h-16 px-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <span className="font-display font-bold text-[13px] text-white">Employee Portal</span>
                <button onClick={() => setMobileOpen(false)} className="text-white/40"><X className="h-5 w-5" /></button>
              </div>
              <nav className="flex-1 py-3 px-2 space-y-0.5">
                {NAV_ITEMS.map((item) => { const Icon = item.icon; const active = isActive(item.href); return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={cn("flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] font-medium", active ? "bg-cyan/10 text-cyan border border-cyan/20" : "text-white/55 hover:text-white hover:bg-white/[0.04]")}>
                    <Icon className="h-4 w-4" />{item.label}
                  </Link>
                ); })}
              </nav>
              <div className="p-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <button onClick={() => { tokenStorage.clear(); router.push("/employee/login"); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] text-rose-300"><LogOut className="h-4 w-4" /> Logout</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-1 min-w-0 flex flex-col h-screen">
        <header className="h-14 shrink-0 flex items-center gap-3 px-4 border-b" style={{ background: "#0f1428", borderColor: "rgba(255,255,255,0.06)" }}>
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-white/60"><Menu className="h-5 w-5" /></button>
          <span className="text-[13px] text-white/50">Employee Portal</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyan/15 border border-cyan/30 font-display font-semibold text-[12px] text-cyan-soft">EM</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto"><div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-6">{children}</div></main>
      </div>
    </div>
  );
}
