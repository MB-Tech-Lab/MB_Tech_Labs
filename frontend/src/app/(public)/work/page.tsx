import React from 'react';
import { Work } from '../../../components/work/Work';
import { CTASection } from '../../../components/shared/CTASection';

export default function WorkPage() {
  return (
    <div className="bg-[#050A1A] min-h-screen pt-16">
      <Work />
      <CTASection />
    </div>
  );
}
