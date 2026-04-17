import { CatmullRomCurve3, Vector3 } from 'three';

export const buildCurve = (pts: Array<Vector3>): CatmullRomCurve3 =>
  new CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
