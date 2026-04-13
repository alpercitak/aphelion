import { useEffect } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  Line,
  LineBasicMaterial,
  Points,
  PointsMaterial,
  Vector3,
} from 'three';
import type { CanvasRefType, SceneRefType } from '@/types';
import { massScale } from '@/utils/physics';
import { setupScene } from '@/utils/setup';
import { MAX_RADIUS, PARAMS, PARTICLE_POOL } from '../constants';
import type { Particle, SceneRef } from '../types';
import { createCentralBody } from '../utils/central-body';
import { createEjectaHaze } from '../utils/ejecta-haze';
import { spawnParticle } from '../utils/particle';
import { createOuterHalo, createPhotonGlow } from '../utils/photon-glow';

export const useInit = (canvasRef: CanvasRefType, sceneRef: SceneRefType<SceneRef>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const { renderer, scene, camera, orbit, stars, dispose } = setupScene({
      canvas,
      cameraPosition: [0, 3, 9],
      orbitOptions: { radius: 9, minRadius: 2.5, maxRadius: 30 },
      toneMappingExposure: 1.4,
    });

    const s = massScale(PARAMS.mass) * 0.9;
    const body = createCentralBody(PARAMS.mass);
    const photonGlow = createPhotonGlow(PARAMS.mass, camera.position);
    const outerHalo = createOuterHalo(PARAMS.mass, camera.position);
    const ejectaHaze = createEjectaHaze(PARAMS.mass);

    ejectaHaze.visible = PARAMS.showEjectaHaze;
    photonGlow.visible = PARAMS.showPhotonSphere;
    scene.add(body, photonGlow, outerHalo, ejectaHaze);

    // Particle system — fixed pool of positions updated each frame
    const particlePositions = new Float32Array(PARTICLE_POOL * 3);
    const particleColors = new Float32Array(PARTICLE_POOL * 3);
    const particleGeo = new BufferGeometry();
    particleGeo.setAttribute('position', new BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new BufferAttribute(particleColors, 3));

    const particlePoints = new Points(
      particleGeo,
      new PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(particlePoints);

    // trail lines group
    const trailGroup = new Group();
    scene.add(trailGroup);

    // initialise particle pool: spread outward from body
    const particles: Particle[] = Array.from({ length: PARTICLE_POOL }, () =>
      spawnParticle(PARAMS.ejectionVelocity * 0.12, PARAMS.temperature, s),
    );

    // stagger lifetimes so particles aren't all at the same radius on first frame
    particles.forEach((p) => {
      const t = Math.random();
      p.pos.add(p.vel.clone().multiplyScalar(t * MAX_RADIUS * 0.8));
      p.life = 1 - t;
    });

    // extract typed uniform refs
    const photonUniforms = photonGlow.material.uniforms as {
      viewVector: { value: Vector3 };
      glowColor: { value: Color };
    };
    const haloUniforms = outerHalo.material.uniforms as {
      viewVector: { value: Vector3 };
    };

    const core = { renderer, scene, camera, orbit, stars };
    const entities = {
      body,
      photonGlow,
      outerHalo,
      ejectaHaze,
      particleGeo,
      particlePoints,
      particles,
      trailGroup,
      photonUniforms,
      haloUniforms,
      bodyRadius: s,
    };

    sceneRef.current = { core, entities };

    return () => {
      const { entities } = sceneRef.current ?? {};
      if (entities) {
        entities.particleGeo.dispose();
        if (entities.particlePoints.material) {
          (entities.particlePoints.material as PointsMaterial).dispose();
        }
        entities.trailGroup.children.forEach((child) => {
          if (child instanceof Line) {
            child.geometry.dispose();
            (child.material as LineBasicMaterial).dispose();
          }
        });
        entities.particles = [];
      }
      dispose();
    };
  }, [canvasRef, sceneRef]);
};
