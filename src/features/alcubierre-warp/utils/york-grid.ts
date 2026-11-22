import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, LineBasicMaterial, LineSegments } from 'three';
import {
  GRID_HALF,
  GRID_LINES,
  GRID_OPACITY,
  GRID_SAMPLES,
  GRID_Y,
  YORK_BASE_COLOR,
  YORK_CONTRACT_COLOR,
  YORK_EXPAND_COLOR,
  YORK_HEIGHT,
  YORK_REF,
} from '../constants';
import type { Bubble, YorkGrid } from '../types';
import { yorkTheta } from './metric';

const BASE = new Color(YORK_BASE_COLOR);
const EXPAND = new Color(YORK_EXPAND_COLOR);
const CONTRACT = new Color(YORK_CONTRACT_COLOR);
const tmp = new Color();

const lineCoord = (j: number) => -GRID_HALF + (2 * GRID_HALF * j) / (GRID_LINES - 1);
const sampleCoord = (i: number) => -GRID_HALF + (2 * GRID_HALF * i) / (GRID_SAMPLES - 1);

/** Grid in the x–z plane: lines along x, then along z, each drawn as segments between samples. */
export const createYorkGrid = (): YorkGrid => {
  const vertexCount = 2 * GRID_LINES * (GRID_SAMPLES - 1) * 2;
  const positions = new BufferAttribute(new Float32Array(vertexCount * 3), 3);
  const colors = new BufferAttribute(new Float32Array(vertexCount * 3), 3);

  let k = 0;
  const put = (x: number, z: number) => positions.setXYZ(k++, x, GRID_Y, z);
  for (let j = 0; j < GRID_LINES; j++) {
    const z = lineCoord(j);
    for (let i = 0; i < GRID_SAMPLES - 1; i++) {
      put(sampleCoord(i), z);
      put(sampleCoord(i + 1), z);
    }
  }
  for (let j = 0; j < GRID_LINES; j++) {
    const x = lineCoord(j);
    for (let i = 0; i < GRID_SAMPLES - 1; i++) {
      put(x, sampleCoord(i));
      put(x, sampleCoord(i + 1));
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', positions);
  geometry.setAttribute('color', colors);
  const material = new LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: GRID_OPACITY,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const line = new LineSegments(geometry, material);
  // Vertices move in y, so the bounding sphere from creation would be stale.
  line.frustumCulled = false;
  return { line, positions, colors };
};

/** Rewrites grid heights and colours in place from the York time at each vertex (ρ = |z| on the plane). */
export const updateYorkGrid = ({ positions, colors }: YorkGrid, bubble: Bubble) => {
  for (let k = 0; k < positions.count; k++) {
    const theta = yorkTheta(positions.getX(k), Math.abs(positions.getZ(k)), bubble);
    const t = Math.tanh(theta / YORK_REF);
    positions.setY(k, GRID_Y + YORK_HEIGHT * t);
    tmp.copy(BASE).lerp(t < 0 ? CONTRACT : EXPAND, Math.abs(t));
    colors.setXYZ(k, tmp.r, tmp.g, tmp.b);
  }
  positions.needsUpdate = true;
  colors.needsUpdate = true;
};
