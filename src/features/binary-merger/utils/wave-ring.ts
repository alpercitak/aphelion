import {
  AdditiveBlending,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  RingGeometry,
  type MeshBasicMaterialParameters,
} from 'three';

const BASE_OPACITY = 0.7;

const MATERIAL_PARAMS = {
  color: 0x4fc3f7,
  transparent: true,
  opacity: BASE_OPACITY,
  side: DoubleSide,
  blending: AdditiveBlending,
  depthWrite: false,
} as const satisfies MeshBasicMaterialParameters;

export const createWaveRing = (radius = 0.5): Mesh<RingGeometry, MeshBasicMaterial> => {
  const geo = new RingGeometry(radius, radius + 0.06, 180, 1);
  const mat = new MeshBasicMaterial(MATERIAL_PARAMS);
  const mesh = new Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.userData = { born: performance.now(), baseOpacity: BASE_OPACITY };
  return mesh;
};
