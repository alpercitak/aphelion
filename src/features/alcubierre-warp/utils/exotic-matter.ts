import { AdditiveBlending, Mesh, MeshBasicMaterial, TorusGeometry } from 'three';
import {
  EXOTIC_COLOR,
  EXOTIC_OPACITY,
  EXOTIC_RADIAL_SEGMENTS,
  EXOTIC_TUBE,
  EXOTIC_TUBULAR_SEGMENTS,
  EXOTIC_V_REF,
} from '../constants';
import type { Bubble } from '../types';

const createRing = ({ radius, sigma }: Bubble) =>
  new TorusGeometry(radius, EXOTIC_TUBE / sigma, EXOTIC_RADIAL_SEGMENTS, EXOTIC_TUBULAR_SEGMENTS);

/** Ring around the bubble waist, its axis along x. */
export const createExoticMatter = (bubble: Bubble): Mesh<TorusGeometry, MeshBasicMaterial> => {
  const mesh = new Mesh(
    createRing(bubble),
    new MeshBasicMaterial({ color: EXOTIC_COLOR, transparent: true, blending: AdditiveBlending, depthWrite: false }),
  );
  mesh.rotation.y = Math.PI / 2;
  return mesh;
};

/** Rebuilds the ring when its size changes; energy density scales with v_s², so opacity does too. */
export const updateExoticMatter = (mesh: Mesh<TorusGeometry, MeshBasicMaterial>, bubble: Bubble) => {
  mesh.geometry.dispose();
  mesh.geometry = createRing(bubble);
  mesh.material.opacity = EXOTIC_OPACITY * Math.min(1, (bubble.velocity / EXOTIC_V_REF) ** 2);
};
