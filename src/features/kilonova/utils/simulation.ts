import { MERGE_SEPARATION, RING_INTERVAL } from '../constants';
import type { LiveState, SceneParams, SceneRef, StateRef } from '../types';
import { createWaveRing, updateWaveRings } from './gw-rings';
import { orbitalOmega, orbitalPositions, separationAt, totalMass } from './physics';

export const toLiveState = (state: StateRef): LiveState => ({
  phase: state.phase,
  elapsed: state.elapsed,
  separation: state.separation,
  days: state.days,
  luminosity: 0,
  dominant: 'BLUE',
});

const placeBodies = (refs: SceneRef, state: StateRef) => {
  const { bodyA, bodyB } = refs.entities;
  const pos = orbitalPositions(state.angle, state.separation);
  bodyA.mesh.position.set(pos.x1, 0, pos.z1);
  bodyB.mesh.position.set(pos.x2, 0, pos.z2);
  bodyA.mesh.visible = true;
  bodyB.mesh.visible = true;
};

const stepInspiral = (refs: SceneRef, params: SceneParams, state: StateRef, dt: number) => {
  state.elapsed += dt;
  const separation = separationAt(state.elapsed);
  if (separation <= MERGE_SEPARATION) {
    // Bodies keep their last separation; the merger phase closes the gap from there
    state.phase = 'merger';
    state.mergeT = 0;
    state.mergeStartSeparation = state.separation;
    return;
  }

  state.separation = separation;
  state.angle += orbitalOmega(separation, totalMass(params)) * dt;
  placeBodies(refs, state);

  if (params.gwRings && state.elapsed - state.lastRingTime >= RING_INTERVAL) {
    state.lastRingTime = state.elapsed;
    state.rings.push(createWaveRing(refs.core.scene, separation / 2));
  }
};

/** Advances the run by one real frame of length dt (already clamped). */
export const stepFrame = (refs: SceneRef, params: SceneParams, state: StateRef, dt: number) => {
  if (state.phase === 'inspiral') {
    stepInspiral(refs, params, state, dt);
  }
  updateWaveRings(refs.core.scene, state.rings, dt);
};
