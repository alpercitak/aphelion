import { BufferAttribute, BufferGeometry, Points, PointsMaterial } from 'three';
import { STAR_COUNT_MAP } from '../constants';
import type { BackgroundDensity } from '../types';

// star color palette: blue giants, white dwarfs, orange giants, red dwarfs
const PALETTE = [
  [0.5, 0.6, 1.0], // blue-white
  [1.0, 1.0, 1.0], // white
  [1.0, 0.95, 0.8], // warm white
  [1.0, 0.8, 0.5], // orange
  [0.7, 0.8, 1.0], // pale blue
];

export const createBackground = (density: BackgroundDensity): Points => {
  const count = STAR_COUNT_MAP[density];
  const pos = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    // Distribute across a flat plane at z=-5 (background)
    pos[i * 3] = (Math.random() - 0.5) * 30;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
    pos[i * 3 + 2] = -5 + (Math.random() - 0.5) * 0.5;

    const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const br = 0.5 + Math.random() * 0.5;
    colors[i * 3] = c?.[0]! * br;
    colors[i * 3 + 1] = c?.[1]! * br;
    colors[i * 3 + 2] = c?.[2]! * br;
  }

  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('color', new BufferAttribute(colors, 3));

  return new Points(
    geo,
    new PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    }),
  );
};
