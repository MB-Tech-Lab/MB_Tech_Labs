"use client";

/**
 * Admin UI Primitives — Enterprise Edition
 * -----------------------------------------
 * Reusable components using CSS variables for dark/light theme support.
 * All colors reference --admin-* variables defined in globals.css.
 */
import { forwardRef, type ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { SrgStatus, Priority, DevProjectStatus } from "../types";

/* --------------------------- Card --------------------------- */

export function AdminCard({
  children,
  className,
  strong = false,
}: {
  children: ReactNode;
  className?: string;
  strong?: boolean;
}) {
  return (
    <div
      className={cn("rounded-xl border", className)}
      style={{
        background: strong ? "var(--admin-surface)" : "var(--admin-surface)",
        borderColor: "var(--admin-border)",
        boxShadow: strong
          ? "0 4px 24px -8px rgba(0,0,0,0.15)"
          : "0 2px 12px -6px rgba(0,0,0,0.1)",
      }}
    >
      {children}
    </div>
  );
}

/* --------------------------- Section heading --------------------------- */

export function SectionTitle({
  eyebrow,
  title,
  description,
  action,
  icon,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="flex items-start gap-2.5">
        {icon && (
          <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "var(--admin-surface-2)", color: "var(--admin-accent)" }}>
            {icon}
          </span>
        )}
        <div>
          {eyebrow && (
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] mb-1" style={{ color: "var(--admin-text-muted)" }}>
              {eyebrow}
            </p>
          )}
          <h3 className="font-semibold text-[16px] tracking-tight" style={{ color: "var(--admin-text)" }}>
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-[12.5px]" style={{ color: "var(--admin-text-secondary)" }}>
              {description}
            </p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

/* --------------------------- Status badge (SRG) --------------------------- */

const SRG_STATUS_COLORS: Record<string, string> = {
  New: "#25D6FF",
  Reviewing: "#3B82F6",
  "Meeting Scheduled": "#8B5CF6",
  "Proposal Ready": "#F59E0B",
  "Quotation Sent": "#F59E0B",
  Negotiation: "#F97316",
  Approved: "#10B981",
  Rejected: "#EF4444",
  Archived: "#64748B",
};

export function StatusBadge({
  status,
  className,
}: {
  status: SrgStatus;
  className?: string;
}) {
  const color = SRG_STATUS_COLORS[status] ?? "#64748B";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap",
        className
      )}
      style={{
        background: `${color}1A`,
        borderColor: `${color}40`,
        color: color,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {status}
    </span>
  );
}

/* --------------------------- Dev Project Status badge --------------------------- */

const DEV_STATUS_COLORS: Record<DevProjectStatus, string> = {
  Discovery: "#3B82F6",
  Planning: "#8B5CF6",
  "UI/UX": "#EC4899",
  Development: "#25D6FF",
  Testing: "#F59E0B",
  Deployment: "#10B981",
  Maintenance: "#64748B",
  "On Hold": "#F97316",
  Cancelled: "#EF4444",
};

export function DevStatusBadge({ status }: { status: DevProjectStatus }) {
  const color = DEV_STATUS_COLORS[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap"
      style={{ background: `${color}1A`, borderColor: `${color}40`, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {status}
    </span>
  );
}

/* --------------------------- Priority badge --------------------------- */

const PRIORITY_COLORS: Record<Priority, string> = {
  Low: "#64748B",
  Medium: "#3B82F6",
  High: "#F59E0B",
  Critical: "#EF4444",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const color = PRIORITY_COLORS[priority];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider"
      style={{ background: `${color}1A`, borderColor: `${color}40`, color }}
    >
      {priority}
    </span>
  );
}

/* --------------------------- Invoice status badge --------------------------- */

const INVOICE_STATUS_COLORS: Record<string, string> = {
  Paid: "#10B981",
  Pending: "#F59E0B",
  Overdue: "#EF4444",
  Draft: "#64748B",
};

export function InvoiceStatusBadge({ status }: { status: string }) {
  const color = INVOICE_STATUS_COLORS[status] ?? "#64748B";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap"
      style={{ background: `${color}1A`, borderColor: `${color}40`, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {status}
    </span>
  );
}

/* --------------------------- Button --------------------------- */

export function AdminButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className,
  disabled,
  type = "button",
  icon,
}: {
  children?: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "outline" | "danger" | "subtle" | "success";
  size?: "sm" | "md";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  icon?: ReactNode;
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";
  const sizes = {
    sm: "text-[12px] px-3 py-1.5",
    md: "text-[13px] px-4 py-2.5",
  };
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { background: "var(--admin-accent)", color: "#0F172A" },
    ghost: { background: "var(--admin-surface-2)", color: "var(--admin-text)", border: "1px solid var(--admin-border)" },
    outline: { background: "transparent", color: "var(--admin-text)", border: "1px solid var(--admin-border)" },
    danger: { background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" },
    subtle: { background: "transparent", color: "var(--admin-text-secondary)" },
    success: { background: "rgba(16,185,129,0.12)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, sizes[size], className)}
      style={variantStyles[variant]}
    >
      {icon}
      {children}
    </button>
  );
}

/* --------------------------- Input --------------------------- */

export const AdminInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function AdminInput({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:ring-2 transition-all",
        className
      )}
      style={{
        background: "var(--admin-surface-2)",
        borderColor: "var(--admin-border)",
        color: "var(--admin-text)",
      }}
      {...props}
    />
  );
});

