import { useEffect } from 'react';
import { AdditiveBlending, ConeGeometry, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import type { CanvasRefType, SceneRefType } from '@/types';
import { setupScene } from '@/utils/setup';
import {
  BH_GLOW_COLOR,
  BLUE_EJECTA_COLOR,
  BLUE_MASS_FRACTION,
  CAMERA_RADIUS,
  EJECTA_PARTICLES,
  FLASH_COLOR,
  JET_COLOR,
  JET_RADIUS,
  NS_COLOR,
  NS_GLOW_COLOR,
  NS_VISUAL_RADIUS,
  RED_EJECTA_COLOR,
} from '../constants';
import type { SceneRef } from '../types';
import { createBody } from '../utils/bodies';
import { createEjectaCloud } from '../utils/ejecta';

export const useInit = (canvasRef: CanvasRefType, sceneRef: SceneRefType<SceneRef>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const { renderer, scene, camera, orbit, stars, dispose } = setupScene({
      canvas,
      cameraPosition: [0, 10, 24],
      orbitOptions: { theta: 0.1, phi: Math.PI / 3, radius: CAMERA_RADIUS, minRadius: 4, maxRadius: 80 },
    });
    scene.add(camera);

    const bodyA = createBody(NS_COLOR, NS_GLOW_COLOR);
    const bodyB = createBody(NS_COLOR, NS_GLOW_COLOR);
    const remnantNs = createBody(NS_COLOR, NS_GLOW_COLOR);
    const remnantBh = createBody(0x000000, BH_GLOW_COLOR);
    for (const body of [bodyA, bodyB, remnantNs]) {
      body.mesh.scale.setScalar(NS_VISUAL_RADIUS);
      body.mesh.visible = false;
    }
    remnantBh.mesh.visible = false;

    // Jet apex at the origin, pointing down; jetUp is the same cone flipped
    const jetGeo = new ConeGeometry(JET_RADIUS, 1, 24, 1, true);
    jetGeo.translate(0, -0.5, 0);
    const jetMat = new MeshBasicMaterial({
      color: JET_COLOR,
      transparent: true,
      opacity: 0,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    const jetDown = new Mesh(jetGeo, jetMat);
    const jetUp = new Mesh(jetGeo, jetMat);
    jetUp.rotation.x = Math.PI;
    jetDown.visible = false;
    jetUp.visible = false;

    const flash = new Mesh(
      new PlaneGeometry(200, 200),
      new MeshBasicMaterial({ color: FLASH_COLOR, transparent: true, opacity: 0, depthWrite: false, depthTest: false }),
    );
    flash.renderOrder = 999;
    camera.add(flash);
    flash.position.z = -1;

    const blueCount = Math.round(EJECTA_PARTICLES * BLUE_MASS_FRACTION);
    const blueEjecta = createEjectaCloud(blueCount, BLUE_EJECTA_COLOR);
    const redEjecta = createEjectaCloud(EJECTA_PARTICLES - blueCount, RED_EJECTA_COLOR);
    scene.add(
      bodyA.mesh,
      bodyB.mesh,
      remnantNs.mesh,
      remnantBh.mesh,
      jetUp,
      jetDown,
      blueEjecta.points,
      redEjecta.points,
    );

    sceneRef.current = {
      core: { scene, renderer, camera, orbit, stars },
      entities: {
        bodyA,
        bodyB,
        remnantNs,
        remnantBh,
        jetUp,
        jetDown,
        flash,
        blueEjecta,
        redEjecta,
      },
    };

    return () => dispose();
  }, [canvasRef, sceneRef]);
};
