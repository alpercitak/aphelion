import type { RefObject } from 'react';
import { Vector3 } from 'three';
import { useSceneAnimation } from '@/hooks/scene-animation';
import type { SceneRefType } from '@/types';
import { INITIAL_SEPARATION, INSPIRAL_RATE_MAP, MERGE_THRESHOLD } from '../constants';
import type { ResetScene, SceneParams, SceneRef, SetPhase, StateRef, WaveRing } from '../types';
import { orbitalOmega } from '../utils/orbital-omega';
import { orbitalPositions } from '../utils/orbital-positions';
import { createWaveRing } from '../utils/wave-ring';

/**
 * Shared logic for wave ring propagation and lifecycle
 */
const updateWaveRings = (refs: SceneRef, state: StateRef) => {
  const { core, entities } = refs;
  const expired: Array<WaveRing> = [];

  state.waveRings.forEach((ringData) => {
    const { mesh } = ringData;
    if (!mesh.parent) {
      return;
    }

    mesh.scale.addScalar(0.06);
    const baseOpacity = mesh.userData.baseOpacity ?? 0.5;
    mesh.material.opacity = Math.max(0, baseOpacity - mesh.scale.x * 0.07);

    if (mesh.material.opacity <= 0) {
      expired.push(ringData);
    }
  });

  // Cleanup
  expired.forEach(({ mesh }) => {
    core.scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();

    const meshIdx = entities.waveRingMeshes.indexOf(mesh);
    if (meshIdx > -1) entities.waveRingMeshes.splice(meshIdx, 1);
  });
  state.waveRings = state.waveRings.filter((ring) => !expired.includes(ring));
};

const handleOrbit = (refs: SceneRef, params: SceneParams, time: number, state: StateRef, setPhase: SetPhase) => {
  const { entities, core } = refs;
  const { bh1, bh2, grid, gridUniforms } = entities;

  const rate = INSPIRAL_RATE_MAP[params.inspiralRate];
  state.separation = Math.max(MERGE_THRESHOLD, state.separation - rate * 0.016);

  const omega = orbitalOmega(state.separation, params.mass1 + params.mass2);
  state.angle += omega * 0.016;

  const pos = orbitalPositions(state.angle, state.separation);
  bh1.position.set(pos.x1, 0, pos.z1);
  bh2.position.set(pos.x2, 0, pos.z2);

  // Visuals
  bh1.userData.diskGroup.rotation.y = time * 0.35;
  bh2.userData.diskGroup.rotation.y = -time * 0.28;

  gridUniforms.source1.value.set(pos.x1, pos.z1);
  gridUniforms.source2.value.set(pos.x2, pos.z2);
  gridUniforms.separation.value = state.separation;
  gridUniforms.amplitude.value = params.waveAmplitude;
  gridUniforms.time.value = time * 1.8;
  grid.visible = params.showGrid;

  // View Vectors
  [bh1, bh2].forEach((bh) => {
    bh.userData.glowMat.uniforms.viewVector?.value.copy(core.camera.position).sub(bh.position);
    bh.userData.haloMat.uniforms.viewVector?.value.copy(core.camera.position).sub(bh.position);
    bh.userData.diskGroup.visible = params.showDisks;
  });

  // Spawn Rings
  const ringInterval = Math.max(0.18, 0.4 - (INITIAL_SEPARATION - state.separation) * 0.02);
  if (params.showWaveRings && time - state.lastRingTime > ringInterval) {
    const ring = createWaveRing(state.separation * 0.3);
    ring.position.set(0, 0.02, 0);
    core.scene.add(ring);
    entities.waveRingMeshes.push(ring);
    state.waveRings.push({ mesh: ring, born: time });
    state.lastRingTime = time;
  }

  if (state.separation <= MERGE_THRESHOLD) {
    state.phase = 'merging';
    state.mergeProgress = 0;
    setPhase('merging');
  }
};

const handleMerging = (refs: SceneRef, params: SceneParams, time: number, state: StateRef, setPhase: SetPhase) => {
  const { entities, core } = refs;
  const { bh1, bh2, gridUniforms, flash, mergedBH } = entities;

  state.mergeProgress = Math.min(1, state.mergeProgress + 0.025);
  const mp = state.mergeProgress;

  bh1.position.lerp(new Vector3(0, 0, 0), 0.06);
  bh2.position.lerp(new Vector3(0, 0, 0), 0.06);
  bh1.scale.setScalar(1 - mp * 0.4);
  bh2.scale.setScalar(1 - mp * 0.4);

  flash.material.opacity = Math.sin(mp * Math.PI) * 0.7;

  gridUniforms.time.value = time * 1.8;
  gridUniforms.source1.value.set(bh1.position.x, bh1.position.z);
  gridUniforms.source2.value.set(bh2.position.x, bh2.position.z);
  gridUniforms.separation.value = bh1.position.distanceTo(bh2.position);
  gridUniforms.amplitude.value = params.waveAmplitude * (1 + mp * 2);

  if (mp > 0.5 && time - state.lastRingTime > 0.05) {
    const ring = createWaveRing(mp * 2);
    ring.position.set(0, 0.02, 0);
    core.scene.add(ring);
    entities.waveRingMeshes.push(ring);
    state.waveRings.push({ mesh: ring, born: time });
    state.lastRingTime = time;
  }

  if (mp >= 1) {
    state.phase = 'merged';
    bh1.visible = false;
    bh2.visible = false;
    mergedBH.visible = true;
    setPhase('merged');
  }
};

const handleMerged = (refs: SceneRef, params: SceneParams, time: number, resetScene: ResetScene) => {
  const { entities, core } = refs;
  const { gridUniforms, flash, mergedBH } = entities;

  flash.material.opacity = Math.max(0, flash.material.opacity - 0.02);
  mergedBH.userData.diskGroup.rotation.y = time * 0.2;
  mergedBH.userData.glowMat.uniforms.viewVector?.value.copy(core.camera.position);
  mergedBH.userData.haloMat.uniforms.viewVector?.value.copy(core.camera.position);

  gridUniforms.amplitude.value = Math.max(0, gridUniforms.amplitude.value - 0.005);
  gridUniforms.time.value = time * 1.8;
  gridUniforms.source1.value.set(0, 0);
  gridUniforms.source2.value.set(0, 0);

  if (params.autoLoop && gridUniforms.amplitude.value <= 0.02) {
    resetScene();
  }
};

const animate = (
  refs: SceneRef,
  params: SceneParams,
  time: number,
  state: StateRef,
  setPhase: SetPhase,
  resetScene: ResetScene,
) => {
  const { core } = refs;
  core.orbit.updateCamera(core.camera);
  core.stars.rotation.y = time * 0.002;

  switch (state.phase) {
    case 'orbit':
      handleOrbit(refs, params, time, state, setPhase);
      break;
    case 'merging':
      handleMerging(refs, params, time, state, setPhase);
      break;
    case 'merged':
      handleMerged(refs, params, time, resetScene);
      break;
  }

  updateWaveRings(refs, state);
};

export const useAnimate = (
  sceneRef: SceneRefType<SceneRef>,
  paramsRef: RefObject<SceneParams>,
  stateRef: RefObject<StateRef>,
  setPhase: SetPhase,
  resetScene: ResetScene,
) => {
  useSceneAnimation((time) => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    animate(refs, paramsRef.current, time, stateRef.current, setPhase, resetScene);
    refs.core.renderer.render(refs.core.scene, refs.core.camera);
  });
};
