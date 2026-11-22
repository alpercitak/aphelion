import { Mesh, MeshBasicMaterial, SphereGeometry } from 'three';
import { GLOW_SCALE } from '../constants';
import type { Body } from '../types';
import { createGlow } from './glow';

/** Unit-radius sphere with a rim glow as a child. Scale the mesh to set its size. */
export const createBody = (color: number, glowColor: number): Body => {
  const mesh = new Mesh(new SphereGeometry(1, 48, 32), new MeshBasicMaterial({ color }));
  const glow = createGlow(glowColor);
  glow.scale.setScalar(GLOW_SCALE);
  mesh.add(glow);
  return { mesh, glow };
};
