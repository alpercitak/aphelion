import { Vector3 } from 'three';
import type { SceneParams, StateRef } from '../types';

export const SCENE_PARAMS = {
  logMass: 6,
  starMass: 1,
  beta: 1.8,
  showTidal: true,
  showOrbit: true,
  showStars: true,
} as const satisfies SceneParams;

/** Scene units with G·M_bh = 1. */
export const GM_BH = 1;

/** Visual tidal radius (scene units). The real r_t is only used for the HUD and horizon ratio. */
export const R_TIDAL_VISUAL = 4;

/** Floor for the visual horizon radius so small holes stay visible. */
export const MIN_HORIZON_VISUAL = 0.25;

/** Visual radius of the star cloud (scene units). */
export const STAR_RADIUS_VISUAL = 0.5;

/** Star starts on the orbit at this radius (scene units). */
export const START_RADIUS = 5 * R_TIDAL_VISUAL;

export const PARTICLE_COUNT = 3000;

export const PARTICLE = {
  STAR: 0,
  FREE: 1,
  ACCRETED: 2,
} as const;

/** Simulation time units per real second. */
export const TIME_SCALE = 20;
/** Largest real frame delta that is simulated (seconds). */
export const MAX_FRAME_DT = 1 / 20;
/** Largest integration step (scene time units). */
export const MAX_SUBSTEP = 0.01;
/** Softening length for the point-mass potential. */
export const SOFTENING = 0.05;
/** Fraction of radial velocity removed per unit time for bound debris inside 2 r_p. */
export const CIRCULARIZATION_RATE = 0.5;

export const SUN_TEMPERATURE_K = 5800;
export const COLOR_REFRESH_FRAMES = 4;
export const LIVE_REFRESH_FRAMES = 10;
export const ORBIT_SEGMENTS = 256;

export const INITIAL_STATE: StateRef = {
  phase: 'approach',
  swallowed: false,
  periapsis: R_TIDAL_VISUAL,
  horizonR: MIN_HORIZON_VISUAL,
  tMin: 1,
  elapsed: 0,
  released: false,
  releaseTime: 0,
  boundFraction: 0,
  diskReady: false,
  accreted: 0,
  prevRadialDot: 0,
  frame: 0,
  starPos: new Vector3(),
  starVel: new Vector3(),
};
