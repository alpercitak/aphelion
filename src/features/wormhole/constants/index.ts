import type { GlossarySection } from '@/components/app/glossary';
import type { Destination, Params, RadioItem, SliderItem, ToggleItem } from '../types';
import type { HintItem } from '@/components/app/hints';
import type { SceneLayoutHudProps } from '@/components/app/scene-layout';

export const TITLE = 'Wormhole';

export const SUBTITLE = 'EINSTEIN-ROSEN BRIDGE · EXOTIC MATTER · SPACETIME TOPOLOGY';

export const PARAMS = {
  throatRadius: 1.0,
  exoticDensity: 0.6,
  lensingStrength: 1.0,
  destination: 'distant',
  showExoticHalo: true,
  showLensingRings: true,
  showStars: true,
} as const satisfies Params;

export const GLOSSARY_ITEMS = [
  {
    title: 'THE STRUCTURE',
    items: [
      {
        term: 'WORMHOLE',
        formula: 'ds² = Morris-Thorne',
        def: 'A hypothetical topological shortcut connecting two distant regions of spacetime — or even two different universes. Consistent with general relativity but requires <em>exotic matter</em> with negative energy density to remain open. Never observed.',
      },
      {
        term: 'EINSTEIN-ROSEN BRIDGE',
        def: 'The original wormhole solution, derived by Einstein and Rosen in 1935 from the Schwarzschild metric. Unlike traversable wormholes, ER bridges pinch off too quickly for anything to pass through. Modern work suggests they may be <em>quantum-entangled</em> with black holes (ER = EPR conjecture).',
      },
      {
        term: 'THROAT',
        def: 'The minimum-radius cross section of the wormhole — the narrowest point connecting the two regions. The <em>Morris-Thorne metric</em> describes a static, spherically symmetric traversable wormhole with throat radius b₀. Tidal forces at the throat must be survivable for traversability.',
      },
      {
        term: 'SPACETIME TOPOLOGY',
        def: 'Unlike black holes which curve spacetime, a wormhole changes its <em>topology</em> — the fundamental connectivity of space. Two distant points become adjacent. This is not just curvature but a genuine change in how spacetime is connected at a global level.',
      },
    ],
  },
  {
    title: 'PARAMETERS',
    items: [
      {
        term: 'THROAT RADIUS',
        def: 'The minimum radius b₀ in the Morris-Thorne metric. Sets the physical size of the traversable opening. A throat radius of ~1 metre would require exotic matter with negative energy comparable to the <em>mass-energy of Jupiter</em>.',
      },
      {
        term: 'EXOTIC MATTER',
        def: 'Matter with negative energy density — required to violate the null energy condition and hold the throat open. Casimir vacuum between parallel plates is a real example of negative energy, though far too weak for a macroscopic wormhole. Controls halo visibility and rim color here.',
      },
      {
        term: 'GRAVITATIONAL LENSING',
        def: 'The extreme spacetime curvature near the throat bends light paths, creating a characteristic brightening of the rim and distortion of background objects. The lensing pattern of a wormhole is <em>distinct from a black hole</em> — light can pass through rather than being captured.',
      },
    ],
  },
  {
    title: 'THEORY',
    items: [
      {
        term: 'MORRIS-THORNE METRIC',
        def: 'A 1988 solution by Kip Thorne and Mike Morris describing a traversable wormhole. It reversed the engineering approach — starting from a desirable spacetime geometry and asking what matter distribution would produce it. The answer required exotic matter.',
      },
      {
        term: 'CASIMIR EFFECT',
        def: 'A real quantum phenomenon producing negative energy density between two conducting plates due to vacuum fluctuations. Often cited as proof that negative energy exists in nature. The energy density is real but <em>far too small</em> for macroscopic wormhole stabilisation.',
      },
      {
        term: 'ER = EPR',
        def: 'A 2013 conjecture by Maldacena and Susskind: Einstein-Rosen bridges (wormholes) and Einstein-Podolsky-Rosen pairs (quantum entanglement) may be the same phenomenon. Two entangled black holes might be connected by a wormhole. Actively researched but unproven.',
      },
    ],
  },
] as const satisfies ReadonlyArray<GlossarySection>;

export const HINT_ITEMS = [
  { title: 'TOPOLOGY', values: ['Non-trivial'] },
  { title: 'STATUS', values: ['Theoretical'] },
] as const satisfies ReadonlyArray<HintItem>;

export const BASE_HUD_PROPS = {
  title: TITLE,
  subtitle: SUBTITLE,
  glossary: GLOSSARY_ITEMS,
  hints: HINT_ITEMS,
} as const satisfies Partial<SceneLayoutHudProps>;

export const SLIDER_ITEMS = [
  {
    id: 'throatRadius',
    label: 'THROAT RADIUS',
    min: 0.4,
    max: 2.2,
    step: 0.05,
    format: (v) => v.toFixed(2),
    tooltip: 'Radius of the wormhole throat. Larger throat = more visible interior and stronger lensing rim.',
  },
  {
    id: 'exoticDensity',
    label: 'EXOTIC MATTER',
    min: 0,
    max: 1,
    step: 0.05,
    format: (v) => v.toFixed(2),
    tooltip:
      'Density of exotic matter with negative energy — required to keep the wormhole stable and traversable. Purely theoretical.',
  },
  {
    id: 'lensingStrength',
    label: 'LENSING',
    min: 0,
    max: 2,
    step: 0.05,
    format: (v) => v.toFixed(2),
    tooltip: 'Intensity of spacetime curvature lensing around the throat. Bends light paths near the opening.',
  },
] as const satisfies ReadonlyArray<SliderItem>;

export const TOGGLE_ITEMS = [
  { id: 'showExoticHalo', label: 'EXOTIC MATTER HALO' },
  { id: 'showLensingRings', label: 'LENSING RINGS' },
  { id: 'showStars', label: 'STAR FIELD' },
] as const satisfies ReadonlyArray<ToggleItem>;

export const DESTINATION_OPTIONS = ['distant', 'nebula'] as const satisfies ReadonlyArray<Destination>;

export const DESTINATION_LABEL_MAP = {
  distant: 'Distant galaxy',
  nebula: 'Stellar nebula',
} as const satisfies Record<Destination, string>;

export const DESTINATION_COLOR_MAP = {
  distant: 0x4466ff, // cold blue — far future
  nebula: 0xff6644, // warm orange — star-forming region
} as const satisfies Record<Destination, number>;

export const RADIO_ITEMS = [
  {
    id: 'destination',
    label: 'DESTINATION',
    options: DESTINATION_OPTIONS.map((id) => ({ id, label: DESTINATION_LABEL_MAP[id] })),
  },
] as const satisfies ReadonlyArray<RadioItem>;
