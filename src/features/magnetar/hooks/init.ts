import { useEffect } from 'react';
import { BackSide, FrontSide } from 'three';
import type { CanvasRefType, SceneRefType } from '@/types';
import { setupScene } from '@/utils/setup';
import { NS_RADIUS, PARAMS } from '../constants';
import type { SceneRef } from '../types';
import { createFieldHalo } from '../utils/field-halo';
import { createFieldLines } from '../utils/field-lines';
import { createGammaBurstFlash } from '../utils/gamma-burst';
import { createGlow } from '../utils/glow';
import { createMagnetarBody } from '../utils/magnetar';

export const useInit = (canvasRef: CanvasRefType, sceneRef: SceneRefType<SceneRef>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const { renderer, scene, camera, orbit, dispose } = setupScene({
      canvas,
      cameraPosition: [0, 1.5, 4.5],
      orbitOptions: { radius: 4.5, minRadius: 1.5, maxRadius: 18 },
    });

    const body = createMagnetarBody();
    const innerGlow = createGlow(camera.position, 0x99bbff, NS_RADIUS * 1.7, FrontSide);
    const outerGlow = createGlow(camera.position, 0x3366ff, NS_RADIUS * 2.8, BackSide);
    const fieldLines = createFieldLines(PARAMS.fieldStrength);
    const fieldHalo = createFieldHalo();
    const flash = createGammaBurstFlash();

    camera.add(flash);
    flash.position.z = -1;
    scene.add(body, innerGlow, outerGlow, fieldLines, fieldHalo, camera);

    const core = { renderer, scene, camera, orbit };
    const entities = {
      body,
      innerGlow,
      outerGlow,
      fieldLines,
      fieldHalo,
      flash,
      activeCracks: [],
      lastQuakeTime: 0,
      lastBurstTime: -999,
      burstOpacity: 0,
    };
    sceneRef.current = { core, entities };

    return () => dispose();
  }, [canvasRef, sceneRef]);
};
