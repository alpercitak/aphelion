import type { RefObject } from 'react';
import { useSceneAnimation } from '@/hooks/scene-animation';
import type { SceneRefType } from '@/types';
import type { LensState, SceneParams, SceneRef } from '../types';

const animate = (refs: SceneRef, params: SceneParams, time: number, lensState: LensState) => {
  if (!refs) {
    return;
  }
  const { core, entities } = refs;

  core.orbit.updateCamera(core.camera);

  // auto-drift lens along a Lissajous path when mouse control is off
  if (!params.mouseLens) {
    lensState.pos.set(
      Math.sin(time * lensState.driftSpeed * 1.0) * 0.55,
      Math.sin(time * lensState.driftSpeed * 0.7 + 1.2) * 0.38,
    );
  }

  // update lens uniforms
  if (params.multipleLenses && !params.darkMatterMode) {
    // Three lenses: primary + two trailing
    entities.lensUniforms.lensCount.value = 3;
    entities.lensUniforms.lensPos.value[0]?.copy(lensState.pos);
    entities.lensUniforms.lensPos.value[1]?.set(
      lensState.pos.x * 0.6 + Math.sin(time * 0.3) * 0.3,
      lensState.pos.y * 0.6 + Math.cos(time * 0.25) * 0.25,
    );
    entities.lensUniforms.lensPos.value[2]?.set(
      -lensState.pos.x * 0.4 + Math.sin(time * 0.2 + 2) * 0.2,
      -lensState.pos.y * 0.4 + Math.cos(time * 0.18 + 1) * 0.18,
    );
    entities.lensUniforms.lensMass.value[0] = params.mass;
    entities.lensUniforms.lensMass.value[1] = params.mass * 0.6;
    entities.lensUniforms.lensMass.value[2] = params.mass * 0.4;
  } else {
    entities.lensUniforms.lensCount.value = 1;
    entities.lensUniforms.lensPos.value[0]?.copy(lensState.pos);
    entities.lensUniforms.lensMass.value[0] = params.mass;
  }

  entities.lensUniforms.showMarkers.value = params.showLensMarker;
  entities.lensUniforms.darkMatterMode.value = params.darkMatterMode;

  // slow galaxy drift for depth
  entities.galaxies.forEach((g, i) => {
    g.position.x += Math.sin(time * 0.02 + i) * 0.0002;
    g.position.y += Math.cos(time * 0.015 + i * 1.3) * 0.0001;
  });

  // ── Two-pass render ─────────────────────────────────────────────────
  // pass 1: render background to texture
  core.renderer.setRenderTarget(entities.renderTarget);
  core.renderer.render(core.scene, core.camera);

  // pass 2: lensing fullscreen pass to screen
  core.renderer.setRenderTarget(null);
  core.renderer.render(entities.lensScene, entities.lensCamera);
};

export const useAnimate = (
  sceneRef: SceneRefType<SceneRef>,
  paramsRef: RefObject<SceneParams>,
  lensStateRef: RefObject<LensState>,
) => {
  useSceneAnimation((time) => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    animate(refs, paramsRef.current, time, lensStateRef.current);
  });
};
