import { schwarzschildRadius } from '@/utils/physics';
import {
  BH_PROMPT_TOTAL_MASS,
  INITIAL_SEPARATION,
  INSPIRAL_TAU,
  KM_PER_UNIT,
  MIN_BH_VISUAL_RADIUS,
  NS_MAX_TOTAL_MASS,
  ORBIT_GM_PER_MSUN,
} from '../constants';
import type { MassParams, RemnantType } from '../types';

/** G · M☉ in km³/s². */
const GM_SUN_KM3_S2 = 1.32712440018e11;

export const totalMass = ({ m1, m2 }: MassParams) => m1 + m2;

/** Chirp mass ℳ = (m₁m₂)^(3/5) / (m₁+m₂)^(1/5), in M☉. */
export const chirpMass = ({ m1, m2 }: MassParams) => (m1 * m2) ** 0.6 / (m1 + m2) ** 0.2;

/** Remnant outcome by total mass. Thresholds are approximate and depend on the neutron-star equation of state. */
export const remnantType = (mass: number): RemnantType => {
  if (mass < NS_MAX_TOTAL_MASS) {
    return 'neutron-star';
  }
  return mass < BH_PROMPT_TOTAL_MASS ? 'hypermassive' : 'black-hole';
};

/** Peters inspiral a(t) = a₀ (1 − t/τ)^(1/4), in scene units. */
export const separationAt = (t: number) => INITIAL_SEPARATION * Math.max(0, 1 - t / INSPIRAL_TAU) ** 0.25;

/** Orbital angular velocity ω = √(GM/a³) in scene units. */
export const orbitalOmega = (separation: number, mass: number) =>
  Math.sqrt((ORBIT_GM_PER_MSUN * mass) / separation ** 3);

/** GW frequency f_GW = 2 f_orb = (1/π)√(GM/a³) with a in real km. */
export const gwFrequencyHz = (mass: number, separation: number) => {
  const aKm = separation * KM_PER_UNIT;
  return Math.sqrt((GM_SUN_KM3_S2 * mass) / aKm ** 3) / Math.PI;
};

/** Scene radius of the black hole remnant: Schwarzschild radius, clamped so it stays visible. */
export const blackHoleVisualRadius = (mass: number) =>
  Math.max(MIN_BH_VISUAL_RADIUS, schwarzschildRadius(mass) / KM_PER_UNIT);

/** Positions of the two bodies on a circle of radius separation/2 in the x–z plane. */
export const orbitalPositions = (angle: number, separation: number) => {
  const r = separation / 2;
  const cx = Math.cos(angle) * r;
  const cz = Math.sin(angle) * r;
  return { x1: cx, z1: cz, x2: -cx, z2: -cz };
};
