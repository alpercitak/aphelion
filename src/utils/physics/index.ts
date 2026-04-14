import { Color } from 'three';

// --- Scientific Constants (SI Units) ---
export const SOLAR_MASS_KG = 1.989e30;
export const GRAVITATIONAL_CONSTANT = 6.6743e-11;
export const SPEED_OF_LIGHT = 299792458;
export const HBAR = 1.054571817e-34;
export const BOLTZMANN_CONSTANT = 1.380649e-23;

// --- Pre-calculated Derived Constants ---
const SPEED_OF_LIGHT_SQ = SPEED_OF_LIGHT ** 2;
const KM_PER_M = 1000;

/** Schwarzschild coefficient: (2 * G * M_sun) / c² / 1000 ≈ 2.953 km/M☉ */
const SCHWARZSCHILD_COEFF = (2 * GRAVITATIONAL_CONSTANT * SOLAR_MASS_KG) / SPEED_OF_LIGHT_SQ / KM_PER_M;

/** Hawking Numerator: (hbar * c³) / (8 * π * G * k_b) ≈ 1.227e23 */
const HAWKING_NUMERATOR = (HBAR * SPEED_OF_LIGHT ** 3) / (8 * Math.PI * GRAVITATIONAL_CONSTANT * BOLTZMANN_CONSTANT);

// --- Visual & Blackbody Configuration ---
const BB_CONFIG = {
  DIVISOR: 100,
  THRESHOLD: 66,
  BLUE_STEER: 19,
  GREEN_LOG: { slope: 99.4708025861, intercept: 161.1195681661 },
  BLUE_LOG: { slope: 138.5177312231, intercept: 305.0447927307 },
  RED_POW: { coeff: 329.698727446, exp: -0.1332047592 },
  GREEN_POW: { coeff: 288.1221695283, exp: -0.0755148492 },
};

/**
 * 1. HAWKING TEMPERATURE (K)
 * Standard TH = (hbar * c³) / (8 * π * G * M * k_b)
 */
export const hawkingTemperatureKelvin = (massSolar: number): number => {
  const massKg = Math.max(1e-28, massSolar) * SOLAR_MASS_KG;
  return HAWKING_NUMERATOR / massKg;
};

/**
 * 2. SCHWARZSCHILD RADIUS (km)
 * rs = 2GM/c²
 */
export const schwarzschildRadius = (massSolar: number): number => {
  return massSolar * SCHWARZSCHILD_COEFF;
};

/**
 * 3. TANNER HELLAND BLACKBODY (Realism)
 * Maps Kelvin to RGB based on stellar atmosphere profiles.
 * Best for: $1,000K to $40,000K.
 */
export const tempToColor = (kelvin: number): Color => {
  const t = Math.max(1000, Math.min(40000, kelvin)) / BB_CONFIG.DIVISOR;
  let r: number, g: number, b: number;

  if (t <= BB_CONFIG.THRESHOLD) {
    r = 255;
    g = BB_CONFIG.GREEN_LOG.slope * Math.log(t) - BB_CONFIG.GREEN_LOG.intercept;
    b = t <= BB_CONFIG.BLUE_STEER ? 0 : BB_CONFIG.BLUE_LOG.slope * Math.log(t - 10) - BB_CONFIG.BLUE_LOG.intercept;
  } else {
    r = BB_CONFIG.RED_POW.coeff * Math.pow(t - 60, BB_CONFIG.RED_POW.exp);
    g = BB_CONFIG.GREEN_POW.coeff * Math.pow(t - 60, BB_CONFIG.GREEN_POW.exp);
    b = 255;
  }

  const clamp = (val: number) => Math.max(0, Math.min(255, val)) / 255;
  return new Color(clamp(r), clamp(g), clamp(b));
};

/**
 * 4. HAWKING GLOW COLOR (Cinematic)
 * Log-scale approximation for the extreme temperature ranges of evaporation.
 * Maps: Orange (cold) -> White (hot) -> Blue (ultra hot)
 */
export const hawkingGlowColor = (tempK: number): Color => {
  const logT = Math.log10(Math.max(tempK, 1e-10));
  const logMin = -9;
  const logMax = 12;
  const t = Math.max(0, Math.min(1, (logT - logMin) / (logMax - logMin)));

  if (t < 0.5) {
    // Orange to White
    return new Color().setRGB(1.0, 0.5 + t, 0.2 + t * 0.8);
  } else {
    // White to Blue-White
    const u = (t - 0.5) * 2;
    return new Color().setRGB(1.0 - u * 0.1, 1.0 - u * 0.05, 1.0);
  }
};

/**
 * 5. MASS SCALE (Visual)
 * Cubed-root scaling ensures visual size corresponds to 3D volume.
 */
export const massScale = (massSolar: number, ref: number = 10): number => {
  return Math.cbrt(Math.max(0, massSolar) / ref);
};
