import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from 'three';

const VECTOR3_UP = new Vector3(0, 1, 0);
const SAMPLE_COUNT = 20;

// Cone wireframe — visual representation of conical spacetime geometry
export const createConeMesh = (curve: CatmullRomCurve3, density: number): Mesh<BufferGeometry, MeshBasicMaterial> => {
  // Sample points along curve and emit thin cone lines outward
  const coneLength = 1.5 * density;
  const positions: Array<number> = [];

  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const t = i / SAMPLE_COUNT;
    const pt = curve.getPoint(t);
    const tan = curve.getTangent(t).normalize();
    // Perpendicular plane: two directions
    const perp1 = new Vector3().crossVectors(tan, VECTOR3_UP).normalize();
    const perp2 = new Vector3().crossVectors(tan, perp1).normalize();

    for (let j = 0; j < 8; j++) {
      const angle = (j / 8) * Math.PI * 2;
      const dir = perp1
        .clone()
        .multiplyScalar(Math.cos(angle))
        .add(perp2.clone().multiplyScalar(Math.sin(angle)));
      const end = pt.clone().add(dir.multiplyScalar(coneLength));
      positions.push(pt.x, pt.y, pt.z, end.x, end.y, end.z);
    }
  }

  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
  return new Mesh(
    geo,
    new MeshBasicMaterial({
      color: 0x334466,
      transparent: true,
      opacity: 0.08,
      blending: AdditiveBlending,
      depthWrite: false,
      wireframe: true,
    }),
  );
};
