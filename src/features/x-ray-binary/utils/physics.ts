import { GRAVITATIONAL_CONSTANT, SOLAR_MASS_KG, schwarzschildRadius } from '@/utils/physics';
import type { AccretorType, MassParams } from '../types';

const R_SUN_M = 6.957e8;
/** G · M☉ in m³/s². */
const GM_SUN_M3_S2 = 1.32712440018e20;
const YEAR_S = 3.156e7;
const STEFAN_BOLTZMANN = 5.670374e-8;
/** Boltzmann constant in keV/K. */
const K_B_KEV = 8.617333e-8;
/** Eddington luminosity per solar mass (W). */
const EDDINGTON_W_PER_MSUN = 1.26e31;
/** Real separation of the default system (R☉). */
const SEPARATION_RSUN = 3;
/** Accretors at or above this mass (M☉) are black holes. */
const BH_MIN_MASS = 3;
const NS_RADIUS_KM = 12;
/** Ratio of the maximum to the characteristic temperature of a thin disk. */
const T_MAX_RATIO = 0.488;

export const accretorType = (m1: number): AccretorType => (m1 < BH_MIN_MASS ? 'neutron-star' : 'black-hole');

/** Orbital period of the real system (hours), with the separation fixed at SEPARATION_RSUN. */
export const orbitalPeriodHours = ({ accretorMass, donorMass }: MassParams) => {
  const a = SEPARATION_RSUN * R_SUN_M;
  return (2 * Math.PI * Math.sqrt(a ** 3 / (GM_SUN_M3_S2 * (accretorMass + donorMass)))) / 3600;
};

/** Inner disk radius (km): the neutron star surface, or the ISCO of a black hole. */
export const innerRadiusKm = (m1: number, type: AccretorType) =>
  type === 'neutron-star' ? NS_RADIUS_KM : 3 * schwarzschildRadius(m1);

/** Mass transfer rate (kg/s) from log10 of the rate in M☉/yr. */
export const massTransferRate = (mdotLog: number) => (10 ** mdotLog * SOLAR_MASS_KG) / YEAR_S;

/** Accretion luminosity (W): GMṀ/R for a neutron star, GMṀ/(2 R_isco) for a black hole. */
export const accretionLuminosity = (m1: number, mdot: number, type: AccretorType) => {
  const radius = innerRadiusKm(m1, type) * 1e3;
  return (GRAVITATIONAL_CONSTANT * m1 * SOLAR_MASS_KG * mdot) / (type === 'neutron-star' ? radius : 2 * radius);
};

export const eddingtonLuminosity = (m1: number) => EDDINGTON_W_PER_MSUN * m1;

/** Inner disk temperature (keV) of a thin disk: T_max = 0.488 T*. */
export const innerDiskKeV = (m1: number, mdot: number, type: AccretorType) => {
  const rIn = innerRadiusKm(m1, type) * 1e3;
  const tStar =
    ((3 * GRAVITATIONAL_CONSTANT * m1 * SOLAR_MASS_KG * mdot) / (8 * Math.PI * STEFAN_BOLTZMANN * rIn ** 3)) ** 0.25;
  return K_B_KEV * T_MAX_RATIO * tStar;
};
