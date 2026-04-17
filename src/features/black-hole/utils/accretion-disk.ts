import { tempToColor } from '@/utils/physics';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
  RingGeometry,
  type MeshBasicMaterialParameters,
} from 'three';

const RINGS = 80 as const;
const INNER_R = 1.5 as const;
const OUTER_R = 6.0 as const;
const DIFF_R = OUTER_R - INNER_R;

const createMeshBasicMaterial = (brightness: number, params: MeshBasicMaterialParameters) =>
  new MeshBasicMaterial({
    transparent: true,
    opacity: Math.max(0.02, brightness * 0.9),
    side: DoubleSide,
    blending: AdditiveBlending,
    depthWrite: false,
    ...params,
  });

const createDopplerDisk = (temp: number) => {
  const group = new Group();

  for (let i = 0; i < RINGS; i++) {
    const t = i / RINGS;
    const r = INNER_R + t * DIFF_R;
    const width = (DIFF_R / RINGS) * 1.05;
    const segments = 256;
    const vertices = [];
    const cols = [];

    for (let j = 0; j <= segments; j++) {
      const angle = (j / segments) * Math.PI * 2;
      const cosA = Math.cos(angle);
      const ringTemp = temp * (1 - t * 0.75);
      let color;
      if (cosA > 0) {
        color = tempToColor(ringTemp * (1 + cosA * 0.5));
        color.multiplyScalar(1 + cosA * 0.8);
      } else {
        const factor = 1 + cosA * 0.4;
        color = tempToColor(ringTemp * factor);
        color.multiplyScalar(Math.max(0.1, factor));
      }
      for (let k = 0; k < 2; k++) {
        const rr = k === 0 ? r : r + width;
        vertices.push(Math.cos(angle) * rr, 0, Math.sin(angle) * rr);
        cols.push(color.r, color.g, color.b);
      }
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    geo.setAttribute('color', new BufferAttribute(new Float32Array(cols), 3));
    const indices = [];
    for (let j = 0; j < segments; j++) {
      const b = j * 2;
      indices.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
    }
    geo.setIndex(indices);
    const brightness = Math.pow(1 - t, 1.5) * 1.5 + 0.05;
    group.add(new Mesh(geo, createMeshBasicMaterial(brightness, { vertexColors: true })));
  }

  return group;
};

const createStandardDisk = (temp: number) => {
  const group = new Group();

  for (let i = 0; i < RINGS; i++) {
    const t = i / RINGS;
    const r = INNER_R + t * (OUTER_R - INNER_R);
    const width = ((OUTER_R - INNER_R) / RINGS) * 1.05;
    const geo = new RingGeometry(r, r + width, 128, 1);
    const color = tempToColor(temp * (1 - t * 0.75));
    const brightness = Math.pow(1 - t, 1.5) * 1.5 + 0.05;
    group.add(new Mesh(geo, createMeshBasicMaterial(brightness, { color })));
  }

  // Turbulence particles
  const count = 3000;
  const pos = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const r = INNER_R + Math.pow(Math.random(), 1.5) * (OUTER_R - INNER_R);
    const angle = Math.random() * Math.PI * 2;
    const t2 = (r - INNER_R) / (OUTER_R - INNER_R);
    const yJitter = (Math.random() - 0.5) * 0.08 * (1 - t2);
    pos[i * 3] = Math.cos(angle) * r;
    pos[i * 3 + 1] = yJitter;
    pos[i * 3 + 2] = Math.sin(angle) * r;
    const c = tempToColor(temp * (1 - t2 * 0.7));
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const pGeo = new BufferGeometry();
  pGeo.setAttribute('position', new BufferAttribute(pos, 3));
  pGeo.setAttribute('color', new BufferAttribute(colors, 3));

  group.add(
    new Points(
      pGeo,
      new PointsMaterial({
        size: 0.04,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    ),
  );

  return group;
};

export const createAccretionDisk = (temp: number, dopplerMode = false) =>
  dopplerMode ? createDopplerDisk(temp) : createStandardDisk(temp);
