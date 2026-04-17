import { AdditiveBlending, Color, DoubleSide, Group, Mesh, MeshBasicMaterial, RingGeometry } from 'three';
import { NS_RADIUS } from '../constants';

const DISK_RING_COUNT = 10 as const;
const INNER_R = NS_RADIUS * 3.5;
const OUTER_R = NS_RADIUS * 9;
const DIFF_R = OUTER_R - INNER_R;

export const createAccretionDisk = (): Group => {
  const group = new Group();

  for (let i = 0; i < DISK_RING_COUNT; i++) {
    const t = i / DISK_RING_COUNT;
    const r = INNER_R + t * DIFF_R;
    const w = (DIFF_R / DISK_RING_COUNT) * 1.05;
    // Hot inner disk fades from white-blue to dim red
    const col = new Color().setHSL(0.62 - t * 0.52, 0.9, 0.7 - t * 0.4);
    group.add(
      new Mesh(
        new RingGeometry(r, r + w, 96, 1),
        new MeshBasicMaterial({
          color: col,
          transparent: true,
          opacity: Math.pow(1 - t, 1.8) * 0.6 + 0.03,
          side: DoubleSide,
          blending: AdditiveBlending,
          depthWrite: false,
        }),
      ),
    );
  }
  return group;
};
