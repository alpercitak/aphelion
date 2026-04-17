import type { SceneParams } from '../types';

export const SCENE_PARAMS = {
  mass: 1.4,
  rpm: 30,
  fieldStrength: 1.0,
  beamWidth: 'narrow',
  showBeams: true,
  showFieldLines: true,
  showBeamFlash: true,
  showAccretionDisk: false,
} as const satisfies SceneParams;

export const BEAM_FLASH_THRESHOLD = 0.92 as const;

export const NS_RADIUS = 0.35 as const; // visual radius — neutron stars are tiny
