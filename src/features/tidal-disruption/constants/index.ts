import type { SceneParams } from '../types';

export const SCENE_PARAMS = {
  logMass: 6,
  starMass: 1,
  beta: 1.8,
  showTidal: true,
  showStars: true,
} as const satisfies SceneParams;

/** Scene units with G·M_bh = 1. */
export const GM_BH = 1;

/** Visual tidal radius (scene units). The real r_t is only used for the HUD and horizon ratio. */
export const R_TIDAL_VISUAL = 4;

/** Floor for the visual horizon radius so small holes stay visible. */
export const MIN_HORIZON_VISUAL = 0.25;
