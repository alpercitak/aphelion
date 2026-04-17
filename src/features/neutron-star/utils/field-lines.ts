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

const FIELD_LINE_COUNT = 12 as const;

// Dipole field line — parametric curve from pole to pole
const dipoleFieldLine = (tiltAngle: number, phiOffset: number, arcScale: number): CatmullRomCurve3 => {
  const points: Vector3[] = [];
  const steps = 40;

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI;
    // Dipole: r = L * sin²(θ), mapped to 3D with tilt and azimuth
    const sinT = Math.sin(t);
    const r = NS_RADIUS * 1.1 + arcScale * sinT * sinT;
    const x = r * Math.sin(t) * Math.cos(phiOffset);
    const y = r * Math.cos(t);
    const z = r * Math.sin(t) * Math.sin(phiOffset);
    // Apply tilt around Z axis
    const tx = x * Math.cos(tiltAngle) - y * Math.sin(tiltAngle);
    const ty = x * Math.sin(tiltAngle) + y * Math.cos(tiltAngle);
    points.push(new Vector3(tx, ty, z));
  }
  return new CatmullRomCurve3(points);
};

export const createFieldLines = (fieldStrength: number): Group => {
  const group = new Group();
  const arcScales = [0.4, 0.65, 0.9, 1.15, 1.4];
  const tilt = 0.25; // magnetic axis tilt relative to rotation axis

  arcScales.forEach((scale) => {
    for (let i = 0; i < FIELD_LINE_COUNT; i++) {
      const phi = (i / FIELD_LINE_COUNT) * Math.PI * 2;
      const curve = dipoleFieldLine(tilt, phi, scale);
      const geo = new TubeGeometry(curve, 30, 0.003, 5, false);
      const mat = new MeshBasicMaterial({
        color: new Color(0.3, 0.55, 1.0),
        transparent: true,
        opacity: fieldStrength * (0.15 + (1 - scale / 1.6) * 0.25),
        blending: AdditiveBlending,
        depthWrite: false,
      });
      group.add(new Mesh(geo, mat));
    }
  });

  return group;
};
