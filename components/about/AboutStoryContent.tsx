import React from 'react';
import SabrangSpectrumReel from './SabrangSpectrumReel';
import PillarAccordion from './PillarAccordion';

export default function AboutStoryContent() {
  return (
    <div className="relative w-full bg-transparent text-white pt-8 pb-28 px-4 sm:px-8 md:px-16 overflow-hidden space-y-24 border-t border-white/5">
      {/* Background Lighting Accents synced with Sabrang Theme */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[190px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[210px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-24">
        {/* Core Spectrums Showcase */}
        <SabrangSpectrumReel />

        {/* Flagship Events Accordion Showcase */}
        <PillarAccordion />
      </div>
    </div>
  );
}
