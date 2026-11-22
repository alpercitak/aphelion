import { useEffect } from 'react';
import { Mesh } from 'three';
import type { SceneRefType } from '@/types';
import type { SceneParams, SceneRef } from '../types';
import { createFieldLines } from '../utils/field-lines';

export const useUpdate = (sceneRef: SceneRefType<SceneRef>, params: SceneParams) => {
  // rebuild field lines
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }

    const { visible } = refs.entities.fieldLines;

    // cleanup old lines
    refs.core.scene.remove(refs.entities.fieldLines);
    refs.entities.fieldLines.traverse((o) => {
      if (o instanceof Mesh) {
        o.geometry.dispose();
        o.material.dispose();
      }
    });

    // create & swap
    const newLines = createFieldLines(params.fieldStrength);
    newLines.visible = visible;

    refs.core.scene.add(newLines);
    refs.entities.fieldLines = newLines;
  }, [sceneRef, params.fieldStrength]);

  // visibility toggles
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    refs.entities.fieldLines.visible = params.showFieldLines;
    refs.entities.fieldHalo.visible = params.showFieldDistortion;
  }, [sceneRef, params.showFieldLines, params.showFieldDistortion]);

  // gamma burst
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs || !params.showGammaBursts) {
      return;
    }
    refs.entities.burstOpacity = params.burstIntensity * 0.4;
  }, [sceneRef, params.showGammaBursts, params.burstIntensity]);
};
