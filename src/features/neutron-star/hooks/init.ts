import { useEffect } from 'react';
import { Object3D } from 'three';
import type { CanvasRefType, SceneRefType } from '@/types';
import { setupScene } from '@/utils/setup';
import { SCENE_PARAMS } from '../constants';
import type { SceneRef } from '../types';
import { createAccretionDisk } from '../utils/accretion-disk';
import { createBeamFlash } from '../utils/beam-flash';
import { createFieldLines } from '../utils/field-lines';
import { createGlow, createOuterGlow } from '../utils/glow';
import { createNeutronStarBody } from '../utils/neutron-star';
import { createPulsarBeams } from '../utils/pulsar-beams';

export const useInit = (canvasRef: CanvasRefType, sceneRef: SceneRefType<SceneRef>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const { renderer, scene, camera, orbit, stars, dispose } = setupScene({
      canvas,
      cameraPosition: [0, 2, 5],
      orbitOptions: { radius: 5, minRadius: 1.5, maxRadius: 20 },
    });

    const starBody = createNeutronStarBody(SCENE_PARAMS.mass);
    const glow = createGlow(camera.position);
    const outerGlow = createOuterGlow(camera.position);
    const rotator = new Object3D();
    const accretionDisk = createAccretionDisk();
    accretionDisk.visible = SCENE_PARAMS.showAccretionDisk;

    scene.add(starBody, glow, outerGlow, rotator, accretionDisk);

    const fieldTiltObj = new Object3D();
    fieldTiltObj.rotation.z = 0.25;
    rotator.add(fieldTiltObj);

    const beams = createPulsarBeams(SCENE_PARAMS.beamWidth);
    fieldTiltObj.add(beams);

    const fieldLines = createFieldLines(SCENE_PARAMS.fieldStrength);
    fieldTiltObj.add(fieldLines);

    const flash = createBeamFlash();
    camera.add(flash);
    flash.position.z = -1;
    scene.add(camera);

    sceneRef.current = {
      core: { renderer, scene, camera, orbit, stars },
      entities: { starBody, glow, outerGlow, rotator, beams, fieldLines, accretionDisk, flash },
    };

    return () => dispose();
  }, [canvasRef, sceneRef]);
};
