import { BufferAttribute, BufferGeometry, Points, PointsMaterial } from 'three';
import {
  BLUE_POLAR_HALF_ANGLE,
  BLUE_SPEED_RANGE,
  EJECTA_POINT_SIZE,
  RED_SPEED_RANGE,
  RED_TORUS_HALF_HEIGHT,
  SPEED_REF,
} from '../constants';
import type { EjectaCloud } from '../types';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const createEjectaCloud = (count: number, color: number): EjectaCloud => {
  const positions = new Float32Array(count * 3);
  const positionAttr = new BufferAttribute(positions, 3);
  const geo = new BufferGeometry();
  geo.setAttribute('position', positionAttr);

  const points = new Points(
    geo,
    new PointsMaterial({
      color,
      size: EJECTA_POINT_SIZE,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
  );
  points.visible = false;
  return { points, positions, positionAttr };
};

const writeParticle = (positions: Float32Array, i3: number, dx: number, dy: number, dz: number, speed: number) => {
  positions[i3] = dx * speed;
  positions[i3 + 1] = dy * speed;
  positions[i3 + 2] = dz * speed;
};

/** Lanthanide-poor ejecta: uniform in cos θ within BLUE_POLAR_HALF_ANGLE of the spin (y) axis, both poles. */
export const fillBlueEjecta = ({ positions, positionAttr }: EjectaCloud) => {
  const cosMin = Math.cos(BLUE_POLAR_HALF_ANGLE);
  for (let i3 = 0; i3 < positions.length; i3 += 3) {
    const cosT = lerp(cosMin, 1, Math.random()) * (Math.random() < 0.5 ? -1 : 1);
    const sinT = Math.sqrt(1 - cosT * cosT);
    const phi = Math.random() * Math.PI * 2;
    const speed = lerp(BLUE_SPEED_RANGE[0], BLUE_SPEED_RANGE[1], Math.random()) / SPEED_REF;
    writeParticle(positions, i3, sinT * Math.cos(phi), cosT, sinT * Math.sin(phi), speed);
  }
  positionAttr.needsUpdate = true;
};

/** Lanthanide-rich ejecta: a thin equatorial torus around the spin (y) axis. */
export const fillRedEjecta = ({ positions, positionAttr }: EjectaCloud) => {
  for (let i3 = 0; i3 < positions.length; i3 += 3) {
    const lat = lerp(-RED_TORUS_HALF_HEIGHT, RED_TORUS_HALF_HEIGHT, Math.random());
    const phi = Math.random() * Math.PI * 2;
    const speed = lerp(RED_SPEED_RANGE[0], RED_SPEED_RANGE[1], Math.random()) / SPEED_REF;
    writeParticle(positions, i3, Math.cos(lat) * Math.cos(phi), Math.sin(lat), Math.cos(lat) * Math.sin(phi), speed);
  }
  positionAttr.needsUpdate = true;
};
