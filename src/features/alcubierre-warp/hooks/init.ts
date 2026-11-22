import { useEffect } from 'react';
import {
  AdditiveBlending,
  type BufferGeometry,
  HalfFloatType,
  type Material,
  Mesh,
  MeshBasicMaterial,
  type Object3D,
  OrthographicCamera,
  Scene,
  SphereGeometry,
  Vector2,
  WebGLRenderTarget,
} from 'three';
import type { CanvasRefType, SceneRefType } from '@/types';
import { setupScene } from '@/utils/setup';
import { CAMERA_RADIUS, SCENE_PARAMS, WALL_COLOR, WALL_OPACITY } from '../constants';
import type { LensUniforms, SceneRef } from '../types';
import { createExoticMatter } from '../utils/exotic-matter';
import { createLensQuad } from '../utils/lens-quad';
import { createShip } from '../utils/ship';
import { createStreamStars } from '../utils/stream-stars';
import { createYorkGrid } from '../utils/york-grid';

export const useInit = (canvasRef: CanvasRefType, sceneRef: SceneRefType<SceneRef>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const { renderer, scene, camera, orbit, stars, dispose } = setupScene({
      canvas,
      cameraPosition: [6, 5, 12],
      orbitOptions: { radius: CAMERA_RADIUS, minRadius: 4, maxRadius: 50 },
    });

    const streamStars = createStreamStars();
    scene.add(streamStars.points);

    const fgScene = new Scene();
    const ship = createShip();
    const yorkGrid = createYorkGrid();
    const exoticMatter = createExoticMatter(SCENE_PARAMS);
    const bubbleWall = new Mesh(
      new SphereGeometry(1, 48, 32),
      new MeshBasicMaterial({
        color: WALL_COLOR,
        wireframe: true,
        transparent: true,
        opacity: WALL_OPACITY,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    );
    fgScene.add(ship, yorkGrid.line, exoticMatter, bubbleWall);

    const resolution = renderer.getDrawingBufferSize(new Vector2());
    const renderTarget = new WebGLRenderTarget(resolution.x, resolution.y, { type: HalfFloatType });
    const lensUniforms: LensUniforms = {
      backgroundTex: { value: renderTarget.texture },
      resolution: { value: resolution },
      bubbleCenter: { value: new Vector2() },
      bubbleRadius: { value: 0 },
      motionDir: { value: new Vector2(1, 0) },
      strength: { value: 0 },
      sigma: { value: 0 },
    };
    const lensQuad = createLensQuad(lensUniforms);
    const lensScene = new Scene();
    lensScene.add(lensQuad);
    const lensCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const onResize = () => {
      renderer.getDrawingBufferSize(lensUniforms.resolution.value);
      renderTarget.setSize(lensUniforms.resolution.value.x, lensUniforms.resolution.value.y);
    };
    window.addEventListener('resize', onResize);

    sceneRef.current = {
      core: { renderer, scene, camera, orbit, stars },
      entities: {
        streamStars,
        fgScene,
        ship,
        yorkGrid,
        exoticMatter,
        bubbleWall,
        renderTarget,
        lensScene,
        lensCamera,
        lensUniforms,
      },
    };

    return () => {
      window.removeEventListener('resize', onResize);
      renderTarget.dispose();
      lensQuad.geometry.dispose();
      lensQuad.material.dispose();
      // setupScene's dispose only traverses the background scene
      fgScene.traverse((object: Object3D & { geometry?: BufferGeometry; material?: Material | Array<Material> }) => {
        object.geometry?.dispose();
        if (Array.isArray(object.material)) {
          for (const material of object.material) {
            material.dispose();
          }
        } else {
          object.material?.dispose();
        }
      });
      dispose();
    };
  }, [canvasRef, sceneRef]);
};
