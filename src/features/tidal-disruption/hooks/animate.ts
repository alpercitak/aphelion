import { useSceneAnimation } from '@/hooks/scene-animation';
import type { SceneRefType } from '@/types';
import type { SceneRef } from '../types';

const animate = (refs: SceneRef) => {
  const { core, entities } = refs;
  core.orbit.updateCamera(core.camera);
  entities.glow.material.uniforms.viewVector?.value.copy(core.camera.position);
};

export const useAnimate = (sceneRef: SceneRefType<SceneRef>) => {
  useSceneAnimation(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    animate(refs);
    refs.core.renderer.render(refs.core.scene, refs.core.camera);
  });
};
