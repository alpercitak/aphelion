import { Vector3 } from 'three';
import { CONTROL_POINTS, STRING_LENGTH } from '../constants';

export const buildStringPoints = (t: number, amp: number, tension: number): Array<Vector3> => {
  const pts: Array<Vector3> = [];
  for (let i = 0; i <= CONTROL_POINTS; i++) {
    const u = i / CONTROL_POINTS - 0.5; // -0.5 → 0.5
    const x = u * STRING_LENGTH;

    // Sum of harmonics — creates realistic string oscillation
    const freq1 = tension * 1.2;
    const freq2 = tension * 2.3;
    const freq3 = tension * 3.7;
    const y =
      amp *
      (0.5 * Math.sin(u * Math.PI * 2 + t * freq1) +
        0.25 * Math.sin(u * Math.PI * 4 + t * freq2 + 0.8) +
        0.12 * Math.sin(u * Math.PI * 8 + t * freq3 + 1.6));
    const z =
      amp *
      (0.3 * Math.sin(u * Math.PI * 3 + t * freq1 * 0.7 + 2.1) +
        0.15 * Math.sin(u * Math.PI * 5 + t * freq2 * 0.9 + 0.4));

    pts.push(new Vector3(x, y, z));
  }
  return pts;
};
