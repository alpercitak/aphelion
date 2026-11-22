import { AdditiveBlending, DoubleSide, Group, Mesh, MeshBasicMaterial, RingGeometry } from 'three';
import { tempToColor } from '@/utils/physics';
import {
  DISK_BRIGHTNESS_EXPONENT,
  DISK_INNER_FRACTION,
  DISK_OPACITY,
  DISK_RING_COUNT,
  DISK_T_IN_DISPLAY,
  DISK_TEMP_EXPONENT,
  MDOT_REF_LOG,
} from '../constants';
import type { AccretionDisk, Binary } from '../types';

export const createAccretionDisk = (): AccretionDisk => {
  const group = new Group();
  const rings: AccretionDisk['rings'] = [];
  const span = 1 - DISK_INNER_FRACTION;
  for (let i = 0; i < DISK_RING_COUNT; i++) {
    const r0 = DISK_INNER_FRACTION + (span * i) / DISK_RING_COUNT;
    const r1 = DISK_INNER_FRACTION + (span * (i + 1)) / DISK_RING_COUNT;
    const rMid = (r0 + r1) / 2;
    const baseOpacity = DISK_OPACITY * (1 - (i + 0.5) / DISK_RING_COUNT);
    const material = new MeshBasicMaterial({
      color: tempToColor(DISK_T_IN_DISPLAY * (rMid / DISK_INNER_FRACTION) ** DISK_TEMP_EXPONENT),
      transparent: true,
      opacity: baseOpacity,
      side: DoubleSide,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new Mesh(new RingGeometry(r0, r1, 96, 1), material);
    mesh.rotation.x = -Math.PI / 2;
    group.add(mesh);
    rings.push({ mesh, baseOpacity });
  }
  return { group, rings };
};

/** Places the disk around the accretor, scaled to its tidal outer radius. */
export const updateAccretionDisk = ({ group }: AccretionDisk, binary: Binary) => {
  group.position.x = binary.x1;
  group.scale.setScalar(binary.diskOuter);
};

export const setDiskBrightness = ({ rings }: AccretionDisk, mdotLog: number) => {
  const brightness = Math.min(1, (10 ** (mdotLog - MDOT_REF_LOG)) ** DISK_BRIGHTNESS_EXPONENT);
  for (const { mesh, baseOpacity } of rings) {
    mesh.material.opacity = baseOpacity * brightness;
  }
};
