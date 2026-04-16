import type { RefObject } from 'react';
import type { PointsMaterial, ShaderMaterial } from 'three';
import { useSceneAnimation } from '@/hooks/scene-animation';
import type { SceneRefType } from '@/types';
import type { SceneParams, SceneRef } from '../types';

export const animate = (refs: SceneRef, params: SceneParams, time: number) => {
  if (!refs) {
    return;
  }
  const { core, entities } = refs;
  const { renderer, camera, orbit, stars } = core;
  const {
    portalScene,
    portalCamera,
    renderTarget,
    destinationStars,
    portalUniforms,
    rimUniforms,
    innerGlowUniforms,
    outerGlowUniforms,
    lensingRings,
    exoticHalo,
  } = entities;

  orbit.updateCamera(camera);

  stars!.rotation.y = time * 0.002;
  destinationStars.rotation.y = -time * 0.003;
  destinationStars.rotation.x = time * 0.001;

  portalCamera.rotation.y = time * 0.08;
  portalCamera.rotation.x = Math.sin(time * 0.15) * 0.1;

  portalUniforms.time.value = time;
  portalUniforms.distortion.value = params.lensingStrength;

  rimUniforms.viewVector.value.copy(camera.position);
  innerGlowUniforms.viewVector.value.copy(camera.position);
  outerGlowUniforms.viewVector.value.copy(camera.position);

  if (params.showExoticHalo) {
    exoticHalo.rotation.y = time * 0.12;
    exoticHalo.rotation.z = time * 0.07;
    (exoticHalo.material as PointsMaterial).opacity = 0.3 + Math.sin(time * 1.4) * 0.15 * params.exoticDensity;
  }

  lensingRings.forEach((ring, i) => {
    ring.lookAt(camera.position);
    (ring.material as ShaderMaterial).uniforms['opacity']!.value =
      (1 - (i + 1) / lensingRings.length) * 0.5 * params.lensingStrength;
  });

  renderer.setRenderTarget(renderTarget);
  renderer.render(portalScene, portalCamera);
  renderer.setRenderTarget(null);
};

export const useAnimate = (sceneRef: SceneRefType<SceneRef>, paramsRef: RefObject<SceneParams>) => {
  useSceneAnimation((time) => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    animate(refs, paramsRef.current, time);
    refs.core.renderer.render(refs.core.scene, refs.core.camera);
  });
};
