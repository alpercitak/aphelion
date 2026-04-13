import type { Params } from '../types';

export const PARAMS = {
  mass: 1.4,
  rpm: 30,
  fieldStrength: 1.0,
  beamWidth: 'narrow',
  showBeams: true,
  showFieldLines: true,
  showBeamFlash: true,
  showAccretionDisk: false,
} as const satisfies Params;

export const BEAM_FLASH_THRESHOLD = 0.92;

export const NS_RADIUS = 0.35; // visual radius — neutron stars are tiny
