"use client";

/**
 * SRG UI Primitives
 * -----------------
 * Reusable form and layout components for the SRG flow.
 * All built on the MB Tech Labs glassmorphism design language
 * with Poppins (headings) + Inter (body).
 */
import { forwardRef, type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, AlertCircle, ChevronDown } from "lucide-react";

/* --------------------------- Field wrapper --------------------------- */

export function Field({
  label,
  htmlFor,
  required,
  error,
  help,
  description,
  children,
}: {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  help?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={htmlFor}
          className="block font-display text-[13px] font-medium text-white/85"
        >
          {label}
          {required && <span className="ml-1 text-cyan">*</span>}
        </label>
      )}
      {description && (
        <p className="text-[12px] text-white/45 leading-relaxed">{description}</p>
      )}
      {children}
      {help && !error && (
        <p className="text-[11.5px] text-white/40 leading-relaxed">{help}</p>
      )}
      {error && (
        <p className="flex items-center gap-1.5 text-[11.5px] text-rose-300 leading-relaxed">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* --------------------------- Inputs --------------------------- */

const baseInputClass =
  "w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/50 focus:ring-2 focus:ring-cyan/15 transition-all duration-200";

export const TextInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { error?: boolean }
>(function TextInput({ className, error, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        baseInputClass,
        error && "border-rose-400/50 focus:border-rose-400/60 focus:ring-rose-400/15",
        className
      )}
      {...props}
    />
  );
});

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }
>(function TextArea({ className, error, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        baseInputClass,
        "min-h-[100px] resize-y leading-relaxed",
        error && "border-rose-400/50 focus:border-rose-400/60 focus:ring-rose-400/15",
        className
      )}
      {...props}
    />
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean; options: { label: string; value: string }[]; placeholder?: string }
>(function Select({ className, error, options, placeholder, ...props }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          baseInputClass,
          "appearance-none pr-10",
          error && "border-rose-400/50 focus:border-rose-400/60 focus:ring-rose-400/15",
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
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
    </div>
  );
});

/* --------------------------- Option chips --------------------------- */

export function OptionChips({
  options,
  value,
  onChange,
  multi = false,
  columns = 1,
}: {
  options: { label: string; value: string }[];
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
  multi?: boolean;
  columns?: 1 | 2;
}) {
  const selected = Array.isArray(value) ? value : value ? [value] : [];

  function toggle(v: string) {
    if (multi) {
      if (selected.includes(v)) {
        onChange(selected.filter((x) => x !== v));
      } else {
        onChange([...selected, v]);
      }
    } else {
      onChange(v === value ? "" : v);
    }
  }

  return (
    <div className={cn("grid gap-2", columns === 2 ? "sm:grid-cols-2" : "grid-cols-1")}>
      {options.map((opt) => {
        const active = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={cn(
              "group flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-[13.5px] transition-all duration-200",
              active
                ? "bg-cyan/10 border-cyan/40 text-white"
                : "bg-white/[0.03] border-white/10 text-white/70 hover:border-white/20 hover:bg-white/[0.05]"
            )}
          >
            <span
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-md border transition-all",
                active ? "bg-cyan border-cyan text-ink" : "border-white/20"
              )}
            >
              {active && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------- Rating / Scale --------------------------- */

export function RatingInput({
  value,
  onChange,
  scale = 5,
  labels,
}: {
  value: number;
  onChange: (v: number) => void;
  scale?: number;
  labels?: string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: scale }).map((_, i) => {
          const n = i + 1;
          const active = value >= n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={cn(
                "h-9 flex-1 rounded-lg border text-[12.5px] font-medium transition-all duration-200",
                active
                  ? "bg-cyan/15 border-cyan/40 text-cyan"
                  : "bg-white/[0.03] border-white/10 text-white/40 hover:border-white/20"
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
      {labels && (
        <div className="flex justify-between text-[10.5px] text-white/35 uppercase tracking-wider">
          {labels.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* --------------------------- Boolean toggle --------------------------- */

export function BooleanToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={cn(
          "flex-1 rounded-xl border px-4 py-2.5 text-[13px] font-medium transition-all",
          value === true
            ? "bg-cyan/10 border-cyan/40 text-white"
            : "bg-white/[0.03] border-white/10 text-white/60 hover:border-white/20"
        )}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={cn(
          "flex-1 rounded-xl border px-4 py-2.5 text-[13px] font-medium transition-all",
          value === false
            ? "bg-cyan/10 border-cyan/40 text-white"
            : "bg-white/[0.03] border-white/10 text-white/60 hover:border-white/20"
        )}
      >
        No
      </button>
    </div>
  );
}

/* --------------------------- Section card --------------------------- */

export function GlassCard({
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

/* --------------------------- Buttons --------------------------- */

export function PrimaryButton({
  children,
  className,
  ...props
}: InputHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[14px] px-6 py-3 hover:bg-cyan-soft transition-all duration-300 hover:shadow-[0_10px_30px_-6px_rgba(37,214,255,0.6)] disabled:opacity-40 disabled:cursor-not-allowed",
        className
      )}
      {...(props as object)}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className,
  ...props
}: InputHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] text-white font-medium text-[14px] px-6 py-3 hover:bg-white/[0.07] hover:border-white/25 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed",
        className
      )}
      {...(props as object)}
    >
      {children}
    </button>
  );
}

/* --------------------------- AnimateIn --------------------------- */

export function AnimateIn({
  children,
  delay = 0,
  y = 16,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
