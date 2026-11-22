import type { RefObject } from 'react';
import { useSceneAnimation } from '@/hooks/scene-animation';
import type { SceneRefType } from '@/types';
import { MAX_FRAME_DT } from '../constants';
import type { SceneRef, StateRef } from '../types';

export const useAnimate = (sceneRef: SceneRefType<SceneRef>, stateRef: RefObject<StateRef | null>) => {
  useSceneAnimation((_time, delta) => {
    const refs = sceneRef.current;
    const state = stateRef.current;
    if (!refs || !state) {
      return;
    }
    refs.core.orbit.updateCamera(refs.core.camera);
    refs.entities.system.rotation.y += state.binary.omega * Math.min(delta, MAX_FRAME_DT);
    refs.core.renderer.render(refs.core.scene, refs.core.camera);
  });
};
