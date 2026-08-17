'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function FloatingArtElements() {
  const shardsRef = useRef<THREE.InstancedMesh>(null);

  // Instanced Floating Metallic Shards (24 subtle floating fragments - ZERO circles/torus rings)
  const SHARD_COUNT = 24;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const shardData = useMemo(() => {
    return Array.from({ length: SHARD_COUNT }, (_, i) => ({
      pos: [
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 10 + 1,
        (Math.random() - 0.5) * 14 - 2,
      ] as [number, number, number],
      rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      scale: 0.12 + Math.random() * 0.28,
      speed: 0.2 + Math.random() * 0.4,
      phase: i * 0.35,
    }));
  }, []);

  const shardMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1a2332'),
        roughness: 0.3,
        metalness: 0.85,
      }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Animate instanced metallic shards drifting gently
    if (shardsRef.current) {
      shardData.forEach((s, i) => {
        dummy.position.set(
          s.pos[0] + Math.sin(t * s.speed + s.phase) * 0.3,
          s.pos[1] + Math.cos(t * s.speed * 0.7 + s.phase) * 0.2,
          s.pos[2] + Math.sin(t * 0.25 + i) * 0.15
        );
        dummy.rotation.set(
          s.rot[0] + t * 0.1,
          s.rot[1] + t * 0.15,
          s.rot[2] + Math.sin(t * 0.15) * 0.08
        );
        dummy.scale.setScalar(s.scale);
        dummy.updateMatrix();
        shardsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      shardsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Instanced Floating Metallic Shards (NO circles, NO torus rings) */}
      <instancedMesh
        ref={shardsRef}
        args={[undefined, undefined, SHARD_COUNT]}
        material={shardMat}
        castShadow
      >
        <boxGeometry args={[1, 0.4, 0.08]} />
      </instancedMesh>
    </group>
  );
}
