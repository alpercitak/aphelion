import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';

export const createGammaBurstFlash = (): Mesh<PlaneGeometry, MeshBasicMaterial> => {
  const mesh = new Mesh(
    new PlaneGeometry(200, 200),
    new MeshBasicMaterial({
      color: 0xddeeff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: false,
    }),
  );
  mesh.renderOrder = 999; // render last — overlays everything
  return mesh;
};
