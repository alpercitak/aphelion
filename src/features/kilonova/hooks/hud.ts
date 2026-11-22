import { useMemo } from 'react';
import type { SceneLayoutHudProps } from '@/components/app/scene-layout';
import { PHASE_LABEL_MAP, REMNANT_LABEL_MAP } from '../constants';
import type { LiveState, SceneParams } from '../types';
import { chirpMass, gwFrequencyHz, remnantType, totalMass } from '../utils/physics';

const BASE_HUD_PROPS = {
  title: 'Kilonova',
  subtitle: 'NEUTRON STAR MERGER · r-PROCESS',
  hints: [
    { title: 'CHIRP MASS', values: ['ℳ = (m₁m₂)^(3/5)/(m₁+m₂)^(1/5)'] },
    { title: 'KILONOVA', values: ['L ∝ t^(−1.3)'] },
  ],
  glossary: [
    {
      title: 'THE EVENT',
      items: [
        {
          term: 'NEUTRON STAR MERGER',
          def: 'Two neutron stars, each about <em>1.1–2 M☉</em> packed into roughly <em>12 km</em> of radius, spiral together as they lose orbital energy to gravitational waves. At contact the tidal forces tear and heat the outer layers.',
        },
        {
          term: 'CHIRP MASS',
          formula: 'ℳ = (m₁m₂)^(3/5) / (m₁+m₂)^(1/5)',
          def: 'The combination of masses that sets how fast the orbit shrinks and how the gravitational-wave frequency rises. It is the best-measured mass in a binary. GW170817 had ℳ ≈ <em>1.19 M☉</em>.',
        },
        {
          term: 'MERGER REMNANT',
          def: 'Below about <em>2.4 M☉</em> total, the remnant is a neutron star. Up to about <em>2.9 M☉</em> it is a hypermassive neutron star that collapses to a black hole after a short delay. Above that, a black hole forms promptly. These thresholds are approximate: they depend on the unknown <em>equation of state</em> of dense matter.',
        },
      ],
    },
    {
      title: 'PHENOMENA',
      items: [
        {
          term: 'R-PROCESS NUCLEOSYNTHESIS',
          def: 'Rapid neutron capture builds elements heavier than iron, such as <em>gold</em> and <em>platinum</em>, in the neutron-rich ejecta. Neutron star mergers are a leading site for these elements.',
        },
        {
          term: 'KILONOVA',
          formula: 'L ∝ t^(-1.3)',
          def: 'Radioactive decay of the freshly made heavy nuclei heats the ejecta, which glows for days to weeks. The light is far fainter than a supernova. The total luminosity peaks within about a day, then falls as <em>t^(-1.3)</em>.',
        },
        {
          term: 'BLUE VS RED',
          def: 'Lanthanide-poor ejecta, mostly polar, is fast and emits blue light that peaks within about a day. Lanthanide-rich ejecta, in the equatorial plane, is slower and redder: it dominates after a few days and peaks in the near-infrared around a week, at a lower luminosity. Lanthanide <em>opacity</em> is what turns the light red.',
        },
        {
          term: 'SHORT GRB JET',
          def: 'A narrow, relativistic jet can break out along the spin axis and produce a short gamma-ray burst. Only observers close to the axis see it.',
        },
        {
          term: 'MULTIMESSENGER ASTRONOMY',
          def: 'Gravitational waves, gamma rays and light from one event, observed together, locate the source and test models of the merger and the ejecta.',
        },
      ],
    },
    {
      title: 'OBSERVED',
      items: [
        {
          term: 'GW170817',
          def: 'On <em>17 August 2017</em> LIGO and Virgo detected gravitational waves from two neutron stars merging, the first binary neutron star merger seen in gravitational waves.',
        },
        {
          term: 'GRB 170817A',
          def: 'A short gamma-ray burst reached Earth about <em>1.7 s</em> after the merger, confirming the link between neutron star mergers and short GRBs.',
        },
        {
          term: 'AT2017gfo',
          def: 'The optical and infrared counterpart in the galaxy <em>NGC 4993</em>, about <em>40 Mpc</em> away. It first looked blue and then faded and reddened over about two weeks, as predicted for a kilonova.',
        },
      ],
    },
  ],
} satisfies Partial<SceneLayoutHudProps>;

export const useHud = (params: SceneParams, live: LiveState) =>
  useMemo(() => {
    const mass = totalMass(params);
    const inspiral = live.phase === 'inspiral';
    const kilonova = live.phase === 'kilonova';

    const stats = [
      { label: 'ℳ', value: chirpMass(params).toFixed(3), unit: 'M☉' },
      { label: 'M', value: mass.toFixed(2), unit: 'M☉' },
      { label: 'REMNANT', value: REMNANT_LABEL_MAP[remnantType(mass)] },
      {
        label: 'f_GW',
        value: inspiral ? gwFrequencyHz(mass, live.separation).toFixed(0) : '—',
        unit: inspiral ? 'Hz' : undefined,
      },
      {
        label: 't',
        value: kilonova ? live.days.toFixed(1) : live.elapsed.toFixed(1),
        unit: kilonova ? 'd' : 's',
      },
      {
        label: 'L',
        value: kilonova ? live.luminosity.toFixed(2) : '—',
        unit: kilonova ? '× peak' : undefined,
      },
      { label: 'DOMINANT', value: kilonova ? live.dominant : '—' },
    ];

    return {
      ...BASE_HUD_PROPS,
      status: PHASE_LABEL_MAP[live.phase],
      stats,
    };
  }, [params, live]);
