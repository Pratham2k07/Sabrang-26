'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import LightningController from '@/components/home/LightningController';

/**
 * FestivalLighting — Dark Moody Spotlight Configuration
 */
export default function FestivalLighting() {
  const redSpotRef = useRef<THREE.SpotLight>(null);
  const blueSpotRef = useRef<THREE.SpotLight>(null);
  const amberSpotRef = useRef<THREE.SpotLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (redSpotRef.current) {
      redSpotRef.current.intensity = 14.0 + Math.sin(t * 1.5) * 3.5;
    }
    if (blueSpotRef.current) {
      blueSpotRef.current.intensity = 16.0 + Math.cos(t * 1.2) * 4.0;
    }
    if (amberSpotRef.current) {
      amberSpotRef.current.intensity = 10.0 + Math.sin(t * 2.0) * 2.5;
    }
  });

  return (
    <group>
      {/* Directional Key Light */}
      <directionalLight position={[0, 10, 12]} intensity={2.5} color="#ffffff" castShadow />

      {/* Electric Cyan Spotlight */}
      <spotLight
        ref={blueSpotRef}
        position={[8, 9, 8]}
        angle={0.65}
        penumbra={0.85}
        intensity={16.0}
        color="#00d2ff"
        castShadow
      />

      {/* Crimson Red Spotlight */}
      <spotLight
        ref={redSpotRef}
        position={[-8, 9, 8]}
        angle={0.65}
        penumbra={0.85}
        intensity={14.0}
        color="#f43f5e"
        castShadow
      />

      {/* Golden Amber Underlight */}
      <spotLight
        ref={amberSpotRef}
        position={[0, -2, 6]}
        angle={0.85}
        penumbra={0.9}
        intensity={10.0}
        color="#fbbf24"
      />

      {/* Subtle Low Ambient Fill */}
      <ambientLight intensity={0.4} color="#0c0a21" />

      {/* Integrated Environmental Lightning Burst */}
      <LightningController />
    </group>
  );
}
