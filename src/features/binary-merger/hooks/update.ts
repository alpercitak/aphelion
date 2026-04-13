import { useEffect, type RefObject } from 'react';
import { applyBlackHoleScale } from '../utils/black-hole';
import type { Params, Phase, SceneRef } from '../types';

export const useUpdate = (sceneRef: RefObject<SceneRef | null>, params: Params, phase: Phase) => {
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }

    const { entities } = refs;

    if (phase === 'orbit') {
      applyBlackHoleScale(entities.bh1, params.mass1);
      applyBlackHoleScale(entities.bh2, params.mass2);
    }

    entities.grid.visible = params.showGrid;

    // Toggle accretion disks based on params
    if (entities.bh1.userData.diskGroup) {
      entities.bh1.userData.diskGroup.visible = params.showDisks;
    }
    if (entities.bh2.userData.diskGroup) {
      entities.bh2.userData.diskGroup.visible = params.showDisks;
    }
    if (entities.mergedBH.userData.diskGroup) {
      entities.mergedBH.userData.diskGroup.visible = params.showDisks;
    }
  }, [params.mass1, params.mass2, params.showGrid, params.showDisks, phase, sceneRef]);
};
