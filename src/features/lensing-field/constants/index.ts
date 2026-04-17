import { Vector2 } from 'three';
import type { BackgroundDensity, LensState, SceneParams } from '../types';

export const SCENE_PARAMS = {
  mass: 100,
  backgroundDensity: 'medium',
  mouseLens: true,
  multipleLenses: false,
  showLensMarker: false,
  darkMatterMode: false,
} as const satisfies SceneParams;

export const INITIAL_LENS_STATE = {
  pos: new Vector2(0, 0),
  driftTime: 0,
  driftSpeed: 0.12,
} as const satisfies LensState;

export const STAR_COUNT_MAP = {
  sparse: 3000,
  medium: 7000,
  dense: 14000,
} as const satisfies Record<BackgroundDensity, number>;

export const GALAXY_COUNT_MAP = {
  sparse: 30,
  medium: 80,
  dense: 160,
} as const satisfies Record<BackgroundDensity, number>;

export const DARK_MATTER_LENS_COUNT = 40 as const;
export const DARK_MATTER_MASS_RANGE = [5, 50] as const;
