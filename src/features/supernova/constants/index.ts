import type { Phase, PhaseValue, RemnantType, SceneParams } from '../types';

export const SCENE_PARAMS = {
  progenitorMass: 20,
  supernovaType: 'type-ii',
  playbackSpeed: 1.0,
  timeline: 0 as number,
  autoPlay: true,
  showShockwave: true,
  showEjecta: true,
  showRemnant: true,
  showNeutrinos: true,
} as const satisfies SceneParams;

export const PHASE_LABEL_MAP = {
  PROGENITOR: '● PROGENITOR STAR',
  COLLAPSE: '◉ CORE COLLAPSE',
  FLASH: '◎ SHOCK BREAKOUT',
  EXPANSION: '◉ EJECTA EXPANDING',
  NEBULA: '● SUPERNOVA REMNANT',
} as const satisfies Record<Phase, string>;

export const PHASE_MAP = {
  PROGENITOR: [0.0, 0.15], // stable massive star
  COLLAPSE: [0.15, 0.25], // core collapse, neutrino burst
  FLASH: [0.25, 0.32], // optical brightening, shock breakout
  EXPANSION: [0.32, 0.7], // shockwave + ejecta expanding
  NEBULA: [0.7, 1.0], // remnant + expanding nebula
} as const satisfies Record<Phase, PhaseValue>;

export const REMNANT_TYPE_LABEL_MAP = {
  'black-hole': 'BLACK HOLE',
  'neutron-star': 'NEUTRON STAR',
  none: 'NONE',
} as const satisfies Record<RemnantType, string>;
