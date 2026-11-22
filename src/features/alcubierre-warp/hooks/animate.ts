import { useSceneAnimation } from '@/hooks/scene-animation';
import type { SceneRefType } from '@/types';
import type { SceneRef } from '../types';

export const useAnimate = (sceneRef: SceneRefType<SceneRef>) => {
  useSceneAnimation(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    refs.core.orbit.updateCamera(refs.core.camera);
    refs.core.renderer.render(refs.core.scene, refs.core.camera);
  });
};
