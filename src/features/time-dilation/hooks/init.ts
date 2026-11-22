import { useEffect } from 'react';
import type { CanvasRefType, SceneRefType } from '@/types';
import { setupScene } from '@/utils/setup';
import { CAMERA_RADIUS, CLOCK_COUNT, TAU } from '../constants';
import type { SceneRef } from '../types';
import { createClock } from '../utils/clock';
import { createPulses } from '../utils/pulses';
import { createBlackHole, createPhotonRing, createWell } from '../utils/well';

export const useInit = (canvasRef: CanvasRefType, sceneRef: SceneRefType<SceneRef>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const { renderer, scene, camera, orbit, stars, dispose } = setupScene({
      canvas,
      cameraPosition: [0, 14, 26],
      orbitOptions: { theta: 0, radius: CAMERA_RADIUS, minRadius: 6, maxRadius: 70 },
    });

    const well = createWell();
    const clocks = Array.from({ length: CLOCK_COUNT }, (_, i) => createClock((i * TAU) / CLOCK_COUNT));
    const pulses = createPulses();
    scene.add(well, createBlackHole(), createPhotonRing(), pulses.points, ...clocks.map((clock) => clock.group));

    sceneRef.current = {
      core: { renderer, scene, camera, orbit, stars },
      entities: { clocks, well, pulses },
    };

    return dispose;
  }, [canvasRef, sceneRef]);
};
