import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, PointsMaterial } from 'three';

// Exotic matter halo — violet/purple particle ring
export const createExoticHalo = (throatRadius: number, density: number): Points => {
  const count = Math.floor(800 * density + 200);
  const pos = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    // Torus-shaped distribution around the throat
    const angle = Math.random() * Math.PI * 2;
    const spread = (Math.random() - 0.5) * throatRadius * 0.6;
    const r = throatRadius * (1.0 + Math.random() * 0.5);
    const y = (Math.random() - 0.5) * throatRadius * 0.4;
    pos[i * 3] = Math.cos(angle) * (r + spread * 0.3);
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = Math.sin(angle) * (r + spread * 0.3);
    // Purple-violet spectrum
    const t = Math.random();
    colors[i * 3] = 0.5 + t * 0.3; // R
    colors[i * 3 + 1] = 0.1 + t * 0.1; // G
    colors[i * 3 + 2] = 0.8 + t * 0.2; // B
  }

  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('color', new BufferAttribute(colors, 3));

  return new Points(
    geo,
    new PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.5 * density,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
};
