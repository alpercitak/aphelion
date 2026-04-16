import { useEffect } from 'react';
import {
  BackSide,
  Color,
  FrontSide,
  LinearFilter,
  PerspectiveCamera,
  RGBAFormat,
  Scene,
  Vector3,
  WebGLRenderTarget,
} from 'three';
import type { CanvasRefType, SceneRefType, UniformValue } from '@/types';
import { setupScene } from '@/utils/setup';
import { DESTINATION_COLOR_MAP, SCENE_PARAMS } from '../constants';
import type { SceneRef } from '../types';
import { createDestinationStars } from '../utils/destination-stars';
import { createExoticHalo } from '../utils/exotic-halo';
import { createFresnelGlow } from '../utils/fresnel-glow';
import { createLensingRings } from '../utils/lensing-rings';
import { createPortalDisc } from '../utils/portal-disc';
import { createThroatRim } from '../utils/throat-rim';

export const useInit = (canvasRef: CanvasRefType, sceneRef: SceneRefType<SceneRef>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const { renderer, scene, camera, orbit, stars, dispose } = setupScene({
      canvas,
      cameraPosition: [0, 1.5, 5],
      orbitOptions: { radius: 5, minRadius: 2, maxRadius: 20 },
    });

    // ── Portal (secondary) scene — rendered to texture ────────────────────────
    const renderTarget = new WebGLRenderTarget(512, 512, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
    });

    const portalScene = new Scene();
    const portalCamera = new PerspectiveCamera(90, 1, 0.01, 500);
    portalCamera.position.set(0, 0, 0.1);
    portalCamera.lookAt(0, 0, -1);

    const destinationStars = createDestinationStars(DESTINATION_COLOR_MAP[SCENE_PARAMS.destination]);
    portalScene.add(destinationStars);

    // ── Wormhole objects ──────────────────────────────────────────────────────
    const throatRadius = SCENE_PARAMS.throatRadius;

    const portalDisc = createPortalDisc(throatRadius, renderTarget);
    // face portal disc toward camera (opening faces +Z)
    portalDisc.rotation.x = Math.PI * 0.5;
    scene.add(portalDisc);

    const rim = createThroatRim(throatRadius);
    scene.add(rim);

    const innerGlow = createFresnelGlow(camera.position, 0xbbddff, throatRadius * 1.3, FrontSide, 3.0);
    const outerGlow = createFresnelGlow(camera.position, 0x6699ff, throatRadius * 2.0, BackSide, 4.5);
    scene.add(innerGlow, outerGlow);

    const lensingRings = createLensingRings(throatRadius, SCENE_PARAMS.lensingStrength);
    lensingRings.forEach((ring) => {
      ring.rotation.x = Math.PI * 0.5;
      scene.add(ring);
    });

    const exoticHalo = createExoticHalo(throatRadius, SCENE_PARAMS.exoticDensity);
    exoticHalo.visible = SCENE_PARAMS.showExoticHalo;
    scene.add(exoticHalo);

    // extract typed uniform refs
    const rimUniforms = rim.material.uniforms as {
      viewVector: UniformValue<Vector3>;
      glowColor: UniformValue<Color>;
    };
    const innerGlowUniforms = innerGlow.material.uniforms as {
      viewVector: UniformValue<Vector3>;
    };
    const outerGlowUniforms = outerGlow.material.uniforms as {
      viewVector: UniformValue<Vector3>;
    };
    const portalUniforms = portalDisc.material.uniforms as {
      time: UniformValue<number>;
      distortion: UniformValue<number>;
    };

    sceneRef.current = {
      core: { renderer, scene, camera, orbit, stars },
      entities: {
        portalScene,
        portalCamera,
        renderTarget,
        rim,
        portalDisc,
        innerGlow,
        outerGlow,
        lensingRings,
        exoticHalo,
        destinationStars,
        rimUniforms,
        innerGlowUniforms,
        outerGlowUniforms,
        portalUniforms,
      },
    };

    return () => {
      renderTarget.dispose();
      dispose();
    };
  }, []);
};
