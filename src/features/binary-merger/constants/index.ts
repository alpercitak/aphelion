import type { InspiralOption, Params, Phase, StateRef } from '../types';

export const PARAMS = {
  mass1: 30,
  mass2: 25,
  inspiralRate: 'medium',
  waveAmplitude: 1.0,
  showGrid: true,
  showWaveRings: true,
  showDisks: true,
  autoLoop: true,
} as const satisfies Params;

export const PHASE_LABEL_MAP = {
  orbit: '● INSPIRAL IN PROGRESS',
  merging: '◉ MERGER EVENT',
  merged: '◎ RINGDOWN',
} as const satisfies Record<Phase, string>;

export const INSPIRAL_RATE_MAP = {
  slow: 0.008,
  medium: 0.022,
  fast: 0.055,
} as const satisfies Record<InspiralOption, number>;

export const INITIAL_SEPARATION = 7.0 as const;

export const MERGE_THRESHOLD = 1.2 as const;

export const INITIAL_STATE: StateRef = {
  separation: INITIAL_SEPARATION,
  angle: 0,
  phase: 'orbit',
  mergeProgress: 0,
  flashOpacity: 0,
  waveRings: [],
  lastRingTime: 0,
  params: PARAMS,
};
