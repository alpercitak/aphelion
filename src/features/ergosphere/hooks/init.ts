import { useEffect } from 'react';
import type { CanvasRefType, SceneRefType } from '@/types';
import { setupScene } from '@/utils/setup';
import type { SceneRef } from '../types';
import { createParticleSystem } from '../utils/particles';
import { createSurfaces } from '../utils/surfaces';

export const useInit = (canvasRef: CanvasRefType, sceneRef: SceneRefType<SceneRef>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const { renderer, scene, camera, orbit, stars, dispose } = setupScene({
      canvas,
      cameraPosition: [0, 4, 12],
      orbitOptions: { theta: 0.1, phi: Math.PI / 2 - 0.6, radius: 13, minRadius: 6, maxRadius: 60 },
    });

    const { horizon, ergosphere, unit } = createSurfaces();
    const particles = createParticleSystem();
    scene.add(horizon, ergosphere, particles.points);

    sceneRef.current = {
      core: { scene, renderer, camera, orbit, stars },
      entities: { horizon, ergosphere, unit, particles },
    };

    return () => dispose();
  }, [canvasRef, sceneRef]);
};
