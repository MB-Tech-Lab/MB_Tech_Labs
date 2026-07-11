"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Globe,
  MessageSquare,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  Briefcase,
  LifeBuoy,
  GraduationCap,
  Handshake,
  Rocket,
  Users,
} from "lucide-react";
import { ShaderBackground } from "@/components/mb-tech-labs/ShaderBackground";
import { FloatingNav } from "@/components/mb-tech-labs/FloatingNav";
import { Footer } from "@/components/mb-tech-labs/Footer";
import Link from "next/link";

const CONTACT_CARDS = [
  { icon: Briefcase, label: "Business", email: "business@mbtechlabs.com", desc: "Partnerships, enterprise inquiries, new projects" },
  { icon: LifeBuoy, label: "Support", email: "support@mbtechlabs.com", desc: "Technical support for existing clients" },
  { icon: GraduationCap, label: "HR / Careers", email: "careers@mbtechlabs.com", desc: "Internship applications, hiring queries" },
  { icon: Handshake, label: "Sales", email: "sales@mbtechlabs.com", desc: "Pricing, quotations, scope discussions" },
];

const INQUIRY_TYPES = [
  { value: "GENERAL", label: "General Inquiry", icon: MessageSquare },
  { value: "SALES", label: "Sales", icon: Briefcase },
  { value: "SUPPORT", label: "Support", icon: LifeBuoy },
  { value: "CAREER", label: "Career", icon: GraduationCap },
  { value: "PARTNERSHIP", label: "Partnership", icon: Handshake },
  { value: "START_PROJECT", label: "Start Project", icon: Rocket },
];

const FAQS = [
  {
    q: "How quickly do you respond to inquiries?",
    a: "We respond to all inquiries within 1 business day. For urgent support requests from existing clients, our average response time is under 4 hours during working hours.",
  },
  {
    q: "What's the best way to start a new project?",
    a: "Click 'Start Your Project' anywhere on our website and complete the Software Requirement Gathering (SRG) form. It takes 8-15 minutes and gives us everything we need to prepare a detailed proposal and quotation.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. We work with clients across India, the US, UK, UAE, and Singapore. Our team operates across time zones to ensure smooth communication regardless of your location.",
  },
  {
    q: "Can I visit your office?",
    a: "We'd love to meet you. Schedule a visit via the contact form or call us during working hours. For remote clients, we're happy to set up a video call at a time that works for both time zones.",
  },
  {
    q: "I'm a student interested in an internship. Where do I apply?",
    a: "Visit our Careers page at /careers to browse open positions and apply directly through our 9-step application portal. We hire students, fresh graduates, and self-learning developers — no experience required.",
  },
];

