import { useEffect, type RefObject } from 'react';
import type { SceneRefType } from '@/types';
import type { LensState, SceneParams, SceneRef } from '../types';
import { createBackground } from '../utils/background';
import { createGalaxies } from '../utils/galaxies';

export const useUpdate = (
  sceneRef: SceneRefType<SceneRef>,
  params: SceneParams,
  lensStateRef: RefObject<LensState>,
) => {
  useEffect(() => {
    const onResize = () => {
      const refs = sceneRef.current;
      if (!refs) {
        return;
      }
      const { core, entities } = refs;
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      entities.bgCamera.aspect = nw / nh;
      entities.bgCamera.updateProjectionMatrix();
      core.renderer.setSize(nw, nh);
      entities.renderTarget.setSize(nw, nh);
      entities.lensUniforms.resolution.value.set(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!params.mouseLens) {
        return;
      }
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      lensStateRef.current.pos.set(x, y);
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { core, entities } = refs;
    const { backgroundDensity } = params;

    // remove old
    entities.bgScene.remove(core.stars!);
    entities.galaxies.forEach((g) => {
      entities.bgScene.remove(g);
      g.material.dispose();
    });

    // add new
    const newStars = createBackground(backgroundDensity);
    const newGalaxies = createGalaxies(backgroundDensity);
    entities.bgScene.add(newStars);
    newGalaxies.forEach((g) => entities.bgScene.add(g));
    core.stars = newStars;
    entities.galaxies = newGalaxies;
  }, [params.backgroundDensity]);
};
