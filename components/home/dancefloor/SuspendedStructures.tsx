'use client';

/**
 * SuspendedStructures — Clean Lighting Rig Wires (NO Torus Rings)
 */
export default function SuspendedStructures() {
  return (
    <group position={[0, 6.5, -2.0]}>
      {/* Clean Vertical Rigging Light Wires */}
      {[-6.0, -2.0, 2.0, 6.0].map((x, idx) => (
        <mesh key={idx} position={[x, 2.0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 6.0, 8]} />
          <meshBasicMaterial color="#38bdf8" opacity={0.35} transparent />
        </mesh>
      ))}
    </group>
  );
}
