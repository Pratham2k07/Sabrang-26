'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TARGET_DATE = new Date('2026-11-06T09:00:00+05:30').getTime();

export default function SabrangCountdown({ scrollProgress }: { scrollProgress: number }) {
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

  const timeUnits = [
    { label: 'DAYS', value: String(timeLeft.days).padStart(2, '0'), accent: 'from-orange-500 via-amber-400 to-yellow-500', glow: 'rgba(249,115,22,0.3)' },
    { label: 'HOURS', value: String(timeLeft.hours).padStart(2, '0'), accent: 'from-cyan-400 via-blue-500 to-indigo-500', glow: 'rgba(6,182,212,0.3)' },
    { label: 'MINUTES', value: String(timeLeft.minutes).padStart(2, '0'), accent: 'from-fuchsia-500 via-pink-500 to-rose-500', glow: 'rgba(236,72,153,0.3)' },
    { label: 'SECONDS', value: String(timeLeft.seconds).padStart(2, '0'), accent: 'from-purple-400 via-violet-500 to-indigo-600', glow: 'rgba(168,85,247,0.3)' },
  ];

  // Dynamic opacity and translateY based on scroll progress
  const countdownOpacity = Math.min(1, 0.4 + scrollProgress * 1.5);
  const countdownTranslateY = (1 - Math.min(1, scrollProgress * 1.8)) * 18;
  const countdownScale = 0.94 + Math.min(1, scrollProgress * 1.5) * 0.06;

  return (
    <div className="flex flex-col items-center justify-center gap-5 w-full max-w-4xl mx-auto px-4">
      {/* ── Official Tagline: "Where every colour finds its way" ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center gap-2"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 md:w-12 h-[1px] bg-gradient-to-r from-transparent to-cyan-400/80" />
          <span
            className="text-xs sm:text-sm md:text-base lg:text-lg font-light tracking-[0.4em] uppercase bg-gradient-to-r from-[#FF5500] via-[#00D2FF] via-[#FF007F] to-[#FFB700] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,210,255,0.4)]"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Where Every Colour Finds Its Way
          </span>
          <div className="w-8 md:w-12 h-[1px] bg-gradient-to-l from-transparent to-pink-500/80" />
        </div>
      </motion.div>

      {/* ── Live Countdown HUD Grid (Scroll Animated) ── */}
      <div
        className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 w-full max-w-2xl transition-all duration-300 ease-out"
        style={{
          opacity: countdownOpacity,
          transform: `translateY(${countdownTranslateY}px) scale(${countdownScale})`,
        }}
      >
        {timeUnits.map((unit, idx) => (
          <div
            key={idx}
            className="group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white/[0.04] border border-white/12 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.08] hover:border-white/30"
            style={{
              boxShadow: `0 8px 32px 0 ${unit.glow}`,
            }}
          >
            {/* Top Glowing Edge Bar */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-[2px] bg-gradient-to-r ${unit.accent} rounded-full opacity-70 group-hover:opacity-100 transition-opacity`} />
            
            {/* Number Display */}
            <span className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
              {unit.value}
            </span>

            {/* Unit Label */}
            <span
              className="text-[9px] sm:text-[10px] md:text-[11px] font-medium tracking-[0.25em] text-white/60 group-hover:text-white/90 uppercase mt-1 transition-colors"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
