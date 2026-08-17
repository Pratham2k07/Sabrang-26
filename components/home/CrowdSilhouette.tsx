'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/**
 * CrowdSilhouette — Layer 4
 *
 * Subtle distant crowd silhouette at the floor horizon with flickering phone light sparkles.
 */
export default function CrowdSilhouette() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Custom shader for distant crowd silhouette waveform
  const crowdMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
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
          // Organic crowd horizon profile with subtle undulating raised hands
          float wave1 = sin(vUv.x * 60.0 + uTime * 1.5) * 0.08;
          float wave2 = cos(vUv.x * 120.0 - uTime * 2.0) * 0.04;
          float profile = 0.35 + wave1 + wave2;

          float alpha = step(vUv.y, profile) * (1.0 - smoothstep(0.0, profile, vUv.y) * 0.4);
          vec3 darkCrowd = vec3(0.01, 0.01, 0.03);

          gl_FragColor = vec4(darkCrowd, alpha * 0.75);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  useFrame(({ clock }) => {
    if (crowdMaterial.uniforms.uTime) {
      crowdMaterial.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <group position={[0, -2.3, -4.0]}>
      {/* Crowd Silhouette Backdrop Plane */}
      <mesh ref={meshRef} position={[0, 0, 0]} scale={[30, 2.5, 1]}>
        <planeGeometry args={[1, 1]} />
        <primitive object={crowdMaterial} />
      </mesh>

      {/* Tiny Phone Light Sparkles along the crowd horizon */}
      <Sparkles
        count={50}
        scale={[28, 1.2, 4]}
        position={[0, 0.2, 0.5]}
        size={1.8}
        speed={0.6}
        color="#ffffff"
      />
      <Sparkles
        count={30}
        scale={[26, 1.0, 4]}
        position={[0, 0.3, 0.5]}
        size={2.2}
        speed={0.8}
        color="#fef08a"
      />
    </group>
  );
}
