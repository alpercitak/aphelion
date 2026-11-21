import type { RefObject } from 'react';
import { useSceneAnimation } from '@/hooks/scene-animation';
import type { SceneRefType } from '@/types';
import { LIVE_REFRESH_FRAMES } from '../constants';
import type { LiveState, SceneParams, SceneRef, StateRef } from '../types';
import { stepFrame } from '../utils/simulation';

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
    const { core, entities } = refs;
    core.orbit.updateCamera(core.camera);
    stepFrame(entities.particles, state, paramsRef.current, delta);
    if (state.frame % LIVE_REFRESH_FRAMES === 0) {
      setLive({ events: state.events, extracted: state.extracted });
    }
    core.renderer.render(core.scene, core.camera);
  });
};
