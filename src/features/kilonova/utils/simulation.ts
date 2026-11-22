import {
  BLUE_PEAK_DAYS,
  DAYS_PER_SECOND,
  EJECTA_BRIGHTNESS,
  EJECTA_DISPLAY_SCALE,
  EJECTA_MASS_REF,
  FLASH_PEAK_OPACITY,
  HMNS_COLLAPSE_DELAY,
  JET_DELAY,
  JET_LENGTH,
  JET_LIFETIME,
  JET_OPACITY,
  JET_RISE,
  KILONOVA_DAYS,
  MERGE_SEPARATION,
  MERGE_SNAP,
  MERGER_DURATION,
  RED_PEAK_DAYS,
  RING_INTERVAL,
} from '../constants';
import type { LiveState, SceneParams, SceneRef, StateRef } from '../types';
import { shiftBlueEjectaColor } from './ejecta';
import { createWaveRing, updateWaveRings } from './gw-rings';
import { componentShape, dominantComponent, relativeLuminosity } from './lightcurve';
import { inspiralTau, orbitalOmega, orbitalPositions, separationAt, totalMass } from './physics';

export const toLiveState = (state: StateRef): LiveState => {
  const kilonova = state.phase === 'kilonova';
  return {
    phase: state.phase,
    elapsed: state.elapsed,
    separation: state.separation,
    days: state.days,
    luminosity: kilonova ? relativeLuminosity(state.days) : 0,
    dominant: dominantComponent(state.days),
  };
};

/** Places the bodies on their orbit. They hide once the merger has closed the gap. */
const placeBodies = (refs: SceneRef, state: StateRef) => {
  const { bodyA, bodyB } = refs.entities;
  const pos = orbitalPositions(state.angle, state.separation);
  const visible = state.mergeT < MERGE_SNAP;
  bodyA.mesh.position.set(pos.x1, 0, pos.z1);
  bodyB.mesh.position.set(pos.x2, 0, pos.z2);
  bodyA.mesh.visible = visible;
  bodyB.mesh.visible = visible;
};

const spawnRingIfDue = (refs: SceneRef, params: SceneParams, state: StateRef) => {
  if (params.gwRings && state.elapsed - state.lastRingTime >= RING_INTERVAL) {
    state.lastRingTime = state.elapsed;
    state.rings.push(createWaveRing(refs.core.scene, state.separation / 2));
  }
};

const stepInspiral = (refs: SceneRef, params: SceneParams, state: StateRef, dt: number) => {
  state.elapsed += dt;
  // Clamped at contact so the merger starts exactly at a = 2 R_NS
  state.separation = Math.max(MERGE_SEPARATION, separationAt(state.elapsed, inspiralTau(params)));
  state.angle += orbitalOmega(state.separation, totalMass(params)) * dt;
  placeBodies(refs, state);
  spawnRingIfDue(refs, params, state);
  if (state.separation === MERGE_SEPARATION) {
    state.phase = 'merger';
    state.mergeT = 0;
  }
};

const stepMerger = (
  refs: SceneRef,
  params: SceneParams,
  state: StateRef,
  dt: number,
  setDays: (days: number) => void,
) => {
  const snap = Math.min(1, state.mergeT / MERGE_SNAP);
  state.separation = MERGE_SEPARATION * (1 - snap * snap * (3 - 2 * snap));
  // Keep orbiting at the contact rate while the bodies close the gap
  state.angle += orbitalOmega(MERGE_SEPARATION, totalMass(params)) * dt;
  placeBodies(refs, state);
  spawnRingIfDue(refs, params, state);

  if (state.mergeT >= MERGER_DURATION) {
    state.phase = 'kilonova';
    state.days = 0;
    setDays(0);
  }
};

/** Flash peaks mid-merger. The camera-attached plane is the same trick as binary-merger. */
const updateFlash = (refs: SceneRef, state: StateRef) => {
  refs.entities.flash.material.opacity =
    state.phase === 'merger' ? Math.sin((Math.PI * state.mergeT) / MERGER_DURATION) * FLASH_PEAK_OPACITY : 0;
};

/** The remnant appears once the bodies have merged. A hypermassive remnant collapses to a black hole after a delay. */
const updateRemnant = (refs: SceneRef, state: StateRef) => {
  const { remnantNs, remnantBh } = refs.entities;
  const merged = state.mergeT >= MERGE_SNAP;
  const collapsed =
    state.remnant === 'black-hole' || (state.remnant === 'hypermassive' && state.mergeT >= HMNS_COLLAPSE_DELAY);
  remnantNs.mesh.visible = merged && !collapsed;
  remnantBh.mesh.visible = merged && collapsed;
};

/** Short GRB jet: a cone along the spin axis, switched on after JET_DELAY and fading within JET_LIFETIME. */
const updateJet = (refs: SceneRef, params: SceneParams, state: StateRef) => {
  const { jetUp, jetDown } = refs.entities;
  const since = state.mergeT - JET_DELAY;
  const active = params.grbJet && since >= 0 && since <= JET_LIFETIME;
  jetUp.visible = active;
  jetDown.visible = active;
  if (!active) {
    return;
  }
  const length = JET_LENGTH * Math.min(1, since / JET_RISE);
  jetUp.scale.set(1, length, 1);
  jetDown.scale.set(1, length, 1);
  jetDown.material.opacity = JET_OPACITY * (1 - since / JET_LIFETIME) ** 2;
};

/**
 * Ejecta expand homologously, r = v t, with the time axis compressed to √day so the cloud stays on screen.
 * Each cloud is scaled as a whole; particle speeds are fixed in the point positions.
 */
const updateEjecta = (refs: SceneRef, params: SceneParams, state: StateRef) => {
  const { blueEjecta, redEjecta } = refs.entities;
  const visible = state.phase === 'kilonova' && state.days > 0;
  const radius = EJECTA_DISPLAY_SCALE * Math.sqrt(state.days);
  const brightness = EJECTA_BRIGHTNESS * Math.sqrt(params.ejectaMass / EJECTA_MASS_REF);

  blueEjecta.points.visible = visible;
  redEjecta.points.visible = visible;
  blueEjecta.points.scale.setScalar(radius);
  redEjecta.points.scale.setScalar(radius);
  blueEjecta.points.material.opacity = Math.min(1, brightness * componentShape(state.days, BLUE_PEAK_DAYS));
  redEjecta.points.material.opacity = Math.min(1, brightness * componentShape(state.days, RED_PEAK_DAYS));
  shiftBlueEjectaColor(blueEjecta, state.days);
};

/** Advances the run by one real frame of length dt (already clamped). */
export const stepFrame = (
  refs: SceneRef,
  params: SceneParams,
  state: StateRef,
  dt: number,
  setDays: (days: number) => void,
) => {
  if (state.phase === 'inspiral') {
    stepInspiral(refs, params, state, dt);
  } else {
    state.elapsed += dt;
    state.mergeT += dt;
    if (state.phase === 'merger') {
      stepMerger(refs, params, state, dt, setDays);
    }
  }
  updateFlash(refs, state);
  updateRemnant(refs, state);
  updateJet(refs, params, state);
  if (state.phase === 'kilonova' && params.autoPlay) {
    state.days = Math.min(KILONOVA_DAYS, state.days + DAYS_PER_SECOND * dt);
  }
  updateEjecta(refs, params, state);
  updateWaveRings(refs.core.scene, state.rings, dt);
};
