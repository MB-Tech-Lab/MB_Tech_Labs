"use client";

import Link from "next/link";
import { ShaderBackground } from "@/components/mb-tech-labs/ShaderBackground";
import { FloatingNav } from "@/components/mb-tech-labs/FloatingNav";
import { Footer } from "@/components/mb-tech-labs/Footer";
import { ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <ShaderBackground />
      <FloatingNav />
      <main className="relative z-10 flex-1 flex items-center justify-center pt-32 pb-20">
        <div className="text-center px-5">
          <h1 className="font-display text-6xl sm:text-8xl font-bold text-gradient-cyan tracking-tight">404</h1>
          <h2 className="mt-4 font-display text-xl sm:text-2xl font-semibold text-white">Page not found</h2>
          <p className="mt-3 text-[14px] text-white/55 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[14px] px-6 py-3.5 hover:bg-cyan-soft transition-all">
              <Home className="h-4 w-4" /> Go Home
            </Link>
            <Link href="/start-project" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] text-white font-medium text-[14px] px-6 py-3.5 hover:bg-white/[0.07] transition-all">
              Start a Project <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
