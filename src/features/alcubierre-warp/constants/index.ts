import type { SceneParams } from '../types';
import { peakYorkTheta } from '../utils/metric';

/** Metres per scene unit. */
export const SCENE_UNIT_M = 40;

/** Largest real frame delta that is simulated (s). */
export const MAX_FRAME_DT = 1 / 20;

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
export const EXOTIC_OPACITY = 0.35;
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

// --- Streaming stars ---

export const STREAM_STAR_COUNT = 2500;
/** Stars wrap between x = ±STREAM_BOX_X and stay within y, z = ±STREAM_BOX_YZ. */
export const STREAM_BOX_X = 60;
export const STREAM_BOX_YZ = 30;
/** Stars start outside this radius so none sit on the ship. */
export const STREAM_MIN_R = 6;
/** Display speed (scene units/s) per unit of v_s, capped at STREAM_SPEED_MAX. */
export const STREAM_SPEED_PER_C = 4;
export const STREAM_SPEED_MAX = 30;
/** Point size in pixels, without distance attenuation, so stars passing near the camera stay points. */
export const STREAM_SIZE = 2;
export const STREAM_COLOR = 0xcfe0ff;

// --- Lensing pass ---

/** Peak screen displacement per unit of v_s, as a fraction of the bubble's screen radius. */
export const LENS_STRENGTH = 0.1;
/** Above this speed the displacement stops growing. */
export const LENS_V_CAP = 4;

// --- Layout ---

export const CAMERA_RADIUS = 15;
