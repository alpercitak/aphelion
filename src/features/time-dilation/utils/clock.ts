import {
  BufferGeometry,
  type Color,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  RingGeometry,
} from 'three';
import {
  CLOCK_HAND_LENGTH,
  CLOCK_HAND_WIDTH,
  CLOCK_RIM_RADIUS,
  CLOCK_RIM_WIDTH,
  CLOCK_TICK_INNER,
  CLOCK_TICK_OUTER,
  CLOCK_TICKS,
  PULSE_INTERVAL,
  TAU,
} from '../constants';
import type { Clock } from '../types';

/** A clock face in its own plane; the group is billboarded to the camera each frame. */
export const createClock = (bearing: number): Clock => {
  const group = new Group();

  const rim = new Mesh(
    new RingGeometry(CLOCK_RIM_RADIUS - CLOCK_RIM_WIDTH, CLOCK_RIM_RADIUS, 48),
    new MeshBasicMaterial(),
  );

  const tickPositions: Array<number> = [];
  for (let k = 0; k < CLOCK_TICKS; k++) {
    const angle = (k / CLOCK_TICKS) * TAU;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    tickPositions.push(CLOCK_TICK_INNER * c, CLOCK_TICK_INNER * s, 0, CLOCK_TICK_OUTER * c, CLOCK_TICK_OUTER * s, 0);
  }
  const ticks = new LineSegments(
    new BufferGeometry().setAttribute('position', new Float32BufferAttribute(tickPositions, 3)),
    new LineBasicMaterial(),
  );

  // pivot at the centre of the face
  const handGeometry = new PlaneGeometry(CLOCK_HAND_WIDTH, CLOCK_HAND_LENGTH).translate(0, CLOCK_HAND_LENGTH / 2, 0);
  const hand = new Mesh(handGeometry, new MeshBasicMaterial());

  group.add(rim, ticks, hand);
  return { bearing, angle: 0, tau: 0, nextTick: PULSE_INTERVAL, group, rim, ticks, hand };
};

export const setClockColor = (clock: Clock, color: Color) => {
  clock.rim.material.color.copy(color);
  clock.ticks.material.color.copy(color);
  clock.hand.material.color.copy(color);
};
