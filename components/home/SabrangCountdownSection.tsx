'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Lightfall from '@/components/effects/Lightfall';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TARGET_DATE = new Date('2026-11-06T09:00:00+05:30').getTime();
const SABRANG_COLORS = ['#FF5500', '#00D2FF', '#FF007F', '#7C3AED', '#FFB700'];

export default function SabrangCountdownSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const sectionY = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [40, 0, 0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0.3]);

  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, TARGET_DATE - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const units = [
    {
      label: 'DAYS',
      value: String(timeLeft.days).padStart(2, '0'),
      color: '#FF5500',
      glow: 'rgba(255, 85, 0, 0.22)',
    },
    {
      label: 'HOURS',
      value: String(timeLeft.hours).padStart(2, '0'),
      color: '#FF007F',
      glow: 'rgba(255, 0, 127, 0.22)',
    },
    {
      label: 'MINUTES',
      value: String(timeLeft.minutes).padStart(2, '0'),
      color: '#7C3AED',
      glow: 'rgba(124, 58, 237, 0.22)',
    },
    {
      label: 'SECONDS',
      value: String(timeLeft.seconds).padStart(2, '0'),
      color: '#00D2FF',
      glow: 'rgba(0, 210, 255, 0.22)',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[75vh] flex flex-col items-center justify-center bg-[#030008] py-24 md:py-36 px-6 overflow-hidden z-10 border-b border-white/5"
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

        {/* Subtle Dark Radial Center Vignette for Clean Number Contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(3,0,8,0.75)_20%,transparent_80%)]" />
      </div>

      <motion.div
        style={{ y: sectionY, opacity }}
        className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center"
      >
        {/* ── Section Subtitle / Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-2 mb-16 text-center"
        >
          <span
            className="text-[10px] md:text-xs tracking-[0.45em] uppercase text-white/40 font-light"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            THE COUNTDOWN IS ON
          </span>
          <h3 className="text-xl md:text-2xl font-light text-white/90 tracking-widest uppercase drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
            FESTIVAL COMMENCES IN
          </h3>
        </motion.div>

        {/* ── Editorial Vertical Countdown Units ── */}
        <div className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 md:gap-y-0 relative">
            {units.map((unit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 35, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative flex flex-col items-center justify-center px-4 md:px-8 py-6 group"
              >
                {/* Subtle Hairline Vertical Divider (between items on desktop) */}
                {i > 0 && (
                  <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-28 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
                )}

                {/* Hairline Divider for Mobile (between columns) */}
                {i % 2 === 1 && (
                  <div className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-20 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
                )}

                {/* Ambient Glow Aura */}
                <div
                  className="absolute inset-0 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: unit.glow }}
                />

                {/* Large Editorial Number */}
                <div className="relative flex items-center justify-center">
                  <span
                    className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extralight text-white tracking-tight leading-none transition-transform duration-300 group-hover:scale-105"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      textShadow: `0 0 35px ${unit.glow}`,
                    }}
                  >
                    {unit.value}
                  </span>

                  {/* Subtle Color Dot Accent */}
                  <div
                    className="absolute -top-1 -right-2 w-2.5 h-2.5 rounded-full opacity-80"
                    style={{ backgroundColor: unit.color, boxShadow: `0 0 14px ${unit.color}` }}
                  />
                </div>

                {/* Small Refined Label */}
                <span
                  className="text-xs md:text-sm font-light tracking-[0.35em] text-white/50 group-hover:text-white/90 uppercase mt-4 transition-colors"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {unit.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Accent Hairline */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
          className="w-48 md:w-64 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mt-20"
        />
      </motion.div>
    </section>
  );
}
