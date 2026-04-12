import { AdditiveBlending, BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments, Vector3 } from 'three';
import { NS_RADIUS } from '../constants';

// Starquake crack — LineSegments radiating from a point on the sphere surface
export const createStarquakeCrack = (origin: Vector3): LineSegments => {
  const segments = 6 + Math.floor(Math.random() * 6);
  const positions: number[] = [];
  const spread = 0.6 + Math.random() * 0.8;

  for (let i = 0; i < segments; i++) {
    // Each crack arm radiates from origin, branching slightly
    const theta = (i / segments) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
    const length = spread * (0.5 + Math.random() * 0.5);
    // Tangent direction on sphere surface
    const tangent = new Vector3(
      Math.cos(theta) * (1 - Math.abs(origin.y)),
      Math.sin(theta) * 0.4,
      Math.sin(theta) * (1 - Math.abs(origin.z)),
    )
      .normalize()
      .multiplyScalar(length * NS_RADIUS);

    const end = origin
      .clone()
      .add(tangent)
      .normalize()
      .multiplyScalar(NS_RADIUS * 1.01);
    positions.push(origin.x, origin.y, origin.z, end.x, end.y, end.z);

    // Secondary branch
    if (Math.random() > 0.4) {
      const branchTheta = theta + (Math.random() - 0.5) * 0.6;
      const branchLen = length * 0.5 * Math.random();
      const mid = origin.clone().add(tangent.clone().multiplyScalar(0.5));
      const branch = new Vector3(Math.cos(branchTheta), Math.sin(branchTheta) * 0.4, Math.sin(branchTheta))
        .normalize()
        .multiplyScalar(branchLen * NS_RADIUS);
      const branchEnd = mid
        .add(branch)
        .normalize()
        .multiplyScalar(NS_RADIUS * 1.01);
      positions.push(mid.x, mid.y, mid.z, branchEnd.x, branchEnd.y, branchEnd.z);
    }
  }

  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));

  return new LineSegments(
    geo,
    new LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1.0,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
};
