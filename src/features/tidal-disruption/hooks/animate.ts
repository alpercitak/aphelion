import type { RefObject } from 'react';
import { useSceneAnimation } from '@/hooks/scene-animation';
import type { SceneRefType } from '@/types';
import type { SceneRef, StateRef } from '../types';
import { stepFrame } from '../utils/simulation';

const animate = (refs: SceneRef, state: StateRef, delta: number) => {
  const { core, entities } = refs;
  core.orbit.updateCamera(core.camera);
  entities.glow.material.uniforms.viewVector?.value.copy(core.camera.position);
  stepFrame(entities.debris, state, delta);
};

export const useAnimate = (sceneRef: SceneRefType<SceneRef>, stateRef: RefObject<StateRef>) => {
  useSceneAnimation((_time, delta) => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    animate(refs, stateRef.current, delta);
    refs.core.renderer.render(refs.core.scene, refs.core.camera);
  });
};
