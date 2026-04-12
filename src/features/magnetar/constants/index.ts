import type { GlossarySection } from '@/components/app/glossary';
import type { HintItem } from '@/components/app/hints';
import type { SceneLayoutHudProps } from '@/components/app/scene-layout';
import type { Params, RadioItem, SliderItem, StarquakeRate, ToggleItem } from '../types';

export const TITLE = 'Magnetar';

export const SUBTITLE = 'EXTREME MAGNETIC FIELD · STARQUAKES · GAMMA RAY BURSTS';

export const PARAMS = {
  fieldStrength: 1.0,
  burstIntensity: 1.0,
  surfaceTemp: 5e6,
  starquakeRate: 'off',
  showFieldLines: true,
  showStarquakes: true,
  showGammaBursts: true,
  showFieldDistortion: true,
} satisfies Params;

export const GLOSSARY_ITEMS = [
  {
    title: 'THE OBJECT',
    items: [
      {
        term: 'MAGNETAR',
        def: "A neutron star with an extraordinarily powerful magnetic field — up to <em>10¹⁵ Gauss</em>, a trillion times Earth's. The field is so strong it distorts atomic orbitals and can crack the solid neutron star crust. About 30 are known in our galaxy.",
      },
      {
        term: 'SGR 1806-20',
        def: "The most powerful magnetar flare ever recorded. On December 27, 2004, a burst from this magnetar <em>50,000 light-years away</em> briefly ionized Earth's upper atmosphere. The energy released in 0.2 seconds equalled the Sun's output over <em>250,000 years</em>.",
      },
      {
        term: 'SOFT GAMMA REPEATER',
        def: 'A class of magnetar that repeatedly emits bursts of X-rays and gamma rays. The "soft" refers to the relatively lower gamma ray energies compared to standard gamma ray bursts. Powered by magnetic field energy release rather than rotation.',
      },
      {
        term: 'ANOMALOUS X-RAY PULSAR',
        def: 'Another magnetar subclass — pulsars whose X-ray luminosity far exceeds what rotation alone could power. The energy source is the decaying magnetic field. Both SGRs and AXPs are now understood as the same class of object: magnetars.',
      },
    ],
  },
  {
    title: 'PHENOMENA',
    items: [
      {
        term: 'STARQUAKE',
        formula: 'ΔE ~ 10⁴⁶ erg',
        def: "A sudden fracture of the neutron star's solid crust, caused by magnetic field stresses building up over time. The crust cracks and shifts, releasing enormous energy as gamma rays. Analogous to an earthquake but powered by <em>magnetic tension</em> rather than tectonic forces.",
      },
      {
        term: 'GAMMA RAY BURST',
        def: 'The electromagnetic signature of a starquake or magnetic reconnection event. Magnetar bursts are typically short (<1 second) but intensely bright. The initial hard spike is followed by a softer decaying tail as the crust settles.',
      },
      {
        term: 'FIELD DECAY',
        def: 'Magnetar fields decay over ~10,000 years as Ohmic dissipation and Hall drift redistribute magnetic energy. As the field weakens below ~10¹⁴ G, burst activity ceases and the magnetar becomes a quiet neutron star. Field decay also <em>heats the crust</em>, keeping magnetars brighter than ordinary neutron stars.',
      },
      {
        term: 'CRUST FRACTURE',
        def: 'The neutron star crust is a crystalline lattice of neutron-rich nuclei. Magnetic stresses build until the lattice yields — the yield stress of neutron star crust is about <em>10²²–10²⁴ Pa</em>, the strongest material known. The fracture propagates at near-sonic speed across the surface.',
      },
    ],
  },
  {
    title: 'PARAMETERS',
    items: [
      {
        term: 'FIELD STRENGTH',
        def: 'Controls field line density and writhing animation speed. Weak fields (10¹²–10¹³ G) produce slow, ordered lines. Extreme fields (10¹⁵ G) produce dense, rapidly writhing chaotic topology. Strength above ~10¹⁴ G is required for magnetar-level activity.',
      },
      {
        term: 'SURFACE TEMPERATURE',
        def: 'Magnetar surfaces are hot by neutron star standards — <em>10⁶–10⁸ K</em> — heated by field decay and burst activity. Color ranges from orange-white at 1MK to hard blue-white at 100MK. Ordinary cooling neutron stars reach ~10⁶ K after millions of years.',
      },
      {
        term: 'BURST INTENSITY',
        def: 'Controls the brightness of gamma ray burst flashes. Real magnetar bursts span 10 orders of magnitude in energy. The brightest (giant flares) are rare — perhaps once per 50 years per magnetar — but dwarf all other magnetar activity.',
      },
    ],
  },
] as const satisfies ReadonlyArray<GlossarySection>;

export const HINT_ITEMS = [
  { title: 'FIELD', values: ['~10¹⁵ G'] },
  { title: 'SURFACE', values: ['~10⁷ K'] },
] as const satisfies ReadonlyArray<HintItem>;

export const BASE_HUD_PROPS = {
  title: TITLE,
  subtitle: SUBTITLE,
  glossary: GLOSSARY_ITEMS,
  hints: HINT_ITEMS,
} satisfies Partial<SceneLayoutHudProps>;

export const SLIDER_ITEMS = [
  {
    id: 'fieldStrength',
    label: 'FIELD STRENGTH',
    min: 0,
    max: 2,
    step: 0.05,
    format: (v) => `${v.toFixed(2)}`,
    tooltip: 'Magnetic field intensity. Controls field line density and writhing speed. Magnetars reach 10¹⁵ Gauss.',
  },
  {
    id: 'burstIntensity',
    label: 'BURST INTENSITY',
    min: 0,
    max: 2,
    step: 0.05,
    format: (v) => v.toFixed(2),
    tooltip:
      'Gamma ray burst brightness. Real magnetar bursts are detectable across the galaxy — SGR 1806-20 was visible in daylight.',
  },
  {
    id: 'surfaceTemp',
    label: 'SURFACE TEMP',
    min: 1e6,
    max: 1e8,
    step: 1e6,
    format: (v) => `${(v / 1e6).toFixed(0)}MK`,
    tooltip: 'Surface temperature in megakelvin. Drives surface color from orange-white to hard blue-white.',
  },
] as const satisfies ReadonlyArray<SliderItem>;

export const TOGGLE_ITEMS = [
  { id: 'showFieldLines', label: 'MAGNETIC FIELD LINES' },
  { id: 'showStarquakes', label: 'STARQUAKE EVENTS' },
  { id: 'showGammaBursts', label: 'GAMMA RAY BURSTS' },
  { id: 'showFieldDistortion', label: 'FIELD DISTORTION' },
] as const satisfies ReadonlyArray<ToggleItem>;

export const RADIO_ITEMS = [
  {
    id: 'starquakeRate',
    label: 'STARQUAKE RATE',
    options: (['off', 'rare', 'frequent'] satisfies Array<StarquakeRate>).map((item) => ({ id: item, label: item })),
  },
] as const satisfies ReadonlyArray<RadioItem>;

export const NS_RADIUS = 0.38;
export const STARQUAKE_DURATION = 1.8; // seconds a crack stays visible
export const STARQUAKE_RATES = {
  off: Infinity,
  rare: 8.0,
  frequent: 2.5,
} as const satisfies Record<StarquakeRate, number>;
