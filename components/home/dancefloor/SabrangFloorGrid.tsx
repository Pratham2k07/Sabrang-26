'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SabrangFloorGridProps {
  scrollProgress: number;
}

const GRID_COLS = 24;
const GRID_ROWS = 30;
const PANEL_COUNT = GRID_COLS * GRID_ROWS;
const PANEL_WIDTH = 0.6;
const PANEL_LENGTH = 0.6;
const PANEL_GAP = 0.08;

// SABRANG 7-LETTER BITMAP MATRIX FOR THE FLOOR GRID
const LETTER_BITMAPS: Record<string, number[][]> = {
  S: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  A: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  B: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  R: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  N: [
    [1, 0, 0, 1],
    [1, 1, 0, 1],
    [1, 0, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  G: [
    [0, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 1, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 1],
  ],
};

const CHROMATIC_SPECTRUM = [
  new THREE.Color('#38bdf8'), // Electric Cyan
  new THREE.Color('#e030ff'), // Hot Magenta
  new THREE.Color('#fbbf24'), // Amber Gold
  new THREE.Color('#f43f5e'), // Crimson Ruby
  new THREE.Color('#a855f7'), // Deep Violet
  new THREE.Color('#10b981'), // Emerald Mint
  new THREE.Color('#f97316'), // Sunny Orange
];

export default function SabrangFloorGrid({ scrollProgress }: SabrangFloorGridProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const { positions, isLetterPanel, letterIndex, radialDists } = useMemo(() => {
    const posList: [number, number, number][] = [];
    const isLetter = new Uint8Array(PANEL_COUNT);
    const letterIdx = new Uint8Array(PANEL_COUNT);
    const radDists = new Float32Array(PANEL_COUNT);

    const startX = -((GRID_COLS * (PANEL_WIDTH + PANEL_GAP)) / 2) + PANEL_WIDTH / 2;
    const startZ = -((GRID_ROWS * (PANEL_LENGTH + PANEL_GAP)) / 2) + PANEL_LENGTH / 2;

    const letters = ['S', 'A', 'B', 'R', 'A', 'N', 'G'];
    const letterStartXs = [1, 4, 7, 10, 14, 17, 20];
    const letterStartRow = 12;

    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const index = r * GRID_COLS + c;
        const px = startX + c * (PANEL_WIDTH + PANEL_GAP);
        const pz = startZ + r * (PANEL_LENGTH + PANEL_GAP);

        posList.push([px, 0, pz]);
        radDists[index] = Math.sqrt(px * px + (pz + 4) * (pz + 4));

        let match = false;
        let lIdx = 0;

        letters.forEach((char, l) => {
          const lCol = letterStartXs[l];
          const bitmap = LETTER_BITMAPS[char];

          if (
            c >= lCol &&
            c < lCol + 3 &&
            r >= letterStartRow &&
            r < letterStartRow + 5
          ) {
            const bRow = r - letterStartRow;
            const bCol = c - lCol;
            if (bitmap[bRow] && bitmap[bRow][bCol] === 1) {
              match = true;
              lIdx = l;
            }
          }
        });

        isLetter[index] = match ? 1 : 0;
        letterIdx[index] = lIdx;
      }
    }

    return {
      positions: posList,
      isLetterPanel: isLetter,
      letterIndex: letterIdx,
      radialDists: radDists,
    };
  }, []);

  const panelMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1e1b4b'),
      roughness: 0.25,
      metalness: 0.75,
    });
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const t = clock.getElapsedTime();
    const sp = scrollProgress;

    for (let i = 0; i < PANEL_COUNT; i++) {
      const [px, py, pz] = positions[i];
      const isL = isLetterPanel[i];
      const lIdx = letterIndex[i];

      const tileColorIdx = Math.abs(i + Math.floor(pz * 0.5)) % CHROMATIC_SPECTRUM.length;
      let baseCol = CHROMATIC_SPECTRUM[tileColorIdx];
      let brightness = 0.55;
      let targetY = py;

      if (isL === 1) {
        brightness = 6.5 + Math.sin(t * 3.0 + lIdx) * 1.5;
        baseCol = CHROMATIC_SPECTRUM[lIdx % CHROMATIC_SPECTRUM.length];
        targetY = 0.12;
      } else {
        const radialDist = radialDists[i];
        const wave = Math.sin(radialDist * 0.65 - t * 2.8 + sp * 8.0) * 0.5 + 0.5;
        if (wave > 0.35) {
          brightness += wave * 2.0;
          const waveColorIdx = Math.abs(Math.floor(radialDist + t * 2.0)) % CHROMATIC_SPECTRUM.length;
          baseCol = CHROMATIC_SPECTRUM[waveColorIdx];
        }
      }

      dummy.position.set(px, targetY, pz);
      dummy.scale.set(PANEL_WIDTH, 0.08, PANEL_LENGTH);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);

      tempColor.copy(baseCol).multiplyScalar(brightness);
      meshRef.current.setColorAt(i, tempColor);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, PANEL_COUNT]}
      material={panelMaterial}
    >
      <boxGeometry args={[1, 1, 1]} />
    </instancedMesh>
  );
}
