import { BufferAttribute, BufferGeometry, Group, LineBasicMaterial, LineLoop } from 'three';
import { LOBE_COLOR, LOBE_OPACITY, LOBE_SEGMENTS } from '../constants';
import type { Binary, LobeCurve, RocheLobes } from '../types';
import { lobeRadius } from './roche';

const createLobeCurve = (): LobeCurve => {
  const positions = new BufferAttribute(new Float32Array(LOBE_SEGMENTS * 3), 3);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', positions);
  const material = new LineBasicMaterial({ color: LOBE_COLOR, transparent: true, opacity: LOBE_OPACITY });
  return { line: new LineLoop(geometry, material), positions };
};

export const createRocheLobes = (): RocheLobes => {
  const donor = createLobeCurve();
  const accretor = createLobeCurve();
  const group = new Group();
  group.add(donor.line, accretor.line);
  return { group, donor, accretor };
};

const traceLobe = (binary: Binary, centreX: number, positions: BufferAttribute) => {
  const maxR = Math.abs(binary.l1x - centreX);
  const dir = { x: 1, y: 0, z: 0 };
  for (let i = 0; i < LOBE_SEGMENTS; i++) {
    const theta = (i / LOBE_SEGMENTS) * 2 * Math.PI;
    dir.x = Math.cos(theta);
    dir.z = Math.sin(theta);
    const r = lobeRadius(binary, centreX, dir, maxR);
    positions.setXYZ(i, centreX + r * dir.x, 0, r * dir.z);
  }
  positions.needsUpdate = true;
};

export const updateRocheLobes = ({ donor, accretor }: RocheLobes, binary: Binary) => {
  traceLobe(binary, binary.x2, donor.positions);
  traceLobe(binary, binary.x1, accretor.positions);
  donor.line.geometry.computeBoundingSphere();
  accretor.line.geometry.computeBoundingSphere();
};
