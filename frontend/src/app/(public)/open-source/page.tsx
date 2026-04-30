import React from 'react';
import { OpenSourceProjects } from '../../../components/open-source/OpenSourceProjects';
import { Community } from '../../../components/open-source/Community';
import { CTASection } from '../../../components/shared/CTASection';

export default function OpenSourcePage() {
  return (
    <div className="bg-[#050A1A] min-h-screen pt-16">
      <OpenSourceProjects />
      <Community />
      <CTASection />
    </div>
  );
}
