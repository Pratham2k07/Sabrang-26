'use client';

import { MeshReflectorMaterial } from '@react-three/drei';

export default function ReflectiveFloor() {
  return (
    <mesh position={[0, -2.4, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[120, 120]} />
      <MeshReflectorMaterial
        blur={[80, 40]}
        resolution={256}
        mirror={0.5}
        mixBlur={0.5}
        mixStrength={1.2}
        roughness={0.45}
        depthScale={1.0}
        minDepthThreshold={0.3}
        maxDepthThreshold={1.5}
        color="#030008"
        metalness={0.8}
        transparent={true}
        opacity={0.4}
      />
    </mesh>
  );
}
