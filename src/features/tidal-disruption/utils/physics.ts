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

const M_SUN_G = 1.989e33;
const C_CGS = 2.998e10;
const DAY_S = 86400;
const EDDINGTON_PER_MSUN = 1.26e38;
/** Accretion efficiency: fraction of rest-mass energy radiated. */
const ETA = 0.1;

/** Frozen-in estimate (not measured): t_min ≈ 41 d · M₆^½ · m★^-1 · r★^(3/2), r★ = m★^0.8. */
export const fallbackDays = (params: MassParams) => {
  const m6 = 10 ** params.logMass / 1e6;
  const rStar = starRadiusKm(params.starMass) / R_SUN_KM;
  return (41 * Math.sqrt(m6) * rStar ** 1.5) / params.starMass;
};

/** Peak fallback rate over Eddington for a full disruption, ṁ = η Ṁ_peak c² / L_Edd with Ṁ_peak = m★ M☉ / (3 t_min) (frozen-in estimate). */
export const peakFallbackRatio = (params: MassParams) => {
  const tMinS = fallbackDays(params) * DAY_S;
  const mdotPeak = (params.starMass * M_SUN_G) / (3 * tMinS);
  const lPeak = ETA * mdotPeak * C_CGS ** 2;
  return lPeak / (EDDINGTON_PER_MSUN * 10 ** params.logMass);
};

/**
 * Radiated L/L_Edd for a fallback rate ṁ in Eddington units. Above ṁ = 1 the disk is too thick to radiate it all:
 * photons are trapped and advected inward or blown out in winds, so L grows only as 1 + ln ṁ (slim-disk estimate).
 */
export const eddingtonLimited = (mdot: number) => (mdot <= 1 ? mdot : 1 + Math.log(mdot));

/** Relative light curve, x = t / t_min: zero before the peak, then x^(-5/3). */
export const fallbackShape = (x: number) => (x < 1 ? 0 : x ** (-5 / 3));

/** Horizon at or above r_p = r_t / β: the star's periapsis lies inside the horizon. */
export const isSwallowed = (params: RunParams) => horizonToTidal(params) * params.beta >= 1;

/** Scene-unit horizon radius: real ratio applied to the visual tidal radius, clamped for visibility. */
export const horizonVisualRadius = (params: MassParams) =>
  Math.max(MIN_HORIZON_VISUAL, R_TIDAL_VISUAL * horizonToTidal(params));

export const kmToAu = (km: number) => km / KM_PER_AU;
