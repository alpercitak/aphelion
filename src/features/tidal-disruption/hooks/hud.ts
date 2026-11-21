import { useMemo } from 'react';
import type { SceneLayoutHudProps } from '@/components/app/scene-layout';
import { PHASE_LABEL_MAP } from '../constants';
import type { LiveState, SceneParams } from '../types';
import { kmToAu, tidalRadiusKm } from '../utils/physics';

const BASE_HUD_PROPS = {
  title: 'Tidal Disruption',
  subtitle: 'SPAGHETTIFICATION · FALLBACK',
  glossary: [
    {
      title: 'THE EVENT',
      items: [
        {
          term: 'TIDAL RADIUS',
          formula: 'r_t = R★ (M/m★)^(1/3)',
          def: "The distance inside which the black hole's tidal pull across the star exceeds the star's own gravity. Inside <em>r_t</em> the star is torn apart. For a Sun-like star and a 10⁶ M☉ black hole, r_t is about <em>0.5 AU</em>.",
        },
        {
          term: 'SPAGHETTIFICATION',
          def: 'Gravity on the near side of the star is much stronger than on the far side. The star is stretched radially and squeezed sideways into a long stream of debris, like <em>spaghetti</em>.',
        },
        {
          term: 'PENETRATION FACTOR (β)',
          formula: 'β = r_t / r_p',
          def: 'How deep the star dives. At <em>β = 1</em> the star is fully disrupted at periapsis. Larger β means a deeper, more violent dive. Below 1 the star passes outside r_t and survives.',
        },
      ],
    },
    {
      title: 'PHENOMENA',
      items: [
        {
          term: 'DEBRIS STREAM',
          def: 'The star is split into a spread of orbital energies. Roughly <em>half</em> of the debris is bound and falls back; the other half escapes at high speed. The most bound debris returns first.',
        },
        {
          term: 'FALLBACK & THE t^-5/3 LAW',
          formula: 'Ṁ ∝ t^(-5/3)',
          def: 'The rate at which debris returns peaks at <em>t_min</em>, roughly half the orbital period of the most bound debris, then falls as <em>t^(-5/3)</em>. The HUD shows the rate relative to its peak.',
        },
        {
          term: 'CIRCULARIZATION',
          def: 'Returning debris collides with itself and loses orbital energy. It settles into a compact <em>accretion disk</em>, and accretion then produces a bright flare.',
        },
        {
          term: 'PARTIAL DISRUPTION',
          def: 'For β < 1 only the outer layers of the star are stripped. The core survives and continues on its orbit.',
        },
        {
          term: 'HILLS MASS',
          def: "Above roughly <em>10⁸ M☉</em>, a Sun-like star's tidal radius lies inside its own horizon. The star is swallowed whole and no flare is seen.",
        },
      ],
    },
    {
      title: 'OBSERVED',
      items: [
        {
          term: 'ASASSN-14li',
          def: 'Discovered in <em>2014</em> by the All-Sky Automated Survey for Supernovae (ASAS-SN), in a galaxy roughly <em>290 million light-years</em> away. Its optical and UV light faded in a way broadly consistent with the t^(-5/3) fallback prediction.',
        },
        {
          term: 'AT2019dsg',
          def: 'A tidal disruption flare found in <em>2019</em>, associated with a high-energy neutrino detected by IceCube. The association is still debated, but it links these flares to high-energy particle production.',
        },
      ],
    },
  ],
  hints: [
    { title: 'TIDAL RADIUS', values: ['r_t = R★(M/m★)^(1/3)'] },
    { title: 'FALLBACK', values: ['Ṁ ∝ t^(-5/3)'] },
  ],
} satisfies Partial<SceneLayoutHudProps>;

export const useHud = (params: SceneParams, live: LiveState) =>
  useMemo(() => {
    const rtAu = kmToAu(tidalRadiusKm(params));
    const hasDebris = live.phase !== 'approach' && live.phase !== 'swallowed';
    const hasFallback = live.phase === 'fallback' || live.phase === 'disk';
    const fallbackRate = (live.t / live.tMin) ** (-5 / 3);

    const stats = [
      { label: 'M', value: `10^${params.logMass.toFixed(1)}`, unit: 'M☉' },
      { label: 'r_t', value: rtAu.toFixed(2), unit: 'AU' },
      { label: 'β', value: params.beta.toFixed(1) },
      { label: 'phase', value: live.phase.toUpperCase() },
      {
        label: 'bound',
        value: hasDebris ? (live.boundFraction * 100).toFixed(0) : '—',
        unit: hasDebris ? '%' : undefined,
      },
      {
        label: 'fallback',
        value: hasFallback ? fallbackRate.toFixed(2) : '—',
        unit: hasFallback ? '× peak' : undefined,
      },
    ];

    return {
      ...BASE_HUD_PROPS,
      status: PHASE_LABEL_MAP[live.phase],
      stats,
    };
  }, [params, live]);
