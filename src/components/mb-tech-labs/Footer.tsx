"use client";

import Image from "next/image";
import {
  Github,
  Linkedin,
  Twitter,
  Dribbble,
  ArrowUpRight,
} from "lucide-react";

const COLUMNS = [
  {
    title: "Services",
    links: [
      "Custom Website Development",
      "Enterprise Software",
      "ERP Systems",
      "AI Solutions",
      "Mobile Apps",
      "Cloud Solutions",
    ],
  },
  {
    title: "Technologies",
    links: [
      "React & Next.js",
      "Node.js & NestJS",
      "PostgreSQL & Supabase",
      "AWS & Google Cloud",
      "OpenAI & Gemini",
      "Vercel",
    ],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Portfolio", "Process", "Contact", "Blog"],
  },
];

const SOCIALS = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Twitter, label: "Twitter / X", href: "#" },
  { icon: Dribbble, label: "Dribbble", href: "#" },
];

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/8 bg-ink/40 backdrop-blur-sm">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <a href="#home" className="flex items-center gap-2.5">
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
                <span className="font-display font-semibold text-[16px] text-white tracking-tight">
                  MB Tech Labs
                </span>
                <span className="text-[10px] text-cyan-soft/70 tracking-[0.18em] uppercase mt-0.5">
                  Engineering Tomorrow
                </span>
              </div>
            </a>
            <p className="mt-5 text-[13.5px] leading-relaxed text-white/55 max-w-sm">
              Engineering Tomorrow's Digital Future. We build enterprise-grade
              software, AI applications, mobile, cloud, and scalable digital
              products for ambitious teams worldwide.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/55 hover:text-cyan hover:border-cyan/30 hover:bg-cyan/5 transition-all duration-300"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="font-display font-semibold text-[12px] uppercase tracking-[0.18em] text-white/80">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-[13.5px] text-white/55 hover:text-cyan-soft transition-colors duration-300"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-7 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12.5px] text-white/45">
            © {new Date().getFullYear()} MB Tech Labs. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <a href="/privacy-policy" className="text-[12px] text-white/45 hover:text-white/70 transition-colors">Privacy Policy</a>
            <span className="text-white/20">·</span>
            <a href="/terms" className="text-[12px] text-white/45 hover:text-white/70 transition-colors">Terms & Conditions</a>
            <span className="text-white/20">·</span>
            <a href="/pricing-policy" className="text-[12px] text-white/45 hover:text-white/70 transition-colors">Pricing Policy</a>
            <span className="text-white/20">·</span>
            <a href="/refund-cancellation" className="text-[12px] text-white/45 hover:text-white/70 transition-colors">Refund & Cancellation</a>
            <span className="text-white/20">·</span>
            <a href="/shipping-delivery" className="text-[12px] text-white/45 hover:text-white/70 transition-colors">Shipping & Delivery</a>
            <span className="text-white/20">·</span>
            <a href="/contact" className="text-[12px] text-white/45 hover:text-white/70 transition-colors">Contact</a>
            <span className="text-white/20">·</span>
            <a href="#home" className="inline-flex items-center gap-1 text-[12px] text-cyan-soft hover:text-cyan transition-colors">
              Back to top <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
