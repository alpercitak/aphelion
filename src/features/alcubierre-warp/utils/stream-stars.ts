import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, PointsMaterial } from 'three';
import {
  STREAM_BOX_X,
  STREAM_BOX_YZ,
  STREAM_COLOR,
  STREAM_MIN_R,
  STREAM_SIZE,
  STREAM_SPEED_MAX,
  STREAM_SPEED_PER_C,
  STREAM_STAR_COUNT,
} from '../constants';
import type { StreamStars } from '../types';

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

/** Stars scattered in a box, rejecting any start inside the ship's radius. */
export const createStreamStars = (): StreamStars => {
  const positions = new BufferAttribute(new Float32Array(STREAM_STAR_COUNT * 3), 3);
  for (let i = 0; i < STREAM_STAR_COUNT; i++) {
    let x = 0;
    let y = 0;
    let z = 0;
    do {
      x = randomBetween(-STREAM_BOX_X, STREAM_BOX_X);
      y = randomBetween(-STREAM_BOX_YZ, STREAM_BOX_YZ);
      z = randomBetween(-STREAM_BOX_YZ, STREAM_BOX_YZ);
    } while (Math.hypot(x, y, z) < STREAM_MIN_R);
    positions.setXYZ(i, x, y, z);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', positions);
  const material = new PointsMaterial({
    color: STREAM_COLOR,
    size: STREAM_SIZE,
    sizeAttenuation: false,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  return { points: new Points(geometry, material), positions };
};

/** Moves the stars toward −x at the bubble's display speed and wraps them at the box edge. */
export const stepStreamStars = ({ positions }: StreamStars, velocity: number, dt: number) => {
  const step = Math.min(STREAM_SPEED_PER_C * velocity, STREAM_SPEED_MAX) * dt;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i) - step;
    positions.setX(i, x < -STREAM_BOX_X ? x + 2 * STREAM_BOX_X : x);
  }
  positions.needsUpdate = true;
};
