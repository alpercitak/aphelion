import { AdditiveBlending, DoubleSide, Mesh, RingGeometry } from 'three';
import type { TypedShaderMaterial } from '@/types';
import { createShaderMaterial } from '@/utils/shader';
import type { LensingUniforms } from '../types';

// Lensing distortion rings — radial displacement via UV distortion baked into geometry
// Screen-space post-processing is out of scope v1; approximated with displaced ring meshes
const VERTEX_SHADER = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform float opacity;
  void main() {
    gl_FragColor = vec4(0.6, 0.8, 1.0, opacity);
  }
`;

const COUNT = 5;

// Lensing rings — concentric rings that approximate light bending near throat
export const createLensingRings = (
  throatRadius: number,
  strength: number,
): Array<Mesh<RingGeometry, TypedShaderMaterial<LensingUniforms>>> => {
  const rings: Array<Mesh<RingGeometry, TypedShaderMaterial<LensingUniforms>>> = [];
  for (let i = 0; i < COUNT; i++) {
    const t = (i + 1) / COUNT;
    const r = throatRadius * (1.05 + t * strength * 0.8);
    const w = throatRadius * 0.006;
    const geo = new RingGeometry(r, r + w, 128, 1);
    const mat = createShaderMaterial({
      uniforms: { opacity: { value: (1 - t) * 0.6 * strength } },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
      blending: AdditiveBlending,
    });
    const mesh = new Mesh(geo, mat);
    rings.push(mesh);
  }
  return rings;
};
