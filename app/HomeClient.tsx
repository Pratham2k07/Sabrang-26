'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { useInteraction } from '@/components/InteractionContext';
import Sabrang3DHero from '@/components/home/Sabrang3DHero';
import SabrangTaglineSection from '@/components/home/SabrangTaglineSection';
import SabrangCountdownSection from '@/components/home/SabrangCountdownSection';

export default function HomeClient() {
  const { user } = useAuth();
  const { setHoverState } = useInteraction();

  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);

  const pillars = [
    { title: 'PANACHE', desc: 'The ultimate fashion showdown. Assert dominance on the runway.', num: '01', state: 'primary' },
    { title: 'BANDJAM', desc: 'Pure sonic warfare under the open sky. The battle of the bands.', num: '02', state: 'secondary' },
    { title: 'STEP-UP', desc: 'Synchronized tactical dance battles. Flawless execution required.', num: '03', state: 'tertiary' },
  ];

  return (
    <div className="relative bg-[#030008] font-sans">
      {/* ── SECTION 1: MONUMENTAL 3D SABRANG SCULPTURAL HERO ───────────── */}
      <Sabrang3DHero />

      {/* ── SECTION 2: EDITORIAL FESTIVAL TAGLINE SECTION ──────────────── */}
      <SabrangTaglineSection />

      {/* ── SECTION 3: EDITORIAL FESTIVAL COUNTDOWN SECTION ────────────── */}
      <SabrangCountdownSection />

      {/* ── SECTION 4: ACCORDION HIGHLIGHTS ─────────────────────────────── */}
      <div className="h-screen w-full relative z-20 bg-black flex overflow-hidden">
        <div className="absolute top-12 left-12 pointer-events-none z-50 mix-blend-normal">
          <h2 className="text-sm tracking-[0.4em] font-light text-white/50 uppercase">Festival Highlights</h2>
          <div className="text-4xl font-light text-white mt-4">Core Directives</div>
        </div>

        {pillars.map((item, i) => {
          const isHovered = hoveredPillar === i;
          const isIdle = hoveredPillar === null;

          return (
            <motion.div
              key={i}
              onMouseEnter={() => {
                setHoveredPillar(i);
                setHoverState(item.state as any);
              }}
              onMouseLeave={() => {
                setHoveredPillar(null);
                setHoverState('idle');
              }}
              animate={{
                width: isHovered ? '80%' : isIdle ? '33.333%' : '10%',
              }}
              transition={{
                type: 'spring',
                stiffness: 250,
                damping: 30,
                mass: 0.8,
              }}
              className="relative h-full border-r border-white/10 flex items-center justify-center cursor-pointer overflow-hidden bg-black"
            >
              <motion.div
                animate={{
                  opacity: isHovered ? 1 : 0,
                  scale: isHovered ? 1 : 0.8,
                }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <h3 className="text-[15vw] font-black uppercase tracking-tighter text-white leading-none text-center whitespace-nowrap">
                  {item.title}
                </h3>
              </motion.div>

              <motion.div
                animate={{ opacity: isHovered ? 1 : 0 }}
                className="absolute bottom-12 left-12 right-12 z-10 mix-blend-normal pointer-events-none"
              >
                <p className="text-2xl font-light text-white max-w-lg">{item.desc}</p>
              </motion.div>

              <motion.div
                animate={{ opacity: isHovered ? 0 : 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mix-blend-normal"
              >
                <div className="text-4xl text-white/30 font-light mb-12">{item.num}</div>
                <h3 className="text-6xl font-medium text-white/50 tracking-widest uppercase -rotate-90 origin-center whitespace-nowrap">
                  {item.title}
                </h3>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
