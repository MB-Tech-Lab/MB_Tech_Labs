"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Loader2 } from "lucide-react";
import { tokenStorage } from "@/lib/api/client";

const THEME_KEY = "mbtl_admin_theme";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [authChecked, setAuthChecked] = useState(isLoginPage);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem(THEME_KEY) as "dark" | "light") ?? "dark";
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, []);

  const toggleCollapsed = useCallback(() => setCollapsed((v) => !v), []);

  // Auth guard — redirect to /admin/login if no token (skip for login page)
  useEffect(() => {
    if (isLoginPage) return;
    if (!tokenStorage.get()) {
      router.replace("/admin/login");
      return;
    }
    queueMicrotask(() => setAuthChecked(true));
  }, [router, isLoginPage]);

  // Apply theme class to admin root
  const themeClass = theme === "light" ? "admin-light" : "";

  // Login page renders without the shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0e1a" }}>
        <Loader2 className="h-8 w-8 animate-spin text-cyan" />
      </div>
    );
  }

  return (
    <div className={`admin-bg min-h-screen ${themeClass}`} style={{ color: "var(--admin-text)" }}>
      <div className="flex">
        {/* Desktop sidebar */}
        <div
          className={`hidden lg:block sticky top-0 h-screen shrink-0 transition-all duration-300 ${
            collapsed ? "w-[68px]" : "w-[260px]"
          }`}
        >
          <AdminSidebar
            collapsed={collapsed}
            onToggleCollapse={toggleCollapsed}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        </div>

        {/* Mobile sidebar drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 lg:hidden"
            >
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 top-0 bottom-0 w-[280px]"
              >
                <AdminSidebar
                  collapsed={false}
                  onNavigate={() => setMobileOpen(false)}
                  theme={theme}
                  onToggleTheme={toggleTheme}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content area */}
        <div className="flex-1 min-w-0 flex flex-col h-screen">
          <AdminTopbar
            onMenuClick={() => setMobileOpen(true)}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
