import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, PointsMaterial } from 'three';

const COUNT = 600 as const;

// Neutrino burst — sparse fast outward particles
export const createNeutrinoParticles = (): Points => {
  const pos = new Float32Array(COUNT * 3);
  const cols = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    // All start at origin — driven by uniform scale in loop
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = Math.cos(phi);
    cols[i * 3] = 0.4 + Math.random() * 0.3;
    cols[i * 3 + 1] = 0.6 + Math.random() * 0.3;
    cols[i * 3 + 2] = 1.0;
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('color', new BufferAttribute(cols, 3));
  return new Points(
    geo,
    new PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
};
