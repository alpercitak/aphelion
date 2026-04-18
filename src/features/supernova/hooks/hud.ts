import { useMemo } from 'react';
import type { SceneLayoutHudProps } from '@/components/app/scene-layout';
import { PHASE_LABEL_MAP, REMNANT_TYPE_LABEL_MAP } from '../constants';
import type { Phase, SceneParams } from '../types';
import { getRemnantType } from '../utils/remnant';

const BASE_HUD_PROPS = {
  title: 'Supernova',
  subtitle: 'CORE COLLAPSE · SHOCKWAVE · NUCLEOSYNTHESIS',
  hints: [
    { title: 'ENERGY', values: ['~10⁴⁴ J'] },
    { title: 'VISIBLE', values: ['~3 weeks'] },
  ],
  glossary: [
    {
      title: 'THE EVENT',
      items: [
        {
          term: 'CORE COLLAPSE SUPERNOVA',
          formula: 'E ~ 3×10⁴⁶ J',
          def: 'When a massive star (>8 M☉) exhausts its nuclear fuel, the iron core — which cannot generate energy by fusion — collapses in under a second. The core reaches nuclear density and rebounds, sending a shockwave through the infalling envelope. The resulting explosion releases more energy than the Sun will emit in its entire <em>10 billion year lifetime</em>.',
        },
        {
          term: 'TYPE-II SUPERNOVA',
          def: "Core-collapse supernova from a massive star retaining its hydrogen envelope. The star's outer layers are ejected at ~10,000 km/s while a neutron star or black hole forms at the center. SN 1987A in the Large Magellanic Cloud — 170,000 light-years away — was visible to the naked eye and remains the closest observed supernova in 400 years.",
        },
        {
          term: 'TYPE-IA SUPERNOVA',
          def: 'A white dwarf in a binary system accretes matter from a companion until it exceeds the <em>Chandrasekhar limit</em> (~1.4 M☉). The entire star detonates via runaway carbon fusion — no remnant left. Type Ia supernovae are used as standard candles to measure cosmic distances; their discovery led to the detection of <em>dark energy</em> in 1998.',
        },
        {
          term: 'NEUTRINO BURST',
          def: 'During core collapse, ~99% of the gravitational energy is radiated as neutrinos in ~10 seconds. The neutrino luminosity briefly exceeds the optical luminosity of the entire observable universe. For SN 1987A, <em>19 neutrinos</em> were detected across three underground detectors — the first detection of supernova neutrinos.',
        },
      ],
    },
    {
      title: 'THE SEQUENCE',
      items: [
        {
          term: 'SHOCK BREAKOUT',
          def: 'The first visible signal — the shockwave reaches the stellar surface and the star briefly brightens in X-rays and UV before the optical peak. Lasts minutes to hours depending on stellar radius. The <em>first ever observed</em> shock breakout in real time occurred in 2016 (KSN 2011b), caught by the Kepler space telescope.',
        },
        {
          term: 'EJECTA',
          def: 'The stellar envelope ejected at 1–30% of the speed of light. Typical mass: 1–15 M☉ depending on progenitor. As ejecta expands and cools, it becomes transparent, revealing the inner layers — the radioactive nickel-56 → cobalt-56 → iron-56 decay chain powers the optical lightcurve for weeks.',
        },
        {
          term: 'NUCLEOSYNTHESIS',
          def: 'Supernovae are the primary source of elements heavier than oxygen in the universe. The extreme temperatures during collapse fuse lighter elements into heavier ones. The subsequent explosion disperses these elements into the interstellar medium. <em>Most of the iron in your blood, the calcium in your bones, and the oxygen you breathe were forged in supernova explosions.</em>',
        },
        {
          term: 'SUPERNOVA REMNANT',
          def: 'The expanding shell of gas and dust that persists for thousands of years. The Crab Nebula — remnant of a supernova observed in 1054 AD — is now 11 light-years across. Remnants are sites of particle acceleration, producing cosmic rays, and often contain a central pulsar: the neutron star born in the explosion.',
        },
      ],
    },
    {
      title: 'REMNANTS',
      items: [
        {
          term: 'REMNANT TYPE',
          def: 'The outcome depends on progenitor mass. 8–20 M☉ → neutron star. 20–25 M☉ → neutron star or black hole. >25 M☉ → black hole (often with no visible explosion — a "failed supernova"). >130 M☉ → pair-instability supernova that completely disrupts the star, leaving no remnant at all.',
        },
        {
          term: 'PAIR INSTABILITY',
          def: 'At extremely high temperatures, gamma-ray photons spontaneously create electron-positron pairs, reducing radiation pressure. For stars >130 M☉, this instability triggers runaway nuclear burning that completely disrupts the star. No neutron star, no black hole — the entire mass is ejected. The most energetic explosions known.',
        },
      ],
    },
  ],
} satisfies Partial<SceneLayoutHudProps>;

export const useHud = (params: SceneParams, phase: Phase) =>
  useMemo(() => {
    const remnantType = getRemnantType(params.progenitorMass);
    const ejectaM = params.progenitorMass * 0.7; // rough — ~30% stays in remnant
    const phaseLabel = PHASE_LABEL_MAP[phase];
    const stats = [
      { label: 'MASS', value: params.progenitorMass.toFixed(0), unit: 'M☉' },
      { label: 'EJECTA', value: ejectaM.toFixed(0), unit: 'M☉' },
      { label: 'REMNANT', value: REMNANT_TYPE_LABEL_MAP[remnantType] },
      { label: 'PHASE', value: phaseLabel },
      { label: 'T', value: `${(params.timeline * 100).toFixed(0)}`, unit: '%' },
    ];
    return {
      ...BASE_HUD_PROPS,
      status: PHASE_LABEL_MAP[phase],
      stats,
    };
  }, [params.progenitorMass, params.timeline, phase]);
