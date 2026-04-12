import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';

export const createMergerFlash = (): Mesh<PlaneGeometry, MeshBasicMaterial> => {
  const geo = new PlaneGeometry(200, 200);
  const mat = new MeshBasicMaterial({
    color: 0xffeedd,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    depthTest: false,
  });
  const mesh = new Mesh(geo, mat);
  mesh.renderOrder = 999; // render last so flash overlays everything
  return mesh;
};
