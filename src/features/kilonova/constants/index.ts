import type { LiveState, Phase, RemnantType, SceneParams, StateRef } from '../types';

export const SCENE_PARAMS = {
  m1: 1.45,
  m2: 1.25,
  ejectaMass: 0.04,
  days: 0 as number,
  autoPlay: true,
  grbJet: true,
  gwRings: true,
  starField: true,
} as const satisfies SceneParams;

// --- Scale: scene units vs real kilometres ---

/** Separation at the start of the inspiral (scene units). */
export const INITIAL_SEPARATION = 10;
/** Real separation at the start of the inspiral (km). */
export const INITIAL_SEPARATION_KM = 300;
export const KM_PER_UNIT = INITIAL_SEPARATION_KM / INITIAL_SEPARATION;

/** Neutron star radius (km). Merger starts at contact, a = 2 R_NS. */
export const NS_RADIUS_KM = 12;
export const MERGE_SEPARATION = (2 * NS_RADIUS_KM) / KM_PER_UNIT;
export const NS_VISUAL_RADIUS = NS_RADIUS_KM / KM_PER_UNIT;

// --- Inspiral ---

/** Peters decay timescale in display seconds (the real value from 300 km is ~30 s): a(t) = a₀ (1 − t/τ)^(1/4). */
export const INSPIRAL_TAU = 6;
/** Scene GM per M☉: orbital ω = √(GM/a³) with GM = ORBIT_GM_PER_MSUN · M. Normalised, not real units. */
export const ORBIT_GM_PER_MSUN = 240;

export const RING_INTERVAL = 0.35;
export const RING_SPEED = 3;
export const RING_MAX_RADIUS = 14;
export const RING_OPACITY = 0.7;
export const RING_COLOR = 0x4fc3f7;

// --- Remnant (approximate: depends on the unknown neutron-star equation of state) ---

/** Total mass (M☉) below which the remnant is a stable or supramassive neutron star. */
export const NS_MAX_TOTAL_MASS = 2.4;
/** Total mass (M☉) at or above which the remnant collapses to a black hole promptly. */
export const BH_PROMPT_TOTAL_MASS = 2.9;
/** Hypermassive remnant collapse delay after the merger starts (s). */
export const HMNS_COLLAPSE_DELAY = 1.0;
export const MIN_BH_VISUAL_RADIUS = 0.3;

// --- Merger ---

export const FLASH_PEAK_OPACITY = 0.7;
/** Time for the two bodies to converge (s). */
export const MERGE_SNAP = 0.6;
/** Merger phase length before the kilonova timeline starts (s). */
export const MERGER_DURATION = 2.5;
/** Short GRB jet onset after the merger, as in GRB 170817A (s). */
export const JET_DELAY = 1.7;
export const JET_LIFETIME = 3;
export const JET_RISE = 0.8;
export const JET_LENGTH = 9;
export const JET_RADIUS = 0.25;
export const JET_OPACITY = 0.9;
export const JET_COLOR = 0xcfeaff;

// --- Kilonova ---

export const DAYS_PER_SECOND = 1;
export const KILONOVA_DAYS = 21;
/** Share of the ejecta mass in the lanthanide-poor blue component. The rest is red. */
export const BLUE_MASS_FRACTION = 0.4;
/** Bolometric peak (days). AT2017gfo was brightest within about a day, then faded as the heating rate. */
export const BOLOMETRIC_PEAK_DAYS = 1;
/** Days after which the red component outshines the blue one in the bolometric output. */
export const RED_TAKEOVER_DAYS = 2.5;
/** Band peaks that set each cloud's brightness: blue in the optical, red in the near-infrared. */
export const BLUE_PEAK_DAYS = 1;
export const RED_PEAK_DAYS = 7;
/** Late-time heating slope: L ∝ t^(−1.3). */
export const DECAY_EXPONENT = -1.3;
export const EJECTA_MASS_REF = 0.04;
export const EJECTA_BRIGHTNESS = 0.9;
export const EJECTA_PARTICLES = 4000;
/** Blue ejecta lies within this angle of the spin axis (rad). */
export const BLUE_POLAR_HALF_ANGLE = Math.PI / 4;
/** Red ejecta lies in an equatorial torus of this half height (rad of latitude). */
export const RED_TORUS_HALF_HEIGHT = 0.35;
export const BLUE_SPEED_RANGE = [0.25, 0.3] as const;
export const RED_SPEED_RANGE = [0.08, 0.12] as const;
/** Speed (c) that maps to a radius of EJECTA_DISPLAY_SCALE · √day. Blue fast, red slow. */
export const SPEED_REF = 0.3;
/** Scene units per √day for a SPEED_REF particle. Square-root time keeps the cloud on screen over 21 days. */
export const EJECTA_DISPLAY_SCALE = 1.75;
export const LANTHANIDE_SHIFT_DAYS = 7;
export const EJECTA_POINT_SIZE = 0.12;
export const BLUE_EJECTA_COLOR = 0x5a99ff;
export const RED_EJECTA_COLOR = 0xff401f;

// --- Colors ---

export const NS_COLOR = 0xdff3ff;
export const NS_GLOW_COLOR = 0x9fd8ff;
export const BH_GLOW_COLOR = 0xff8a3d;
export const FLASH_COLOR = 0xffeedd;
export const GLOW_SCALE = 2.4;

// --- Layout & refresh ---

export const CAMERA_RADIUS = 22;
/** Largest real frame delta that is simulated (s). */
export const MAX_FRAME_DT = 1 / 20;
export const LIVE_REFRESH_FRAMES = 10;

export const PHASE_LABEL_MAP = {
  inspiral: '● INSPIRAL',
  merger: '◉ MERGER',
  kilonova: '◎ KILONOVA',
} as const satisfies Record<Phase, string>;

export const REMNANT_LABEL_MAP = {
  'neutron-star': 'NEUTRON STAR',
  hypermassive: 'HMNS → BLACK HOLE',
  'black-hole': 'BLACK HOLE',
} as const satisfies Record<RemnantType, string>;

export const INITIAL_LIVE: LiveState = {
  phase: 'inspiral',
  elapsed: 0,
  separation: INITIAL_SEPARATION,
  days: 0,
  luminosity: 0,
  dominant: 'BLUE',
};

export const INITIAL_STATE: StateRef = {
  phase: 'inspiral',
  frame: 0,
  elapsed: 0,
  mergeT: 0,
  separation: INITIAL_SEPARATION,
  angle: 0,
  remnant: 'neutron-star',
  days: 0,
  lastRingTime: 0,
  rings: [],
};
