import type { RefObject } from 'react';
import { useSceneAnimation } from '@/hooks/scene-animation';
import type { SceneRefType } from '@/types';
import { GLOW_BASE, GLOW_FLARE, LIVE_REFRESH_FRAMES } from '../constants';
import type { LiveState, SceneParams, SceneRef, StateRef } from '../types';
import { eddingtonLimited, fallbackShape, peakFallbackRatio } from '../utils/physics';
import { stepFrame, toLiveState } from '../utils/simulation';

const animate = (refs: SceneRef, state: StateRef, delta: number, params: SceneParams) => {
  const { core, entities } = refs;
  core.orbit.updateCamera(core.camera);
  entities.glow.material.uniforms.viewVector?.value.copy(core.camera.position);
  const { brightness } = entities.glow.material.uniforms;
  if (brightness) {
    // Glow follows the Eddington-limited luminosity, relative to its full-disruption peak
    const peak = peakFallbackRatio(params);
    const shape = state.released
      ? state.releasedFraction * fallbackShape((state.elapsed - state.releaseTime) / state.tMin)
      : 0;
    brightness.value = GLOW_BASE + (GLOW_FLARE * eddingtonLimited(peak * shape)) / eddingtonLimited(peak);
  }
  stepFrame(entities.debris, state, delta, params.playbackSpeed);
};

export const useAnimate = (
  sceneRef: SceneRefType<SceneRef>,
  stateRef: RefObject<StateRef>,
  paramsRef: RefObject<SceneParams>,
  setLive: (live: LiveState) => void,
) => {
  useSceneAnimation((_time, delta) => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const state = stateRef.current;
    animate(refs, state, delta, paramsRef.current);
    if (state.frame % LIVE_REFRESH_FRAMES === 0) {
      setLive(toLiveState(state));
    }
    refs.core.renderer.render(refs.core.scene, refs.core.camera);
  });
};
