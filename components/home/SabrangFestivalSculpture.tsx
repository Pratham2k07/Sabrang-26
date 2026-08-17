'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

interface SabrangFestivalSculptureProps {
  position?: [number, number, number];
  scale?: number;
}

const LETTERS = ['S', 'A', 'B', 'R', 'A', 'N', 'G'];
const LETTER_X_OFFSETS = [-5.2, -3.5, -1.8, 0, 1.8, 3.5, 5.2];

export default function SabrangFestivalSculpture({
  position = [0, 0, 0],
  scale = 1.0,
}: SabrangFestivalSculptureProps) {
  const groupRef = useRef<THREE.Group>(null);

  // High-End Luminous Ice-White Physical Glass Material with Cyan-Violet Aura Tint
  const letterMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#ffffff'),
        emissive: new THREE.Color('#38bdf8'),
        emissiveIntensity: 0.65,
        roughness: 0.08,
        metalness: 0.35,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        reflectivity: 1.0,
        specularColor: new THREE.Color('#ffffff'),
        specularIntensity: 4.0,
      }),
    []
  );

  // Woven Brass Arch Installation Frame
  const archMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#f59e0b'),
        emissive: new THREE.Color('#78350f'),
        emissiveIntensity: 0.35,
        roughness: 0.2,
        metalness: 0.85,
      }),
    []
  );

  // Gentle rhythmic pulse
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.7) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* High Intensity Backlight Aura for SABRANG */}
      <pointLight position={[0, 0.5, -0.8]} color="#38bdf8" intensity={28.0} distance={18} decay={1.2} />
      <pointLight position={[-4, 0.5, -0.8]} color="#e030ff" intensity={22.0} distance={15} decay={1.2} />
      <pointLight position={[4, 0.5, -0.8]} color="#ffb700" intensity={22.0} distance={15} decay={1.2} />

      {/* Elegant Brass Arch Framing in Background */}
      <mesh position={[0, 0.5, -1.2]}>
        <torusGeometry args={[7.8, 0.12, 16, 100, Math.PI]} />
        <primitive object={archMat} />
      </mesh>

      {/* ── HIGH-END 3D SABRANG GLASS SCULPTURE ──────────────────────── */}
      <Center>
        <group>
          {LETTERS.map((char, index) => (
            <group key={index} position={[LETTER_X_OFFSETS[index], 0, 0]}>
              <Text3D
                font="https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_bold.typeface.json"
                size={1.75}
                height={0.55}
                curveSegments={16}
                bevelEnabled
                bevelThickness={0.14}
                bevelSize={0.08}
                bevelOffset={0}
                bevelSegments={6}
                castShadow
                receiveShadow
                material={letterMaterial}
              >
                {char}
              </Text3D>
            </group>
          ))}
        </group>
      </Center>
    </group>
  );
}
