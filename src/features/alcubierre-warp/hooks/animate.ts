import type { RefObject } from 'react';
import { type PerspectiveCamera, Vector2, Vector3 } from 'three';
import { useSceneAnimation } from '@/hooks/scene-animation';
import type { SceneRefType } from '@/types';
import { LENS_STRENGTH, LENS_V_CAP, MAX_FRAME_DT } from '../constants';
import type { LensUniforms, SceneParams, SceneRef } from '../types';
import { stepStreamStars } from '../utils/stream-stars';

const ORIGIN = new Vector3();
const AXIS_POINT = new Vector3(1, 0, 0);
const edgePoint = new Vector3();
const projected = new Vector3();
const edgeNdc = new Vector2();
const axisNdc = new Vector2();

const projectTo = (point: Vector3, camera: PerspectiveCamera, out: Vector2) => {
  projected.copy(point).project(camera);
  return out.set(projected.x, projected.y);
};

/** Projects the bubble centre, its wall and its motion axis to the screen for the lens pass. */
const updateLensUniforms = (uniforms: LensUniforms, camera: PerspectiveCamera, params: SceneParams) => {
  camera.updateMatrixWorld();
  const aspect = camera.aspect;
  const centre = projectTo(ORIGIN, camera, uniforms.bubbleCenter.value);

  // camera-right at the bubble's edge, so the radius is the wall's apparent size
  edgePoint.set(params.radius, 0, 0).applyQuaternion(camera.quaternion);
  const edge = projectTo(edgePoint, camera, edgeNdc);
  uniforms.bubbleRadius.value = Math.hypot((edge.x - centre.x) * aspect, edge.y - centre.y);

  const axis = projectTo(AXIS_POINT, camera, axisNdc);
  uniforms.motionDir.value.set((axis.x - centre.x) * aspect, axis.y - centre.y).normalize();

  uniforms.strength.value = params.lensing ? LENS_STRENGTH * Math.min(params.velocity, LENS_V_CAP) : 0;
  uniforms.sigma.value = params.sigma * params.radius;
};

export const useAnimate = (sceneRef: SceneRefType<SceneRef>, paramsRef: RefObject<SceneParams>) => {
  useSceneAnimation((_time, delta) => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { core, entities } = refs;
    const params = paramsRef.current;

    core.orbit.updateCamera(core.camera);
    stepStreamStars(entities.streamStars, params.velocity, Math.min(delta, MAX_FRAME_DT));
    updateLensUniforms(entities.lensUniforms, core.camera, params);

    // background (with stream stars) → render target
    core.renderer.setRenderTarget(entities.renderTarget);
    core.renderer.render(core.scene, core.camera);

    // lensed background → screen
    core.renderer.setRenderTarget(null);
    core.renderer.render(entities.lensScene, entities.lensCamera);

    // ship, York grid, exotic ring on top
    core.renderer.autoClear = false;
    core.renderer.clearDepth();
    core.renderer.render(entities.fgScene, core.camera);
    core.renderer.autoClear = true;
  });
};
