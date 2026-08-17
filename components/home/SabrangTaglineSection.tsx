'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Lightfall from '@/components/effects/Lightfall';

const SABRANG_COLORS = ['#FF5500', '#00D2FF', '#FF007F', '#7C3AED', '#FFB700'];

export default function SabrangTaglineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [40, 0, 0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0.2]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[85vh] flex flex-col items-center justify-center bg-[#030008] py-28 md:py-40 px-6 overflow-hidden z-10 border-t border-white/5"
    >
      {/* ── Exact Same Lightfall Background as Hero (Pure Dark #030008 Base) ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Lightfall
          colors={SABRANG_COLORS}
          backgroundColor="#030008"
          speed={0.9}
          streakCount={10}
          streakWidth={1.1}
          streakLength={1.4}
          glow={1.1}
          density={0.8}
          twinkle={0.9}
          zoom={1.25}
          backgroundGlow={0.6}
          opacity={0.7}
          mouseInteraction={false}
          className="w-full h-full"
        />

        {/* Subtle Dark Radial Center Vignette for Clean Typography Contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(3,0,8,0.75)_20%,transparent_80%)]" />
      </div>

      {/* ── Editorial Tagline Composition ── */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 max-w-5xl text-center flex flex-col items-center gap-4"
      >
        {/* Category Pill / Accent */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-2"
        >
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-cyan-400/60" />
          <span
            className="text-[10px] md:text-xs tracking-[0.45em] uppercase text-white/40 font-light"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            FESTIVAL THEME & MOTTO
          </span>
          <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-pink-400/60" />
        </motion.div>

        {/* Line 1: WHERE EVERY COLOUR */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <h2
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-[0.18em] text-white leading-none uppercase text-center drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            WHERE EVERY COLOUR
          </h2>
        </motion.div>

        {/* Line 2: FINDS ITS WAY */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden mt-1 md:mt-3"
        >
          <h2
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-[0.2em] uppercase text-center bg-gradient-to-r from-[#FF5500] via-[#00D2FF] via-[#FF007F] to-[#FFB700] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,210,255,0.35)]"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            FINDS ITS WAY
          </h2>
        </motion.div>

        {/* Decorative Hairline Separator */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
          className="w-32 md:w-48 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mt-8"
        />
      </motion.div>
    </section>
  );
}
