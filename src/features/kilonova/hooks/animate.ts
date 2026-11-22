import type { RefObject } from 'react';
import { useSceneAnimation } from '@/hooks/scene-animation';
import type { SceneRefType } from '@/types';
import { LIVE_REFRESH_FRAMES } from '../constants';
import type { LiveState, SceneParams, SceneRef, StateRef } from '../types';
import { toLiveState } from '../utils/simulation';

export const useAnimate = (
  sceneRef: SceneRefType<SceneRef>,
  paramsRef: RefObject<SceneParams>,
  stateRef: RefObject<StateRef>,
  setLive: (live: LiveState) => void,
  setDays: (days: number) => void,
) => {
  useSceneAnimation((time) => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const state = stateRef.current;
    const params = paramsRef.current;
    refs.core.orbit.updateCamera(refs.core.camera);
    refs.core.stars.rotation.y = time * 0.002;

    state.frame++;
    if (state.frame % LIVE_REFRESH_FRAMES === 0) {
      if (state.phase === 'kilonova' && params.autoPlay) {
        setDays(state.days);
      }
      setLive(toLiveState(state));
    }
    refs.core.renderer.render(refs.core.scene, refs.core.camera);
  });
};
