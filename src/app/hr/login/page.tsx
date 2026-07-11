"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { ShaderBackground } from "@/components/mb-tech-labs/ShaderBackground";
import { authApi } from "@/lib/api/auth";

export default function HRLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@mbtechlabs.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await authApi.login(email, password);
      // Check if user has HR-related role
      const allowedRoles = ["SUPER_ADMIN", "ADMIN", "PROJECT_MANAGER"];
      if (!allowedRoles.includes(result.user.role)) {
        await authApi.logout();
        setError("Access denied. Your account does not have HR permissions.");
        return;
      }
      router.push("/hr");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <ShaderBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-panel-strong rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan/15 border border-cyan/30 mb-4">
              <Users className="h-6 w-6 text-cyan" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-white tracking-tight">
              HR Dashboard
            </h1>
            <p className="text-[12.5px] text-white/55 mt-1">
              MB Tech Labs Talent Management
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-center gap-2 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-[12.5px] text-rose-200"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-white/70 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 pl-10 pr-4 py-3 text-[13.5px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/50 focus:ring-2 focus:ring-cyan/15 transition-all"
                  placeholder="hr@mbtechlabs.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-white/70 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 pl-10 pr-4 py-3 text-[13.5px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/50 focus:ring-2 focus:ring-cyan/15 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[14px] px-6 py-3.5 hover:bg-cyan-soft transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_12px_40px_-8px_rgba(37,214,255,0.65)]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In to HR Dashboard
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/8 text-center">
            <p className="text-[11px] text-white/40">
              Authorized personnel only · HR Executives, Recruiters & HR Managers
            </p>
          </div>
          <div className="mt-4 text-center">
            <Link href="/" className="text-[12px] text-white/45 hover:text-white/70 transition-colors">
              ← Back to website
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
