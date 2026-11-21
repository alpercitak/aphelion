import { useEffect } from 'react';
import type { SceneRefType } from '@/types';
import type { RunParams, SceneParams, SceneRef } from '../types';

export const useUpdate = (
  sceneRef: SceneRefType<SceneRef>,
  params: SceneParams,
  run: number,
  resetScene: (run: RunParams) => void,
) => {
  const { logMass, starMass, beta, showTidal, showOrbit, showStars } = params;

  // biome-ignore lint/correctness/useExhaustiveDependencies: `run` is the replay trigger
  useEffect(() => {
    resetScene({ logMass, starMass, beta });
  }, [logMass, starMass, beta, run, resetScene]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    refs.entities.tidalSphere.visible = showTidal;
    refs.entities.orbit.line.visible = showOrbit;
    refs.core.stars.visible = showStars;
  }, [showTidal, showOrbit, showStars, sceneRef]);
};
