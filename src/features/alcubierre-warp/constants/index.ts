import type { SceneParams } from '../types';
import { peakYorkTheta } from '../utils/metric';

/** Metres per scene unit. */
export const SCENE_UNIT_M = 40;

export const SCENE_PARAMS = {
  velocity: 2,
  radius: 2.5,
  sigma: 4,
  yorkGrid: true,
  exoticMatter: true,
  lensing: true,
  starField: true,
} as const satisfies SceneParams;

// --- York-time grid ---

export const GRID_HALF = 9;
export const GRID_LINES = 72;
export const GRID_SAMPLES = 144;
/** Height of the grid plane, under the ship. */
export const GRID_Y = -1.2;
export const YORK_HEIGHT = 2.2;
/** Peak |θ| at the default parameters; normalises the grid height and colour. */
export const YORK_REF = peakYorkTheta(SCENE_PARAMS);
export const GRID_OPACITY = 0.8;
export const YORK_BASE_COLOR = 0x2a3a55;
/** Expansion (θ > 0, behind the bubble). */
export const YORK_EXPAND_COLOR = 0xff5a4a;
/** Contraction (θ < 0, in front of the bubble). */
export const YORK_CONTRACT_COLOR = 0x4fa8ff;

// --- Exotic matter ring ---

/** Tube radius in units of 1/σ, so the wall thickness and the tube stay in step. */
export const EXOTIC_TUBE = 1.5;
export const EXOTIC_COLOR = 0xb06cff;
export const EXOTIC_OPACITY = 0.7;
/** Speed at which the ring is fully opaque; the energy grows as v_s². */
export const EXOTIC_V_REF = 2;
export const EXOTIC_RADIAL_SEGMENTS = 24;
export const EXOTIC_TUBULAR_SEGMENTS = 96;

// --- Bubble wall hint ---

export const WALL_COLOR = 0x4fc3f7;
export const WALL_OPACITY = 0.08;

// --- Ship ---

export const SHIP_COLOR = 0xd0d4dc;
export const SHIP_NOSE_RADIUS = 0.18;
export const SHIP_NOSE_LENGTH = 0.6;
export const SHIP_NOSE_X = 0.2;
export const SHIP_BODY_RADIUS = 0.1;
export const SHIP_BODY_LENGTH = 0.5;
export const SHIP_BODY_X = -0.35;
export const ENGINE_COLOR = 0x6fb8ff;
export const ENGINE_RADIUS = 0.1;
export const ENGINE_X = -0.62;

// --- Layout ---

export const CAMERA_RADIUS = 15;
