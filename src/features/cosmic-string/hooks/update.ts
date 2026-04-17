import { useEffect } from 'react';
import type { SceneRefType } from '@/types';
import type { SceneParams, SceneRef } from '../types';

export const useUpdate = (sceneRef: SceneRefType<SceneRef>, params: SceneParams) => {
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    refs.entities.stringGlow.visible = params.showGlow;
    if (refs.entities.coneMesh) {
      refs.entities.coneMesh.visible = params.showCone;
    }
  }, [params.showGlow, params.showCone]);
};
