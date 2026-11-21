import {
  COLOR,
  ESCAPE_R_MAX,
  ESCAPE_SPEED,
  HORIZON_MARGIN,
  INSPIRAL_CURVATURE,
  INSPIRAL_RATE,
  KIND,
  MAX_FRAME_DT,
  PLUNGE_SPEED,
  RESPAWN_R_MAX,
  RESPAWN_R_MIN,
  TIME_SCALE,
} from '../constants';
import type { ParticleSystem, SceneParams, StateRef } from '../types';
import { clampAngularVelocity, horizonRadius, keplerianOmega } from './kerr';
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

/** Radial motion: slow inspiral, fast plunge, outward escape, and replacement at the horizon. */
const advanceRadius = (sys: ParticleSystem, i: number, rPlus: number, h: number) => {
  const kind = sys.kind[i];
  const r = sys.r[i] ?? 0;

  if (kind === KIND.ESCAPE) {
    const rOut = r + ESCAPE_SPEED * h;
    sys.r[i] = rOut;
    if (rOut > ESCAPE_R_MAX) {
      sys.kind[i] = KIND.DORMANT;
      sys.colors.fill(0, i * 3, i * 3 + 3);
    }
    return;
  }

  const drift = kind === KIND.PLUNGE ? PLUNGE_SPEED : INSPIRAL_RATE * (1 + INSPIRAL_CURVATURE / r);
  const rIn = r - drift * h;
  if (rIn <= rPlus + HORIZON_MARGIN) {
    respawnParticle(sys, i, RESPAWN_R_MIN, RESPAWN_R_MAX);
    return;
  }
  sys.r[i] = rIn;
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

/**
 * Advances every particle by one real frame. Each particle's Ω is its own orbital velocity clamped to the
 * frame-dragged range at its position, so inside the ergosphere it can no longer stand still or counter-rotate.
 */
export const stepFrame = (sys: ParticleSystem, state: StateRef, params: Pick<SceneParams, 'spin'>, delta: number) => {
  const a = params.spin;
  const rPlus = horizonRadius(a);
  const h = Math.min(delta, MAX_FRAME_DT) * TIME_SCALE;

  for (let i = 0; i < sys.kind.length; i++) {
    if (sys.kind[i] === KIND.DORMANT) {
      continue;
    }
    advanceRadius(sys, i, rPlus, h);
    if (sys.kind[i] === KIND.DORMANT) {
      continue;
    }
    const r = sys.r[i] ?? 0;
    const omega = clampAngularVelocity((sys.frac[i] ?? 0) * keplerianOmega(r, a), r, sys.theta[i] ?? 0, a);
    sys.phi[i] = (sys.phi[i] ?? 0) + omega * h;
    writeParticle(sys, i, a, omega);
  }

  state.frame++;
  sys.positionAttr.needsUpdate = true;
  sys.colorAttr.needsUpdate = true;
};
