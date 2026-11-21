import { useEffect } from 'react';
import type { SceneRefType } from '@/types';
import type { SceneParams, SceneRef } from '../types';
import { horizonVisualRadius } from '../utils/physics';

export const useUpdate = (sceneRef: SceneRefType<SceneRef>, params: SceneParams) => {
  const { logMass, starMass, showTidal, showStars } = params;

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { horizon, glow } = refs.entities;
    const r = horizonVisualRadius({ logMass, starMass });
    horizon.scale.setScalar(r);
    glow.scale.setScalar(r);
  }, [logMass, starMass, sceneRef]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    refs.entities.tidalSphere.visible = showTidal;
    refs.core.stars.visible = showStars;
  }, [showTidal, showStars, sceneRef]);
};
