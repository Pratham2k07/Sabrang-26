'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SabrangParticleHologramProps {
  position?: [number, number, number];
  scale?: number;
}

const PARTICLE_COUNT = 3200;

// Vibrant Luminous Sabrang Color Spectrum Palette
const PALETTE = [
  new THREE.Color('#38bdf8'), // Electric Sky Cyan
  new THREE.Color('#f43f5e'), // Crimson Rose
  new THREE.Color('#fbbf24'), // Radiant Amber Gold
  new THREE.Color('#c084fc'), // Deep Violet
  new THREE.Color('#34d399'), // Emerald Mint
  new THREE.Color('#ffffff'), // Luminous Pure White
];

export default function SabrangParticleHologram({
  position = [0, 0, 0],
  scale = 1.05,
}: SabrangParticleHologramProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate 3,200 bold target positions forming S-A-B-R-A-N-G in 3D space
  const { targetPositions, colors, scales } = useMemo(() => {
    const targPos = new Float32Array(PARTICLE_COUNT * 3);
    const colBuf = new Float32Array(PARTICLE_COUNT * 3);
    const scaleBuf = new Float32Array(PARTICLE_COUNT);

    const letterCount = 7;
    const particlesPerLetter = Math.floor(PARTICLE_COUNT / letterCount);
    const letterXOffsets = [-6.4, -4.3, -2.1, 0, 2.1, 4.3, 6.4];

    let pIdx = 0;

    for (let l = 0; l < letterCount; l++) {
      const offsetX = letterXOffsets[l];

      for (let i = 0; i < particlesPerLetter; i++) {
        const u = Math.random();
        const v = Math.random();

        let lx = 0;
        let ly = 0;

        // Sampling thick 2D stroke geometry for S-A-B-R-A-N-G
        if (l === 0) {
          // S
          const angle = u * Math.PI * 2.2;
          const r = 0.85 + (Math.random() - 0.5) * 0.25;
          lx = Math.sin(angle) * r;
          ly = Math.cos(angle) * r + (u > 0.5 ? -0.75 : 0.75);
        } else if (l === 1 || l === 4) {
          // A
          if (v < 0.7) {
            lx = (u - 0.5) * 1.6;
            ly = (1.0 - Math.abs(u - 0.5) * 2.0) * 2.0 - 1.0;
          } else {
            lx = (u - 0.5) * 1.1;
            ly = -0.1;
          }
        } else if (l === 2) {
          // B
          if (v < 0.3) {
            lx = -0.7;
            ly = (u - 0.5) * 2.0;
          } else {
            const angle = u * Math.PI;
            const r = 0.7 + (Math.random() - 0.5) * 0.2;
            lx = Math.cos(angle) * r - 0.05;
            ly = Math.sin(angle) * (r * 0.7) + (v > 0.65 ? 0.5 : -0.5);
          }
        } else if (l === 3) {
          // R
          if (v < 0.35) {
            lx = -0.7;
            ly = (u - 0.5) * 2.0;
          } else if (v < 0.75) {
            const angle = u * Math.PI;
            const r = 0.65 + (Math.random() - 0.5) * 0.2;
            lx = Math.cos(angle) * r - 0.05;
            ly = Math.sin(angle) * (r * 0.7) + 0.5;
          } else {
            lx = -0.1 + u * 0.8;
            ly = -1.0 + (1.0 - u) * 1.0;
          }
        } else if (l === 5) {
          // N
          if (v < 0.33) {
            lx = -0.7;
            ly = (u - 0.5) * 2.0;
          } else if (v < 0.66) {
            lx = 0.7;
            ly = (u - 0.5) * 2.0;
          } else {
            lx = (u - 0.5) * 1.4;
            ly = -(u - 0.5) * 2.0;
          }
        } else if (l === 6) {
          // G
          const angle = u * Math.PI * 1.6;
          const r = 0.85 + (Math.random() - 0.5) * 0.25;
          lx = Math.cos(angle) * r;
          ly = Math.sin(angle) * r;
          if (v > 0.75) {
            lx = 0.3 + (v - 0.75) * 2.0;
            ly = -0.15;
          }
        }

        // Add stroke width noise
        const noiseX = (Math.random() - 0.5) * 0.18;
        const noiseY = (Math.random() - 0.5) * 0.18;
        const noiseZ = (Math.random() - 0.5) * 0.5;

        targPos[pIdx * 3] = offsetX + lx + noiseX;
        targPos[pIdx * 3 + 1] = ly + noiseY;
        targPos[pIdx * 3 + 2] = noiseZ;

        // Color & Scale
        const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        colBuf[pIdx * 3] = color.r;
        colBuf[pIdx * 3 + 1] = color.g;
        colBuf[pIdx * 3 + 2] = color.b;

        scaleBuf[pIdx] = 0.15 + Math.random() * 0.25;

        pIdx++;
      }
    }

    return {
      targetPositions: targPos,
      colors: colBuf,
      scales: scaleBuf,
    };
  }, []);

  // Custom Point Shader Material for ultra-luminous large particles
  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        attribute vec3 color;
        attribute float aScale;

        varying vec3 vColor;
        uniform float uTime;
        uniform vec2 uMouse;

        void main() {
          vColor = color;

          vec3 pos = position;
          pos.x += sin(uTime * 1.2 + pos.y * 2.0) * 0.06;
          pos.y += cos(uTime * 1.5 + pos.x * 2.0) * 0.06;
          pos.z += sin(uTime * 1.8 + pos.x * 1.5) * 0.04;

          // Interactive mouse deflection
          vec2 mouseWorld = uMouse * vec2(8.0, 4.5);
          float dist = distance(pos.xy, mouseWorld);
          if (dist < 2.2) {
            vec2 push = normalize(pos.xy - mouseWorld) * (2.2 - dist) * 0.5;
            pos.xy += push;
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = (aScale * 140.0) / -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = exp(-dist * 4.0);
          gl_FragColor = vec4(vColor * 2.5, alpha * 0.95);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();

    if (particleMaterial.uniforms.uTime) {
      particleMaterial.uniforms.uTime.value = t;
    }
    if (particleMaterial.uniforms.uMouse) {
      particleMaterial.uniforms.uMouse.value.set(pointer.x, pointer.y);
    }
  });

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* High Intensity Backlight Aura behind SABRANG for maximum legibility */}
      <pointLight position={[0, 0, 0.5]} color="#ffffff" intensity={25.0} distance={15} decay={1.2} />
      <pointLight position={[-4, 0, 0.5]} color="#00d2ff" intensity={20.0} distance={12} decay={1.2} />
      <pointLight position={[4, 0, 0.5]} color="#f43f5e" intensity={20.0} distance={12} decay={1.2} />

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[targetPositions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        </bufferGeometry>
        <primitive object={particleMaterial} />
      </points>
    </group>
  );
}
