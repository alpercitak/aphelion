import { Mesh, MeshBasicMaterial, SphereGeometry } from 'three';

export const createEventHorizon = (): Mesh<SphereGeometry, MeshBasicMaterial> =>
  new Mesh(new SphereGeometry(1, 48, 48), new MeshBasicMaterial({ color: 0x000000 }));
