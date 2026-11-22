import { AdditiveBlending, DoubleSide, Mesh, MeshBasicMaterial, RingGeometry, type Scene } from 'three';
import { RING_COLOR, RING_MAX_RADIUS, RING_OPACITY, RING_SPEED } from '../constants';

export const createWaveRing = (scene: Scene, radius: number) => {
  const mesh = new Mesh(
    new RingGeometry(0.98, 1, 180),
    new MeshBasicMaterial({
      color: RING_COLOR,
      transparent: true,
      opacity: RING_OPACITY,
      side: DoubleSide,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.scale.setScalar(radius);
  scene.add(mesh);
  return mesh;
};

/** Expands each ring in the orbital (x–z) plane, fades it, and disposes the ones that have faded out. */
export const updateWaveRings = (scene: Scene, rings: Array<Mesh<RingGeometry, MeshBasicMaterial>>, dt: number) => {
  for (let i = rings.length - 1; i >= 0; i--) {
    const ring = rings[i];
    if (!ring) {
      continue;
    }
    ring.scale.addScalar(RING_SPEED * dt);
    ring.material.opacity = Math.max(0, RING_OPACITY * (1 - ring.scale.x / RING_MAX_RADIUS));
    if (ring.material.opacity <= 0) {
      disposeRing(scene, ring);
      rings.splice(i, 1);
    }
  }
};

export const clearWaveRings = (scene: Scene, rings: Array<Mesh<RingGeometry, MeshBasicMaterial>>) => {
  for (const ring of rings) {
    disposeRing(scene, ring);
  }
  rings.length = 0;
};

const disposeRing = (scene: Scene, ring: Mesh<RingGeometry, MeshBasicMaterial>) => {
  scene.remove(ring);
  ring.geometry.dispose();
  ring.material.dispose();
};
