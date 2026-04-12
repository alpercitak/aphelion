import { BufferAttribute, BufferGeometry, Color, Points, PointsMaterial } from 'three';

const COUNT = 3000;

// "Other side" star field — different color temp for the destination
export const createDestinationStars = (color: number): Points => {
  const pos = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const base = new Color(color);

  for (let i = 0; i < COUNT; i++) {
    const r = 60 + Math.random() * 80;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
    const brightness = 0.4 + Math.random() * 0.6;
    colors[i * 3] = base.r * brightness;
    colors[i * 3 + 1] = base.g * brightness;
    colors[i * 3 + 2] = base.b * brightness;
  }

  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('color', new BufferAttribute(colors, 3));

  return new Points(
    geo,
    new PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    }),
  );
};
