'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

interface SabrangSculpture1Props {
  position?: [number, number, number];
  scale?: number;
}

export default function SabrangSculpture1({
  position = [0, 0, 0],
  scale = 1.05,
}: SabrangSculpture1Props) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const leftLightRef = useRef<THREE.PointLight>(null);
  const rightLightRef = useRef<THREE.PointLight>(null);

  const { pointer } = useThree();

  // Luminous Ice-White Physical Material with Dynamic Chromatic Emissive Shimmer
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#ffffff'),
        emissive: new THREE.Color('#38bdf8'),
        emissiveIntensity: 0.65,
        roughness: 0.06,
        metalness: 0.15,
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
          float aura = exp(-dist * 3.8);

          vec3 cyan = vec3(0.0, 0.82, 1.0);
          vec3 violet = vec3(0.65, 0.25, 0.98);
          vec3 magenta = vec3(0.95, 0.25, 0.65);

          float t = uTime * 0.6;
          vec3 col = mix(cyan, violet, sin(t + vUv.x * 3.0) * 0.5 + 0.5);
          col = mix(col, magenta, cos(t * 0.8 + vUv.y * 2.0) * 0.5 + 0.5);

          gl_FragColor = vec4(col * 1.6, aura * 0.7);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  // Chromatic Spectrum Colors for Dynamic Shimmer
  const spectrumColors = useMemo(
    () => [
      new THREE.Color('#38bdf8'), // Cyan
      new THREE.Color('#e030ff'), // Magenta
      new THREE.Color('#ffb700'), // Amber
      new THREE.Color('#ff007f'), // Pink
    ],
    []
  );

  // Target Euler rotation vector for mouse interaction
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (auraMaterial.uniforms.uTime) {
      auraMaterial.uniforms.uTime.value = t;
    }

    // Dynamic Chromatic Emissive Shimmer on SABRANG Text
    const colorIndex = (t * 0.3) % spectrumColors.length;
    const nextIndex = (colorIndex + 1) % spectrumColors.length;
    const factor = colorIndex % 1;
    material.emissive.lerpColors(
      spectrumColors[Math.floor(colorIndex)],
      spectrumColors[Math.floor(nextIndex)],
      factor
    );
    material.emissiveIntensity = 0.55 + Math.sin(t * 1.2) * 0.25;

    // Orbital Point Lights Drift
    if (leftLightRef.current) {
      leftLightRef.current.position.x = -6 + Math.sin(t * 0.8) * 1.5;
      leftLightRef.current.position.y = 0.5 + Math.cos(t * 0.6) * 1.0;
    }
    if (rightLightRef.current) {
      rightLightRef.current.position.x = 6 + Math.cos(t * 0.7) * 1.5;
      rightLightRef.current.position.y = 0.5 + Math.sin(t * 0.9) * 1.0;
    }

    // Floating breathing + Subtle Mouse Tilt
    if (groupRef.current) {
      // Idle Breathing
      const floatY = Math.sin(t * 0.8) * 0.12;

      // Mouse interactive tilt
      targetRotation.current.x = pointer.y * -0.15;
      targetRotation.current.y = pointer.x * 0.18;

      groupRef.current.position.y = position[1] + floatY;

      // Smooth Lerp Rotations
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x + Math.sin(t * 0.5) * 0.02,
        0.05
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y + Math.cos(t * 0.4) * 0.03,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* ── Soft Chromatic Diffused Aura Halo Backdrop ──────────────── */}
      <mesh ref={auraRef} position={[0, 0, -0.8]} scale={[24, 7, 1]}>
        <planeGeometry args={[1, 1]} />
        <primitive object={auraMaterial} />
      </mesh>

      {/* ── Volumetric Backlighting ─────────────────────────── */}
      <pointLight position={[0, 2, 4.0]} color="#ffffff" intensity={16.0} distance={20} decay={1.2} />
      <pointLight position={[0, 0, -1.2]} color="#818cf8" intensity={30.0} distance={22} decay={1.2} />
      <pointLight
        ref={leftLightRef}
        position={[-6, 0.5, 2.0]}
        color="#00d2ff"
        intensity={18.0}
        distance={18}
        decay={1.2}
      />
      <pointLight
        ref={rightLightRef}
        position={[6, 0.5, 2.0]}
        color="#e030ff"
        intensity={18.0}
        distance={18}
        decay={1.2}
      />
      <pointLight position={[0, -2.5, 2.5]} color="#ffb700" intensity={12.0} distance={14} decay={1.2} />

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
