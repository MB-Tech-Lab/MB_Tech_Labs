"use client";

import { motion } from "framer-motion";
import { Target, Eye, Heart, Users, Code2, Rocket, Sparkles } from "lucide-react";
import { ShaderBackground } from "@/components/mb-tech-labs/ShaderBackground";
import { FloatingNav } from "@/components/mb-tech-labs/FloatingNav";
import { Footer } from "@/components/mb-tech-labs/Footer";

const VALUES = [
  { icon: Target, title: "Engineering Excellence", desc: "We hold ourselves to the highest standards of code quality, architecture, and delivery." },
  { icon: Heart, title: "Client Obsession", desc: "We succeed when our clients succeed. Every decision starts with their outcome." },
  { icon: Code2, title: "Practical Innovation", desc: "We adopt new technology when it solves real problems — not for the sake of novelty." },
  { icon: Users, title: "Mentorship Culture", desc: "Every engineer teaches and learns. Seniority is measured by impact, not title." },
  { icon: Rocket, title: "Ship Fast, Ship Right", desc: "We balance speed and quality. Weekly demos, not quarterly death marches." },
  { icon: Sparkles, title: "Transparency", desc: "Open roadmaps, honest estimates, direct communication. No black boxes." },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <ShaderBackground />
      <FloatingNav />
      <main className="relative z-10 flex-1 pt-32 pb-20">
        <div className="mx-auto max-w-[900px] px-5 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[0.06] px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.18em] text-cyan-soft">
              <Sparkles className="h-3 w-3" /> About Us
            </span>
            <h1 className="mt-5 font-display text-3xl sm:text-5xl font-semibold text-white tracking-tight">
              We build <span className="text-gradient-cyan">software</span> that businesses depend on.
            </h1>
            <p className="mt-5 text-[15px] text-white/60 leading-relaxed max-w-2xl">
              MB Tech Labs was founded with a simple belief: great software comes from engineers who care deeply about the craft, not from process-heavy agencies chasing billable hours. We're a team of senior engineers, designers, and architects who ship production software for clients worldwide.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="glass-panel rounded-2xl p-6">
              <Target className="h-6 w-6 text-cyan" />
              <h2 className="mt-4 font-display text-[16px] font-semibold text-white">Our Mission</h2>
              <p className="mt-2 text-[13px] text-white/55 leading-relaxed">To engineer software that earns trust at scale — systems that remain fast, secure, and maintainable years after they ship.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="glass-panel rounded-2xl p-6">
              <Eye className="h-6 w-6 text-cyan" />
              <h2 className="mt-4 font-display text-[16px] font-semibold text-white">Our Vision</h2>
              <p className="mt-2 text-[13px] text-white/55 leading-relaxed">To be the engineering partner that ambitious companies call when the software they build determines whether they win or lose.</p>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mt-16">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight text-center">
              Our Core <span className="text-gradient-cyan">Values</span>
            </h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {VALUES.map((v, i) => {
                const Icon = v.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="glass-panel rounded-2xl p-5">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/25 text-cyan"><Icon className="h-5 w-5" /></span>
                    <h3 className="mt-4 font-display font-semibold text-[14px] text-white">{v.title}</h3>
                    <p className="mt-2 text-[12.5px] text-white/55 leading-relaxed">{v.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mt-16 glass-panel-strong rounded-2xl p-8">
            <h2 className="font-display text-xl font-semibold text-white">A Message from the Founder</h2>
            <blockquote className="mt-4 text-[14px] text-white/65 leading-relaxed italic">
              "We started MB Tech Labs because we were tired of seeing great companies held back by bad software. Not buggy software — badly architected software. Systems that work on day 1 but collapse under their own weight by month 6. We believe engineering excellence is not a luxury; it's the foundation every modern business deserves. That's what we build."
            </blockquote>
            <p className="mt-4 text-[13px] text-white/45">— MB Tech Labs Founding Team</p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
