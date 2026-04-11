import { AdditiveBlending, DoubleSide, Mesh, MeshBasicMaterial, RingGeometry } from 'three';

const createPhotonRing = () =>
  new Mesh(
    new RingGeometry(1.48, 1.52, 256, 1),
    new MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      side: DoubleSide,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );

const createEinsteinRing = () =>
  new Mesh(
    new RingGeometry(1.2, 1.22, 256, 1),
    new MeshBasicMaterial({
      color: 0xffaa44,
      transparent: true,
      opacity: 0.5,
      side: DoubleSide,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );

export const createLensingRings = () => ({
  photonRing: createPhotonRing(),
  einsteinRing: createEinsteinRing(),
});
