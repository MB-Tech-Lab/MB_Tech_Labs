import React from 'react';
import { Vision } from '../../../components/about/Vision';
import { Stats } from '../../../components/about/Stats';
import { WhyChooseUs } from '../../../components/about/WhyChooseUs';
import { Process } from '../../../components/about/Process';
import { CTASection } from '../../../components/shared/CTASection';

export default function AboutPage() {
  return (
    <div className="bg-[#050A1A] min-h-screen pt-16">
      <Vision />
      <Stats />
      <WhyChooseUs />
      <Process />
      <CTASection />
    </div>
  );
}
