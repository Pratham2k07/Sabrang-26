'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LightningControllerProps {
  onFlash?: (intensity: number) => void;
}

export default function LightningController({ onFlash }: LightningControllerProps) {
  const flashLightRef = useRef<THREE.PointLight>(null);
  const flashIntensityRef = useRef(0);
  const nextFlashTimeRef = useRef(2.5);

  useFrame(({ clock }, delta) => {
    nextFlashTimeRef.current -= delta;

    // Trigger periodic electrical lightning flash
    if (nextFlashTimeRef.current <= 0) {
      flashIntensityRef.current = 8.0 + Math.random() * 6.0; // Intense burst
      onFlash?.(1.0);
      nextFlashTimeRef.current = 3.5 + Math.random() * 4.5; // Next flash delay
    }

    // Fast drop, exponential decay
    if (flashIntensityRef.current > 0.05) {
      flashIntensityRef.current *= 0.88;
    } else {
      flashIntensityRef.current = 0;
    }

    if (flashLightRef.current) {
      flashLightRef.current.intensity = flashIntensityRef.current;
    }
  });

  return (
    <pointLight
      ref={flashLightRef}
      position={[0, 8, 2]}
      color="#e0f0ff"
      distance={35}
      decay={2}
      intensity={0}
    />
  );
}
