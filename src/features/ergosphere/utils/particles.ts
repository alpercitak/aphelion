import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, PointsMaterial } from 'three';
import { EQUATOR_BAND, KIND, PARTICLE_COUNT, PARTICLE_TOTAL, SPAWN_R_MAX, SPAWN_R_MIN } from '../constants';
import type { ParticleSystem } from '../types';
import { circularAngularMomentum, turningPointEnergy } from './kerr';

const randomIn = (min: number, max: number) => min + (max - min) * Math.random();

/**
 * Places a NORMAL particle on a bound geodesic at a random radius in [rMin, rMax] inside the equatorial band. It
 * starts at a radial and polar turning point (ṙ = θ̇ = 0): L = frac · L_pro(r), E is the larger root of R(r) = 0, and Q
 * follows from θ. Spin changes do not reset particles, so E, L and Q keep the spin they were drawn with.
 */
export const respawnParticle = (sys: ParticleSystem, i: number, rMin: number, rMax: number, a: number) => {
  let r = 0;
  let theta = 0;
  let frac = 0;
  let l = 0;
  let e = 0;
  // Redraw while there is no real root (e.g. L_pro is NaN inside the prograde photon orbit) or E <= 0.
  do {
    r = randomIn(rMin, rMax);
    theta = Math.PI / 2 + randomIn(-EQUATOR_BAND, EQUATOR_BAND);
    frac = randomIn(-1, 1);
    l = frac * circularAngularMomentum(r, a);
    e = turningPointEnergy(r, theta, a, l);
  } while (!(e > 0));

  sys.r[i] = r;
  sys.theta[i] = theta;
  sys.phi[i] = randomIn(0, Math.PI * 2);
  sys.rDot[i] = 0;
  sys.thetaDot[i] = 0;
  sys.energy[i] = e;
  sys.angMom[i] = l;
  sys.carter[i] = Math.cos(theta) ** 2 * (a * a * (1 - e * e) + (l * l) / Math.sin(theta) ** 2);
  sys.frac[i] = frac;
  sys.kind[i] = KIND.NORMAL;
};

export const resetParticles = (sys: ParticleSystem, a: number) => {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    respawnParticle(sys, i, SPAWN_R_MIN, SPAWN_R_MAX, a);
  }
  for (let i = PARTICLE_COUNT; i < PARTICLE_TOTAL; i++) {
    sys.kind[i] = KIND.DORMANT;
  }
  sys.colors.fill(0, PARTICLE_COUNT * 3);
  sys.colorAttr.needsUpdate = true;
};

export const createParticleSystem = (a: number): ParticleSystem => {
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
      size: 0.16,
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
    rDot: new Float64Array(PARTICLE_TOTAL),
    thetaDot: new Float64Array(PARTICLE_TOTAL),
    energy: new Float64Array(PARTICLE_TOTAL),
    angMom: new Float64Array(PARTICLE_TOTAL),
    carter: new Float64Array(PARTICLE_TOTAL),
    frac: new Float64Array(PARTICLE_TOTAL),
    kind: new Uint8Array(PARTICLE_TOTAL).fill(KIND.DORMANT),
  };
  resetParticles(sys, a);
  return sys;
};
