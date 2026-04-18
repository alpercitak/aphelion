import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, PointsMaterial } from 'three';

// Ejecta particle pool
const EJECTA_COUNT = 3000 as const;

// Element composition palette — oxygen (blue), silicon (orange), iron (gold), nickel (green)
const ELEMENT_COLOR_MAP = [
  [0.4, 0.6, 1.0], // oxygen — blue
  [1.0, 0.55, 0.2], // silicon — orange
  [1.0, 0.85, 0.2], // iron/nickel — gold
  [0.4, 1.0, 0.5], // radioactive nickel — green
  [1.0, 0.9, 0.7], // hydrogen envelope — warm white
];

// Ejecta particles — radial outward spray
export const createEjectaParticles = (): Points => {
  const pos = new Float32Array(EJECTA_COUNT * 3);
  const cols = new Float32Array(EJECTA_COUNT * 3);
  const vels = new Float32Array(EJECTA_COUNT * 3); // stored as normalised direction

  for (let i = 0; i < EJECTA_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const speed = 0.4 + Math.random() * 0.6; // velocity variation
    const dx = Math.sin(phi) * Math.cos(theta);
    const dy = Math.sin(phi) * Math.sin(theta);
    const dz = Math.cos(phi);

    // Store unit direction (position set by uniform scale)
    pos[i * 3] = dx * speed;
    pos[i * 3 + 1] = dy * speed;
    pos[i * 3 + 2] = dz * speed;

    vels[i * 3] = dx;
    vels[i * 3 + 1] = dy;
    vels[i * 3 + 2] = dz;

    const c = ELEMENT_COLOR_MAP[Math.floor(Math.random() * ELEMENT_COLOR_MAP.length)];
    cols[i * 3] = c?.[0] ?? 0;
    cols[i * 3 + 1] = c?.[1] ?? 0;
    cols[i * 3 + 2] = c?.[2] ?? 0;
  }

  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('color', new BufferAttribute(cols, 3));
  geo.setAttribute('velocity', new BufferAttribute(vels, 3)); // stored for reference

  return new Points(
    geo,
    new PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
};