export function AdminTextarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:ring-2 transition-all min-h-[100px] resize-y leading-relaxed",
        className
      )}
      style={{
        background: "var(--admin-surface-2)",
        borderColor: "var(--admin-border)",
        color: "var(--admin-text)",
      }}
      {...props}
    />
  );
}

export function AdminSelect({
  className,
  options,
  placeholder,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: { label: string; value: string }[];
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        className={cn(
          "w-full appearance-none rounded-lg border px-3.5 py-2.5 pr-10 text-[13.5px] focus:outline-none focus:ring-2 transition-all",
          className
        )}
        style={{
          background: "var(--admin-surface-2)",
          borderColor: "var(--admin-border)",
          color: "var(--admin-text)",
        }}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
        style={{ color: "var(--admin-text-muted)" }}
      />
    </div>
  );
}

/* --------------------------- Animated counter --------------------------- */

export function AnimatedCounter({
  value,
  duration = 1200,
  suffix = "",
  className,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return (
    <span className={className}>
      {display}
      {suffix}
    </span>
  );
}

/* --------------------------- Page transition --------------------------- */

export function PageTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------- Skeleton --------------------------- */

export function Skeleton({ className }: { className?: string }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      className={cn("rounded-md", className)}
      style={{ background: "var(--admin-surface-2)" }}
    />
  );
}

/* --------------------------- Empty state --------------------------- */

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && (
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "var(--admin-surface-2)", color: "var(--admin-text-muted)" }}>
          {icon}
        </div>
      )}
      <h3 className="font-semibold text-[16px]" style={{ color: "var(--admin-text)" }}>
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 text-[13px] max-w-sm" style={{ color: "var(--admin-text-secondary)" }}>
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* --------------------------- Page Header --------------------------- */

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight" style={{ color: "var(--admin-text)" }}>
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-[13.5px]" style={{ color: "var(--admin-text-secondary)" }}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* --------------------------- Progress Bar --------------------------- */

export function ProgressBar({
  value,
  max = 100,
  className,
  color,
}: {
  value: number;
  max?: number;
  className?: string;
  color?: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div
      className={cn("h-2 rounded-full overflow-hidden", className)}
      style={{ background: "var(--admin-surface-2)" }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="h-full rounded-full"
        style={{ background: color ?? "var(--admin-accent)" }}
      />
    </div>
  );
}

/* --------------------------- Avatar --------------------------- */

export function Avatar({
  initials,
  size = "md",
  color,
}: {
  initials: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}) {
  const sizes = {
    sm: "h-7 w-7 text-[10px]",
    md: "h-9 w-9 text-[12px]",
    lg: "h-12 w-12 text-[14px]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-semibold shrink-0",
        sizes[size]
      )}
      style={{
        background: color ?? "var(--admin-accent)",
        color: "#0F172A",
      }}
    >
      {initials}
    </span>
  );
}

/* --------------------------- Tabs --------------------------- */

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { label: string; value: string; count?: number }[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      className="flex items-center gap-1 overflow-x-auto border-b"
      style={{ borderColor: "var(--admin-border)" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className="relative inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors"
          style={{
            color: active === tab.value ? "var(--admin-accent)" : "var(--admin-text-secondary)",
          }}
        >
          {tab.label}
          {tab.count != null && (
            <span
              className="inline-flex items-center justify-center rounded-full text-[10px] font-bold h-4 min-w-4 px-1"
              style={{
                background: active === tab.value ? "var(--admin-accent)" : "var(--admin-surface-2)",
                color: active === tab.value ? "#0F172A" : "var(--admin-text-muted)",
              }}
            >
              {tab.count}
            </span>
          )}
          {active === tab.value && (
            <motion.span
              layoutId="tab-active"
              className="absolute bottom-0 left-0 right-0 h-0.5"
              style={{ background: "var(--admin-accent)" }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
