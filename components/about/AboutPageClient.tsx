'use client';

/**
 * AboutPageClient — Client wrapper for the About page.
 *
 * Features:
 *   - Persistent fixed 3D fluid canvas (HeroColoursOverBlack) extending from
 *     page top all the way down through the Pillar Accordion.
 *   - Tracks page scroll progress dynamically and feeds it into the shader.
 */

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import AboutHero from './AboutHero';
import AboutStoryContent from './AboutStoryContent';

const HeroColoursOverBlack = dynamic(() => import('./HeroColoursOverBlack'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black z-0" />,
});

export default function AboutPageClient() {
  const scrollProgressRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        scrollProgressRef.current = Math.min(Math.max(window.scrollY / totalScroll, 0), 1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#000000] text-white overflow-x-hidden">
      {/* ── Fixed Full-Page 3D Liquid Canvas Background ───────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroColoursOverBlack scrollProgress={scrollProgressRef} />
      </div>

      {/* ── Foreground Page Sections ─────────────────────────────────────────── */}
      <div className="relative z-10 w-full">
        {/* Immersive 3D Spatial Typography Hero */}
        <AboutHero scrollProgressRef={scrollProgressRef} />

        {/* Flagship Events & Accordion Pillars Content */}
        <AboutStoryContent />
      </div>
    </div>
  );
}
