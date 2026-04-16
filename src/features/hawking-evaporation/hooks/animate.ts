import { useRef, type RefObject } from 'react';
import { BufferAttribute, PointsMaterial } from 'three';
import { useSceneAnimation } from '@/hooks/scene-animation';
import { hawkingGlowColor, hawkingTemperatureKelvin } from '@/utils/physics';
import { DECAY_RATE_MAP, PAIR_POOL, VISUAL_SCALE } from '../constants';
import type { Params, Phase, SceneRef, StateRef, VirtualPair } from '../types';
import { spawnPair } from '../utils/virtual-pair';

const animate = (
  refs: SceneRef,
  params: Params,
  state: StateRef,
  setLiveMass: (m: number) => void,
  setPhase: (p: Phase) => void,
  resetScene: () => void,
  time: number,
  delta: number,
  frameCounter: { count: number },
) => {
  const { core, entities } = refs;
  const { camera, orbit, stars } = core;
  const { horizon, photonGlow, outerGlow, halo, photonUniforms, outerUniforms, haloUniforms, pairGeo, pairPoints } =
    entities;

  // Basic Scene Updates
  orbit.updateCamera(camera);
  stars!.rotation.y = time * 0.002;

  if (state.phase === 'evaporating') {
    // 1. Mass Decay Logic (Accelerates as mass approaches zero)
    const decayBase = DECAY_RATE_MAP[params.timeCompression as keyof typeof DECAY_RATE_MAP] || 0.001;
    const massNorm = state.mass / params.initialMass;
    const accel = 1 + (1 - massNorm) * 8;
    state.mass = Math.max(0, state.mass - decayBase * accel * delta);

    // 2. Physics-to-Visual Mapping
    const tempK = hawkingTemperatureKelvin(state.mass);
    const glowColor = hawkingGlowColor(tempK);
    const s = massNorm * VISUAL_SCALE;

    // Scale Meshes
    horizon.scale.setScalar(Math.max(0.01, s));
    photonGlow.scale.setScalar(Math.max(0.015, s));
    outerGlow.scale.setScalar(Math.max(0.02, s));
    halo.scale.setScalar(1 + (1 - massNorm) * 0.5);

    // Update Shader Uniforms
    photonUniforms.glowColor.value.copy(glowColor);
    outerUniforms.glowColor.value.copy(glowColor);
    haloUniforms.innerColor.value.copy(glowColor);
    haloUniforms.opacity.value = params.radiationIntensity * 0.07 * (1 + (1 - massNorm) * 3);

    photonUniforms.viewVector.value.copy(camera.position);
    outerUniforms.viewVector.value.copy(camera.position);

    // 3. Virtual Particle Pairs
    const pairInterval = Math.max(0.02, 0.3 * massNorm);
    if (params.showPairs && time - state.lastPairTime > pairInterval && state.pairs.length < PAIR_POOL) {
      state.pairs.push(spawnPair(s, tempK));
      state.lastPairTime = time;
    }

    // Update Particle Buffers
    const posAttr = pairGeo.attributes.position as BufferAttribute;
    const colAttr = pairGeo.attributes.color as BufferAttribute;
    const toRemove: VirtualPair[] = [];

    state.pairs.forEach((pair, i) => {
      pair.life -= 0.018;
      pair.inPos.lerp(pair.inTarget, 0.08); // Falling in
      pair.outPos.addScaledVector(pair.outVel, 1); // Escaping

      const fade = Math.max(0, pair.life);
      const idx = i * 2;

      posAttr.setXYZ(idx, pair.inPos.x, pair.inPos.y, pair.inPos.z);
      posAttr.setXYZ(idx + 1, pair.outPos.x, pair.outPos.y, pair.outPos.z);

      colAttr.setXYZ(idx, pair.color.r * fade * 0.5, pair.color.g * fade * 0.5, pair.color.b * fade * 0.5);
      colAttr.setXYZ(idx + 1, pair.color.r * fade, pair.color.g * fade, pair.color.b * fade);

      if (pair.life <= 0 || pair.outPos.length() > 6) toRemove.push(pair);
    });

    state.pairs = state.pairs.filter((p) => !toRemove.includes(p));
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    // Visibility toggles
    (pairPoints.material as PointsMaterial).opacity = params.pairOpacity;
    pairPoints.visible = params.showPairs;
    halo.visible = params.showHalo;

    // 4. Throttled UI Sync (Keep HUD updated at ~6fps to save CPU)
    frameCounter.count++;
    if (frameCounter.count >= 10) {
      setLiveMass(state.mass);
      frameCounter.count = 0;
    }

    // 5. Final Evaporation Trigger
    if (state.mass <= 0.0001) {
      state.phase = 'flashing';
      state.flashOpacity = 1.0;
      setPhase('flashing');
      [horizon, photonGlow, outerGlow].forEach((m) => (m.visible = false));
    }
  }

  if (state.phase === 'flashing') {
    state.flashOpacity = Math.max(0, state.flashOpacity - 0.015);
    halo.scale.setScalar(halo.scale.x + 0.05);

    if (state.flashOpacity <= 0) {
      state.phase = 'done';
      setPhase('done');
    }
  }

  if (state.phase === 'done' && params.autoLoop) {
    if (time - state.lastPairTime > 3.0) {
      resetScene();
    }
  }
};

export const useAnimate = (
  sceneRef: RefObject<SceneRef | null>,
  paramsRef: RefObject<Params>,
  stateRef: RefObject<StateRef>,
  setPhase: (p: Phase) => void,
  setLiveMass: (m: number) => void,
  resetScene: () => void,
) => {
  // persistence for throttled UI updates without triggering re-renders
  const frameCounter = useRef({ count: 0 });

  useSceneAnimation((time, delta) => {
    const refs = sceneRef.current;
    const state = stateRef.current;
    const params = paramsRef.current;

    if (!refs || !state) {
      return;
    }

    animate(refs, params, state, setLiveMass, setPhase, resetScene, time, delta, frameCounter.current);
    refs.core.renderer.render(refs.core.scene, refs.core.camera);
  });
};
