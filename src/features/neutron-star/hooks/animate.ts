import { Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { useSceneAnimation } from '@/hooks/scene-animation';
import { BEAM_FLASH_THRESHOLD } from '../constants';
import type { Params, SceneRef } from '../types';

const animate = (refs: SceneRef, params: Params, time: number) => {
  const { core, entities } = refs;
  const { camera, orbit, stars } = core;
  const { starBody, glow, outerGlow, flash, fieldLines, accretionDisk, rotator } = entities;

  // core Motion
  orbit.updateCamera(camera);
  stars.rotation.y = time * 0.002;

  const radsPerSec = (params.rpm / 60) * Math.PI * 2;
  rotator.rotation.y = time * radsPerSec;
  starBody.rotation.y = time * radsPerSec;

  // surface shader uniforms
  starBody.material.uniforms['time']!.value = time;
  starBody.material.uniforms['rpm']!.value = params.rpm;
  starBody.material.uniforms['mass']!.value = params.mass;

  glow.material.uniforms.viewVector?.value.copy(camera.position);
  outerGlow.material.uniforms.viewVector?.value.copy(camera.position);

  // beam flash logic
  if (params.showBeamFlash) {
    const beamAxisWorld = new Vector3(0, 1, 0).applyEuler(rotator.rotation);
    const camDir = camera.position.clone().normalize();
    const alignment = Math.abs(beamAxisWorld.dot(camDir));

    const prevOpacity = flash.material.opacity;
    // We use a small delta check or fixed step here
    flash.material.opacity =
      alignment > BEAM_FLASH_THRESHOLD ? Math.min(0.35, prevOpacity + 0.06) : Math.max(0, prevOpacity - 0.04);
  } else {
    flash.material.opacity = 0;
  }

  // object Updates
  fieldLines.children.forEach((child) => {
    if (child instanceof Mesh && child.material instanceof MeshBasicMaterial) {
      child.material.opacity = params.fieldStrength * 0.3;
    }
  });

  if (params.showAccretionDisk) {
    accretionDisk.rotation.y = time * 0.15;
  }
};

export function useAnimate(sceneRef: React.RefObject<SceneRef | null>, paramsRef: React.RefObject<Params>) {
  useSceneAnimation((time) => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { core } = refs;
    animate(refs, paramsRef.current, time);
    core.renderer.render(core.scene, core.camera);
  });
}
