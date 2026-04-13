import type { Params } from '../types';

export const PARAMS = {
  mass: 10,
  spin: 0,
  temp: 8000,
  lensStrength: 1.0,
  showDisk: true,
  showJets: true,
  showStars: true,
  dopplerShift: false,
} as const satisfies Params;
