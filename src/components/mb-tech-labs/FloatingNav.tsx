"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Clock } from "lucide-react";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function useLiveTime() {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hh = String(now.getUTCHours()).padStart(2, "0");
      const mm = String(now.getUTCMinutes()).padStart(2, "0");
      const ss = String(now.getUTCSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss} UTC`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const time = useLiveTime();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-[1280px]"
      >
        <nav
          className={`glass-nav rounded-2xl px-4 sm:px-5 py-2.5 flex items-center justify-between transition-all duration-500 ${
            scrolled ? "shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]" : ""
          }`}
        >
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative h-9 w-9 rounded-xl overflow-hidden ring-1 ring-white/10 bg-white/5">
              <Image
                src="/MBTechLabsLogo.png"
                alt="MB Tech Labs logo"
                fill
                className="object-contain p-1.5"
                sizes="36px"
                priority
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-semibold text-[15px] text-white tracking-tight">
                MB Tech Labs
              </span>
              <span className="text-[10px] text-cyan-soft/70 tracking-[0.18em] uppercase mt-0.5">
                Engineering
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="relative px-3.5 py-2 text-[13.5px] text-white/70 hover:text-white transition-colors duration-300 rounded-lg group"
                >
                  {item.label}
                  <span className="absolute left-3.5 right-3.5 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-cyan to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                </a>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/8">
              <Clock className="h-3.5 w-3.5 text-cyan" />
              <span className="font-mono text-[11px] text-white/75 tabular-nums tracking-tight">
                {time}
              </span>
            </div>
            <a
              href="/start-project"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-cyan text-ink font-medium text-[13px] px-4 py-2.5 hover:bg-cyan-soft transition-all duration-300 hover:shadow-[0_8px_30px_-6px_rgba(37,214,255,0.6)]"
            >
              Start Your Project
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            {/* Mobile toggle */}
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-white"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-ink/80 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-20 left-3 right-3 glass-panel-strong rounded-2xl p-3"
            >
              <ul className="flex flex-col">
                {NAV_ITEMS.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3.5 text-[15px] text-white/85 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-cyan" />
                  <span className="font-mono text-[11px] text-white/70 tabular-nums">
                    {time}
                  </span>
                </div>
                <a
                  href="/start-project"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-cyan text-ink font-medium text-[13px] px-4 py-2.5"
                >
                  Start Your Project
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
