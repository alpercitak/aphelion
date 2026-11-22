import type { LiveState, SceneParams, StateRef } from '../types';

export const SCENE_PARAMS = {
  spin: 0.9,
  mass: 10,
  showErgosphere: true,
  showPenrose: true,
  showStars: true,
} as const satisfies SceneParams;

export const ERGOSPHERE_COLOR = 0x2fe6c4;

/** Test particles. The last FRAGMENT_SLOTS entries are reserved for Penrose escape fragments. */
export const PARTICLE_COUNT = 600;
export const FRAGMENT_SLOTS = 8;
export const PARTICLE_TOTAL = PARTICLE_COUNT + FRAGMENT_SLOTS;

export const KIND = {
  NORMAL: 0,
  PLUNGE: 1,
  ESCAPE: 2,
  DORMANT: 3,
} as const;

/** Radial shell for the initial spawn, in M. */
export const SPAWN_R_MIN = 2.5;
export const SPAWN_R_MAX = 6;
/** Radial shell for particles that fall in or escape and are replaced. */
export const RESPAWN_R_MIN = 4.5;
export const RESPAWN_R_MAX = 6.5;
/** Half-thickness of the particle band around the equator (rad). */
export const EQUATOR_BAND = 0.5;
/** A particle is replaced once r ≤ r₊ + HORIZON_MARGIN. */
export const HORIZON_MARGIN = 0.05;

/** Simulation time units per real second. */
export const TIME_SCALE = 3;
/** Largest real frame delta that is simulated (seconds). */
export const MAX_FRAME_DT = 1 / 20;
/** Radial infall speed of PLUNGE fragments (display only). */
export const PLUNGE_SPEED = 0.6;
export const ESCAPE_SPEED = 2;
export const ESCAPE_R_MAX = 14;
/** Average Penrose events per real second. */
export const PENROSE_RATE = 0.25;

export const LIVE_REFRESH_FRAMES = 10;

/** RGB per particle state, used for vertex colors. Values above 1 are allowed (additive blending). */
export const COLOR = {
  retrograde: [1, 0.28, 0.22],
  prograde: [0.3, 0.65, 1.4],
  plunge: [0.45, 0.06, 0.04],
  escape: [2.2, 2, 1.6],
} as const;

/** Below this spin the HUD labels the hole as Schwarzschild. */
export const SCHWARZSCHILD_SPIN_LIMIT = 0.01;

export const INITIAL_LIVE: LiveState = {
  events: 0,
  extracted: 0,
};

export const INITIAL_STATE: StateRef = {
  events: 0,
  extracted: 0,
  frame: 0,
};
