'use client';

import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const LETTERS = ['S', 'A', 'B', 'R', 'A', 'N', 'G'];

const STATS = [
  { value: '50+', label: 'EVENTS', accent: '#9d4edd' },
  { value: '₹2.5L', label: 'PRIZE POOL', accent: '#ff00ff' },
  { value: '5000+', label: 'ATTENDEES', accent: '#00e5ff' },
  { value: '3', label: 'DAYS OF DOMINANCE', accent: '#ffc800' },
];

export default function SabrangEditorialHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse spring physics for interactive magnetic typography
  const mX = useMotionValue(0);
  const mY = useMotionValue(0);
  const x = useSpring(mX, { damping: 18, stiffness: 160 });
  const y = useSpring(mY, { damping: 18, stiffness: 160 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window === 'undefined') return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    mX.set((e.clientX - cx) * 0.04);
    mY.set((e.clientY - cy) * 0.04);
  };

  const handleMouseLeave = () => {
    mX.set(0);
    mY.set(0);
  };

  // GSAP ScrollTrigger timeline - Split title apart on scroll & reveal manifesto
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const ctx = gsap.context(() => {
      // Split top half upward
      gsap.to('.hero-split-top', {
        yPercent: -140,
        opacity: 0,
        scale: 1.15,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '55% top',
          scrub: 0.6,
        },
      });

      // Split bottom half downward
      gsap.to('.hero-split-bottom', {
        yPercent: 140,
        opacity: 0,
        scale: 1.15,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '55% top',
          scrub: 0.6,
        },
      });

      // Fade out badge & scroll prompt
      gsap.to('.hero-badge-wrap', {
        opacity: 0,
        scale: 0.6,
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '35% top',
          scrub: 0.5,
        },
      });

      // Reveal inner manifesto content
      gsap.fromTo(
        '.hero-reveal-manifesto',
        { opacity: 0, y: 70, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: hero,
            start: '35% top',
            end: '65% top',
            scrub: 0.8,
          },
        }
      );

      // Reveal CTA Buttons
      gsap.fromTo(
        '.hero-reveal-cta',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: hero,
            start: '50% top',
            end: '72% top',
            scrub: 0.8,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* 250vh Scroll Container */}
      <div ref={heroRef} className="h-[250vh] relative z-10">
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#030007]"
        >
          {/* Subtle Ambient Radial Lighting (Pure CSS, 0% CPU overhead) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(157, 78, 221, 0.18) 0%, rgba(0, 229, 255, 0.08) 50%, transparent 80%)',
            }}
          />

          {/* Top Brand Header */}
          <div className="hero-badge-wrap absolute top-8 left-0 right-0 flex justify-between items-center px-8 md:px-12 z-30 pointer-events-none">
            <span
              className="text-white/40 tracking-[0.45em] uppercase text-[10px] md:text-[11px] font-light"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              JK LAKSHMIPAT UNIVERSITY · JAIPUR
            </span>
            <span
              className="text-white/30 tracking-[0.35em] uppercase text-[10px] font-light hidden md:inline-block"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              2026 EDITION
            </span>
          </div>

          {/* Split SABRANG Title - Top Half */}
          <div
            className="hero-split-top absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            style={{ clipPath: 'inset(0% 0% 50% 0%)' }}
          >
            <motion.h1
              className="sabrang-editorial-title flex items-center justify-center leading-[0.85] text-center"
              style={{ x, y }}
            >
              {LETTERS.map((char, i) => (
                <span key={i} className="inline-block">
                  {char}
                </span>
              ))}
            </motion.h1>
          </div>

          {/* Split SABRANG Title - Bottom Half */}
          <div
            className="hero-split-bottom absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            style={{ clipPath: 'inset(50% 0% 0% 0%)' }}
          >
            <motion.h1
              className="sabrang-editorial-title flex items-center justify-center leading-[0.85] text-center"
              style={{ x, y }}
            >
              {LETTERS.map((char, i) => (
                <span key={i} className="inline-block">
                  {char}
                </span>
              ))}
            </motion.h1>
          </div>

          {/* Center Year Badge */}
          <div className="hero-badge-wrap absolute top-1/2 left-1/2 -translate-x-1/2 mt-[7vh] md:mt-[9vh] z-20 pointer-events-none">
            <span
              className="text-xs md:text-base font-light tracking-[0.5em] text-white/40 uppercase"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              — 2026 —
            </span>
          </div>

          {/* Inner Festival Manifesto (Reveals as Title Splits) */}
          <div className="hero-reveal-manifesto absolute inset-0 flex flex-col items-center justify-center z-15 pointer-events-none px-6">
            <div className="max-w-4xl text-center">
              <span
                className="text-[10px] md:text-xs tracking-[0.4em] text-white/40 uppercase mb-4 block font-light"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                JK LAKSHMIPAT UNIVERSITY PRESENTS
              </span>

              <h2 className="text-3xl md:text-6xl lg:text-7xl font-extralight text-white tracking-tight mb-6 leading-tight">
                The Cultural{' '}
                <span className="font-bold bg-gradient-to-r from-[#9d4edd] via-[#ff00ff] to-[#00e5ff] bg-clip-text text-transparent">
                  Phenomenon
                </span>
              </h2>

              <p className="text-base md:text-xl text-white/60 font-light max-w-2xl mx-auto leading-relaxed mb-10">
                Three days of art, music, dance, innovation, and unbridled creativity.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {STATS.map((s, idx) => (
                  <div
                    key={idx}
                    className="bg-white/[0.03] border border-white/10 backdrop-blur-md p-4 rounded-lg flex flex-col items-center"
                  >
                    <div className="text-2xl md:text-3xl font-light text-white mb-1" style={{ color: s.accent }}>
                      {s.value}
                    </div>
                    <div className="text-[9px] md:text-[10px] text-white/50 tracking-[0.2em] uppercase font-light">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hero-reveal-cta absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row items-center gap-4 z-30 pointer-events-auto">
            <Link
              href="/register"
              className="group relative px-9 py-4 bg-white text-black font-bold text-xs md:text-sm tracking-widest uppercase overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(157,78,221,0.6)] rounded-sm"
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                Register Now
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#9d4edd] via-[#ff00ff] to-[#00e5ff] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>

            <Link
              href="/events"
              className="px-9 py-4 border border-white/20 text-white/80 font-light text-xs md:text-sm tracking-widest uppercase hover:bg-white/10 hover:border-white/40 transition-all duration-300 rounded-sm"
            >
              Explore Events
            </Link>
          </div>

          {/* Scroll Prompt */}
          <div className="hero-badge-wrap absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-20">
            <span
              className="text-[9px] tracking-[0.5em] text-white/30 uppercase font-light"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              SCROLL
            </span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
          </div>
        </div>
      </div>

      <style>{`
        .sabrang-editorial-title {
          font-family: 'Cinzel', Georgia, serif;
          font-size: clamp(5rem, 16.5vw, 21rem);
          font-weight: 900;
          letter-spacing: -0.02em;

          /* Metallic Iridescent Gradient Fill */
          background: linear-gradient(
            135deg,
            #ffffff 0%,
            #e0f7fc 25%,
            #ffd0ec 50%,
            #fff3d6 75%,
            #ffffff 100%
          );
          background-size: 200% 200%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;

          /* Subtle specular drop shadow */
          filter: drop-shadow(0 0 60px rgba(157, 78, 221, 0.3));
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.35);

          animation: titleShimmer 8s ease-in-out infinite alternate;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
        }

        @keyframes titleShimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
