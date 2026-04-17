import type { RefObject } from 'react';
import { Color, PerspectiveCamera, Vector2, Vector3, type MeshBasicMaterial } from 'three';
import { useSceneAnimation } from '@/hooks/scene-animation';
import type { SceneRefType } from '@/types';
import { CONTROL_POINTS, GLOW_RADIUS, LOOP_LIFETIME, REBUILD_INTERVAL, STRING_RADIUS } from '../constants';
import type { CommutationLoop, SceneParams, SceneRef } from '../types';
import { createCommutationLoop } from '../utils/commutation-loop';
import { createConeMesh } from '../utils/cone-mesh';
import { buildCurve } from '../utils/curve';
import { createStringMesh } from '../utils/string-mesh';
import { buildStringPoints } from '../utils/string-points';

const toNDC = (v: Vector3, camera: PerspectiveCamera) => {
  const projected = v.clone().project(camera);
  return new Vector2(projected.x, projected.y);
};

const animate = (refs: SceneRef, params: SceneParams, time: number) => {
  if (!refs) {
    return;
  }
  const { core } = refs;
  const { orbit, camera, stars } = core;

  orbit.updateCamera(camera);
  stars!.rotation.y = time * 0.001;

  const rebuildString = (time: number, params: SceneParams) => {
    const pts = buildStringPoints(time, params.oscillationAmp, params.tension);
    const curve = buildCurve(pts);

    // Rebuild core geometry
    refs.entities.stringScene.remove(refs.entities.stringCore);
    refs.entities.stringCore.geometry.dispose();
    refs.entities.stringCore = createStringMesh(curve, STRING_RADIUS, 0xffffff, 0.95);
    refs.entities.stringScene.add(refs.entities.stringCore);

    // Rebuild glow
    refs.entities.stringScene.remove(refs.entities.stringGlow);
    refs.entities.stringGlow.geometry.dispose();
    refs.entities.stringGlow = createStringMesh(
      curve,
      GLOW_RADIUS,
      new Color(0.4 + params.linearDensity * 0.3, 0.7, 1.0).getHex(),
      params.linearDensity * 0.5,
    );
    refs.entities.stringGlow.visible = params.showGlow;
    refs.entities.stringScene.add(refs.entities.stringGlow);

    // Rebuild cone
    if (refs.entities.coneMesh) {
      refs.entities.stringScene.remove(refs.entities.coneMesh);
      refs.entities.coneMesh.geometry.dispose();
    }
    const newCone = createConeMesh(curve, params.linearDensity);
    newCone.visible = params.showCone;
    refs.entities.stringScene.add(newCone);
    refs.entities.coneMesh = newCone;

    // Update lensing uniforms — project string endpoints to NDC
    const startWorld = pts[0]!;
    const endWorld = pts[pts.length - 1]!;

    refs.entities.lensUniforms.stringA.value.copy(toNDC(startWorld, camera));
    refs.entities.lensUniforms.stringB.value.copy(toNDC(endWorld, camera));
    refs.entities.lensUniforms.linearDensity.value = params.linearDensity;
    refs.entities.lensUniforms.showDoubleImage.value = params.showDoubleImage;
  };

  // Rebuild string geometry on interval
  if (time - refs.entities.lastRebuildTime > REBUILD_INTERVAL) {
    rebuildString(time, params);
    refs.entities.lastRebuildTime = time;
  }

  // Intercommutation events — spawn loop near string midpoint
  const loopInterval = 4.0 - params.tension * 2.5;
  if (params.showIntercommutation && time - refs.entities.lastLoopTime > Math.max(1.0, loopInterval)) {
    const midIdx = Math.floor(CONTROL_POINTS / 2);
    const midPt = buildStringPoints(time, params.oscillationAmp, params.tension)[midIdx]!;
    const loopR = 0.3 + Math.random() * 0.5;
    const loopMesh = createCommutationLoop(midPt, loopR);
    refs.entities.stringScene.add(loopMesh);
    refs.entities.loops.push({ mesh: loopMesh, born: time, radius: loopR });
    refs.entities.lastLoopTime = time;
  }

  // Animate loops — shrink and fade
  const expiredLoops: Array<CommutationLoop> = [];
  refs.entities.loops.forEach((loop) => {
    const age = time - loop.born;
    const progress = age / LOOP_LIFETIME;
    if (progress >= 1) {
      expiredLoops.push(loop);
      return;
    }
    const scale = 1 - progress;
    loop.mesh.scale.setScalar(scale);
    (loop.mesh.material as MeshBasicMaterial).opacity = (1 - progress) * 0.9;
  });
  expiredLoops.forEach(({ mesh }) => {
    refs.entities.stringScene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
    refs.entities.loops = refs.entities.loops.filter((l) => l.mesh !== mesh);
  });

  // ── Three-pass render ─────────────────────────────────────────────────
  core.renderer.clear();

  // Pass 1: background → render target
  core.renderer.setRenderTarget(refs.entities.renderTarget);
  core.renderer.clearColor();
  core.renderer.render(refs.core.scene, refs.core.camera);

  // Pass 2: lensing fullscreen pass → screen
  core.renderer.setRenderTarget(null);
  core.renderer.clearColor();
  core.renderer.render(refs.entities.lensScene, refs.entities.lensCamera);

  // Pass 3: string on top of lensed background
  core.renderer.clearDepth();
  core.renderer.render(refs.entities.stringScene, refs.core.camera);
};

export const useAnimate = (sceneRef: SceneRefType<SceneRef>, paramsRef: RefObject<SceneParams>) => {
  useSceneAnimation((time) => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    animate(refs, paramsRef.current, time);
  });
};
