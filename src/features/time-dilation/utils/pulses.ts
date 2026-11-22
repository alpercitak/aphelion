import { AdditiveBlending, BufferAttribute, BufferGeometry, type Color, Points, PointsMaterial } from 'three';
import { CLOCK_LIFT, PULSE_COUNT, PULSE_MAX_RADIUS, PULSE_SIZE, PULSE_SPEED } from '../constants';
import type { Pulse, Pulses } from '../types';
import { surfaceHeight } from './physics';

export const createPulses = (): Pulses => {
  const positions = new BufferAttribute(new Float32Array(PULSE_COUNT * 3), 3);
  // free pulses stay black, which is invisible under additive blending
  const colors = new BufferAttribute(new Float32Array(PULSE_COUNT * 3), 3);
  const geometry = new BufferGeometry().setAttribute('position', positions).setAttribute('color', colors);
  const points = new Points(
    geometry,
    new PointsMaterial({
      size: PULSE_SIZE,
      sizeAttenuation: false,
      vertexColors: true,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
  points.frustumCulled = false;

  const list = Array.from({ length: PULSE_COUNT }, (): Pulse => ({ active: false, r: 0, bearing: 0 }));
  return { points, positions, colors, list };
};

const place = ({ positions }: Pulses, i: number, { r, bearing }: Pulse) => {
  positions.setXYZ(i, r * Math.cos(bearing), surfaceHeight(r) + CLOCK_LIFT, r * Math.sin(bearing));
};

/** Starts a pulse at radius r on the given azimuth. Does nothing if the pool is full. */
export const emitPulse = (pulses: Pulses, r: number, bearing: number, color: Color) => {
  for (const [i, pulse] of pulses.list.entries()) {
    if (pulse.active) {
      continue;
    }
    pulse.active = true;
    pulse.r = r;
    pulse.bearing = bearing;
    place(pulses, i, pulse);
    pulses.colors.setXYZ(i, color.r, color.g, color.b);
    return;
  }
};

/** Moves active pulses outward by dt (already scaled by the time rate) and frees those past PULSE_MAX_RADIUS. */
export const stepPulses = (pulses: Pulses, dt: number) => {
  const { list, colors } = pulses;
  list.forEach((pulse, i) => {
    if (!pulse.active) {
      return;
    }
    pulse.r += PULSE_SPEED * (1 - 1 / pulse.r) * dt;
    if (pulse.r > PULSE_MAX_RADIUS) {
      pulse.active = false;
      colors.setXYZ(i, 0, 0, 0);
      return;
    }
    place(pulses, i, pulse);
  });
  pulses.positions.needsUpdate = true;
  colors.needsUpdate = true;
};

export const clearPulses = (pulses: Pulses) => {
  pulses.list.forEach((pulse, i) => {
    pulse.active = false;
    pulses.colors.setXYZ(i, 0, 0, 0);
  });
  pulses.colors.needsUpdate = true;
};
