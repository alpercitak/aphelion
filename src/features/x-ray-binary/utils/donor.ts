import { Color, Mesh, ShaderMaterial, SphereGeometry } from 'three';
import { DONOR_COLOR, DONOR_FILL, DONOR_GLOW_COLOR, DONOR_GLOW_SCALE, DONOR_LIMB_DARKENING } from '../constants';
import type { Binary, Donor, Vec3 } from '../types';
import { createGlow } from './glow';
import { lobeRadius } from './roche';

const VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

/** Linear limb darkening I(μ) = 1 − u(1 − μ), μ = cos of the angle between the normal and the line of sight. */
const FRAGMENT_SHADER = `
  uniform vec3 color;
  uniform float limbDarkening;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float mu = max(dot(normalize(vNormal), normalize(vView)), 0.0);
    gl_FragColor = vec4(color * (1.0 - limbDarkening * (1.0 - mu)), 1.0);
  }
`;

export const createDonor = (): Donor => {
  const geometry = new SphereGeometry(1, 96, 64);
  const material = new ShaderMaterial({
    uniforms: { color: { value: new Color(DONOR_COLOR) }, limbDarkening: { value: DONOR_LIMB_DARKENING } },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
  });
  const mesh = new Mesh(geometry, material);
  // The glow shares the reshaped surface, so it follows the teardrop toward L1
  const glow = createGlow(DONOR_GLOW_COLOR);
  glow.geometry.dispose();
  glow.geometry = geometry;
  glow.scale.setScalar(DONOR_GLOW_SCALE);
  mesh.add(glow);

  const position = geometry.getAttribute('position');
  const unit: Vec3[] = [];
  for (let i = 0; i < position.count; i++) {
    unit.push({ x: position.getX(i), y: position.getY(i), z: position.getZ(i) });
  }
  return { mesh, unit };
};

/** Moves the surface (and the glow that shares it) onto the donor's Roche lobe. */
export const shapeDonor = ({ mesh, unit }: Donor, binary: Binary) => {
  const maxR = Math.abs(binary.l1x - binary.x2);
  const { geometry } = mesh;
  const position = geometry.getAttribute('position');
  unit.forEach((d, i) => {
    const r = lobeRadius(binary, binary.x2, d, maxR) * DONOR_FILL;
    position.setXYZ(i, d.x * r, d.y * r, d.z * r);
  });
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();

  mesh.position.x = binary.x2;
};
