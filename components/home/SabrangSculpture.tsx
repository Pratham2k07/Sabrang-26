'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

interface SabrangSculptureProps {
  position?: [number, number, number];
  scale?: number;
}

export default function SabrangSculpture({
  position = [0, 0, 0],
  scale = 1.05,
}: SabrangSculptureProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Mesh>(null);

  // Luminous Ice-White Physical Material with Electric Cyan Emissive Tint
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#ffffff'),
        emissive: new THREE.Color('#38bdf8'),
        emissiveIntensity: 0.75,
        roughness: 0.08,
        metalness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        reflectivity: 1.0,
        specularColor: new THREE.Color('#ffffff'),
        specularIntensity: 3.5,
      }),
    []
  );

  // Soft Chromatic Diffused Aura Shader Backdrop
  const auraMaterial = useMemo(() => {
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
          vec2 center = vUv - vec2(0.5);
          float dist = length(center * vec2(1.2, 2.5));
          float aura = exp(-dist * 4.0);

          vec3 cyan = vec3(0.0, 0.82, 1.0);
          vec3 violet = vec3(0.65, 0.25, 0.98);
          vec3 magenta = vec3(0.95, 0.25, 0.65);

          float t = uTime * 0.6;
          vec3 col = mix(cyan, violet, sin(t + vUv.x * 3.0) * 0.5 + 0.5);
          col = mix(col, magenta, cos(t * 0.8 + vUv.y * 2.0) * 0.5 + 0.5);

          gl_FragColor = vec4(col * 1.5, aura * 0.65);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  // Subtle breathing float & aura pulse
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (auraMaterial.uniforms.uTime) {
      auraMaterial.uniforms.uTime.value = t;
    }

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.7) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* ── Soft Chromatic Diffused Aura Halo Backdrop ──────────────── */}
      <mesh ref={auraRef} position={[0, 0, -0.8]} scale={[22, 6, 1]}>
        <planeGeometry args={[1, 1]} />
        <primitive object={auraMaterial} />
      </mesh>

      {/* ── Intense Volumetric Backlighting ─────────────────────────── */}
      {/* 1. Pure White Center Key Light */}
      <pointLight position={[0, 2, 4.0]} color="#ffffff" intensity={15.0} distance={20} decay={1.2} />

      {/* 2. Intense Backlight Glow Halo */}
      <pointLight position={[0, 0, -1.2]} color="#818cf8" intensity={28.0} distance={22} decay={1.2} />

      {/* 3. Electric Cyan Left Aura */}
      <pointLight position={[-6, 0.5, 2.0]} color="#00d2ff" intensity={16.0} distance={18} decay={1.2} />

      {/* 4. Electric Violet-Pink Right Aura */}
      <pointLight position={[6, 0.5, 2.0]} color="#e030ff" intensity={16.0} distance={18} decay={1.2} />

      {/* 5. Warm Amber Underlight */}
      <pointLight position={[0, -2.5, 2.5]} color="#ffb700" intensity={10.0} distance={14} decay={1.2} />

      {/* ── Luminous 3D SABRANG Sculpture ───────────────────────────── */}
      <Center>
        <Text3D
          ref={meshRef}
          font="https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_bold.typeface.json"
          size={1.8}
          height={0.52}
          curveSegments={14}
          bevelEnabled
          bevelThickness={0.13}
          bevelSize={0.07}
          bevelOffset={0}
          bevelSegments={6}
          castShadow
          receiveShadow
          material={material}
        >
          SABRANG
        </Text3D>
      </Center>
    </group>
  );
}
