'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * DanceFloorLighting — Ultra-Fast 60 FPS Lighting Rig
 */
export default function DanceFloorLighting() {
  const leftSpotRef = useRef<THREE.SpotLight>(null);
  const rightSpotRef = useRef<THREE.SpotLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (leftSpotRef.current) {
      leftSpotRef.current.intensity = 32.0 + Math.sin(t * 1.5) * 5.0;
    }
    if (rightSpotRef.current) {
      rightSpotRef.current.intensity = 35.0 + Math.cos(t * 1.2) * 5.0;
    }
  });

  return (
    <group>
      {/* Directional Overhead Key Light */}
      <directionalLight position={[0, 12, 10]} intensity={4.5} color="#ffffff" />

      {/* Front Key Spot */}
      <spotLight
        position={[0, 9, 12]}
        angle={0.85}
        penumbra={0.8}
        intensity={38.0}
        color="#00d2ff"
      />

      {/* Left Stage Spot (Crimson Ruby) */}
      <spotLight
        ref={leftSpotRef}
        position={[-9, 7, 5]}
        angle={0.75}
        penumbra={0.8}
        intensity={32.0}
        color="#f43f5e"
      />

      {/* Right Stage Spot (Amber Gold) */}
      <spotLight
        ref={rightSpotRef}
        position={[9, 7, 5]}
        angle={0.75}
        penumbra={0.8}
        intensity={35.0}
        color="#fbbf24"
      />

      {/* Bright Ambient Stage Fill */}
      <ambientLight intensity={2.2} color="#c084fc" />
    </group>
  );
}
