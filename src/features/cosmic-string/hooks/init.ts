import { useEffect } from 'react';
import { LinearFilter, OrthographicCamera, RGBAFormat, Scene, Vector2, WebGLRenderTarget } from 'three';
import type { CanvasRefType, SceneRefType } from '@/types';
import { setupScene } from '@/utils/setup';
import { GLOW_RADIUS, SCENE_PARAMS, STRING_RADIUS } from '../constants';
import type { SceneRef } from '../types';
import { createConeMesh } from '../utils/cone-mesh';
import { buildCurve } from '../utils/curve';
import { createLensQuad } from '../utils/lens-quad';
import { createStringMesh } from '../utils/string-mesh';
import { buildStringPoints } from '../utils/string-points';

export const useInit = (canvasRef: CanvasRefType, sceneRef: SceneRefType<SceneRef>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const { renderer, scene, camera, orbit, stars, dispose } = setupScene({
      canvas,
      cameraPosition: [0, 0, 8],
      orbitOptions: { radius: 8, minRadius: 3, maxRadius: 20, phi: Math.PI / 2 },
      toneMappingExposure: 1.0,
    });

    const W = window.innerWidth;
    const H = window.innerHeight;

    // ── Render target ────────────────────────────────────────────────────────
    const renderTarget = new WebGLRenderTarget(W, H, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
    });

    // ── Lensing pass ─────────────────────────────────────────────────────────
    const lensScene = new Scene();
    const lensCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const lensUniforms = {
      backgroundTex: { value: renderTarget.texture },
      resolution: { value: new Vector2(W, H) },
      linearDensity: { value: SCENE_PARAMS.linearDensity },
      showDoubleImage: { value: SCENE_PARAMS.showDoubleImage },
      stringA: { value: new Vector2(-1, 0) },
      stringB: { value: new Vector2(1, 0) },
    };

    const lensQuad = createLensQuad(lensUniforms);
    lensScene.add(lensQuad);

    // ── String scene — rendered on top ────────────────────────────────────────
    const stringScene = new Scene();

    const initPts = buildStringPoints(0, SCENE_PARAMS.oscillationAmp, SCENE_PARAMS.tension);
    const initCurve = buildCurve(initPts);

    const stringCore = createStringMesh(initCurve, STRING_RADIUS, 0xffffff, 0.95);
    const stringGlow = createStringMesh(initCurve, GLOW_RADIUS, 0x88ccff, 0.35);
    stringGlow.visible = SCENE_PARAMS.showGlow;
    stringScene.add(stringCore, stringGlow);

    const coneMesh = createConeMesh(initCurve, SCENE_PARAMS.linearDensity);
    coneMesh.visible = SCENE_PARAMS.showCone;
    stringScene.add(coneMesh);

    sceneRef.current = {
      core: { renderer, scene, camera, orbit, stars },
      entities: {
        stringScene,
        lensScene,
        lensCamera,
        renderTarget,
        stringCore,
        stringGlow,
        coneMesh,
        lensQuad,
        loops: [],
        lastLoopTime: 0,
        lastRebuildTime: -1,
        lensUniforms,
      },
    };

    // ── Animation loop ────────────────────────────────────────────────────────

    const onResize = () => {
      const refs = sceneRef.current;
      if (!refs) {
        return null;
      }
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      renderTarget.setSize(nw, nh);
      refs.entities.lensUniforms.resolution.value.set(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      renderTarget.dispose();
      dispose();
    };
  }, []);
};
