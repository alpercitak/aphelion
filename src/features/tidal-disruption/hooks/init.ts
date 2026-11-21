import { useEffect } from 'react';
import { Mesh, MeshBasicMaterial, SphereGeometry } from 'three';
import type { CanvasRefType, SceneRefType } from '@/types';
import { setupScene } from '@/utils/setup';
import { CAMERA_RADIUS, PARTICLE_COUNT, R_TIDAL_VISUAL } from '../constants';
import type { SceneRef } from '../types';
import { createDebrisSystem } from '../utils/debris';
import { createEventHorizon } from '../utils/event-horizon';
import { createOuterGlow } from '../utils/glow';
import { createOrbitPath } from '../utils/orbit';

export const useInit = (canvasRef: CanvasRefType, sceneRef: SceneRefType<SceneRef>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const { renderer, scene, camera, orbit, stars, dispose } = setupScene({
      canvas,
      cameraPosition: [0, 18, 32],
      orbitOptions: { theta: 0.1, phi: Math.PI / 3, radius: CAMERA_RADIUS, minRadius: 6, maxRadius: 80 },
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
    const orbitPath = createOrbitPath();
    const debris = createDebrisSystem(PARTICLE_COUNT);
    scene.add(horizon, glow, tidalSphere, orbitPath.line, debris.points);

    sceneRef.current = {
      core: { scene, renderer, camera, orbit, stars },
      entities: { horizon, glow, tidalSphere, orbit: orbitPath, debris },
    };

    return () => dispose();
  }, [canvasRef, sceneRef]);
};
