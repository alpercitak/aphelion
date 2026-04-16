import { useEffect } from 'react';
import { Mesh, Points } from 'three';
import type { SceneRefType } from '@/types';
import type { SceneParams, SceneRef } from '../types';
import { createPulsarBeams } from '../utils/pulsar-beams';

export const useUpdate = (sceneRef: SceneRefType<SceneRef>, params: SceneParams) => {
  // visibility toggles
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { entities } = refs;

    entities.beams.visible = params.showBeams;
    entities.fieldLines.visible = params.showFieldLines;
    entities.accretionDisk.visible = params.showAccretionDisk;
  }, [params.showBeams, params.showFieldLines, params.showAccretionDisk]);

  // structural rebuilds
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }

    const { entities } = refs;

    const tiltObj = entities.rotator.children[0]!;
    entities.beams.traverse((o) => {
      if (o instanceof Mesh || o instanceof Points) {
        o.geometry.dispose();
        Array.isArray(o.material) ? o.material.forEach((m) => m.dispose()) : o.material.dispose();
      }
    });

    tiltObj.remove(entities.beams);
    const newBeams = createPulsarBeams(params.beamWidth);
    newBeams.visible = params.showBeams;
    tiltObj.add(newBeams);
    entities.beams = newBeams;
  }, [params.beamWidth]);
};
