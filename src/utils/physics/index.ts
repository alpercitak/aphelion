import { Color } from 'three';

// --- Physical Constants ---
const SOLAR_MASS_KG = 1.989e30;
const GRAVITATIONAL_CONSTANT = 6.6743e-11;
const SPEED_OF_LIGHT = 299792458;
const KM_PER_M = 1000;
const HAWKING_MASS_COEFFICIENT = 1.227e23;

// --- Blackbody Algorithm Constants (Tanner Helland) ---
const BB_TEMP_DIVISOR = 100;
const BB_THRESHOLD = 66;
const BB_BLUE_STEER = 19;

// Curve fitting coefficients
const GREEN_LOG_SLOPE = 99.4708025861;
const GREEN_LOG_INTERCEPT = 161.1195681661;
const BLUE_LOG_SLOPE = 138.5177312231;
const BLUE_LOG_INTERCEPT = 305.0447927307;

const RED_POW_COEFF = 329.698727446;
const RED_POW_EXP = -0.1332047592;
const GREEN_POW_COEFF = 288.1221695283;
const GREEN_POW_EXP = -0.0755148492;

/**
 * Converts Blackbody temperature (Kelvin) to a THREE.Color.
 */
export const tempToColor = (T: number): Color => {
  // Clamp and normalize temperature
  const t = Math.max(1, T) / BB_TEMP_DIVISOR;
  let r: number, g: number, b: number;

  if (t <= BB_THRESHOLD) {
    r = 255;
    g = Math.max(0, Math.min(255, GREEN_LOG_SLOPE * Math.log(t) - GREEN_LOG_INTERCEPT));
    b = t <= BB_BLUE_STEER ? 0 : Math.max(0, Math.min(255, BLUE_LOG_SLOPE * Math.log(t - 10) - BLUE_LOG_INTERCEPT));
  } else {
    r = Math.max(0, Math.min(255, RED_POW_COEFF * Math.pow(t - 60, RED_POW_EXP)));
    g = Math.max(0, Math.min(255, GREEN_POW_COEFF * Math.pow(t - 60, GREEN_POW_EXP)));
    b = 255;
  }

  return new Color(r / 255, g / 255, b / 255);
};

/**
 * Calculates the Schwarzschild radius in km.
 */
export const schwarzschildRadius = (massSolar: number): number => {
  const massKg = massSolar * SOLAR_MASS_KG;
  const radiusMeters = (2 * GRAVITATIONAL_CONSTANT * massKg) / Math.pow(SPEED_OF_LIGHT, 2);
  return radiusMeters / KM_PER_M;
};

/**
 * Calculates the Hawking temperature in Kelvin.
 */
export const hawkingTemperature = (massSolar: number): number => {
  return HAWKING_MASS_COEFFICIENT / Math.max(1e-10, massSolar);
};

/**
 * Visual scale factor.
 */
export const massScale = (massSolar: number, ref: number = 10): number => {
  return Math.cbrt(massSolar / ref);
};
