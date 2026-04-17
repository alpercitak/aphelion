import type { SceneParams } from '../types';

export const SCENE_PARAMS = {
  linearDensity: 0.5,
  tension: 0.5,
  oscillationAmp: 1.0,
  showDoubleImage: true,
  showIntercommutation: true,
  showGlow: true,
  showCone: false,
} as const satisfies SceneParams;

// String geometry
export const CONTROL_POINTS = 50 as const;
export const STRING_LENGTH = 22 as const; // world units — extends beyond camera frustum edges
export const STRING_RADIUS = 0.008 as const;
export const GLOW_RADIUS = 0.035 as const;

// Intercommutation loop lifetime in seconds
export const LOOP_LIFETIME = 2.5 as const;

// seconds — throttle geometry rebuild
export const REBUILD_INTERVAL = 0.05;
