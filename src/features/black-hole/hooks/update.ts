import { useEffect } from 'react';
import { Mesh } from 'three';
import type { SceneRefType } from '@/types';
import type { SceneParams, SceneRef } from '../types';
import { createAccretionDisk } from '../utils/accretion-disk';
import { applyMassScale } from '../utils/mass-scale';

export const useUpdate = (sceneRef: SceneRefType<SceneRef>, params: SceneParams) => {
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { entities } = refs;
    const { blackHole, photonSphere, outerGlow, photonRing, einsteinRing } = entities;
    applyMassScale({ blackHole, photonSphere, outerGlow, photonRing, einsteinRing }, params.mass, params.spin);
  }, [params.mass, params.spin, sceneRef]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { core, entities } = refs;

    // cleanup old disk
    core.scene.remove(entities.diskGroup);
    entities.diskGroup.traverse((o) => {
      if (o instanceof Mesh) {
        o.geometry?.dispose();
        o.material?.dispose();
      }
    });

    // Create and swap
    const newDisk = createAccretionDisk(params.temp, params.dopplerShift);
    entities.diskGroup = newDisk;

    if (params.showDisk) {
      core.scene.add(newDisk);
    }
  }, [params.temp, params.dopplerShift, params.showDisk, sceneRef]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { core, entities } = refs;
    const { stars, scene } = core;
    const { jetsGroup, diskGroup } = entities;

    stars!.visible = params.showStars;

    if (params.showJets) {
      scene.add(jetsGroup);
    } else {
      scene.remove(jetsGroup);
    }

    if (params.showDisk) {
      scene.add(diskGroup);
    } else {
      scene.remove(diskGroup);
    }
  }, [params.showStars, params.showJets, params.showDisk, sceneRef]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { entities } = refs;
    const { photonMat, photonRingMat, einsteinMat } = entities;

    photonRingMat.opacity = params.lensStrength * 0.9;
    einsteinMat.opacity = params.lensStrength * 0.5;
    photonMat.uniforms.glowColor?.value.setRGB(1.0, 0.67 * params.lensStrength, 0.27 * params.lensStrength);
  }, [params.lensStrength, sceneRef]);
};
