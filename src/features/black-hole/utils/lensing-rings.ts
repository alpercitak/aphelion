import { AdditiveBlending, DoubleSide, Mesh, MeshBasicMaterial, RingGeometry, type ColorRepresentation } from 'three';

const createMesh = (color: ColorRepresentation, opacity: number) =>
  new MeshBasicMaterial({
    color,
    opacity,
    transparent: true,
    side: DoubleSide,
    blending: AdditiveBlending,
    depthWrite: false,
  });

const createPhotonRing = (): Mesh<RingGeometry, MeshBasicMaterial> =>
  new Mesh(new RingGeometry(1.48, 1.52, 256, 1), createMesh(0xffffff, 0.9));

const createEinsteinRing = (): Mesh<RingGeometry, MeshBasicMaterial> =>
  new Mesh(new RingGeometry(1.2, 1.22, 256, 1), createMesh(0xffaa44, 0.5));

export const createLensingRings = () => ({
  photonRing: createPhotonRing(),
  einsteinRing: createEinsteinRing(),
});
