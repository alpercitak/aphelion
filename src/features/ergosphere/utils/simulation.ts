import {
  COLOR,
  ESCAPE_R_MAX,
  ESCAPE_SPEED,
  HORIZON_MARGIN,
  KIND,
  MAX_FRAME_DT,
  PARTICLE_COUNT,
  PENROSE_RATE,
  PLUNGE_SPEED,
  RESPAWN_R_MAX,
  RESPAWN_R_MIN,
  TIME_SCALE,
} from '../constants';
import type { ParticleSystem, SceneParams, StateRef } from '../types';
import {
  azimuthRate,
  clampAngularVelocity,
  ergosphereRadius,
  horizonRadius,
  keplerianOmega,
  penroseEfficiency,
  polarForce,
  radialForce,
  timeRate,
} from './kerr';
import { respawnParticle } from './particles';

const colorOf = (kind: number, omega: number) => {
  if (kind === KIND.PLUNGE) {
    return COLOR.plunge;
  }
  if (kind === KIND.ESCAPE) {
    return COLOR.escape;
  }
  return omega < 0 ? COLOR.retrograde : COLOR.prograde;
};

type Force = (x: number, a: number, e: number, l: number, q: number) => number;

/** Position and velocity written by rk4Step. */
const rk4Out = { x: 0, v: 0 };

/** One RK4 step in Mino time for x'' = force(x), leaving the new (x, v) in rk4Out. */
const rk4Step = (force: Force, x: number, v: number, dl: number, a: number, e: number, l: number, q: number) => {
  const a1 = force(x, a, e, l, q);
  const x2 = x + (dl / 2) * v;
  const v2 = v + (dl / 2) * a1;
  const a2 = force(x2, a, e, l, q);
  const x3 = x + (dl / 2) * v2;
  const v3 = v + (dl / 2) * a2;
  const a3 = force(x3, a, e, l, q);
  const x4 = x + dl * v3;
  const v4 = v + dl * a3;
  const a4 = force(x4, a, e, l, q);
  rk4Out.x = x + (dl / 6) * (v + 2 * v2 + 2 * v3 + v4);
  rk4Out.v = v + (dl / 6) * (a1 + 2 * a2 + 2 * a3 + a4);
};

/** Coordinate Ω = dφ/dt on the particle's current geodesic. */
const geodesicOmega = (sys: ParticleSystem, i: number, a: number) => {
  const r = sys.r[i] ?? 0;
  const theta = sys.theta[i] ?? 0;
  const e = sys.energy[i] ?? 0;
  const l = sys.angMom[i] ?? 0;
  return azimuthRate(r, theta, a, e, l) / timeRate(r, theta, a, e, l);
};

/** Advances a NORMAL particle one frame along its Kerr geodesic and respawns it once it falls in or escapes. */
const stepGeodesic = (sys: ParticleSystem, i: number, a: number, rPlus: number, h: number) => {
  const r = sys.r[i] ?? 0;
  const theta = sys.theta[i] ?? 0;
  const e = sys.energy[i] ?? 0;
  const l = sys.angMom[i] ?? 0;
  const q = sys.carter[i] ?? 0;
  const dl = h / timeRate(r, theta, a, e, l);
  sys.phi[i] = (sys.phi[i] ?? 0) + azimuthRate(r, theta, a, e, l) * dl;

  rk4Step(radialForce, r, sys.rDot[i] ?? 0, dl, a, e, l, q);
  sys.r[i] = rk4Out.x;
  sys.rDot[i] = rk4Out.v;
  rk4Step(polarForce, theta, sys.thetaDot[i] ?? 0, dl, a, e, l, q);
  sys.theta[i] = rk4Out.x;
  sys.thetaDot[i] = rk4Out.v;

  const rNew = sys.r[i] ?? 0;
  if (rNew <= rPlus + HORIZON_MARGIN || rNew > ESCAPE_R_MAX) {
    respawnParticle(sys, i, RESPAWN_R_MIN, RESPAWN_R_MAX, a);
  }
  return geodesicOmega(sys, i, a);
};

/** Radial motion of a PLUNGE or ESCAPE fragment: fast plunge, outward escape, and replacement at the horizon. */
const advanceRadius = (sys: ParticleSystem, i: number, a: number, rPlus: number, h: number) => {
  const r = sys.r[i] ?? 0;

  if (sys.kind[i] === KIND.ESCAPE) {
    const rOut = r + ESCAPE_SPEED * h;
    sys.r[i] = rOut;
    if (rOut > ESCAPE_R_MAX) {
      sys.kind[i] = KIND.DORMANT;
      sys.colors.fill(0, i * 3, i * 3 + 3);
    }
    return;
  }

  const rIn = r - PLUNGE_SPEED * h;
  if (rIn <= rPlus + HORIZON_MARGIN) {
    respawnParticle(sys, i, RESPAWN_R_MIN, RESPAWN_R_MAX, a);
    return;
  }
  sys.r[i] = rIn;
};

