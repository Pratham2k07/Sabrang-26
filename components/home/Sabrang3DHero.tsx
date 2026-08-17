'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

import SabrangSculpture1 from '@/components/home/SabrangSculpture1';
import FloatingArtElements from '@/components/home/FloatingArtElements';
import LightningController from '@/components/home/LightningController';
import Lightfall from '@/components/effects/Lightfall';

gsap.registerPlugin(ScrollTrigger);

// Sabrang Chromatic Spectrum
const SABRANG_COLORS = ['#FF5500', '#00D2FF', '#FF007F', '#7C3AED', '#FFB700'];

// ── Fixed Camera Rig with Cinematic Scroll Parallax ────────────────────────
function CameraRig({ scrollProgress }: { scrollProgress: number }) {
  const targetPos = useRef(new THREE.Vector3(0, 0, 13.0));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();

    // Subtle cinematic camera breathing micro-drift
    const driftX = Math.sin(t * 0.4) * 0.05;
    const driftY = Math.cos(t * 0.35) * 0.04 + scrollProgress * 0.5;
    const targetZ = 13.0 + scrollProgress * 2.5;

    targetPos.current.set(driftX, driftY, targetZ);
    targetLook.current.set(0, -scrollProgress * 0.3, 0);

    camera.position.lerp(targetPos.current, 0.08);
    camera.lookAt(targetLook.current);
  });

  return null;
}

// ── Physical Light Spectrum ──────────────────────────────────────────────────

function PhysicalLightSpectrum() {
  const blueSpotRef = useRef<THREE.SpotLight>(null);
  const magentaSpotRef = useRef<THREE.SpotLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (blueSpotRef.current) {
      blueSpotRef.current.position.x = 10 + Math.sin(t * 0.5) * 3;
      blueSpotRef.current.position.y = 10 + Math.cos(t * 0.4) * 2;
    }
    if (magentaSpotRef.current) {
      magentaSpotRef.current.position.x = -10 - Math.cos(t * 0.45) * 3;
      magentaSpotRef.current.position.y = 8 + Math.sin(t * 0.35) * 2;
    }
  });

  return (
    <group>
      <directionalLight position={[0, 8, 14]} intensity={4.5} color="#ffffff" castShadow />
      <spotLight
        ref={blueSpotRef}
        position={[10, 10, 10]}
        angle={0.65}
        penumbra={0.7}
        intensity={9.5}
        color="#00d2ff"
        castShadow
      />
      <spotLight
        ref={magentaSpotRef}
        position={[-10, 8, 8]}
        angle={0.7}
        penumbra={0.8}
        intensity={8.5}
        color="#e030ff"
      />
      <spotLight position={[0, -2, 6]} angle={0.8} penumbra={0.9} intensity={5.5} color="#ffaa00" />
      <ambientLight intensity={1.2} color="#90a5c5" />
    </group>
  );
}

// ── Master Hero Component (Pristine Standalone 3D Hero) ──────────────────────

export default function Sabrang3DHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;
    if (!container || !sticky) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '160vh' }}>
      <div ref={stickyRef} className="sticky top-0 w-full h-screen overflow-hidden bg-[#030008]">
        {/* Full-Height Uniform Lightfall Background */}
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <Lightfall
            colors={SABRANG_COLORS}
            backgroundColor="#030008"
            speed={1 + scrollProgress * 0.8}
            streakCount={10}
            streakWidth={1.1}
            streakLength={1.3 + scrollProgress * 0.5}
            glow={1.1}
            density={0.9}
            twinkle={1}
            zoom={1.25}
            backgroundGlow={0.8}
            opacity={Math.max(0.15, 0.85 - scrollProgress * 0.7)}
            mouseInteraction={true}
            mouseStrength={1.1}
            mouseRadius={0.45}
            className="w-full h-full"
          />
        </div>

        {/* Three.js R3F 3D Canvas with Smooth Dissolve */}
        <div
          className="absolute inset-0 z-[5] pointer-events-none transition-opacity duration-300"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 1.3) }}
        >
          <Canvas
            camera={{ position: [0, 0, 13.0], fov: 45 }}
            dpr={[1, 1.25]}
            gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
            className="w-full h-full"
          >
            <CameraRig scrollProgress={scrollProgress} />
            <PhysicalLightSpectrum />
            <SabrangSculpture1 position={[0, scrollProgress * 0.8, 0]} scale={1.05} />
            <FloatingArtElements />
            <Sparkles count={45} scale={20} size={2.5} speed={0.4} color="#00d2ff" />
            <Sparkles count={35} scale={18} size={2.0} speed={0.3} color="#ffb700" />
            <LightningController />
          </Canvas>
        </div>

        {/* Widescreen Radial Edge Vignette Overlay */}
        <div className="absolute inset-0 z-[8] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.85)_100%)]" />

        {/* Editorial Overlay UI */}
        <div className="absolute inset-0 z-[10] pointer-events-none flex flex-col justify-between p-8 md:p-12">
          {/* Top Branding Header */}
          <div className="flex justify-between items-center w-full">
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
              SABRANG 2026
            </span>
          </div>

          {/* Bottom Scroll Prompt */}
          <div
            className="flex flex-col items-center justify-center gap-2 mb-4 transition-opacity duration-300"
            style={{ opacity: Math.max(0, 1 - scrollProgress * 2) }}
          >
            <span
              className="text-white/40 tracking-[0.5em] uppercase text-[10px] font-light"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              SCROLL TO DISCOVER
            </span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-cyan-400/60 via-purple-500/40 to-transparent animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
