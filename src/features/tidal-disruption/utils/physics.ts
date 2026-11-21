import { schwarzschildRadius } from '@/utils/physics';
import { MIN_HORIZON_VISUAL, R_TIDAL_VISUAL } from '../constants';
import type { MassParams, RunParams } from '../types';

const R_SUN_KM = 6.957e5;
const KM_PER_AU = 1.495978707e8;

/** Main-sequence radius (km): R★ = R☉ · m★^0.8 */
const starRadiusKm = (starMass: number) => R_SUN_KM * starMass ** 0.8;

/** Tidal radius (km): r_t = R★ (M_bh / m★)^(1/3) */
export const tidalRadiusKm = ({ logMass, starMass }: MassParams) =>
  starRadiusKm(starMass) * (10 ** logMass / starMass) ** (1 / 3);

/** Horizon radius over tidal radius, from real values. */
const horizonToTidal = (params: MassParams) => schwarzschildRadius(10 ** params.logMass) / tidalRadiusKm(params);

/** Horizon at or above min(r_t, r_p): the star crosses the horizon before it can be torn apart. */
export const isSwallowed = (params: RunParams) => horizonToTidal(params) * Math.max(1, params.beta) >= 1;

/** Scene-unit horizon radius: real ratio applied to the visual tidal radius, clamped for visibility. */
export const horizonVisualRadius = (params: MassParams) =>
  Math.max(MIN_HORIZON_VISUAL, R_TIDAL_VISUAL * horizonToTidal(params));

export const kmToAu = (km: number) => km / KM_PER_AU;
