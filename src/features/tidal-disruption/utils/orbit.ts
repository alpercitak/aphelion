import { BufferAttribute, BufferGeometry, Line, LineBasicMaterial, type Vector3 } from 'three';
import { GM_BH, ORBIT_SEGMENTS, R_TIDAL_VISUAL, START_RADIUS } from '../constants';
import type { OrbitPath } from '../types';

/** Periapsis r_p = r_t / β, in scene units. */
export const periapsisOf = (beta: number) => R_TIDAL_VISUAL / beta;

/** Parabola radius at true anomaly ν: r = 2 r_p / (1 + cos ν). */
const radiusAt = (periapsis: number, nu: number) => (2 * periapsis) / (1 + Math.cos(nu));

/** True anomaly magnitude where the parabola reaches START_RADIUS. The star starts at -ν₀ (inbound). */
export const startAnomaly = (periapsis: number) => Math.acos((2 * periapsis) / START_RADIUS - 1);

/** Position and velocity on a parabolic (E = 0) orbit in the x–z plane. */
export const setParabolicState = (periapsis: number, nu: number, pos: Vector3, vel: Vector3) => {
  const cos = Math.cos(nu);
  const sin = Math.sin(nu);
  const r = radiusAt(periapsis, nu);
  const k = Math.sqrt(GM_BH / (2 * periapsis));
  const vRad = k * sin;
  const vTan = k * (1 + cos);
  pos.set(r * cos, 0, r * sin);
  vel.set(vRad * cos - vTan * sin, 0, vRad * sin + vTan * cos);
};

/** Samples the full parabola the star travels (from -ν₀ to +ν₀) into the path buffer. */
export const fillOrbitPath = (positions: Float32Array, periapsis: number, nu0: number) => {
  for (let i = 0; i <= ORBIT_SEGMENTS; i++) {
    const nu = -nu0 + (2 * nu0 * i) / ORBIT_SEGMENTS;
    const r = radiusAt(periapsis, nu);
    positions[i * 3] = r * Math.cos(nu);
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = r * Math.sin(nu);
  }
};

export const createOrbitPath = (): OrbitPath => {
  const positions = new Float32Array((ORBIT_SEGMENTS + 1) * 3);
  const positionAttr = new BufferAttribute(positions, 3);
  const geo = new BufferGeometry();
  geo.setAttribute('position', positionAttr);
  const line = new Line(
    geo,
    new LineBasicMaterial({ color: 0x7fd4ff, transparent: true, opacity: 0.35, depthWrite: false }),
  );
  line.frustumCulled = false;
  return { line, positions, positionAttr };
};
