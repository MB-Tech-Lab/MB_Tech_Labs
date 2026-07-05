"use client";

/**
 * Admin UI Primitives
 * -------------------
 * Reusable components for the Project Control Center.
 * Premium enterprise aesthetic — glassmorphism, soft shadows,
 * MB Tech Labs brand palette.
 */
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { ProjectStatus, Priority } from "../types";

/* --------------------------- Glass card --------------------------- */

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
      className={cn(
        strong ? "glass-panel-strong" : "glass-panel",
        "rounded-2xl",
        className
      )}
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
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        {eyebrow && (
          <p className="text-[10.5px] font-display font-semibold uppercase tracking-[0.22em] text-cyan-soft/70 mb-1.5">
            {eyebrow}
          </p>
        )}
        <h3 className="font-display text-[17px] font-semibold text-white tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-[12.5px] text-white/50">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/* --------------------------- Status badge --------------------------- */

const STATUS_COLORS: Record<ProjectStatus, string> = {
  New: "bg-cyan/15 text-cyan-soft border-cyan/30",
  Reviewing: "bg-blue-400/15 text-blue-200 border-blue-400/30",
  "Meeting Scheduled": "bg-violet-400/15 text-violet-200 border-violet-400/30",
  "Proposal Ready": "bg-amber-400/15 text-amber-200 border-amber-400/30",
  "Quotation Sent": "bg-amber-400/15 text-amber-200 border-amber-400/30",
  Negotiation: "bg-orange-400/15 text-orange-200 border-orange-400/30",
  Approved: "bg-emerald-400/15 text-emerald-200 border-emerald-400/30",
  Development: "bg-cyan/15 text-cyan-soft border-cyan/30",
  Testing: "bg-purple-400/15 text-purple-200 border-purple-400/30",
  Delivered: "bg-teal-400/15 text-teal-200 border-teal-400/30",
  Completed: "bg-emerald-400/15 text-emerald-200 border-emerald-400/30",
  Rejected: "bg-rose-400/15 text-rose-200 border-rose-400/30",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap",
        STATUS_COLORS[status] ?? STATUS_COLORS.New,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
}

/* --------------------------- Priority badge --------------------------- */

const PRIORITY_COLORS: Record<Priority, string> = {
  Low: "bg-white/5 text-white/50 border-white/15",
  Medium: "bg-blue-400/10 text-blue-200 border-blue-400/25",
  High: "bg-amber-400/10 text-amber-200 border-amber-400/25",
  Critical: "bg-rose-400/10 text-rose-200 border-rose-400/25",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider",
        PRIORITY_COLORS[priority]
      )}
    >
      {priority}
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
  variant?: "primary" | "ghost" | "outline" | "danger" | "subtle";
  size?: "sm" | "md";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  icon?: ReactNode;
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-xl font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";
  const sizes = {
    sm: "text-[12px] px-3 py-1.5",
    md: "text-[13px] px-4 py-2.5",
  };
  const variants = {
    primary:
      "bg-cyan text-ink hover:bg-cyan-soft hover:shadow-[0_8px_30px_-6px_rgba(37,214,255,0.55)]",
    ghost:
      "bg-white/[0.04] text-white/80 border border-white/10 hover:bg-white/[0.08] hover:border-white/20",
    outline:
      "bg-transparent text-white border border-white/15 hover:bg-white/[0.04] hover:border-white/25",
    danger:
      "bg-rose-500/15 text-rose-200 border border-rose-400/25 hover:bg-rose-500/25",
    subtle:
      "bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.05]",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, sizes[size], variants[variant], className)}
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
        "w-full rounded-lg bg-white/[0.04] border border-white/10 px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/50 focus:ring-2 focus:ring-cyan/15 transition-all",
        className
      )}
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
        "w-full rounded-lg bg-white/[0.04] border border-white/10 px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/50 focus:ring-2 focus:ring-cyan/15 transition-all min-h-[100px] resize-y leading-relaxed",
        className
      )}
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
          "w-full appearance-none rounded-lg bg-white/[0.04] border border-white/10 px-3.5 py-2.5 pr-10 text-[13.5px] text-white focus:outline-none focus:border-cyan/50 focus:ring-2 focus:ring-cyan/15 transition-all",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled className="bg-ink text-white/40">
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-ink text-white">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
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
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={value}
    >
      <CounterInner value={value} duration={duration} suffix={suffix} />
    </motion.span>
  );
}

function CounterInner({
  value,
  duration,
  suffix,
}: {
  value: number;
  duration: number;
  suffix: string;
}) {
  return (
    <motion.span
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <CountUp value={value} duration={duration} />
      {suffix}
    </motion.span>
  );
}

function CountUp({ value, duration }: { value: number; duration: number }) {
  // Use a state + rAF loop
  return <CountUpImpl value={value} duration={duration} />;
}

import { useEffect, useState } from "react";

function CountUpImpl({ value, duration }: { value: number; duration: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{display}</>;
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
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
      className={cn("rounded-md bg-white/[0.06]", className)}
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
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/10 text-white/40">
          {icon}
        </div>
      )}
      <h3 className="font-display text-[16px] font-semibold text-white">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 text-[13px] text-white/50 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
