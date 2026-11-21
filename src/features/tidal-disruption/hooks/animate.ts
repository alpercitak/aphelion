import type { RefObject } from 'react';
import { useSceneAnimation } from '@/hooks/scene-animation';
import type { SceneRefType } from '@/types';
import { LIVE_REFRESH_FRAMES } from '../constants';
import type { LiveState, SceneRef, StateRef } from '../types';
import { stepFrame, toLiveState } from '../utils/simulation';

const animate = (refs: SceneRef, state: StateRef, delta: number) => {
  const { core, entities } = refs;
  core.orbit.updateCamera(core.camera);
  entities.glow.material.uniforms.viewVector?.value.copy(core.camera.position);
  stepFrame(entities.debris, state, delta);
};

export const useAnimate = (
  sceneRef: SceneRefType<SceneRef>,
  stateRef: RefObject<StateRef>,
  setLive: (live: LiveState) => void,
) => {
  useSceneAnimation((_time, delta) => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const state = stateRef.current;
    animate(refs, state, delta);
    if (state.frame % LIVE_REFRESH_FRAMES === 0) {
      setLive(toLiveState(state));
    }
    refs.core.renderer.render(refs.core.scene, refs.core.camera);
  });
};
