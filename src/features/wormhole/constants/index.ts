import type { Destination, SceneParams } from '../types';

export const SCENE_PARAMS = {
  throatRadius: 1.0,
  exoticDensity: 0.6,
  lensingStrength: 1.0,
  destination: 'distant',
  showExoticHalo: true,
  showLensingRings: true,
  showStars: true,
} as const satisfies SceneParams;

export const DESTINATION_OPTIONS = ['distant', 'nebula'] as const satisfies ReadonlyArray<Destination>;

export const DESTINATION_LABEL_MAP = {
  distant: 'Distant galaxy',
  nebula: 'Stellar nebula',
} as const satisfies Record<Destination, string>;

export const DESTINATION_COLOR_MAP = {
  distant: 0x4466ff, // cold blue — far future
  nebula: 0xff6644, // warm orange — star-forming region
} as const satisfies Record<Destination, number>;