function timeAgo() { return ""; }

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState({
    name: "", email: "", company: "", phone: "", subject: "", message: "", inquiryType: "GENERAL",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    // Simulate submission (in production, this would POST to /api/contact)
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  }

  const inputClass = "w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/50 focus:ring-2 focus:ring-cyan/15 transition-all";

  return (
    <div className="relative min-h-screen flex flex-col">
      <ShaderBackground />
      <FloatingNav />
      <main className="relative z-10 flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[12px] text-white/45 mb-6">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/70">Contact</span>
          </nav>

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
              <Mail className="h-3 w-3" /> Get in Touch
            </span>
            <h1 className="mt-5 font-display text-3xl sm:text-4xl md:text-[44px] font-semibold text-white tracking-tight leading-[1.1]">
              Let's talk about your <span className="text-gradient-cyan">project.</span>
            </h1>
            <p className="mt-4 text-[15px] text-white/55 leading-relaxed max-w-2xl">
              Whether you're building a startup, modernizing legacy systems, or need a dedicated engineering team — we're ready to help. Reach out and we'll respond within one business day.
            </p>
          </motion.div>

          {/* Contact Cards */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONTACT_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.06 }}>
                  <a href={`mailto:${card.email}`} className="glass-panel rounded-2xl p-5 block hover:border-cyan/25 transition-colors group h-full">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/25 text-cyan group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-display font-semibold text-[13px] text-white">{card.label}</h3>
                    <p className="mt-1 text-[11.5px] text-cyan-soft/70 break-all">{card.email}</p>
                    <p className="mt-2 text-[11.5px] text-white/45 leading-relaxed">{card.desc}</p>
                  </a>
                </motion.div>
              );
            })}
          </div>

          {/* Contact Info + Form */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-5">
            {/* Left: Company Info */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="space-y-4">
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="font-display text-[14px] font-semibold text-white mb-4">Company Information</h3>
                <div className="space-y-3">
                  <InfoRow icon={Phone} label="Business Phone" value="+91 98765 43210" />
                  <InfoRow icon={MapPin} label="Address" value="MB Tech Labs, Mumbai, Maharashtra, India" />
                  <InfoRow icon={Clock} label="Working Hours" value="Mon–Fri, 9:00 AM – 7:00 PM IST" />
                  <InfoRow icon={Globe} label="Website" value="mbtechlabs.com" />
                </div>
              </div>

              {/* Social Links */}
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="font-display text-[14px] font-semibold text-white mb-4">Connect With Us</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "GitHub", href: "https://github.com/mbtechlabs", icon: "🔗" },
                    { label: "LinkedIn", href: "https://linkedin.com/company/mbtechlabs", icon: "💼" },
                    { label: "Instagram", href: "https://instagram.com/mbtechlabs", icon: "📸" },
                    { label: "YouTube", href: "https://youtube.com/@mbtechlabs", icon: "▶️" },
                  ].map((social) => (
                    <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2.5 text-[12px] text-white/70 hover:border-cyan/25 hover:text-cyan-soft transition-all">
                      <span>{social.icon}</span>
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="font-display text-[14px] font-semibold text-white mb-3">Find Us</h3>
                <div className="rounded-xl border border-white/8 bg-white/[0.02] h-40 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-white/30 mx-auto" />
                    <p className="mt-2 text-[11.5px] text-white/40">Mumbai, India</p>
                    <p className="text-[10.5px] text-white/30">Map integration coming soon</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <div className="glass-panel-strong rounded-2xl p-6">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan/15 border border-cyan/40">
                      <CheckCircle2 className="h-8 w-8 text-cyan" />
                    </div>
                    <h3 className="mt-6 font-display text-xl font-semibold text-white">Message Sent!</h3>
                    <p className="mt-2 text-[13px] text-white/55 max-w-sm">
                      Thank you for reaching out. Our team will get back to you within 1 business day.
                    </p>
                    <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", company: "", phone: "", subject: "", message: "", inquiryType: "GENERAL" }); }} className="mt-5 rounded-xl border border-white/15 bg-white/[0.03] px-5 py-2.5 text-[13px] text-white/70 hover:bg-white/[0.07] transition-all">
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-display text-[16px] font-semibold text-white mb-5">Send Us a Message</h3>
                    {error && <div className="mb-4 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-[13px] text-rose-200">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Inquiry Type */}
                      <div>
                        <label className="block text-[12px] font-medium text-white/70 mb-2">Inquiry Type</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {INQUIRY_TYPES.map((type) => {
                            const Icon = type.icon;
                            const active = form.inquiryType === type.value;
                            return (
                              <button key={type.value} type="button" onClick={() => setForm({ ...form, inquiryType: type.value })} className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-[12px] transition-all ${active ? "bg-cyan/10 border-cyan/40 text-white" : "bg-white/[0.03] border-white/10 text-white/55 hover:border-white/20"}`}>
                                <Icon className="h-3.5 w-3.5" />
                                {type.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[12px] font-medium text-white/70 mb-1.5">Name *</label>
                          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-[12px] font-medium text-white/70 mb-1.5">Email *</label>
                          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@company.com" className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-[12px] font-medium text-white/70 mb-1.5">Company</label>
                          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Acme Inc" className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-[12px] font-medium text-white/70 mb-1.5">Phone</label>
                          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className={inputClass} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[12px] font-medium text-white/70 mb-1.5">Subject *</label>
                        <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="What's this about?" className={inputClass} />
                      </div>

                      <div>
                        <label className="block text-[12px] font-medium text-white/70 mb-1.5">Message *</label>
                        <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your project, question, or how we can help..." rows={5} className={`${inputClass} resize-y`} />
                      </div>

                      <button type="submit" disabled={submitting} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[14px] px-6 py-3.5 hover:bg-cyan-soft transition-all disabled:opacity-50 hover:shadow-[0_12px_40px_-8px_rgba(37,214,255,0.65)]">
                        {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : <><Send className="h-4 w-4" /> Send Message</>}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* FAQ */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mt-16">
            <h2 className="font-display text-xl font-semibold text-white mb-5">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i} className={`glass-panel rounded-xl overflow-hidden transition-colors ${isOpen ? "border-cyan/25" : ""}`}>
                    <button type="button" onClick={() => setOpenFaq(isOpen ? null : i)} className="w-full text-left px-5 py-4 flex items-center justify-between gap-4">
                      <span className="font-display font-medium text-[13.5px] text-white">{faq.q}</span>
                      <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/[0.04] border border-white/10">
                        <ChevronDown className="h-3.5 w-3.5 text-cyan" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                          <p className="px-5 pb-4 text-[13px] leading-relaxed text-white/60">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mt-16 glass-panel-strong rounded-2xl p-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
              <Sparkles className="h-3 w-3" /> Ready to Build?
            </span>
            <p className="mt-4 text-[14px] text-white/60 max-w-md mx-auto">
              Skip the back-and-forth. Submit your project requirements through our SRG portal and get a detailed proposal in 3 days.
            </p>
            <Link href="/start-project" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan text-ink font-semibold text-[14px] px-6 py-3.5 hover:bg-cyan-soft transition-all hover:shadow-[0_10px_30px_-6px_rgba(37,214,255,0.6)]">
              Start Your Project <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/25 text-cyan">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-[10.5px] uppercase tracking-wider text-white/40">{label}</p>
        <p className="text-[13px] text-white/80 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
