"use client";

import { ShaderBackground } from "@/components/mb-tech-labs/ShaderBackground";
import { FloatingNav } from "@/components/mb-tech-labs/FloatingNav";
import { Hero } from "@/components/mb-tech-labs/Hero";
import { About } from "@/components/mb-tech-labs/About";
import { Services } from "@/components/mb-tech-labs/Services";
import { Industries } from "@/components/mb-tech-labs/Industries";
import { WhyChooseUs } from "@/components/mb-tech-labs/WhyChooseUs";
import { TechStack } from "@/components/mb-tech-labs/TechStack";
import { FeaturedProjects } from "@/components/mb-tech-labs/FeaturedProjects";
import { Process } from "@/components/mb-tech-labs/Process";
import { Testimonials } from "@/components/mb-tech-labs/Testimonials";
import { Pricing } from "@/components/mb-tech-labs/Pricing";
import { FAQ } from "@/components/mb-tech-labs/FAQ";
import { CTA } from "@/components/mb-tech-labs/CTA";
import { Footer } from "@/components/mb-tech-labs/Footer";
import { Careers } from "@/components/mb-tech-labs/Careers";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <ShaderBackground />
      <FloatingNav />
      <main className="flex-1">
        <Hero />
        <About />
        <Services />
        <Industries />
        <Process />
        <FeaturedProjects />
        <TechStack />
        <WhyChooseUs />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Careers />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
