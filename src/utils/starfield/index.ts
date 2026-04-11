import { BufferAttribute, BufferGeometry, PointsMaterial, Points } from 'three';

// --- Star Field Configuration ---
const DEFAULT_STAR_COUNT = 4000;
const STAR_MIN_RADIUS = 80;
const STAR_MAX_RADIUS = 200;
const STAR_RADIUS_RANGE = STAR_MAX_RADIUS - STAR_MIN_RADIUS;

// --- Material Configuration ---
const STAR_SIZE = 0.18;
const STAR_OPACITY = 0.85;

// --- Colors ---
const STAR_PALETTES: Array<[number, number, number]> = [
  [0.6, 0.7, 1.0], // Bluish
  [1.0, 1.0, 1.0], // White
  [1.0, 0.9, 0.7], // Yellowish
  [1.0, 0.7, 0.5], // Orange-Red
  [0.7, 0.8, 1.0], // Soft Blue
] as const;

/**
 * Creates a spherical field of stars as a THREE.Points object.
 */
export const createStarField = (count: number = DEFAULT_STAR_COUNT): Points => {
  const geo = new BufferGeometry();

  // 3 coordinates (x, y, z) and 3 color values (r, g, b) per star
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // --- Spherical Distribution Math ---
    // Uniform distribution on a sphere surface or volume
    const r = STAR_MIN_RADIUS + Math.random() * STAR_RADIUS_RANGE;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    // Convert Spherical to Cartesian
    const sinPhi = Math.sin(phi);
    positions[i3] = r * sinPhi * Math.cos(theta); // x
    positions[i3 + 1] = r * sinPhi * Math.sin(theta); // y
    positions[i3 + 2] = r * Math.cos(phi); // z

    // --- Color Selection ---
    const paletteIndex = Math.floor(Math.random() * STAR_PALETTES.length);
    const [r_col, g_col, b_col] = STAR_PALETTES[paletteIndex]!;

    colors[i3] = r_col;
    colors[i3 + 1] = g_col;
    colors[i3 + 2] = b_col;
  }

  geo.setAttribute('position', new BufferAttribute(positions, 3));
  geo.setAttribute('color', new BufferAttribute(colors, 3));

  const mat = new PointsMaterial({
    size: STAR_SIZE,
    vertexColors: true,
    transparent: true,
    opacity: STAR_OPACITY,
    sizeAttenuation: true,
  });

  return new Points(geo, mat);
};
