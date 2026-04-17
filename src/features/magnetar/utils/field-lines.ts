import {
  AdditiveBlending,
  CatmullRomCurve3,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  TubeGeometry,
  Vector3,
} from 'three';
import { NS_RADIUS } from '../constants';

const FIELD_LINE_COUNT = 18 as const;
const STEPS = 50 as const;

// Chaotic multipole field line — randomised higher-order path
const createChaoticFieldLine = (seed: number, fieldStrength: number): Mesh<TubeGeometry, MeshBasicMaterial> => {
  const points: Array<Vector3> = [];

  // Random tilt and phase per line
  const tilt = ((seed * 1.618) % (Math.PI * 0.6)) - Math.PI * 0.3;
  const phase = (seed * 2.399) % (Math.PI * 2);
  const arcR = NS_RADIUS * 1.15 + ((seed * 0.317) % 1.0) * NS_RADIUS * 3.5;
  // Higher-order multipole perturbation
  const multipoleAmp = ((seed * 0.537) % 1.0) * 0.4;
  const multipoleFreq = 2 + Math.floor((seed * 0.213) % 3);

  for (let i = 0; i <= STEPS; i++) {
    const t = (i / STEPS) * Math.PI;
    const sinT = Math.sin(t);
    const cosT = Math.cos(t);
    // Base dipole
    const r = NS_RADIUS * 1.05 + arcR * sinT * sinT;
    // Multipole perturbation
    const mp = multipoleAmp * Math.sin(multipoleFreq * t);
    const x = (r + mp) * sinT * Math.cos(phase);
    const y = (r + mp) * cosT;
    const z = (r + mp) * sinT * Math.sin(phase);
    // Apply tilt
    const tx = x * Math.cos(tilt) - y * Math.sin(tilt);
    const ty = x * Math.sin(tilt) + y * Math.cos(tilt);
    points.push(new Vector3(tx, ty, z));
  }

  const curve = new CatmullRomCurve3(points);
  const thickness = 0.004 + fieldStrength * 0.003;
  const opacity = fieldStrength * (0.1 + ((seed * 0.293) % 0.25));

  return new Mesh(
    new TubeGeometry(curve, 32, thickness, 5, false),
    new MeshBasicMaterial({
      color: new Color(0.25 + fieldStrength * 0.1, 0.45, 1.0),
      transparent: true,
      opacity,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
};

export const createFieldLines = (fieldStrength: number): Group => {
  const group = new Group();
  for (let i = 0; i < FIELD_LINE_COUNT; i++) {
    group.add(createChaoticFieldLine(i, fieldStrength));
  }
  return group;
};
