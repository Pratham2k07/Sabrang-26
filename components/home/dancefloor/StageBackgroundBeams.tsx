'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * StageBackgroundBeams
 *
 * Sweeping physical festival laser light beams & chromatic aura halo in the background.
 */
export default function StageBackgroundBeams() {
  const groupRef = useRef<THREE.Group>(null);
  const beamRefs = useRef<(THREE.Mesh | null)[]>([]);

  // 6 Sweeping Festival Laser Beams (Cyan, Magenta, Amber, Violet)
  const BEAM_COLORS = ['#38bdf8', '#e030ff', '#fbbf24', '#f43f5e', '#a855f7', '#00d2ff'];

  const beamMaterials = useMemo(
    () =>
      BEAM_COLORS.map(
        (col) =>
          new THREE.MeshBasicMaterial({
            color: new THREE.Color(col),
            transparent: true,
            opacity: 0.35,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
      ),
    []
  );

  // Background Chromatic Aura Glow Backdrop
  const auraMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform float uTime;
          void main() {
            vec2 center = vUv - vec2(0.5, 0.5);
            float dist = length(center);

            float aura1 = exp(-dist * 3.5);
            float aura2 = exp(-dist * 6.0);

            vec3 cyan = vec3(0.0, 0.82, 1.0);
            vec3 magenta = vec3(0.88, 0.19, 1.0);
            vec3 gold = vec3(1.0, 0.72, 0.0);

            vec3 finalColor = mix(cyan, magenta, sin(uTime * 0.8 + dist * 4.0) * 0.5 + 0.5);
            finalColor = mix(finalColor, gold, cos(uTime * 0.6) * 0.3 + 0.3);

            gl_FragColor = vec4(finalColor * aura1 * 1.5, aura1 * 0.45);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (auraMaterial.uniforms.uTime) {
      auraMaterial.uniforms.uTime.value = t;
    }

    // Sweep 6 laser beams back and forth
    beamRefs.current.forEach((beam, idx) => {
      if (beam) {
        beam.rotation.z = Math.sin(t * 0.4 + idx * 1.2) * 0.35;
        beam.rotation.x = Math.cos(t * 0.3 + idx * 0.8) * 0.15;
      }
    });
  });

  return (
    <group position={[0, 0, -5.0]}>
      {/* 1. Chromatic Backlight Aura Plane right behind SABRANG marquee */}
      <mesh position={[0, 2.5, -2.0]} scale={[24, 14, 1]}>
        <planeGeometry args={[1, 1]} />
        <primitive object={auraMaterial} />
      </mesh>

      {/* 2. Sweeping Festival Laser Beams */}
      {BEAM_COLORS.map((_, idx) => {
        const posX = (idx - 2.5) * 3.8;
        return (
          <mesh
            key={idx}
            ref={(el) => {
              beamRefs.current[idx] = el;
            }}
            position={[posX, 6.0, -1.0]}
            rotation={[0, 0, (idx - 2.5) * 0.15]}
          >
            <cylinderGeometry args={[0.08, 1.2, 22.0, 16, 1, true]} />
            <primitive object={beamMaterials[idx]} />
          </mesh>
        );
      })}
    </group>
  );
}
