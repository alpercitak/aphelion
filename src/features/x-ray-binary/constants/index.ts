import type { SceneParams } from '../types';

/** Mass transfer rate (log10 M☉/yr) at which the disk has its reference brightness. */
export const MDOT_REF_LOG = -8.5;

export const SCENE_PARAMS = {
  accretorMass: 1.4,
  donorMass: 0.6,
  mdotLog: MDOT_REF_LOG,
  rocheLobes: true,
  starField: true,
} as const satisfies SceneParams;

// --- Binary geometry (scene units) ---

/** Separation of the two stars. */
export const SEPARATION = 10;
/** Orbital angular velocity of the default system (rad/s). */
export const ORBIT_OMEGA_REF = 0.25;
/** Scene gravitational constant, chosen so the default system orbits at ORBIT_OMEGA_REF. */
export const G_SCENE = (ORBIT_OMEGA_REF ** 2 * SEPARATION ** 3) / (SCENE_PARAMS.accretorMass + SCENE_PARAMS.donorMass);
/** Share of the donor's Roche lobe that the surface fills, so it stays just inside. */
export const DONOR_FILL = 0.995;
/** Disk outer edge as a share of the accretor's Roche lobe (tidal truncation). */
export const DISK_TIDAL_FRACTION = 0.8;
export const LOBE_SEGMENTS = 256;
export const LOBE_COLOR = 0x4fc3f7;
export const LOBE_OPACITY = 0.5;

// --- Disk ---

export const DISK_RING_COUNT = 14;
/** Inner disk edge as a share of the outer edge. */
export const DISK_INNER_FRACTION = 0.06;
/** Display temperature (K) at the inner edge, used for ring colours. */
export const DISK_T_IN_DISPLAY = 30000;
/** Thin-disk temperature index: T ∝ r^(−3/4). */
export const DISK_TEMP_EXPONENT = -0.75;
export const DISK_OPACITY = 0.6;
/** Disk brightness scales as (Ṁ / Ṁ_ref)^exponent, capped at 1. */
export const DISK_BRIGHTNESS_EXPONENT = 0.25;

// --- Gas stream & disk particles ---

export const GAS_PARTICLES = 5000;
export const GAS_POINT_SIZE = 0.12;
export const STREAM_COLOR = 0xffb070;
/** Gas colour multiplier, so overlapping points under additive blending don't saturate to white. */
export const GAS_BRIGHTNESS = 0.4;
/** Stream spawn rate (particles/s) at MDOT_REF_LOG; scales linearly with Ṁ. */
export const STREAM_RATE_REF = 220;
export const STREAM_RATE_MAX = 1200;
/** Initial stream speed from L1 toward the accretor (scene units/s). */
export const STREAM_V0 = 0.15;
export const STREAM_JITTER = 0.08;
export const STREAM_VELOCITY_JITTER = 0.05;
/** Largest integration step for stream particles (s). */
export const GAS_MAX_SUBSTEP = 1 / 240;
/** Stream particles beyond this many separations from the origin are freed. */
export const GAS_ESCAPE_RANGE = 3;
/** Time constant (s) of the viscous inward drift of disk gas. */
export const DISK_DRIFT_TIME = 5;
/**
 * Cap (rad/s) on the displayed Keplerian rate, so inner-disk gas moves a small step per frame
 * instead of strobing (the inner edge orbits in ~0.1 s). Inside the radius where Kepler exceeds it,
 * the gas turns rigidly.
 */
export const DISK_MAX_ANGULAR_RATE = 12;
/** Random walk in radius per √s, as a share of r: viscous spreading that smears the spiral from the single entry point. */
export const DISK_DIFFUSION = 0.15;
/** Rate (1/s) at which disk gas settles onto the midplane. */
export const DISK_SETTLE_RATE = 1;
/** Entries in the disk colour lookup table. */
export const DISK_LUT_SIZE = 64;

// --- Bodies & colours ---

export const DONOR_COLOR = 0xffa060;
export const DONOR_GLOW_COLOR = 0xffb070;
export const NS_COLOR = 0xcfe8ff;
export const NS_GLOW_COLOR = 0x9fd8ff;
export const NS_VISUAL_RADIUS = 0.25;
export const BH_VISUAL_RADIUS = 0.35;
export const BH_GLOW_COLOR = 0xff8a3d;
export const GLOW_SCALE = 2.4;
/** Donor glow as a multiple of its surface, so the halo hugs the lobe. */
export const DONOR_GLOW_SCALE = 1.15;
/** Linear limb-darkening coefficient u; about 0.6 for a Sun-like star in the optical. */
export const DONOR_LIMB_DARKENING = 0.6;

// --- Layout ---

export const CAMERA_RADIUS = 26;
/** Largest real frame delta that is simulated (s). */
export const MAX_FRAME_DT = 1 / 20;
