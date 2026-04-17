import { AdditiveBlending, CatmullRomCurve3, Mesh, MeshBasicMaterial, TubeGeometry, Vector3 } from 'three';
import { STRING_RADIUS } from '../constants';

const STEPS = 32 as const;

export const createCommutationLoop = (position: Vector3, radius: number): Mesh<TubeGeometry, MeshBasicMaterial> => {
  // Simple circle loop
  const loopPts: Array<Vector3> = [];
  for (let i = 0; i <= STEPS; i++) {
    const a = (i / STEPS) * Math.PI * 2;
    loopPts.push(new Vector3(position.x + Math.cos(a) * radius, position.y + Math.sin(a) * radius * 0.5, position.z));
  }
  const curve = new CatmullRomCurve3(loopPts, true);
  return new Mesh(
    new TubeGeometry(curve, 40, STRING_RADIUS * 0.8, 5, true),
    new MeshBasicMaterial({
      color: 0xaaddff,
      transparent: true,
      opacity: 0.9,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
};
