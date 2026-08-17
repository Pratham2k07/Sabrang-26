'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * ForegroundInstallation — Layer 1 & 2
 *
 * Clean, subtle, translucent silk fabrics framing the 3D scene (NO flat grey shapes).
 */
export default function ForegroundInstallation() {
  const fabricGroupRef = useRef<THREE.Group>(null);

  // Translucent Dark Crimson Silk
  const silkRedMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#9f1239'),
        emissive: new THREE.Color('#4c0519'),
        emissiveIntensity: 0.2,
        roughness: 0.25,
        metalness: 0.1,
        transmission: 0.75,
        thickness: 0.6,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      }),
    []
  );

  // Translucent Amber Silk
  const silkAmberMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#d97706'),
        emissive: new THREE.Color('#451a03'),
        emissiveIntensity: 0.15,
        roughness: 0.25,
        metalness: 0.1,
        transmission: 0.75,
        thickness: 0.6,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      }),
    []
  );

  // Gentle fabric swaying
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (fabricGroupRef.current) {
      fabricGroupRef.current.rotation.z = Math.sin(t * 0.5) * 0.03;
      fabricGroupRef.current.position.y = Math.cos(t * 0.6) * 0.04;
    }
  });

  return (
    <group ref={fabricGroupRef}>
      {/* Foreground Left Soft Translucent Crimson Silk */}
      <mesh position={[-5.8, 2.5, 8.5]} rotation={[0.2, 0.4, -0.2]}>
        <cylinderGeometry args={[1.8, 0.3, 7.0, 32, 1, true]} />
        <primitive object={silkRedMat} />
      </mesh>

      {/* Foreground Right Soft Translucent Amber Silk */}
      <mesh position={[6.2, 1.8, 7.0]} rotation={[-0.2, -0.5, 0.3]}>
        <cylinderGeometry args={[1.5, 0.25, 6.0, 32, 1, true]} />
        <primitive object={silkAmberMat} />
      </mesh>
    </group>
  );
}
