import { type RefObject } from 'react';
import { useSceneAnimation } from '@/hooks/scene-animation';
import type { SceneRefType } from '@/types';
import type { Params, SceneRef } from '../types';

const animate = (refs: SceneRef, params: Params, time: number) => {
  const { core, entities } = refs;
  const { orbit, camera, stars, renderer, scene } = core;
  const { diskGroup, photonMat, photonSphere, outerGlow, photonRing, einsteinRing } = entities;

  orbit.updateCamera(camera);

  // Disk rotation (Keplerian)
  if (diskGroup && params.showDisk) {
    diskGroup.children.forEach((child, i) => {
      child.rotation.y = time * (0.08 + (1 - i / diskGroup.children.length) * 0.12);
    });
  }

  // Photon sphere pulse
  const pulse = 1 + Math.sin(time * 2.1) * 0.015;
  const s = Math.cbrt(params.mass / 10);
  const oblate = 1 - params.spin * 0.15;
  photonSphere.scale.set(s * pulse, s * oblate * pulse, s * pulse);

  // Update glow view vectors
  photonMat.uniforms.viewVector?.value.copy(camera.position);
  outerGlow.material.uniforms.viewVector?.value.copy(camera.position);

  if (params.showStars) {
    stars.rotation.y = time * 0.003;
  }

  // Lensing rings face camera
  photonRing.lookAt(camera.position);
  einsteinRing.lookAt(camera.position);

  renderer.render(scene, camera);
};

export const useAnimate = (sceneRef: SceneRefType<SceneRef>, paramsRef: RefObject<Params>) => {
  useSceneAnimation((time) => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { core } = refs;
    const { renderer, scene, camera } = core;
    animate(refs, paramsRef.current, time);
    renderer.render(scene, camera);
  });
};
