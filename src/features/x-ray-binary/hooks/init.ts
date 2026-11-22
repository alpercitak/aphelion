import { useEffect } from 'react';
import { Group } from 'three';
import type { CanvasRefType, SceneRefType } from '@/types';
import { setupScene } from '@/utils/setup';
import {
  BH_GLOW_COLOR,
  BH_VISUAL_RADIUS,
  CAMERA_RADIUS,
  NS_COLOR,
  NS_GLOW_COLOR,
  NS_VISUAL_RADIUS,
} from '../constants';
import type { SceneRef } from '../types';
import { createBody } from '../utils/bodies';
import { createAccretionDisk } from '../utils/disk';
import { createDonor } from '../utils/donor';
import { createGas } from '../utils/gas';
import { createRocheLobes } from '../utils/lobes';

export const useInit = (canvasRef: CanvasRefType, sceneRef: SceneRefType<SceneRef>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const { renderer, scene, camera, orbit, stars, dispose } = setupScene({
      canvas,
      cameraPosition: [0, 14, 22],
      orbitOptions: { theta: 0.1, phi: Math.PI / 3, radius: CAMERA_RADIUS, minRadius: 6, maxRadius: 80 },
    });

    const system = new Group();
    const donor = createDonor();
    const neutronStar = createBody(NS_COLOR, NS_GLOW_COLOR);
    neutronStar.mesh.scale.setScalar(NS_VISUAL_RADIUS);
    const blackHole = createBody(0x000000, BH_GLOW_COLOR);
    blackHole.mesh.scale.setScalar(BH_VISUAL_RADIUS);
    const lobes = createRocheLobes();
    const disk = createAccretionDisk();
    const gas = createGas();
    system.add(donor.mesh, neutronStar.mesh, blackHole.mesh, lobes.group, disk.group, gas.points);
    scene.add(system);

    sceneRef.current = {
      core: { scene, renderer, camera, orbit, stars },
      entities: { system, donor, neutronStar, blackHole, lobes, disk, gas },
    };

    return () => dispose();
  }, [canvasRef, sceneRef]);
};
