import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, PointsMaterial } from 'three';
import { tempToColor } from '@/utils/physics';
import { DEBRIS_HOT_GAIN, DEBRIS_POINT_SIZE, PARTICLE, STAR_RADIUS_VISUAL } from '../constants';
import type { DebrisSystem } from '../types';

const T_MIN = 3000;
const T_MAX = 25000;
const LUT_SIZE = 64;

// Precomputed tempToColor samples so the per-frame color update does not allocate
const TEMPERATURE_LUT = new Float32Array(LUT_SIZE * 3);
for (let i = 0; i < LUT_SIZE; i++) {
  const c = tempToColor(T_MIN + ((T_MAX - T_MIN) * i) / (LUT_SIZE - 1));
  TEMPERATURE_LUT[i * 3] = c.r;
  TEMPERATURE_LUT[i * 3 + 1] = c.g;
  TEMPERATURE_LUT[i * 3 + 2] = c.b;
}

/** Debris temperature (K): hottest at periapsis, cooling with distance. */
export const debrisTemperature = (r: number, periapsis: number) =>
  T_MIN + (T_MAX - T_MIN) * Math.min(1, periapsis / r) ** 1.5;

/** Writes the blackbody color for a temperature into the color buffer at index i3, brighter when hotter. */
export const writeColor = (colors: Float32Array, i3: number, kelvin: number) => {
  const t = Math.min(1, Math.max(0, (kelvin - T_MIN) / (T_MAX - T_MIN)));
  const idx = Math.round(t * (LUT_SIZE - 1)) * 3;
  const gain = 1 + (DEBRIS_HOT_GAIN - 1) * t;
  colors[i3] = (TEMPERATURE_LUT[idx] ?? 0) * gain;
  colors[i3 + 1] = (TEMPERATURE_LUT[idx + 1] ?? 0) * gain;
  colors[i3 + 2] = (TEMPERATURE_LUT[idx + 2] ?? 0) * gain;
};

/** Uniformly distributed offsets inside the star's visual sphere. */
const fillStarOffsets = (offsets: Float32Array) => {
  for (let i3 = 0; i3 < offsets.length; i3 += 3) {
    const cosT = 2 * Math.random() - 1;
    const sinT = Math.sqrt(1 - cosT * cosT);
    const phi = Math.random() * Math.PI * 2;
    const r = STAR_RADIUS_VISUAL * Math.cbrt(Math.random());
    offsets[i3] = r * sinT * Math.cos(phi);
    offsets[i3 + 1] = r * sinT * Math.sin(phi);
    offsets[i3 + 2] = r * cosT;
  }
};

export const createDebrisSystem = (count: number): DebrisSystem => {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const positionAttr = new BufferAttribute(positions, 3);
  const colorAttr = new BufferAttribute(colors, 3);

  const geo = new BufferGeometry();
  geo.setAttribute('position', positionAttr);
  geo.setAttribute('color', colorAttr);

  const points = new Points(
    geo,
    new PointsMaterial({
      size: DEBRIS_POINT_SIZE,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
  points.frustumCulled = false;

  const offsets = new Float32Array(count * 3);
  fillStarOffsets(offsets);

  return {
    points,
    positions,
    colors,
    positionAttr,
    colorAttr,
    offsets,
    velocities: new Float32Array(count * 3),
    status: new Uint8Array(count).fill(PARTICLE.STAR),
  };
};
