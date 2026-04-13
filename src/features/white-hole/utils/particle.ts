import { Vector3 } from 'three';
import { tempToColor } from '@/utils/physics';
import type { Particle } from '../types';

export const spawnParticle = (speed: number, temp: number, bodyRadius: number): Particle => {
  // Random direction on unit sphere
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const dir = new Vector3(Math.sin(phi) * Math.cos(theta), Math.sin(phi) * Math.sin(theta), Math.cos(phi));

  const startR = bodyRadius * 1.05;
  const pos = dir.clone().multiplyScalar(startR);
  const vel = dir.clone().multiplyScalar(speed * (0.7 + Math.random() * 0.6));
  const color = tempToColor(temp * (0.6 + Math.random() * 0.8));

  return {
    pos,
    vel,
    life: 1.0,
    maxLife: 1.0,
    prevPos: pos.clone(),
    color,
    trailLine: null,
  };
};
