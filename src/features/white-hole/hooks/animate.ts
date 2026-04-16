import type { RefObject } from 'react';
import { AdditiveBlending, BufferAttribute, BufferGeometry, Line, LineBasicMaterial } from 'three';
import { useSceneAnimation } from '@/hooks/scene-animation';
import type { SceneRefType } from '@/types';
import { EJECTION_RATE_MAP, MAX_RADIUS } from '../constants';
import type { SceneParams, SceneRef } from '../types';
import { spawnParticle } from '../utils/particle';

const animate = (refs: SceneRef, params: SceneParams, time: number) => {
  const { core, entities } = refs;
  const { camera, orbit, stars } = core;
  const { photonUniforms, haloUniforms, ejectaHaze, particleGeo, outerHalo, trailGroup } = entities;

  orbit.updateCamera(camera);
  stars!.rotation.y = time * 0.002;

  // Update glow view vectors
  photonUniforms.viewVector.value.copy(camera.position);
  haloUniforms.viewVector.value.copy(camera.position);

  // Slowly pulse outer halo
  haloUniforms.viewVector.value.copy(camera.position);
  const pulse = 1.0 + Math.sin(time * 1.3) * 0.04;
  outerHalo.scale.setScalar(pulse);

  // Ejecta haze drift
  if (params.showEjectaHaze) {
    ejectaHaze.rotation.y = time * 0.04;
    ejectaHaze.rotation.x = time * 0.02;
  }

  // ── Particle update ─────────────────────────────────────────────────
  const speed = params.ejectionVelocity * 0.12;
  const spawnCount = EJECTION_RATE_MAP[params.ejectionRate];
  const posAttr = particleGeo.attributes['position'] as BufferAttribute;
  const colAttr = particleGeo.attributes['color'] as BufferAttribute;

  // Decay factor — faster particles decay sooner visually
  const decayRate = 0.004 + speed * 0.006;
  let spawnBudget = spawnCount;

  refs.entities.particles.forEach((particle, i) => {
    particle.prevPos.copy(particle.pos);
    particle.pos.addScaledVector(particle.vel, 1);
    particle.life -= decayRate;

    // Respawn when dead or out of range
    const dist = particle.pos.length();
    if (particle.life <= 0 || dist > MAX_RADIUS) {
      // Remove old trail
      if (particle.trailLine) {
        trailGroup.remove(particle.trailLine);
        particle.trailLine.geometry.dispose();
        particle.trailLine.material.dispose();
        particle.trailLine = null;
      }
      if (spawnBudget > 0) {
        const fresh = spawnParticle(speed, params.temperature, refs.entities.bodyRadius);
        refs.entities.particles[i] = fresh;
        spawnBudget--;
      } else {
        // Park out of view until next spawn budget
        particle.pos.set(0, 0, 0);
        particle.life = 0;
      }
      return;
    }

    // Write position
    posAttr.setXYZ(i, particle.pos.x, particle.pos.y, particle.pos.z);

    // Color fades with life and distance
    const fade = particle.life * (1 - dist / MAX_RADIUS);
    colAttr.setXYZ(i, particle.color.r * fade, particle.color.g * fade, particle.color.b * fade);

    // Trail line update
    if (params.showTrails) {
      if (!particle.trailLine) {
        const trailGeo = new BufferGeometry().setFromPoints([particle.prevPos.clone(), particle.pos.clone()]);
        const trailMat = new LineBasicMaterial({
          color: particle.color,
          transparent: true,
          opacity: 0.4,
          blending: AdditiveBlending,
          depthWrite: false,
        });
        particle.trailLine = new Line(trailGeo, trailMat);
        trailGroup.add(particle.trailLine);
      } else {
        // Update trail endpoints
        const pts = particle.trailLine.geometry.attributes['position'] as BufferAttribute;
        pts.setXYZ(0, particle.prevPos.x, particle.prevPos.y, particle.prevPos.z);
        pts.setXYZ(1, particle.pos.x, particle.pos.y, particle.pos.z);
        pts.needsUpdate = true;
        (particle.trailLine.material as LineBasicMaterial).opacity = particle.life * 0.45;
      }
    } else if (particle.trailLine) {
      // Trails toggled off — remove existing
      trailGroup.remove(particle.trailLine);
      particle.trailLine.geometry.dispose();
      particle.trailLine.material.dispose();
      particle.trailLine = null;
    }
  });

  posAttr.needsUpdate = true;
  colAttr.needsUpdate = true;
};

export const useAnimate = (sceneRef: SceneRefType<SceneRef>, paramsRef: RefObject<SceneParams>) => {
  useSceneAnimation((time) => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    animate(refs, paramsRef.current, time);
    refs.core.renderer.render(refs.core.scene, refs.core.camera);
  });
};
