import { useEffect } from 'react';
import type { SceneRefType } from '@/types';
import type { SceneParams, SceneRef } from '../types';
import { shapeSurfaces } from '../utils/surfaces';

export const useUpdate = (
  sceneRef: SceneRefType<SceneRef>,
  params: SceneParams,
  run: number,
  resetScene: () => void,
) => {
  const { spin, showErgosphere, showStars } = params;

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    shapeSurfaces(refs.entities, spin);
  }, [spin, sceneRef]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `run` is the replay trigger
  useEffect(() => {
    resetScene();
  }, [run, resetScene]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    refs.entities.ergosphere.visible = showErgosphere;
    refs.core.stars.visible = showStars;
  }, [showErgosphere, showStars, sceneRef]);
};
