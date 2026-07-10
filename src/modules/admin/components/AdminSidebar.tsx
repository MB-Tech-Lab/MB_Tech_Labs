"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Inbox,
  Users,
  FolderKanban,
  FileText,
  Receipt,
  Calculator,
  Calendar,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  Sparkles,
  Search,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "../context/AdminContext";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "SRG Submissions", href: "/admin/submissions", icon: Inbox },
  { label: "Clients", href: "/admin/clients", icon: Users },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Proposals", href: "/admin/proposals", icon: FileText },
  { label: "Quotations", href: "/admin/quotations", icon: Calculator },
  { label: "Invoices", href: "/admin/invoices", icon: Receipt },
  { label: "Team", href: "/admin/team", icon: UserCircle },
  { label: "Calendar", href: "/admin/calendar", icon: Calendar },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({
  collapsed,
  onToggleCollapse,
  onNavigate,
  theme,
  onToggleTheme,
}: {
  collapsed: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}) {
  const pathname = usePathname();
  const { notifications } = useAdmin();
  const unreadCount = notifications.filter((n) => !n.read).length;

  function isActive(href: string): boolean {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className="h-full flex flex-col border-r"
      style={{
        background: "var(--admin-surface)",
        borderColor: "var(--admin-border)",
      }}
    >
      {/* Logo / brand */}
      <div
        className={cn(
          "flex items-center gap-3 h-16 shrink-0 border-b px-4",
          collapsed && "justify-center px-2"
        )}
        style={{ borderColor: "var(--admin-border)" }}
      >
        <div className="relative h-9 w-9 shrink-0 rounded-xl overflow-hidden ring-1 flex items-center justify-center" style={{ background: "var(--admin-accent)", borderColor: "var(--admin-border)" }}>
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-bold text-[14px] leading-tight truncate" style={{ color: "var(--admin-text)" }}>
              MB Tech Labs
            </p>
            <p className="text-[10px] leading-tight truncate" style={{ color: "var(--admin-text-muted)" }}>
              Control Center
            </p>
          </div>
        )}
      </div>

      {/* Search (collapsed = hidden) */}
      {!collapsed && (
        <div className="p-3">
          <SidebarSearch />
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const showBadge = item.label === "Notifications" && unreadCount > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all",
                collapsed && "justify-center px-2",
                active
                  ? "text-white"
                  : "hover:bg-opacity-50"
              )}
              style={{
                background: active ? "var(--admin-accent)" : "transparent",
                color: active ? "#0F172A" : "var(--admin-text-secondary)",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "var(--admin-surface-2)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {showBadge && !collapsed && (
                <span
                  className="ml-auto inline-flex items-center justify-center rounded-full text-[10px] font-bold h-5 min-w-5 px-1"
                  style={{ background: "var(--admin-accent)", color: "#0F172A" }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
              {showBadge && collapsed && (
                <span
                  className="absolute top-1 right-1 h-2 w-2 rounded-full"
                  style={{ background: "var(--admin-accent)" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: theme toggle + collapse + profile */}
      <div className="shrink-0 border-t p-2 space-y-1" style={{ borderColor: "var(--admin-border)" }}>
        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all hover:bg-opacity-50",
            collapsed && "justify-center px-2"
          )}
          style={{ color: "var(--admin-text-secondary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--admin-surface-2)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          {!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </button>

        {/* Profile */}
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2",
            collapsed && "justify-center px-2"
          )}
          style={{ background: "var(--admin-surface-2)" }}
        >
          <div
            className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center text-[11px] font-bold"
            style={{ background: "var(--admin-accent)", color: "#0F172A" }}
          >
            AD
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold truncate" style={{ color: "var(--admin-text)" }}>
                Admin User
              </p>
              <p className="text-[10px] truncate" style={{ color: "var(--admin-text-muted)" }}>
                Super Admin
              </p>
            </div>
          )}
        </div>

        {/* Collapse toggle (desktop only) */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={cn(
              "w-full hidden lg:flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all",
              collapsed && "justify-center px-2"
            )}
            style={{ color: "var(--admin-text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--admin-surface-2)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {collapsed ? (
              <ChevronRight className="h-[18px] w-[18px]" />
            ) : (
              <>
                <ChevronLeft className="h-[18px] w-[18px]" />
                <span>Collapse</span>
              </>
            )}
          </button>
        )}
      </div>
    </aside>
  );
}

function SidebarSearch() {
  const { setSearch } = useAdmin();
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "var(--admin-text-muted)" }} />
      <input
        type="text"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="w-full rounded-lg border pl-9 pr-3 py-2 text-[12.5px] focus:outline-none focus:ring-2 transition-all"
        style={{
          background: "var(--admin-surface-2)",
          borderColor: "var(--admin-border)",
          color: "var(--admin-text)",
        }}
      />
    </div>
  );
}
