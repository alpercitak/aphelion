import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, PointsMaterial } from 'three';
import { EQUATOR_BAND, KIND, PARTICLE_COUNT, PARTICLE_TOTAL, SPAWN_R_MAX, SPAWN_R_MIN } from '../constants';
import type { ParticleSystem } from '../types';

const randomIn = (min: number, max: number) => min + (max - min) * Math.random();

/** Places a particle at a random radius in [rMin, rMax] inside the equatorial band, with a random own velocity. */
export const respawnParticle = (sys: ParticleSystem, i: number, rMin: number, rMax: number) => {
  sys.r[i] = randomIn(rMin, rMax);
  sys.theta[i] = Math.PI / 2 + randomIn(-EQUATOR_BAND, EQUATOR_BAND);
  sys.phi[i] = randomIn(0, Math.PI * 2);
  sys.frac[i] = randomIn(-1, 1);
  sys.kind[i] = KIND.NORMAL;
};

export const resetParticles = (sys: ParticleSystem) => {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    respawnParticle(sys, i, SPAWN_R_MIN, SPAWN_R_MAX);
  }
  for (let i = PARTICLE_COUNT; i < PARTICLE_TOTAL; i++) {
    sys.kind[i] = KIND.DORMANT;
  }
  sys.colors.fill(0, PARTICLE_COUNT * 3);
  sys.colorAttr.needsUpdate = true;
};

export const createParticleSystem = (): ParticleSystem => {
  const positions = new Float32Array(PARTICLE_TOTAL * 3);
  const colors = new Float32Array(PARTICLE_TOTAL * 3);
  const positionAttr = new BufferAttribute(positions, 3);
  const colorAttr = new BufferAttribute(colors, 3);

  const geo = new BufferGeometry();
  geo.setAttribute('position', positionAttr);
  geo.setAttribute('color', colorAttr);

  const points = new Points(
    geo,
    new PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
  points.frustumCulled = false;

  const sys: ParticleSystem = {
    points,
    positions,
    colors,
    positionAttr,
    colorAttr,
    r: new Float64Array(PARTICLE_TOTAL),
    theta: new Float64Array(PARTICLE_TOTAL),
    phi: new Float64Array(PARTICLE_TOTAL),
    frac: new Float64Array(PARTICLE_TOTAL),
    kind: new Uint8Array(PARTICLE_TOTAL).fill(KIND.DORMANT),
  };
  resetParticles(sys);
  return sys;
};
