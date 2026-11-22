import { GRAVITATIONAL_CONSTANT, SOLAR_MASS_KG, SPEED_OF_LIGHT } from '@/utils/physics';
import type { Bubble } from '../types';

const PEAK_SAMPLES = 2048;

const sech2 = (u: number) => 1 - Math.tanh(u) ** 2;

/** Alcubierre shape function: about 1 inside the bubble, 0 outside. */
export const shapeFunction = (r: number, radius: number, sigma: number) =>
  (Math.tanh(sigma * (r + radius)) - Math.tanh(sigma * (r - radius))) / (2 * Math.tanh(sigma * radius));

/** Radial derivative of the shape function; negative at the wall. */
export const shapeDerivative = (r: number, radius: number, sigma: number) =>
  (sigma * (sech2(sigma * (r + radius)) - sech2(sigma * (r - radius)))) / (2 * Math.tanh(sigma * radius));

/** York time θ = v_s (x/r) f'(r): negative in front (contraction), positive behind (expansion). */
export const yorkTheta = (x: number, rho: number, { velocity, radius, sigma }: Bubble) => {
  const r = Math.hypot(x, rho);
  if (r === 0) {
    return 0;
  }
  return velocity * (x / r) * shapeDerivative(r, radius, sigma);
};

/** Eulerian energy density, always ≤ 0. */
export const eulerianEnergy = (x: number, rho: number, { velocity, radius, sigma }: Bubble) => {
  const r = Math.hypot(x, rho);
  if (r === 0) {
    return 0;
  }
  const fp = shapeDerivative(r, radius, sigma);
  return (-(velocity ** 2) / (8 * Math.PI)) * ((rho * rho) / (4 * r * r)) * fp * fp;
};

/** Peak |θ|, which sits on the axis (ρ = 0) where |x/r| = 1, so it is v_s · max|f'|. */
export const peakYorkTheta = (bubble: Bubble) => {
  const { velocity, radius, sigma } = bubble;
  const rMax = 2 * radius + 10 / sigma;
  let peak = 0;
  for (let i = 1; i <= PEAK_SAMPLES; i++) {
    const r = (rMax * i) / PEAK_SAMPLES;
    peak = Math.max(peak, Math.abs(shapeDerivative(r, radius, sigma)));
  }
  return velocity * peak;
};

/** Pfenning & Ford thin-wall estimate of the total negative energy, as a mass in M☉. */
export const negativeEnergySolarMasses = ({ velocity, radius, sigma }: Bubble, metersPerUnit: number) => {
  const radiusM = radius * metersPerUnit;
  const sigmaPerM = sigma / metersPerUnit;
  const energyKg = (velocity ** 2 * radiusM ** 2 * sigmaPerM * SPEED_OF_LIGHT ** 2) / (12 * GRAVITATIONAL_CONSTANT);
  return energyKg / SOLAR_MASS_KG;
};
