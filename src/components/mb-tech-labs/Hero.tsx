"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Brain,
  Cloud,
  Shield,
  Cpu,
  Workflow,
  Lightbulb,
} from "lucide-react";

const STATS = [
  { value: "50+", label: "Projects Delivered" },
  { value: "100%", label: "Client Satisfaction" },
  { value: "24/7", label: "Support" },
];

const FLOAT_CARDS = [
  { label: "Artificial Intelligence", icon: Brain, x: "2%", y: "62%", delay: 0.6, dur: 7 },
  { label: "Cloud Computing", icon: Cloud, x: "82%", y: "18%", delay: 0.9, dur: 8.5 },
  { label: "Enterprise Software", icon: Cpu, x: "78%", y: "70%", delay: 1.1, dur: 7.6 },
  { label: "Cyber Security", icon: Shield, x: "12%", y: "22%", delay: 1.3, dur: 9 },
  { label: "Automation", icon: Workflow, x: "44%", y: "8%", delay: 1.5, dur: 8 },
  { label: "Digital Innovation", icon: Lightbulb, x: "40%", y: "82%", delay: 1.7, dur: 7.2 },
];

function useCountUp(target: number, run: boolean, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);
  return val;
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-[100svh] flex flex-col items-center justify-center pt-32 pb-16 px-5 sm:px-8 overflow-hidden"
    >
      {/* Floating glass cards (decorative, desktop+) */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        {FLOAT_CARDS.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, scale: 0.85, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: c.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ left: c.x, top: c.y }}
              className="absolute"
            >
              <div className="float-soft" style={{ animationDuration: `${c.dur}s` }}>
                <div className="glass-panel rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5">
                  <span className="h-7 w-7 rounded-lg bg-cyan/10 border border-cyan/25 inline-flex items-center justify-center">
                    <Icon className="h-3.5 w-3.5 text-cyan" />
                  </span>
                  <span className="text-[12px] text-white/80 font-medium whitespace-nowrap">
                    {c.label}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Center content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-cyan-soft"
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan" />
          MB Tech Labs
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 font-display font-semibold text-white tracking-[-0.025em] text-[40px] leading-[1.05] sm:text-6xl md:text-[76px] md:leading-[1.02]"
        >
          Building Intelligent Software
          <br className="hidden sm:block" />{" "}
          <span className="text-gradient-cyan gradient-drift">
            For Modern Businesses.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 max-w-2xl text-[15px] sm:text-[17px] leading-relaxed text-white/65"
        >
          MB Tech Labs creates enterprise-grade websites, software platforms,
          AI-powered applications, mobile solutions, cloud systems, and scalable
          digital products that help businesses grow through technology.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.66, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-col sm:flex-row items-center gap-3"
        >
          <a
            href="/start-project"
            className="group inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[14.5px] px-6 py-3.5 hover:bg-cyan-soft transition-all duration-300 hover:shadow-[0_12px_40px_-8px_rgba(37,214,255,0.65)]"
          >
            Start Your Project
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#services"
            className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] backdrop-blur-md text-white font-medium text-[14.5px] px-6 py-3.5 hover:bg-white/[0.07] hover:border-white/25 transition-all duration-300"
          >
            Explore Services
            <ArrowUpRight className="h-4 w-4 text-cyan transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 grid grid-cols-3 gap-4 sm:gap-12 w-full max-w-2xl"
        >
          {STATS.map((s) => (
            <StatItem key={s.label} value={s.value} label={s.label} run={inView} />
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">
          Scroll
        </span>
        <div className="relative h-9 w-5 rounded-full border border-white/15 flex justify-center pt-1.5">
          <motion.span
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1 rounded-full bg-cyan"
          />
        </div>
      </motion.div>
    </section>
  );
}

function StatItem({
  value,
  label,
  run,
}: {
  value: string;
  label: string;
  run: boolean;
}) {
  // For "50+", "100%", "24/7" — we just animate the numeric portion if any
  const numeric = parseInt(value, 10);
  const isNumeric = !isNaN(numeric) && /\d/.test(value);
  const suffix = isNumeric ? value.replace(/^\d+/, "") : "";
  const prefix = isNumeric ? value.match(/^[^\d]+/)?.[0] ?? "" : "";
  const count = useCountUp(isNumeric ? numeric : 0, run && isNumeric);

  return (
    <div className="text-center">
      <div className="font-display font-semibold text-3xl sm:text-4xl md:text-[44px] text-white tracking-tight tabular-nums">
        {isNumeric ? (
          <>
            {prefix}
            {count}
            {suffix}
          </>
        ) : (
          value
        )}
      </div>
      <div className="mt-1.5 text-[11px] sm:text-[12px] uppercase tracking-[0.18em] text-white/45">
        {label}
      </div>
    </div>
  );
}