/**
 * Advances a PLUNGE or ESCAPE fragment one frame. Its Ω is its own orbital velocity clamped to the frame-dragged
 * range at its position. A plunge that reaches the horizon respawns as a NORMAL particle, so its Ω is the geodesic one.
 */
const stepFragment = (sys: ParticleSystem, i: number, a: number, rPlus: number, h: number) => {
  advanceRadius(sys, i, a, rPlus, h);
  if (sys.kind[i] === KIND.NORMAL) {
    return geodesicOmega(sys, i, a);
  }
  const r = sys.r[i] ?? 0;
  const omega = clampAngularVelocity((sys.frac[i] ?? 0) * keplerianOmega(r, a), r, sys.theta[i] ?? 0, a);
  sys.phi[i] = (sys.phi[i] ?? 0) + omega * h;
  return omega;
};

const writeParticle = (sys: ParticleSystem, i: number, a: number, omega: number) => {
  const r = sys.r[i] ?? 0;
  const theta = sys.theta[i] ?? 0;
  const phi = sys.phi[i] ?? 0;
  const horizontal = Math.sqrt(r * r + a * a) * Math.sin(theta);
  const i3 = i * 3;
  sys.positions[i3] = horizontal * Math.cos(phi);
  sys.positions[i3 + 1] = r * Math.cos(theta);
  sys.positions[i3 + 2] = horizontal * Math.sin(phi);

  const c = colorOf(sys.kind[i] ?? KIND.NORMAL, omega);
  sys.colors[i3] = c[0];
  sys.colors[i3 + 1] = c[1];
  sys.colors[i3 + 2] = c[2];
};

/** Uniformly picks one normal particle inside the ergosphere (reservoir sampling, no allocation). */
const pickInsideErgosphere = (sys: ParticleSystem, a: number) => {
  let chosen = -1;
  let seen = 0;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    if (sys.kind[i] !== KIND.NORMAL) {
      continue;
    }
    const cosTheta = Math.cos(sys.theta[i] ?? 0);
    if ((sys.r[i] ?? 0) >= ergosphereRadius(a, cosTheta)) {
      continue;
    }
    seen++;
    if (Math.random() * seen < 1) {
      chosen = i;
    }
  }
  return chosen;
};

const findDormantFragment = (sys: ParticleSystem) => {
  for (let i = PARTICLE_COUNT; i < sys.kind.length; i++) {
    if (sys.kind[i] === KIND.DORMANT) {
      return i;
    }
  }
  return -1;
};

/**
 * Penrose split: a particle inside the ergosphere breaks in two. Fragment A (negative energy) takes the parent's
 * slot and plunges. Fragment B takes a dormant slot, leaves with the parent's position and a boosted prograde
 * velocity. Each event extracts η_max in units of the particle's energy.
 */
const splitParticle = (sys: ParticleSystem, state: StateRef, a: number) => {
  const parent = pickInsideErgosphere(sys, a);
  const child = findDormantFragment(sys);
  if (parent < 0 || child < 0) {
    return;
  }
  sys.kind[parent] = KIND.PLUNGE;
  sys.r[child] = sys.r[parent] ?? 0;
  sys.theta[child] = sys.theta[parent] ?? 0;
  sys.phi[child] = sys.phi[parent] ?? 0;
  sys.frac[child] = 1;
  sys.kind[child] = KIND.ESCAPE;

  state.events++;
  state.extracted += penroseEfficiency(a);
};

/**
 * Advances every particle by one real frame. NORMAL particles follow true timelike Kerr geodesics, one RK4 step in
 * Mino time per frame. Penrose fragments keep the display kinematics in advanceRadius and clampAngularVelocity.
 */
export const stepFrame = (
  sys: ParticleSystem,
  state: StateRef,
  params: Pick<SceneParams, 'spin' | 'showPenrose'>,
  delta: number,
) => {
  const a = params.spin;
  const rPlus = horizonRadius(a);
  const dtReal = Math.min(delta, MAX_FRAME_DT);
  const h = dtReal * TIME_SCALE;

  for (let i = 0; i < sys.kind.length; i++) {
    if (sys.kind[i] === KIND.DORMANT) {
      continue;
    }
    const omega = sys.kind[i] === KIND.NORMAL ? stepGeodesic(sys, i, a, rPlus, h) : stepFragment(sys, i, a, rPlus, h);
    if (sys.kind[i] === KIND.DORMANT) {
      continue;
    }
    writeParticle(sys, i, a, omega);
  }

  if (params.showPenrose && Math.random() < PENROSE_RATE * dtReal) {
    splitParticle(sys, state, a);
  }

  state.frame++;
  sys.positionAttr.needsUpdate = true;
  sys.colorAttr.needsUpdate = true;
};
