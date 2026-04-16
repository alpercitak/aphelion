import type { RefObject } from 'react';
import { LineBasicMaterial, Mesh, MeshBasicMaterial, PointsMaterial, Vector3 } from 'three';
import { useSceneAnimation } from '@/hooks/scene-animation';
import type { SceneRefType } from '@/types';
import { NS_RADIUS, STARQUAKE_DURATION, STARQUAKE_RATE_MAP } from '../constants';
import type { ActiveCrack, Params, SceneRef } from '../types';
import { createStarquakeCrack } from '../utils/starquake-crack';

const animate = (refs: SceneRef, params: Params, time: number) => {
  const { core, entities } = refs;
  const { orbit, camera, renderer, scene } = core;
  const { body, innerGlow, outerGlow, fieldLines, fieldHalo, flash, lastQuakeTime, activeCracks } = entities;
  const {
    burstIntensity,
    fieldStrength,
    showFieldDistortion,
    showFieldLines,
    starquakeRate,
    showStarquakes,
    showGammaBursts,
    surfaceTemp,
  } = params;

  orbit.updateCamera(camera);

  // surface shader
  body.material.uniforms['time']!.value = time;
  body.material.uniforms['fieldStrength']!.value = fieldStrength;
  // normalise surfaceTemp from [1e6, 1e8] to [0, 1]
  body.material.uniforms['surfaceTemp']!.value = (surfaceTemp - 1e6) / (1e8 - 1e6);

  // slow body rotation — magnetars spin slower than pulsars (~0.1–10 RPM)
  body.rotation.y = time * 0.3;

  // glow view vectors
  innerGlow.material.uniforms['viewVector']!.value.copy(camera.position);
  outerGlow.material.uniforms['viewVector']!.value.copy(camera.position);

  // writhing field lines: sine-based phase offset per child
  if (showFieldLines) {
    fieldLines.visible = true;
    fieldLines.children.forEach((child, i) => {
      // Rotate each line at a slightly different rate — creates writhing effect
      child.rotation.y = time * (0.04 + i * 0.003) * fieldStrength;
      child.rotation.x = Math.sin(time * 0.15 + i * 0.4) * 0.08 * fieldStrength;
      if (child instanceof Mesh && child.material instanceof MeshBasicMaterial) {
        child.material.opacity = fieldStrength * (0.08 + (i % 3) * 0.06);
      }
    });
  } else {
    fieldLines.visible = false;
  }

  // field halo pulse
  fieldHalo.visible = showFieldDistortion;
  if (showFieldDistortion) {
    const haloPulse = 0.4 + Math.sin(time * 1.2) * 0.1;
    (fieldHalo.material as PointsMaterial).opacity = haloPulse * fieldStrength * 0.5;
    fieldHalo.rotation.y = time * 0.05;
    fieldHalo.rotation.x = time * 0.03;
  }

  // spawn starquake
  if (showStarquakes && starquakeRate !== 'off') {
    const interval = STARQUAKE_RATE_MAP[starquakeRate];
    if (time - lastQuakeTime > interval) {
      // random point on sphere surface
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const origin = new Vector3(
        NS_RADIUS * Math.sin(phi) * Math.cos(theta),
        NS_RADIUS * Math.sin(phi) * Math.sin(theta),
        NS_RADIUS * Math.cos(phi),
      );
      const crack = createStarquakeCrack(origin);
      scene.add(crack);
      activeCracks.push({ mesh: crack, born: time });
      entities.lastQuakeTime = time;

      // Trigger gamma burst
      if (showGammaBursts) {
        entities.burstOpacity = burstIntensity * 0.6;
        entities.lastBurstTime = time;
      }
    }
  }

  // animate active cracks, fade out over STARQUAKE_DURATION
  const expiredCracks: Array<ActiveCrack> = [];
  activeCracks.forEach((crack) => {
    const age = time - crack.born;
    const opacity = Math.max(0, 1 - age / STARQUAKE_DURATION);
    (crack.mesh.material as LineBasicMaterial).opacity = opacity;
    // Expand slightly as it fades
    const expand = 1 + age * 0.15;
    crack.mesh.scale.setScalar(expand);
    if (opacity <= 0) expiredCracks.push(crack);
  });
  expiredCracks.forEach(({ mesh }) => {
    scene.remove(mesh);
    mesh.geometry.dispose();
    entities.activeCracks = entities.activeCracks.filter((c) => c.mesh !== mesh);
  });

  // gamma burst flash decay
  if (entities.burstOpacity > 0) {
    entities.burstOpacity = Math.max(0, entities.burstOpacity - 0.018);
    flash.material.opacity = entities.burstOpacity;
  } else {
    flash.material.opacity = 0;
  }
};

export const useAnimate = (sceneRef: SceneRefType<SceneRef>, paramsRef: RefObject<Params>) => {
  useSceneAnimation((time) => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    animate(refs, paramsRef.current, time);
    refs.core.renderer.render(refs.core.scene, refs.core.camera);
  });
};
