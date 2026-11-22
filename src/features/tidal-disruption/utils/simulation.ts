import type { Vector3 } from 'three';
import {
  CIRCULARIZATION_RATE,
  COLOR_REFRESH_FRAMES,
  DISK_AFTER_TMIN,
  GM_BH,
  MAX_FRAME_DT,
  MAX_SUBSTEP,
  PARTICLE,
  R_TIDAL_VISUAL,
  SOFTENING,
  STAR_RADIUS_VISUAL,
  SUN_TEMPERATURE_K,
  TIME_SCALE,
} from '../constants';
import type { DebrisSystem, LiveState, Phase, StateRef } from '../types';
import { debrisTemperature, writeColor } from './debris';

const SOFTENING_SQ = SOFTENING * SOFTENING;

/** Time from disruption to the fallback peak: the period of the most bound debris, whose energy spread is GM·R★/r². */
export const fallbackTimescale = (releaseRadius: number) => {
  const energySpread = (GM_BH * STAR_RADIUS_VISUAL) / releaseRadius ** 2;
  const semiMajor = GM_BH / (2 * energySpread);
  return 2 * Math.PI * Math.sqrt(semiMajor ** 3 / GM_BH);
};

/** Point-mass kick-drift for the star center (semi-implicit Euler). */
const stepStar = (pos: Vector3, vel: Vector3, h: number) => {
  const r2 = pos.lengthSq() + SOFTENING_SQ;
  vel.addScaledVector(pos, (-GM_BH * h) / (r2 * Math.sqrt(r2)));
  pos.addScaledVector(vel, h);
};

/** Resets every particle to the rigid star cloud at the star's current position. */
export const resetParticles = (debris: DebrisSystem, state: StateRef) => {
  const { positions, colors, offsets, velocities, status } = debris;
  const { starPos } = state;
  status.fill(PARTICLE.STAR);
  velocities.fill(0);
  for (let i3 = 0; i3 < positions.length; i3 += 3) {
    positions[i3] = starPos.x + (offsets[i3] ?? 0);
    positions[i3 + 1] = starPos.y + (offsets[i3 + 1] ?? 0);
    positions[i3 + 2] = starPos.z + (offsets[i3 + 2] ?? 0);
    writeColor(colors, i3, SUN_TEMPERATURE_K);
  }
  debris.positionAttr.needsUpdate = true;
  debris.colorAttr.needsUpdate = true;
};

const syncStarParticles = (debris: DebrisSystem, starPos: Vector3) => {
  const { positions, offsets, status } = debris;
  for (let i = 0; i < status.length; i++) {
    if (status[i] !== PARTICLE.STAR) {
      continue;
    }
    const i3 = i * 3;
    positions[i3] = starPos.x + (offsets[i3] ?? 0);
    positions[i3 + 1] = starPos.y + (offsets[i3 + 1] ?? 0);
    positions[i3 + 2] = starPos.z + (offsets[i3 + 2] ?? 0);
  }
};

/**
 * Releases star particles as free test particles with the star's velocity (frozen-in approximation).
 * Full disruption releases everything. Partial disruption releases only the tips whose radial offset
 * exceeds R★·(1/β − 1), so the rest keeps moving rigidly with the surviving core.
 */
const releaseParticles = (debris: DebrisSystem, state: StateRef) => {
  const { positions, velocities, offsets, status } = debris;
  const { starPos, starVel } = state;
  const starR = starPos.length();
  const threshold =
    state.periapsis > R_TIDAL_VISUAL
      ? STAR_RADIUS_VISUAL * (state.periapsis / R_TIDAL_VISUAL - 1)
      : Number.NEGATIVE_INFINITY;
  const v2 = starVel.lengthSq();

  let count = 0;
  let bound = 0;
  for (let i = 0; i < status.length; i++) {
    if (status[i] !== PARTICLE.STAR) {
      continue;
    }
    const i3 = i * 3;
    const ox = offsets[i3] ?? 0;
    const oy = offsets[i3 + 1] ?? 0;
    const oz = offsets[i3 + 2] ?? 0;
    const radialOffset = (ox * starPos.x + oy * starPos.y + oz * starPos.z) / starR;
    if (Math.abs(radialOffset) <= threshold) {
      continue;
    }

    const x = starPos.x + ox;
    const y = starPos.y + oy;
    const z = starPos.z + oz;
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
    velocities[i3] = starVel.x;
    velocities[i3 + 1] = starVel.y;
    velocities[i3 + 2] = starVel.z;
    status[i] = PARTICLE.FREE;

    count++;
    if (0.5 * v2 - GM_BH / Math.sqrt(x * x + y * y + z * z) < 0) {
      bound++;
    }
  }

  state.released = true;
  state.releaseTime = state.elapsed;
  state.boundFraction = count > 0 ? bound / count : 0;
};

const accrete = (debris: DebrisSystem, state: StateRef, i: number) => {
  debris.status[i] = PARTICLE.ACCRETED;
  debris.colors.fill(0, i * 3, i * 3 + 3);
  state.accreted++;
};

