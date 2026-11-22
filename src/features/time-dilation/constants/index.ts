import type { LiveState, SceneParams, StateRef } from '../types';

export const SCENE_PARAMS = {
  mass: 10,
  innerRadius: 1.5,
  timeRate: 1,
  orbiting: false,
  signals: true,
  wellGrid: true,
  starField: true,
} as const satisfies SceneParams;

export const TAU = Math.PI * 2;
/** Largest real frame delta that is simulated (s). */
export const MAX_FRAME_DT = 1 / 20;
export const LIVE_REFRESH_FRAMES = 10;
export const CAMERA_RADIUS = 30;

// --- Radii (scene units: Rₛ = 1) ---

export const PHOTON_SPHERE_RADIUS = 1.5;
export const CLOCK_COUNT = 4;
export const CLOCK_SPACING = 2;
/** Orbital angle per unit of Ω, so inner orbits are visible without blurring. */
export const ORBIT_DISPLAY_SCALE = 3;

// --- Flamm's paraboloid ---

export const R_EDGE = 16;
export const WELL_RINGS = 24;
export const WELL_SPOKES = 36;
export const WELL_RING_SEGMENTS = 128;
export const WELL_SPOKE_SAMPLES = 48;
export const WELL_COLOR = 0x2a4a6a;

// --- Black hole ---

export const BLACK_HOLE_RADIUS = 1;
export const PHOTON_RING_WIDTH = 0.04;
export const PHOTON_RING_COLOR = 0xffb070;
export const PHOTON_RING_OPACITY = 0.35;

// --- Clocks ---

export const CLOCK_LIFT = 0.6;
/** Proper seconds per revolution of the hand. */
export const CLOCK_PERIOD = 4;
export const CLOCK_RIM_RADIUS = 0.45;
export const CLOCK_RIM_WIDTH = 0.04;
export const CLOCK_TICKS = 12;
export const CLOCK_TICK_INNER = 0.34;
export const CLOCK_TICK_OUTER = 0.4;
export const CLOCK_HAND_LENGTH = 0.36;
export const CLOCK_HAND_WIDTH = 0.05;

// --- Light ---

export const EMITTED_WAVELENGTH_NM = 500;
export const VISIBLE_MAX_NM = 780;
/** Brightness of wavelengths beyond the visible range, so infrared clocks stay faintly visible. */
export const INFRARED_RED = 0.15;

export const INITIAL_STATE: StateRef = { t: 0, frame: 0 };
export const INITIAL_LIVE: LiveState = { t: 0, tau: Array.from({ length: CLOCK_COUNT }, () => 0) };
