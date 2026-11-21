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
  }, [sceneRef, params.showBeams, params.showFieldLines, params.showAccretionDisk]);

  // structural rebuilds
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }

    const { entities } = refs;
    const { fieldTilt } = entities;

    entities.beams.traverse((o) => {
      if (o instanceof Mesh || o instanceof Points) {
        o.geometry.dispose();
        if (Array.isArray(o.material)) {
          o.material.forEach((m) => {
            m.dispose();
          });
        } else {
          o.material.dispose();
        }
      }
    });

    fieldTilt.remove(entities.beams);
    const newBeams = createPulsarBeams(params.beamWidth);
    newBeams.visible = params.showBeams;
    fieldTilt.add(newBeams);
    entities.beams = newBeams;
  }, [sceneRef, params.beamWidth, params.showBeams]);
};
