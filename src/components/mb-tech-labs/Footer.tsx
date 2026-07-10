"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Github,
  Linkedin,
  Instagram,
  Youtube,
  ArrowRight,
  Sparkles,
} from "lucide-react";

/* ─── Section 2: Company ─── */
const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/#portfolio" },
  { label: "Process", href: "/#process" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

/* ─── Section 3: Services ─── */
const SERVICE_LINKS = [
  { label: "Custom Software", href: "/services" },
  { label: "ERP Systems", href: "/services" },
  { label: "CRM Development", href: "/services" },
  { label: "AI Solutions", href: "/services" },
  { label: "Mobile Applications", href: "/services" },
  { label: "Cloud Solutions", href: "/services" },
];

/* ─── Section 4: Resources ─── */
const RESOURCE_LINKS = [
  { label: "Technology Stack", href: "/technologies" },
  { label: "Case Studies", href: "/#portfolio" },
  { label: "Development Process", href: "/#process" },
  { label: "FAQ", href: "/#faq" },
  { label: "Blog", href: "#", comingSoon: true },
];

/* ─── Social Icons ─── */
const SOCIALS = [
  { icon: Github, label: "GitHub", href: "https://github.com/mbtechlabs" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/mbtechlabs" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/mbtechlabs" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@mbtechlabs" },
];

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/8 bg-ink/40 backdrop-blur-sm">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-14">
        {/* ─── Main grid: 5 sections ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* SECTION 1: Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative h-10 w-10 rounded-xl overflow-hidden ring-1 ring-white/10 bg-white/5">
                <Image
                  src="/MBTechLabsLogo.png"
                  alt="MB Tech Labs logo"
                  fill
                  className="object-contain p-1.5"
                  sizes="40px"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-semibold text-[16px] text-white tracking-tight group-hover:text-cyan-soft transition-colors">
                  MB Tech Labs
                </span>
                <span className="text-[10px] text-cyan-soft/70 tracking-[0.18em] uppercase mt-0.5">
                  Engineering Tomorrow
                </span>
              </div>
            </Link>
            <p className="mt-5 text-[13px] leading-relaxed text-white/50 max-w-xs">
              We build enterprise software, AI solutions, cloud platforms and
              digital products for businesses worldwide.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/50 hover:text-cyan hover:border-cyan/30 hover:bg-cyan/5 transition-all duration-300"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: Company */}
          <div className="lg:col-span-2">
            <h4 className="font-display font-semibold text-[11px] uppercase tracking-[0.2em] text-white/70 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-white/50 hover:text-cyan-soft transition-colors duration-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SECTION 3: Services */}
          <div className="lg:col-span-2">
            <h4 className="font-display font-semibold text-[11px] uppercase tracking-[0.2em] text-white/70 mb-4">
              Services
            </h4>
            <ul className="space-y-2.5">
              {SERVICE_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-white/50 hover:text-cyan-soft transition-colors duration-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SECTION 4: Resources */}
          <div className="lg:col-span-2">
            <h4 className="font-display font-semibold text-[11px] uppercase tracking-[0.2em] text-white/70 mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {RESOURCE_LINKS.map((l) => (
                <li key={l.label} className="flex items-center gap-2">
                  <Link
                    href={l.href}
                    className={`text-[13px] transition-colors duration-300 ${
                      l.comingSoon
                        ? "text-white/30 cursor-default pointer-events-none"
                        : "text-white/50 hover:text-cyan-soft"
                    }`}
                  >
                    {l.label}
                  </Link>
                  {l.comingSoon && (
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[8.5px] uppercase tracking-wider text-white/30">
                      Soon
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* SECTION 5: CTA */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-cyan/15 bg-cyan/[0.03] p-5 h-full flex flex-col justify-between">
              <div>
                <h4 className="font-display font-semibold text-[14px] text-white leading-tight">
                  Need a Software Partner?
                </h4>
                <p className="mt-2 text-[12px] text-white/50 leading-relaxed">
                  Let's discuss your idea and build something amazing together.
                </p>
              </div>
              <Link
                href="/start-project"
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-cyan text-ink font-semibold text-[12.5px] px-4 py-2.5 hover:bg-cyan-soft transition-all duration-300 group"
              >
                Start Your Project
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Bottom bar ─── */}
        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[12px] text-white/40">
            <span>© {new Date().getFullYear()} MB Tech Labs</span>
            <span className="text-white/20">·</span>
            <span className="text-cyan-soft/50">Engineering Tomorrow</span>
            <span className="text-white/20">·</span>
            <span className="flex items-center gap-1">
              Made with <span className="text-rose-400/70">♥</span> in India
            </span>
          </div>
          <div className="flex items-center gap-3 text-[12px]">
            <Link href="/privacy-policy" className="text-white/40 hover:text-white/70 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/15">•</span>
            <Link href="/terms" className="text-white/40 hover:text-white/70 transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
