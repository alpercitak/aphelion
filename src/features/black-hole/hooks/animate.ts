import type { RefObject } from 'react';
import { useSceneAnimation } from '@/hooks/scene-animation';
import type { SceneRefType } from '@/types';
import type { SceneParams, SceneRef } from '../types';

const animate = (refs: SceneRef, params: SceneParams, time: number) => {
  const { core, entities } = refs;
  const { orbit, camera, stars } = core;
  const { diskGroup, photonMat, photonSphere, outerGlow, photonRing, einsteinRing } = entities;

  orbit.updateCamera(camera);

  // disk rotation (Keplerian)
  if (diskGroup && params.showDisk) {
    diskGroup.children.forEach((child, i) => {
      child.rotation.y = time * (0.08 + (1 - i / diskGroup.children.length) * 0.12);
    });
  }

  // photon sphere pulse
  const pulse = 1 + Math.sin(time * 2.1) * 0.015;
  const s = Math.cbrt(params.mass / 10);
  const oblate = 1 - params.spin * 0.15;
  photonSphere.scale.set(s * pulse, s * oblate * pulse, s * pulse);

  // update glow view vectors
  photonMat.uniforms.viewVector?.value.copy(camera.position);
  outerGlow.material.uniforms.viewVector?.value.copy(camera.position);

  if (params.showStars) {
    stars!.rotation.y = time * 0.003;
  }

  // lensing rings face camera
  photonRing.lookAt(camera.position);
  einsteinRing.lookAt(camera.position);
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
