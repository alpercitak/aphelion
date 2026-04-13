import { Vector3 } from 'three';
import { tempToColor } from '@/utils/physics';
import type { VirtualPair } from '../types';

export const spawnPair = (horizonRadius: number, tempK: number): VirtualPair => {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const dir = new Vector3(Math.sin(phi) * Math.cos(theta), Math.sin(phi) * Math.sin(theta), Math.cos(phi));

  // Spawn just outside horizon
  const spawnR = horizonRadius * 1.15;
  const inPos = dir.clone().multiplyScalar(spawnR);
  const outPos = dir.clone().multiplyScalar(spawnR);

  return {
    inPos,
    inTarget: dir.clone().multiplyScalar(horizonRadius * 0.3),
    outPos,
    outVel: dir.clone().multiplyScalar(0.08 + Math.random() * 0.04),
    life: 1.0,
    color: tempToColor(Math.max(tempK * 0.001, 3000)), // map to visible range
  };
};
