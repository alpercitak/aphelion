import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, PointsMaterial } from 'three';
import { NS_RADIUS } from '../constants';

const COUNT = 1200 as const;

// Particle halo around the star representing field energy density
export const createFieldHalo = (): Points => {
  const pos = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    const r = NS_RADIUS * 1.4 + Math.random() * NS_RADIUS * 2.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
    const brightness = Math.random() * 0.6;
    colors[i * 3] = 0.2 * brightness;
    colors[i * 3 + 1] = 0.4 * brightness;
    colors[i * 3 + 2] = brightness;
  }

  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('color', new BufferAttribute(colors, 3));

  return new Points(
    geo,
    new PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
};
