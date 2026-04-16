import { useEffect } from 'react';
import { LineBasicMaterial } from 'three';
import type { SceneRefType } from '@/types';
import { massScale, tempToColor } from '@/utils/physics';
import type { SceneParams, SceneRef } from '../types';
import { createCentralBody } from '../utils/central-body';
import { createEjectaHaze } from '../utils/ejecta-haze';
import { createOuterHalo, createPhotonGlow } from '../utils/photon-glow';

export const useUpdate = (sceneRef: SceneRefType<SceneRef>, params: SceneParams) => {
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }

    const { core, entities } = refs;
    const { scene, camera } = core;
    const { body, photonGlow, outerHalo, ejectaHaze } = entities;

    // dispose old resources
    [body, photonGlow, outerHalo, ejectaHaze].forEach((obj) => {
      scene.remove(obj);
      obj.geometry.dispose();
      if (Array.isArray(obj.material)) {
        obj.material.forEach((m) => m.dispose());
      } else {
        obj.material.dispose();
      }
    });

    // create new resources
    const newBody = createCentralBody(params.mass);
    const newGlow = createPhotonGlow(params.mass, camera.position);
    const newHalo = createOuterHalo(params.mass, camera.position);
    const newHaze = createEjectaHaze(params.mass);

    // apply current visibility settings to new objects
    newGlow.visible = params.showPhotonSphere;
    newHaze.visible = params.showEjectaHaze;
    scene.add(newBody, newGlow, newHalo, newHaze);

    // update refs
    entities.body = newBody;
    entities.photonGlow = newGlow;
    entities.outerHalo = newHalo;
    entities.ejectaHaze = newHaze;
    entities.bodyRadius = massScale(params.mass) * 0.9;

    entities.photonUniforms = newGlow.material.uniforms as any;
    entities.haloUniforms = newHalo.material.uniforms as any;
  }, [params.mass]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }

    const { core, entities } = refs;

    entities.photonGlow.visible = params.showPhotonSphere;
    entities.ejectaHaze.visible = params.showEjectaHaze;
    core.stars!.visible = params.showStars;

    entities.particles.forEach((p) => {
      p.color = tempToColor(params.temperature * (0.6 + Math.random() * 0.8));
      if (p.trailLine) {
        (p.trailLine.material as LineBasicMaterial).color = p.color;
      }
    });
  }, [params.temperature, params.showPhotonSphere, params.showEjectaHaze, params.showStars]);
};
