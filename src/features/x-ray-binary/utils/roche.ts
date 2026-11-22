import { DISK_TIDAL_FRACTION, G_SCENE, SEPARATION } from '../constants';
import type { Binary, MassParams, Vec3 } from '../types';

type Field = Pick<Binary, 'x1' | 'x2' | 'gm1' | 'gm2' | 'omega'>;

/** Roche potential in the corotating frame. */
const potential = (f: Field, x: number, y: number, z: number) => {
  const r1 = Math.hypot(x - f.x1, y, z);
  const r2 = Math.hypot(x - f.x2, y, z);
  return -f.gm1 / r1 - f.gm2 / r2 - 0.5 * f.omega ** 2 * (x * x + z * z);
};

/** Roche-lobe volume radius over separation (Eggleton), for the star whose mass ratio to its companion is q. */
export const eggleton = (q: number) => (0.49 * q ** (2 / 3)) / (0.6 * q ** (2 / 3) + Math.log(1 + q ** (1 / 3)));

const dPhidx = (f: Field, x: number) =>
  (f.gm1 * (x - f.x1)) / Math.abs(x - f.x1) ** 3 + (f.gm2 * (x - f.x2)) / Math.abs(x - f.x2) ** 3 - f.omega ** 2 * x;

const findL1 = (f: Field) => {
  let lo = f.x1 + 1e-3 * SEPARATION;
  let hi = f.x2 - 1e-3 * SEPARATION;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (dPhidx(f, mid) > 0) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) / 2;
};

export const computeBinary = ({ accretorMass, donorMass }: MassParams): Binary => {
  const total = accretorMass + donorMass;
  const x1 = (-SEPARATION * donorMass) / total;
  const x2 = (SEPARATION * accretorMass) / total;
  const omega = Math.sqrt((G_SCENE * total) / SEPARATION ** 3);
  const field: Field = { x1, x2, gm1: G_SCENE * accretorMass, gm2: G_SCENE * donorMass, omega };
  const l1x = findL1(field);
  const phiL1 = potential(field, l1x, 0, 0);
  const q = donorMass / accretorMass;
  return {
    m1: accretorMass,
    m2: donorMass,
    q,
    ...field,
    l1x,
    phiL1,
    diskOuter: DISK_TIDAL_FRACTION * eggleton(1 / q) * SEPARATION,
  };
};

/** Distance from `centreX` along unit `dir` to the lobe surface, bisected on (0, maxR]. */
export const lobeRadius = (binary: Binary, centreX: number, dir: Vec3, maxR: number) => {
  let lo = 1e-3;
  let hi = maxR;
  for (let i = 0; i < 40; i++) {
    const s = (lo + hi) / 2;
    if (potential(binary, centreX + s * dir.x, s * dir.y, s * dir.z) < binary.phiL1) {
      lo = s;
    } else {
      hi = s;
    }
  }
  return (lo + hi) / 2;
};
