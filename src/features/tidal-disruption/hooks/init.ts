import { useEffect } from 'react';
import { Mesh, MeshBasicMaterial, SphereGeometry } from 'three';
import type { CanvasRefType, SceneRefType } from '@/types';
import { setupScene } from '@/utils/setup';
import { R_TIDAL_VISUAL } from '../constants';
import type { SceneRef } from '../types';
import { createEventHorizon } from '../utils/event-horizon';
import { createOuterGlow } from '../utils/glow';

export const useInit = (canvasRef: CanvasRefType, sceneRef: SceneRefType<SceneRef>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const { renderer, scene, camera, orbit, stars, dispose } = setupScene({
      canvas,
      cameraPosition: [0, 18, 32],
      orbitOptions: { theta: 0.1, phi: Math.PI / 3, radius: 38, minRadius: 6, maxRadius: 80 },
    });

    const horizon = createEventHorizon();
    const glow = createOuterGlow(camera.position);
    const tidalSphere = new Mesh(
      new SphereGeometry(R_TIDAL_VISUAL, 48, 32),
      new MeshBasicMaterial({
        color: 0x66ccff,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
      }),
    );
    scene.add(horizon, glow, tidalSphere);

    sceneRef.current = {
      core: { scene, renderer, camera, orbit, stars },
      entities: { horizon, glow, tidalSphere },
    };

    return () => dispose();
  }, [canvasRef, sceneRef]);
};
