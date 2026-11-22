import { Mesh, MeshBasicMaterial, SphereGeometry } from 'three';
import { DONOR_COLOR, DONOR_FILL, DONOR_GLOW_COLOR, GLOW_SCALE, SEPARATION } from '../constants';
import type { Binary, Donor, Vec3 } from '../types';
import { createGlow } from './glow';
import { eggleton, lobeRadius } from './roche';

export const createDonor = (): Donor => {
  const geometry = new SphereGeometry(1, 96, 64);
  const mesh = new Mesh(geometry, new MeshBasicMaterial({ color: DONOR_COLOR }));
  const glow = createGlow(DONOR_GLOW_COLOR);
  mesh.add(glow);

  const position = geometry.getAttribute('position');
  const unit: Vec3[] = [];
  for (let i = 0; i < position.count; i++) {
    unit.push({ x: position.getX(i), y: position.getY(i), z: position.getZ(i) });
  }
  return { mesh, glow, unit };
};

/** Moves the surface onto the donor's Roche lobe and sizes the glow to the lobe. */
export const shapeDonor = ({ mesh, glow, unit }: Donor, binary: Binary) => {
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
  glow.scale.setScalar(eggleton(binary.q) * SEPARATION * GLOW_SCALE);
};
