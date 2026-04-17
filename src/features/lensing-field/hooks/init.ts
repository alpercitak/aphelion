import { useEffect } from 'react';
import {
  LinearFilter,
  OrthographicCamera,
  PerspectiveCamera,
  RGBAFormat,
  Scene,
  Vector2,
  WebGLRenderTarget,
} from 'three';
import type { CanvasRefType, SceneRefType } from '@/types';
import { setupScene } from '@/utils/setup';
import { DARK_MATTER_LENS_COUNT, SCENE_PARAMS } from '../constants';
import type { SceneRef } from '../types';
import { createBackground } from '../utils/background';
import { generateDarkMatterLenses } from '../utils/dark-matter-lenses';
import { createGalaxies } from '../utils/galaxies';
import { createLensQuad } from '../utils/lens-quad';

export const useInit = (canvasRef: CanvasRefType, sceneRef: SceneRefType<SceneRef>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const { renderer, scene, orbit, camera, dispose } = setupScene({
      canvas,
      cameraPosition: [0, 0, 5],
      orbitOptions: { radius: 5, minRadius: 2, maxRadius: 15, phi: Math.PI / 2 },
      toneMappingExposure: 1.0,
    });

    const W = window.innerWidth;
    const H = window.innerHeight;

    // ── Background scene ─────────────────────────────────────────────────────

    const bgCamera = new PerspectiveCamera(55, W / H, 0.01, 100);
    bgCamera.position.set(0, 0, 5);
    bgCamera.lookAt(0, 0, 0);

    const stars = createBackground(SCENE_PARAMS.backgroundDensity);
    const galaxies = createGalaxies(SCENE_PARAMS.backgroundDensity);
    scene.add(stars);
    galaxies.forEach((g) => scene.add(g));

    // ── Render target ────────────────────────────────────────────────────────
    const renderTarget = new WebGLRenderTarget(W, H, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
    });

    // ── Lensing fullscreen pass ───────────────────────────────────────────────
    const lensScene = new Scene();
    const lensCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Pad arrays to fixed lengths for GLSL uniform arrays
    const lensPositions = Array.from({ length: 5 }, () => new Vector2(0, 0));
    const lensMasses = new Array(5).fill(0) as Array<number>;
    const dmLenses = generateDarkMatterLenses();
    const dmPositions = [
      ...dmLenses.positions,
      ...Array.from({ length: DARK_MATTER_LENS_COUNT - dmLenses.positions.length }, () => new Vector2(0, 0)),
    ].slice(0, DARK_MATTER_LENS_COUNT);
    const dmMasses = [...dmLenses.masses, ...new Array(DARK_MATTER_LENS_COUNT - dmLenses.masses.length).fill(0)].slice(
      0,
      DARK_MATTER_LENS_COUNT,
    ) as Array<number>;

    const lensUniforms = {
      backgroundTex: { value: renderTarget.texture },
      resolution: { value: new Vector2(W, H) },
      lensCount: { value: 1 },
      lensPos: { value: lensPositions },
      lensMass: { value: lensMasses },
      showMarkers: { value: false },
      darkMatterMode: { value: false },
      dmPos: { value: dmPositions },
      dmMass: { value: dmMasses },
      dmLenses,
    };
    const lensQuad = createLensQuad(lensUniforms);

    lensScene.add(lensQuad);

    sceneRef.current = {
      core: { renderer, scene, orbit, stars, camera },
      entities: { lensScene, lensCamera, renderTarget, galaxies, lensQuad, lensUniforms },
    };

    return () => {
      renderTarget.dispose();
      dispose();
    };
  });
};
