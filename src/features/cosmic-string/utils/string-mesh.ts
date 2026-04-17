import { AdditiveBlending, DoubleSide, Mesh, MeshBasicMaterial, TubeGeometry, type CatmullRomCurve3 } from 'three';

// Generate oscillating control points for the string
export const createStringMesh = (
  curve: CatmullRomCurve3,
  radius: number,
  color: number,
  opacity: number,
): Mesh<TubeGeometry, MeshBasicMaterial> =>
  new Mesh(
    new TubeGeometry(curve, 120, radius, 6, false),
    new MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      blending: AdditiveBlending,
      depthWrite: false,
      side: DoubleSide,
    }),
  );
