import { useEffect } from 'react';
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Points, PointsMaterial, Vector3 } from 'three';
import type { CanvasRefType, SceneRefType, UniformValue } from '@/types';
import { hawkingGlowColor, hawkingTemperatureKelvin } from '@/utils/physics';
import { setupScene } from '@/utils/setup';
import { PAIR_POOL, SCENE_PARAMS } from '../constants';
import type { SceneRef } from '../types';
import { createEventHorizon } from '../utils/event-horizon';
import { createFlash } from '../utils/flash';
import { createOuterGlow, createPhotonGlow } from '../utils/glow';
import { createRadiationHalo } from '../utils/radiation-halo';

export const useInit = (canvasRef: CanvasRefType, sceneRef: SceneRefType<SceneRef>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const { renderer, scene, camera, orbit, stars, dispose } = setupScene({
      canvas,
      cameraPosition: [0, 2, 6],
      orbitOptions: { radius: 6, minRadius: 2, maxRadius: 20 },
    });

    const initTemp = hawkingTemperatureKelvin(SCENE_PARAMS.initialMass);
    const initColor = hawkingGlowColor(initTemp);

    const horizon = createEventHorizon();
    const photonGlow = createPhotonGlow(camera.position, initColor);
    const outerGlow = createOuterGlow(camera.position, initColor);
    const halo = createRadiationHalo(initColor, new Color(0x4488ff), SCENE_PARAMS.radiationIntensity);

    scene.add(horizon, photonGlow, outerGlow, halo);
    halo.visible = SCENE_PARAMS.showHalo;

    // Virtual pair points — fixed pool
    const pairPositions = new Float32Array(PAIR_POOL * 2 * 3); // pairs × 2 particles × xyz
    const pairColors = new Float32Array(PAIR_POOL * 2 * 3);
    const pairGeo = new BufferGeometry();
    pairGeo.setAttribute('position', new BufferAttribute(pairPositions, 3));
    pairGeo.setAttribute('color', new BufferAttribute(pairColors, 3));
    const pairPoints = new Points(
      pairGeo,
      new PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: SCENE_PARAMS.pairOpacity,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    );
    pairPoints.visible = SCENE_PARAMS.showPairs;
    scene.add(pairPoints);

    // Flash overlay — attached to camera
    const flash = createFlash();
    camera.add(flash);
    flash.position.z = -1;
    scene.add(camera);

    // Typed uniform refs
    const photonUniforms = photonGlow.material.uniforms as {
      viewVector: UniformValue<Vector3>;
      glowColor: UniformValue<Color>;
    };
    const outerUniforms = outerGlow.material.uniforms as {
      viewVector: UniformValue<Vector3>;
      glowColor: UniformValue<Color>;
    };
    const haloUniforms = halo.material.uniforms as {
      innerColor: UniformValue<Color>;
      outerColor: UniformValue<Color>;
      opacity: UniformValue<number>;
    };

    sceneRef.current = {
      core: { renderer, scene, camera, orbit, stars },
      entities: {
        horizon,
        photonGlow,
        outerGlow,
        halo,
        flash,
        pairPoints,
        pairGeo,
        photonUniforms,
        outerUniforms,
        haloUniforms,
      },
    };

    return () => dispose();
  }, [canvasRef, sceneRef]);
};
