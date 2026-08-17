'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

import SabrangFestivalSculpture from '@/components/home/SabrangFestivalSculpture';
import SabrangFloorGrid from '@/components/home/dancefloor/SabrangFloorGrid';
import DanceFloorLighting from '@/components/home/dancefloor/DanceFloorLighting';
import ReflectiveFloor from '@/components/home/ReflectiveFloor';
import CrowdSilhouette from '@/components/home/CrowdSilhouette';
import ForegroundInstallation from '@/components/home/ForegroundInstallation';
import LightningController from '@/components/home/LightningController';

gsap.registerPlugin(ScrollTrigger);

// ── Cinematic Stage Camera Rig ──────────────────────────────────────────────
function StageCameraRig({ scrollProgress }: { scrollProgress: number }) {
  const targetPos = useRef(new THREE.Vector3(0, 0.4, 9.5));
  const targetLook = useRef(new THREE.Vector3(0, 0.2, 0));

  useFrame(({ camera, clock, pointer }) => {
    const t = clock.getElapsedTime();

    // Responsive parallax with subtle breathing
    const driftX = Math.sin(t * 0.35) * 0.08 + pointer.x * 0.4;
    const driftY = 0.4 + Math.cos(t * 0.3) * 0.05 + pointer.y * 0.25 - scrollProgress * 0.6;
    const targetZ = 9.5 + scrollProgress * 3.0;

    targetPos.current.set(driftX, driftY, targetZ);
    targetLook.current.set(pointer.x * 0.2, 0.2 - scrollProgress * 0.4, 0);

    camera.position.lerp(targetPos.current, 0.06);
    camera.lookAt(targetLook.current);
  });

  return null;
}

export default function SabrangStageHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#030008] select-none"
    >
      {/* ── 3D THREE.JS FESTIVAL STAGE CANVAS ─────────────────────── */}
      <div className="absolute inset-0 z-10">
        <Canvas
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.25,
          }}
          camera={{ position: [0, 0.4, 9.5], fov: 48 }}
          dpr={[1, 2]}
        >
          <color attach="background" args={['#030008']} />
          <fog attach="fog" args={['#030008', 8, 30]} />

          {/* Camera Controller */}
          <StageCameraRig scrollProgress={scrollProgress} />

          {/* Stage Lighting Rig */}
          <DanceFloorLighting />

          {/* Suspended 3D SABRANG Glass Sculpture Over Stage */}
          <SabrangFestivalSculpture position={[0, 0.6, 0]} scale={0.9} />

          {/* Interactive LED Stage Dance Floor Grid */}
          <SabrangFloorGrid scrollProgress={scrollProgress} />

          {/* Reflective Gloss Stage Floor */}
          <ReflectiveFloor />

          {/* Cheering Crowd Silhouette with Phone Sparkles */}
          <CrowdSilhouette />

          {/* Translucent Foreground Silk Fabrics */}
          <ForegroundInstallation />

          {/* Dynamic Lightning Flash Controller */}
          <LightningController />

          {/* Atmospheric Air Sparkles & Dust Motes */}
          <Sparkles
            count={70}
            scale={[16, 10, 14]}
            position={[0, 2, 0]}
            size={2.5}
            speed={0.4}
            color="#38bdf8"
          />
          <Sparkles
            count={50}
            scale={[14, 8, 12]}
            position={[0, 1, 0]}
            size={3.0}
            speed={0.5}
            color="#e030ff"
          />
          <Sparkles
            count={40}
            scale={[12, 6, 10]}
            position={[0, 0.5, 0]}
            size={2.2}
            speed={0.3}
            color="#fbbf24"
          />
        </Canvas>
      </div>

      {/* ── STAGE HERO HEADER & OVERLAY UI ────────────────────────── */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 sm:p-12">
        {/* Top Bar Status */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_#34d399]" />
            <span className="text-xs tracking-[0.35em] font-mono uppercase text-white/70">
              STAGE LIVE // SABRANG &apos;26
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-white/40 tracking-widest">
            <span>OCTOBER 2026</span>
            <span>•</span>
            <span>MAIN ARENA</span>
          </div>
        </div>

        {/* Bottom Hero Callouts */}
        <div className="w-full flex flex-col sm:flex-row items-end justify-between gap-6">
          <div className="max-w-md text-left">
            <div className="text-xs font-mono text-sky-400 tracking-[0.3em] uppercase mb-2">
              Annual Cultural &amp; Music Phenomenon
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]">
              THE MAIN STAGE
            </h1>
            <p className="text-sm text-white/60 mt-3 font-light leading-relaxed">
              Step onto the interactive kinetic dancefloor. Feel the sonic shockwaves, beam lasers, and monument of Sabrang.
            </p>
          </div>

          {/* Interactive CTAs */}
          <div className="pointer-events-auto flex items-center gap-4">
            <a
              href="#events"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white text-xs font-mono font-bold tracking-widest uppercase transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(56,189,248,0.6)]"
            >
              Explore Lineup
            </a>
            <a
              href="#about"
              className="px-6 py-3 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white text-xs font-mono tracking-widest uppercase transition-all duration-300 hover:border-white/60 hover:bg-white/10"
            >
              Festival Story
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
