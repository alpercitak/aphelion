import { useEffect } from 'react';
import type { SceneRefType } from '@/types';
import type { SceneParams, SceneRef, StarUniforms } from '../types';
import { createProgenitorStar } from '../utils/progenitor-star';
import { createRemnant, getRemnantType } from '../utils/remnant';

export const useUpdate = (sceneRef: SceneRefType<SceneRef>, params: SceneParams) => {
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { core, entities } = refs;
    const { scene } = core;

    // Rebuild star
    scene.remove(entities.star);
    entities.star.geometry.dispose();
    entities.star.material.dispose();
    const newStar = createProgenitorStar(params.progenitorMass);
    scene.add(newStar);
    entities.star = newStar;
    entities.starUniforms = newStar.material.uniforms as StarUniforms;

    // Rebuild remnant
    if (entities.remnant) {
      scene.remove(entities.remnant);
      entities.remnant.geometry.dispose();
    }
    const rt = getRemnantType(params.progenitorMass);
    if (rt !== 'none') {
      const newRemnant = createRemnant(rt);
      newRemnant.visible = false;
      scene.add(newRemnant);
      entities.remnant = newRemnant;
    } else {
      entities.remnant = null;
    }
  }, [params.progenitorMass]);
};
