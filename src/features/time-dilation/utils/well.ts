import {
  AdditiveBlending,
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  RingGeometry,
  SphereGeometry,
} from 'three';
import {
  BLACK_HOLE_RADIUS,
  PHOTON_RING_COLOR,
  PHOTON_RING_OPACITY,
  PHOTON_RING_WIDTH,
  PHOTON_SPHERE_RADIUS,
  R_EDGE,
  TAU,
  WELL_COLOR,
  WELL_RING_SEGMENTS,
  WELL_RINGS,
  WELL_SPOKE_SAMPLES,
  WELL_SPOKES,
} from '../constants';
import { surfaceHeight } from './physics';

/** Radius on the grid for u ∈ [0, 1], denser near the hole. */
const gridRadius = (u: number) => 1 + (R_EDGE - 1) * u * u;

const pushPoint = (positions: Array<number>, r: number, angle: number) => {
  positions.push(r * Math.cos(angle), surfaceHeight(r), r * Math.sin(angle));
};

/** Rings and spokes on Flamm's paraboloid. Does not depend on the params, so it is built once. */
export const createWell = () => {
  const positions: Array<number> = [];

  for (let i = 1; i <= WELL_RINGS; i++) {
    const r = gridRadius(i / WELL_RINGS);
    for (let s = 0; s < WELL_RING_SEGMENTS; s++) {
      pushPoint(positions, r, (s / WELL_RING_SEGMENTS) * TAU);
      pushPoint(positions, r, ((s + 1) / WELL_RING_SEGMENTS) * TAU);
    }
  }

  for (let k = 0; k < WELL_SPOKES; k++) {
    const angle = (k / WELL_SPOKES) * TAU;
    for (let s = 0; s < WELL_SPOKE_SAMPLES; s++) {
      pushPoint(positions, gridRadius(s / WELL_SPOKE_SAMPLES), angle);
      pushPoint(positions, gridRadius((s + 1) / WELL_SPOKE_SAMPLES), angle);
    }
  }

  const geometry = new BufferGeometry().setAttribute('position', new Float32BufferAttribute(positions, 3));
  return new LineSegments(geometry, new LineBasicMaterial({ color: WELL_COLOR }));
};

/** Black sphere whose equator is the horizon circle at the paraboloid's throat (r = Rₛ). */
export const createBlackHole = () => {
  const hole = new Mesh(new SphereGeometry(BLACK_HOLE_RADIUS, 48, 32), new MeshBasicMaterial({ color: 0x000000 }));
  hole.position.y = surfaceHeight(BLACK_HOLE_RADIUS);
  return hole;
};

/** Faint ring at the photon sphere, lying flat on the well. */
export const createPhotonRing = () => {
  const ring = new Mesh(
    new RingGeometry(PHOTON_SPHERE_RADIUS - PHOTON_RING_WIDTH / 2, PHOTON_SPHERE_RADIUS + PHOTON_RING_WIDTH / 2, 128),
    new MeshBasicMaterial({
      color: PHOTON_RING_COLOR,
      transparent: true,
      opacity: PHOTON_RING_OPACITY,
      side: DoubleSide,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = surfaceHeight(PHOTON_SPHERE_RADIUS);
  return ring;
};
