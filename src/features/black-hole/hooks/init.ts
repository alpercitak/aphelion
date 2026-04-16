import { useEffect } from 'react';
import type { CanvasRefType, SceneRefType } from '@/types';
import { setupScene } from '@/utils/setup';
import { SCENE_PARAMS } from '../constants';
import type { SceneRef } from '../types';
import { createAccretionDisk } from '../utils/accretion-disk';
import { createEventHorizon } from '../utils/event-horizon';
import { createLensingRings } from '../utils/lensing-rings';
import { createOuterGlow } from '../utils/outer-glow';
import { createPhotonSphere } from '../utils/photon-sphere';
import { createRelativisticJets } from '../utils/relativistic-jets';

export const useInit = (canvasRef: CanvasRefType, sceneRef: SceneRefType<SceneRef>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const { renderer, scene, camera, orbit, stars, dispose } = setupScene({
      canvas,
      cameraPosition: [0, 3, 8],
      orbitOptions: { theta: 0.1, phi: Math.PI / 3.5, radius: 16 },
    });

    const blackHole = createEventHorizon();
    const photonSphere = createPhotonSphere(camera.position);
    const outerGlow = createOuterGlow(camera.position);
    const { photonRing, einsteinRing } = createLensingRings();
    const diskGroup = createAccretionDisk(SCENE_PARAMS.temp, false);
    const jetsGroup = createRelativisticJets();
    scene.add(blackHole, photonSphere, outerGlow, photonRing, einsteinRing, diskGroup, jetsGroup);

    sceneRef.current = {
      core: { scene, renderer, camera, orbit, stars },
      entities: {
        blackHole,
        photonSphere,
        outerGlow,
        photonRing,
        einsteinRing,
        diskGroup,
        jetsGroup,
        photonMat: photonSphere.material,
        einsteinMat: einsteinRing.material,
        photonRingMat: photonRing.material,
      },
    };

    return () => dispose();
  }, [canvasRef, sceneRef]);
};
