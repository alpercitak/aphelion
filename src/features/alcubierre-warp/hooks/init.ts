import { useEffect } from 'react';
import { AdditiveBlending, Mesh, MeshBasicMaterial, SphereGeometry } from 'three';
import type { CanvasRefType, SceneRefType } from '@/types';
import { setupScene } from '@/utils/setup';
import { CAMERA_RADIUS, SCENE_PARAMS, WALL_COLOR, WALL_OPACITY } from '../constants';
import type { SceneRef } from '../types';
import { createExoticMatter } from '../utils/exotic-matter';
import { createShip } from '../utils/ship';
import { createYorkGrid } from '../utils/york-grid';

export const useInit = (canvasRef: CanvasRefType, sceneRef: SceneRefType<SceneRef>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const { renderer, scene, camera, orbit, stars, dispose } = setupScene({
      canvas,
      cameraPosition: [6, 5, 12],
      orbitOptions: { radius: CAMERA_RADIUS, minRadius: 4, maxRadius: 50 },
    });

    const ship = createShip();
    const yorkGrid = createYorkGrid();
    const exoticMatter = createExoticMatter(SCENE_PARAMS);
    const bubbleWall = new Mesh(
      new SphereGeometry(1, 48, 32),
      new MeshBasicMaterial({
        color: WALL_COLOR,
        wireframe: true,
        transparent: true,
        opacity: WALL_OPACITY,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(ship, yorkGrid.line, exoticMatter, bubbleWall);

    sceneRef.current = {
      core: { scene, renderer, camera, orbit, stars },
      entities: { ship, yorkGrid, exoticMatter, bubbleWall },
    };

    return () => dispose();
  }, [canvasRef, sceneRef]);
};
