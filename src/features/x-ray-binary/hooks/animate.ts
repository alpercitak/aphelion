import type { RefObject } from 'react';
import { useSceneAnimation } from '@/hooks/scene-animation';
import type { SceneRefType } from '@/types';
import { MAX_FRAME_DT } from '../constants';
import type { SceneParams, SceneRef, StateRef } from '../types';
import { stepGas } from '../utils/gas';

export const useAnimate = (
  sceneRef: SceneRefType<SceneRef>,
  paramsRef: RefObject<SceneParams>,
  stateRef: RefObject<StateRef>,
) => {
  useSceneAnimation((_time, delta) => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const state = stateRef.current;
    refs.core.orbit.updateCamera(refs.core.camera);
    const dt = Math.min(delta, MAX_FRAME_DT);
    refs.entities.system.rotation.y += state.binary.omega * dt;
    stepGas(refs.entities.gas, state, paramsRef.current.mdotLog, dt);
    refs.core.renderer.render(refs.core.scene, refs.core.camera);
  });
};
