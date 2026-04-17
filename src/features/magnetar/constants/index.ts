import type { SceneParams, StarquakeRate } from '../types';

export const SCENE_PARAMS = {
  fieldStrength: 1.0,
  burstIntensity: 1.0,
  surfaceTemp: 5e6,
  starquakeRate: 'off',
  showFieldLines: true,
  showStarquakes: true,
  showGammaBursts: true,
  showFieldDistortion: true,
} as const satisfies SceneParams;

export const NS_RADIUS = 0.38 as const;

export const STARQUAKE_DURATION = 1.8 as const; // seconds a crack stays visible

export const STARQUAKE_RATE_MAP = {
  off: Infinity,
  rare: 8.0,
  frequent: 2.5,
} as const satisfies Record<StarquakeRate, number>;
