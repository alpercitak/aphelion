import type { EjectionRate, Params } from '../types';

export const PARAMS = {
  mass: 10,
  ejectionRate: 'low',
  ejectionVelocity: 0.01,
  temperature: 12000,
  showTrails: true,
  showPhotonSphere: true,
  showEjectaHaze: true,
  showStars: true,
} as const satisfies Params;

// Spawn rates: particles per frame
export const EJECTION_RATE_MAP = {
  low: 2,
  medium: 5,
  high: 10,
  extreme: 20,
} as const satisfies Record<EjectionRate, number>;

// Ejecta particle pool size — fixed, respawned when out of range
export const PARTICLE_POOL = 2400;
export const MAX_RADIUS = 10.0;
