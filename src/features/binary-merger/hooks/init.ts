import { useEffect } from 'react';
import type { CanvasRefType, SceneRefType } from '@/types';
import { setupScene } from '@/utils/setup';
import { INITIAL_SEPARATION, PARAMS } from '../constants';
import type { SceneRef } from '../types';
import { createBlackHoleUnit, createMergedBlackHole } from '../utils/black-hole';
import { createMergerFlash } from '../utils/merger-flash';
import { orbitalPositions } from '../utils/orbital-positions';
import { createSpacetimeGrid } from '../utils/spacetime-grid';

export const useInit = (canvasRef: CanvasRefType, sceneRef: SceneRefType<SceneRef>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const { renderer, scene, camera, orbit, stars, dispose } = setupScene({
      canvas,
      cameraPosition: [0, 10, 14],
      orbitOptions: { theta: 0.1, phi: Math.PI / 3.5, radius: 16 },
    });

    const grid = createSpacetimeGrid();
    const bh1 = createBlackHoleUnit(PARAMS.mass1, camera.position);
    const bh2 = createBlackHoleUnit(PARAMS.mass2, camera.position);
    const mergedBH = createMergedBlackHole(PARAMS.mass1, PARAMS.mass2, camera.position);
    mergedBH.visible = false;

    const flash = createMergerFlash();
    camera.add(flash);
    flash.position.z = -1;

    scene.add(grid, bh1, bh2, mergedBH, camera);

    const initPos = orbitalPositions(0, INITIAL_SEPARATION);
    bh1.position.set(initPos.x1, 0, initPos.z1);
    bh2.position.set(initPos.x2, 0, initPos.z2);

    sceneRef.current = {
      core: { scene, renderer, camera, orbit, stars },
      entities: { grid, bh1, bh2, mergedBH, flash, waveRingMeshes: [] },
    };

    return () => dispose();
  }, [canvasRef, sceneRef]);
};
