import { massScale } from '@/utils/physics';
import type { Mesh } from 'three';

export const applyMassScale = (objects: Record<string, Mesh>, mass: number, spin = 0): void => {
  const s = massScale(mass);
  const oblate = 1 - spin * 0.15;
  objects.blackHole?.scale.set(s, s * oblate, s);
  objects.photonSphere?.scale.set(s, s * oblate, s);
  objects.outerGlow?.scale.setScalar(s);
  objects.photonRing?.scale.setScalar(s);
  objects.einsteinRing?.scale.setScalar(s);
};
