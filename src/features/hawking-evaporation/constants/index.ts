import type { Params, StateRef, TimeCompression } from '../types';
import type { Phase } from '../types';

export const PARAMS = {
  initialMass: 0.1,
  timeCompression: 'medium',
  pairOpacity: 0.8,
  radiationIntensity: 1.0,
  showPairs: true,
  showHalo: true,
  showTempReadout: true,
  autoLoop: true,
} as const satisfies Params;

export const INITIAL_STATE = {
  mass: PARAMS.initialMass,
  phase: 'evaporating',
  flashOpacity: 0,
  pairs: [],
  lastPairTime: 0,
} as const satisfies StateRef;

export const PHASE_LABEL_MAP = {
  evaporating: '● EVAPORATING',
  flashing: '◉ FINAL BURST',
  done: '◎ EVAPORATED',
} as const satisfies Record<Phase, string>;

// Max virtual pairs in pool
export const PAIR_POOL = 120;

// Visual scale — micro BH displayed larger than physical for clarity
export const VISUAL_SCALE = 0.8;

// Mass decay rate per second for each compression level
// Mapped so medium takes ~30s to evaporate from initialMass=0.1
export const DECAY_RATE_MAP = {
  slow: 0.001,
  medium: 0.003,
  fast: 0.009,
} as const satisfies Record<TimeCompression, number>;
