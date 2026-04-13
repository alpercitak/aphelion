import { useSceneAnimation } from '@/hooks/scene-animation';
import type { RefObject } from 'react';
import { Vector3 } from 'three';
import { INITIAL_SEPARATION, INSPIRAL_RATE_MAP, MERGE_THRESHOLD } from '../constants';
import type { Params, Phase, SceneRef, StateRef } from '../types';
import { orbitalOmega } from '../utils/orbital-omega';
import { orbitalPositions } from '../utils/orbital-positions';
import { createWaveRing } from '../utils/wave-ring';

/**
 * Shared logic for wave ring propagation and lifecycle
 */
const updateWaveRings = (refs: SceneRef, state: StateRef, time: number) => {
  const { core, entities } = refs;
  const toRemoveIdx: Array<number> = [];

  state.waveRings.forEach((ringData, i) => {
    const { mesh } = ringData;
    if (!mesh.parent) {
      return;
    }

    mesh.scale.addScalar(0.06);
    const baseOpacity = mesh.userData.baseOpacity ?? 0.5;
    mesh.material.opacity = Math.max(0, baseOpacity - mesh.scale.x * 0.07);

    if (mesh.material.opacity <= 0) {
      toRemoveIdx.push(i);
    }
  });

  // Cleanup
  toRemoveIdx.reverse().forEach((i) => {
    const { mesh } = state.waveRings[i]!;
    core.scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();

    state.waveRings.splice(i, 1);
    const meshIdx = entities.waveRingMeshes.indexOf(mesh);
    if (meshIdx > -1) entities.waveRingMeshes.splice(meshIdx, 1);
  });
};

const handleOrbit = (refs: SceneRef, state: StateRef, params: Params, time: number, setPhase: (p: Phase) => void) => {
  const { entities, core } = refs;
  const { bh1, bh2, grid } = entities;

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

  grid.material.uniforms['source1']!.value.set(pos.x1, pos.z1);
  grid.material.uniforms['source2']!.value.set(pos.x2, pos.z2);
  grid.material.uniforms['separation']!.value = state.separation;
  grid.material.uniforms['amplitude']!.value = params.waveAmplitude;
  grid.material.uniforms['time']!.value = time * 1.8;
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

const handleMerging = (refs: SceneRef, state: StateRef, params: Params, time: number, setPhase: (p: Phase) => void) => {
  const { entities, core } = refs;
  const { bh1, bh2, grid, flash, mergedBH } = entities;

  state.mergeProgress = Math.min(1, state.mergeProgress + 0.025);
  const mp = state.mergeProgress;

  bh1.position.lerp(new Vector3(0, 0, 0), 0.06);
  bh2.position.lerp(new Vector3(0, 0, 0), 0.06);
  bh1.scale.setScalar(1 - mp * 0.4);
  bh2.scale.setScalar(1 - mp * 0.4);

  flash.material.opacity = Math.sin(mp * Math.PI) * 0.7;

  grid.material.uniforms['time']!.value = time * 1.8;
  grid.material.uniforms['source1']!.value.set(bh1.position.x, bh1.position.z);
  grid.material.uniforms['source2']!.value.set(bh2.position.x, bh2.position.z);
  grid.material.uniforms['separation']!.value = bh1.position.distanceTo(bh2.position);
  grid.material.uniforms['amplitude']!.value = params.waveAmplitude * (1 + mp * 2);

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

const handleMerged = (refs: SceneRef, state: StateRef, params: Params, time: number, resetScene: () => void) => {
  const { entities, core } = refs;
  const { grid, flash, mergedBH } = entities;

  flash.material.opacity = Math.max(0, flash.material.opacity - 0.02);
  mergedBH.userData.diskGroup.rotation.y = time * 0.2;
  mergedBH.userData.glowMat.uniforms.viewVector?.value.copy(core.camera.position);
  mergedBH.userData.haloMat.uniforms.viewVector?.value.copy(core.camera.position);

  grid.material.uniforms['amplitude']!.value = Math.max(0, grid.material.uniforms['amplitude']!.value - 0.005);
  grid.material.uniforms['time']!.value = time * 1.8;
  grid.material.uniforms['source1']!.value.set(0, 0);
  grid.material.uniforms['source2']!.value.set(0, 0);

  if (params.autoLoop && grid.material.uniforms['amplitude']!.value <= 0.02) {
    resetScene();
  }
};

export const useAnimate = (
  sceneRef: RefObject<SceneRef | null>,
  paramsRef: RefObject<Params>,
  stateRef: RefObject<StateRef>,
  setPhase: (p: Phase) => void,
  resetScene: () => void,
) => {
  useSceneAnimation((time) => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }

    const { core } = refs;
    const params = paramsRef.current;
    const state = stateRef.current;

    core.orbit.updateCamera(core.camera);
    core.stars.rotation.y = time * 0.002;

    switch (state.phase) {
      case 'orbit':
        handleOrbit(refs, state, params, time, setPhase);
        break;
      case 'merging':
        handleMerging(refs, state, params, time, setPhase);
        break;
      case 'merged':
        handleMerged(refs, state, params, time, resetScene);
        break;
    }

    updateWaveRings(refs, state, time);

    core.renderer.render(core.scene, core.camera);
  });
};
