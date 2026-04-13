import type { GlossarySection } from '@/components/app/glossary';
import type { HintItem } from '@/components/app/hints';
import type { SceneLayoutHudProps } from '@/components/app/scene-layout';
import type { InspiralOption, Params, Phase, RadioItem, SliderItem, StateRef, ToggleItem } from '../types';

export const TITLE = 'Binary Merger';

export const SUBTITLE = 'GRAVITATIONAL WAVES · INSPIRAL · LIGO GW150914';

export const PARAMS = {
  mass1: 30,
  mass2: 25,
  inspiralRate: 'medium',
  waveAmplitude: 1.0,
  showGrid: true,
  showWaveRings: true,
  showDisks: true,
  autoLoop: true,
} satisfies Params;

export const GLOSSARY_ITEMS = [
  {
    title: 'THE EVENT',
    items: [
      {
        term: 'GRAVITATIONAL WAVES',
        formula: 'h ~ GM/rc²',
        def: 'Ripples in spacetime itself, propagating at the speed of light. Predicted by Einstein in 1916, directly detected for the first time by LIGO on <em>September 14, 2015</em>. The waves stretch and compress space perpendicular to their direction of travel.',
      },
      {
        term: 'INSPIRAL',
        def: 'As two massive objects orbit each other, they radiate gravitational wave energy. This loss of energy causes the orbit to shrink — the objects spiral inward, orbiting faster and faster as the separation decreases. The frequency of emitted waves increases, forming a characteristic <em>chirp</em>.',
      },
      {
        term: 'CHIRP MASS',
        formula: 'ℳ = (m₁m₂)³/⁵ / (m₁+m₂)¹/⁵',
        def: 'The most precisely measurable quantity from a gravitational wave signal. It sets the <em>rate of inspiral</em> — how quickly the orbital frequency sweeps upward. For GW150914, the chirp mass was about <em>28 M☉</em>.',
      },
      {
        term: 'MERGER',
        def: 'The moment the two event horizons touch and merge into a single black hole. Releases an enormous burst of energy — GW150914 radiated more power than <em>all visible stars in the observable universe combined</em>, for a fraction of a second.',
      },
      {
        term: 'RINGDOWN',
        def: 'After merger, the newly formed black hole is highly distorted and rapidly oscillates. It radiates gravitational waves as it settles into a stable Kerr black hole. The frequency of these oscillations directly encodes the <em>mass and spin</em> of the remnant.',
      },
    ],
  },
  {
    title: 'PARAMETERS',
    items: [
      {
        term: 'MASS 1 & MASS 2',
        def: 'The individual masses of the two black holes in solar masses. GW150914 involved masses of approximately <em>36 M☉ and 29 M☉</em>. The mass ratio determines orbital asymmetry — unequal masses produce stronger gravitational wave emission.',
      },
      {
        term: 'INSPIRAL RATE',
        def: "Controls how rapidly the orbital separation shrinks over time. In reality the inspiral phase lasts <em>millions of years</em>, the final plunge milliseconds. Here it's compressed so you can watch the full sequence. Faster rates compress more time.",
      },
      {
        term: 'WAVE AMPLITUDE',
        def: "The visual intensity of spacetime grid deformation. Real gravitational waves from GW150914 distorted space by a fraction of a proton's width over a 4 km detector — <em>h ~ 10⁻²¹</em>. Here it's amplified enormously for visibility.",
      },
    ],
  },
  {
    title: 'LIGO & DETECTION',
    items: [
      {
        term: 'LIGO',
        def: 'Laser Interferometer Gravitational-Wave Observatory. Two L-shaped detectors in <em>Hanford, WA</em> and <em>Livingston, LA</em>, each with 4 km arms. Measures spacetime distortions by comparing the travel time of laser light along perpendicular paths.',
      },
      {
        term: 'GW150914',
        def: 'The first detected gravitational wave event. Two black holes, ~1.3 billion light-years away, merged on <em>September 14, 2015</em>. The signal lasted 0.2 seconds. Combined mass of the remnant: ~62 M☉. About <em>3 M☉ was radiated as gravitational waves</em>.',
      },
      {
        term: 'SPACETIME FABRIC',
        def: 'A visual metaphor for the metric tensor — the mathematical object that describes the geometry of spacetime. Gravitational waves are oscillations in this geometry. The rubber-sheet analogy is imperfect but captures how mass curves spacetime.',
      },
      {
        term: 'MASS RATIO',
        def: 'q = m₂/m₁ where m₁ ≥ m₂. Unequal mass ratios produce asymmetric orbits and stronger wave emission. Equal masses (q=1) orbit a common center with perfect symmetry. Extreme mass ratio inspirals (EMRI) involve a small object orbiting a supermassive black hole.',
      },
    ],
  },
] as const satisfies ReadonlyArray<GlossarySection>;

export const HINT_ITEMS = [
  { title: 'GW150914', values: ['36 + 29 → 62 M☉', '3 M☉ RADIATED'] },
] as const satisfies ReadonlyArray<HintItem>;

export const BASE_HUD_PROPS = {
  title: TITLE,
  subtitle: SUBTITLE,
  glossary: GLOSSARY_ITEMS,
  hints: HINT_ITEMS,
} as const satisfies Partial<SceneLayoutHudProps>;

export const SLIDER_ITEMS = [
  {
    id: 'mass1',
    label: 'MASS 1',
    min: 1,
    max: 50,
    step: 0.5,
    tooltip:
      'Mass of the first black hole. Larger mass = bigger event horizon and stronger gravitational wave emission.',
    format: (v: number) => `${v.toFixed(1)} M☉`,
  },
  {
    id: 'mass2',
    label: 'MASS 2',
    min: 1,
    max: 50,
    step: 0.5,
    tooltip: 'Mass of the second black hole. Unequal masses produce orbital asymmetry and stronger waves.',
    format: (v: number) => `${v.toFixed(1)} M☉`,
  },
  {
    id: 'waveAmplitude',
    label: 'WAVE AMP',
    min: 0,
    max: 2,
    step: 0.05,
    format: (v: number) => v.toFixed(2),
    tooltip:
      'Spacetime grid deformation intensity. Real gravitational waves distort space by less than a proton width — amplified here for visibility.',
  },
] as const satisfies ReadonlyArray<SliderItem>;

export const TOGGLE_ITEMS = [
  { id: 'showGrid', label: 'Spacetime grid' },
  { id: 'showWaveRings', label: 'Wave rings' },
  { id: 'showDisks', label: 'Accretion disks' },
  { id: 'autoLoop', label: 'Auto loop' },
] as const satisfies ReadonlyArray<ToggleItem>;

export const RADIO_ITEMS = [
  {
    id: 'inspiralRate',
    label: 'Inspiral',
    labelTooltip: 'How fast the orbit decays. Real inspiral takes millions of years — compressed here.',
    options: (['slow', 'medium', 'fast'] satisfies Array<InspiralOption>).map((item) => ({ id: item, label: item })),
  },
] as const satisfies ReadonlyArray<RadioItem>;

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
