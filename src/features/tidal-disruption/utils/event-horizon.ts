import { Mesh, MeshBasicMaterial, SphereGeometry } from 'three';

export const createEventHorizon = () => {
  const geo = new SphereGeometry(1, 64, 64);
  const mat = new MeshBasicMaterial({ color: 0x000000 });
  return new Mesh(geo, mat);
};