/** Newtonian free-particle integration, horizon capture and circularization of bound debris. */
const stepDebris = (debris: DebrisSystem, state: StateRef, h: number) => {
  const { positions, velocities, status } = debris;
  const captureR = 2 * state.periapsis;
  const fallbackStarted = state.elapsed - state.releaseTime >= state.tMin;

  for (let i = 0; i < status.length; i++) {
    if (status[i] !== PARTICLE.FREE) {
      continue;
    }
    const i3 = i * 3;
    let x = positions[i3] ?? 0;
    let y = positions[i3 + 1] ?? 0;
    let z = positions[i3 + 2] ?? 0;
    let vx = velocities[i3] ?? 0;
    let vy = velocities[i3 + 1] ?? 0;
    let vz = velocities[i3 + 2] ?? 0;

    const r2 = x * x + y * y + z * z;
    const r = Math.sqrt(r2);
    const bound = 0.5 * (vx * vx + vy * vy + vz * vz) - GM_BH / r < 0;

    // Bound debris back near the star after the first orbit damps its radial velocity and settles into a disk
    if (bound && fallbackStarted && r < captureR) {
      const f = (CIRCULARIZATION_RATE * h * (x * vx + y * vy + z * vz)) / r2;
      vx -= f * x;
      vy -= f * y;
      vz -= f * z;
    }

    const soft = r2 + SOFTENING_SQ;
    const k = (-GM_BH * h) / (soft * Math.sqrt(soft));
    vx += k * x;
    vy += k * y;
    vz += k * z;
    x += vx * h;
    y += vy * h;
    z += vz * h;

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
    velocities[i3] = vx;
    velocities[i3 + 1] = vy;
    velocities[i3 + 2] = vz;

    const rNew = Math.sqrt(x * x + y * y + z * z);
    if (rNew < state.horizonR) {
      accrete(debris, state, i);
    }
  }
};

const checkEvents = (debris: DebrisSystem, state: StateRef) => {
  const r = state.starPos.length();
  const radialDot = state.starPos.dot(state.starVel);

  if (!state.released && !state.swallowed) {
    // Full disruption (β ≥ 1) releases on the tidal-radius crossing; periapsis catches the grazing case
    const fullDisruption = state.periapsis <= R_TIDAL_VISUAL;
    const atPeriapsis = state.prevRadialDot < 0 && radialDot >= 0;
    if (atPeriapsis || (fullDisruption && r <= R_TIDAL_VISUAL)) {
      releaseParticles(debris, state);
    }
  }

  // Swallowed star: the whole cloud crosses the horizon at once
  if (state.swallowed && state.accreted === 0 && r <= state.horizonR) {
    for (let i = 0; i < debris.status.length; i++) {
      accrete(debris, state, i);
    }
  }

  state.prevRadialDot = radialDot;
};

const phaseOf = (state: StateRef): Phase => {
  if (state.swallowed) {
    return 'swallowed';
  }
  if (!state.released) {
    return 'approach';
  }
  const sinceRelease = state.elapsed - state.releaseTime;
  if (sinceRelease >= DISK_AFTER_TMIN * state.tMin) {
    return 'disk';
  }
  return sinceRelease >= state.tMin ? 'fallback' : 'disruption';
};

const refreshDebrisColors = (debris: DebrisSystem, periapsis: number) => {
  const { positions, colors, status } = debris;
  for (let i = 0; i < status.length; i++) {
    if (status[i] !== PARTICLE.FREE) {
      continue;
    }
    const i3 = i * 3;
    const r = Math.sqrt((positions[i3] ?? 0) ** 2 + (positions[i3 + 1] ?? 0) ** 2 + (positions[i3 + 2] ?? 0) ** 2);
    writeColor(colors, i3, debrisTemperature(r, periapsis));
  }
};

export const toLiveState = (state: StateRef): LiveState => ({
  phase: state.phase,
  t: state.released ? state.elapsed - state.releaseTime : 0,
  tMin: state.tMin,
  boundFraction: state.boundFraction,
});

/** Advances the simulation by one real frame: fixed sub-steps, then buffer and phase updates. */
export const stepFrame = (debris: DebrisSystem, state: StateRef, delta: number, speed: number) => {
  const simDt = Math.min(delta, MAX_FRAME_DT) * TIME_SCALE * speed;
  const substeps = Math.max(1, Math.ceil(simDt / MAX_SUBSTEP));
  const h = simDt / substeps;

  for (let s = 0; s < substeps; s++) {
    stepStar(state.starPos, state.starVel, h);
    state.elapsed += h;
    checkEvents(debris, state);
    if (state.released) {
      stepDebris(debris, state, h);
    }
  }

  syncStarParticles(debris, state.starPos);
  if (state.frame % COLOR_REFRESH_FRAMES === 0) {
    refreshDebrisColors(debris, state.periapsis);
    debris.colorAttr.needsUpdate = true;
  }
  state.phase = phaseOf(state);
  state.frame++;

  debris.positionAttr.needsUpdate = true;
};
