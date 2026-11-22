import { Vector3 } from 'three';
import type { LiveState, Phase, SceneParams, StateRef } from '../types';

export const SCENE_PARAMS = {
  logMass: 6,
  starMass: 1,
  beta: 1.8,
  showTidal: true,
  showOrbit: true,
  showStars: true,
  playbackSpeed: 1,
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

/** Default orbit camera distance (scene units). Start point (r = START_RADIUS) stays on screen. */
export const CAMERA_RADIUS = 28;

/** Debris point size in world units (perspective-attenuated). */
export const DEBRIS_POINT_SIZE = 0.16;
/** Color gain applied at the hottest debris; coldest debris keeps gain 1. Values > 1 rely on additive blending and tone mapping. */
export const DEBRIS_HOT_GAIN = 1.8;

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
/** Disk phase starts at this multiple of t_min, when ~37% of bound debris has returned (1 − (t/t_min)^(−2/3)). */
export const DISK_AFTER_TMIN = 2;

/** Glow brightness with no flare, and the extra brightness added at the flare peak. */
export const GLOW_BASE = 1;
export const GLOW_FLARE = 3;

export const SUN_TEMPERATURE_K = 5800;
export const COLOR_REFRESH_FRAMES = 4;
export const LIVE_REFRESH_FRAMES = 10;
export const ORBIT_SEGMENTS = 256;

export const PHASE_LABEL_MAP = {
  approach: '● STAR APPROACHING',
  disruption: '◉ TIDAL DISRUPTION',
  fallback: '◎ DEBRIS FALLBACK',
  disk: '◎ DISK FORMED',
  swallowed: '● SWALLOWED WHOLE',
} as const satisfies Record<Phase, string>;

export const INITIAL_LIVE: LiveState = {
  phase: 'approach',
  t: 0,
  tMin: 1,
  boundFraction: 0,
};

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
  accreted: 0,
  prevRadialDot: 0,
  frame: 0,
  starPos: new Vector3(),
  starVel: new Vector3(),
};
