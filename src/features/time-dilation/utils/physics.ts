import { CLOCK_SPACING, PHOTON_SPHERE_RADIUS, R_EDGE } from '../constants';

/** Rate of a static clock, dτ/dt = √(1 − Rₛ/r). */
export const staticRate = (r: number) => Math.sqrt(1 - 1 / r);

/** Rate of a clock on a circular orbit, dτ/dt = √(1 − 3Rₛ/2r). Only defined outside the photon sphere. */
export const orbitRate = (r: number) => Math.sqrt(1 - 3 / (2 * r));

/** Locally measured (static observer) speed of a circular orbit, v = √(1/(2(r − Rₛ))). */
export const orbitSpeed = (r: number) => Math.sqrt(1 / (2 * (r - 1)));

/**
 * Frequency ratio ν_obs/ν_em seen by a distant observer from a clock on a circular orbit, √(1 − Rₛ/r) / (γ(1 − v·n̂)).
 * `vDotN` is v·n̂ with n̂ the unit vector from the clock toward the camera. Light bending is ignored.
 */
export const orbitDopplerRate = (r: number, vDotN: number) => {
  const v = orbitSpeed(r);
  return (staticRate(r) * Math.sqrt(1 - v * v)) / (1 - vDotN);
};

export const canOrbit = (r: number) => r > PHOTON_SPHERE_RADIUS;

/** Clocks inside the photon sphere cannot orbit, so they stay static in orbit mode. */
export const clockRate = (r: number, orbiting: boolean) => (orbiting && canOrbit(r) ? orbitRate(r) : staticRate(r));

/** Coordinate angular velocity of a circular orbit, Ω = √(1/(2r³)) with GM = 1/2. */
export const orbitOmega = (r: number) => Math.sqrt(1 / (2 * r ** 3));

/** Flamm's paraboloid w(r) = 2√(r − Rₛ), shifted to zero at the outer edge of the grid. */
export const surfaceHeight = (r: number) => 2 * (Math.sqrt(r - 1) - Math.sqrt(R_EDGE - 1));

/** Radius of clock i: innerRadius · CLOCK_SPACING^i. */
export const clockRadius = (innerRadius: number, index: number) => innerRadius * CLOCK_SPACING ** index;
