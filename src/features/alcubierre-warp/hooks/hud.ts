import { useMemo } from 'react';
import type { SceneLayoutHudProps } from '@/components/app/scene-layout';
import { SCENE_UNIT_M } from '../constants';
import type { SceneParams } from '../types';
import { negativeEnergySolarMasses, peakYorkTheta, wallThickness } from '../utils/metric';

const BASE_HUD_PROPS = {
  title: 'Alcubierre Warp',
  subtitle: 'WARP BUBBLE · EXOTIC MATTER',
  hints: [
    { title: 'SHAPE FUNCTION', values: ['f(r) = (tanh σ(r+R) − tanh σ(r−R)) / (2 tanh σR)'] },
    { title: 'YORK TIME', values: ['θ = v_s (x/r) df/dr'] },
  ],
  glossary: [
    {
      title: 'THE METRIC',
      items: [
        {
          term: 'ALCUBIERRE METRIC',
          formula: 'ds² = −dt² + (dx − v_s f dt)² + dy² + dz²',
          def: "Miguel Alcubierre's 1994 solution of general relativity. A bubble of flat space moves along x, with space contracting in front of it and expanding behind.",
        },
        {
          term: 'SHAPE FUNCTION',
          def: 'The function f goes from about <em>1</em> inside the bubble to <em>0</em> outside it. The change happens across the wall, where the energy is concentrated.',
        },
        {
          term: 'YORK TIME',
          def: 'The rate at which small volumes of space expand or contract, as seen by Eulerian observers, who move at right angles to the slices of constant time.',
        },
      ],
    },
    {
      title: 'PHENOMENA',
      items: [
        {
          term: 'EXPANSION & CONTRACTION',
          def: 'Space is compressed ahead of the bubble and stretched behind it. The ship rides inside the flat region and does not accelerate.',
        },
        {
          term: 'NEGATIVE ENERGY',
          def: 'Holding the bubble open needs matter with negative energy density. This violates the weak energy condition, and no classical matter is known to do it.',
        },
        {
          term: 'HORIZONS',
          def: 'For v_s > 1 the front of the bubble is causally disconnected from the ship. Signals from the ship cannot reach the front wall, so the bubble cannot be steered or switched off from inside.',
        },
      ],
    },
    {
      title: 'REFINEMENTS',
      items: [
        {
          term: 'PFENNING & FORD',
          def: 'A <em>1997</em> estimate. The energy grows as <em>R²/Δ</em>, and quantum inequalities limit the wall to a few hundred Planck lengths, so a 100 m bubble needs far more than the mass of the visible universe.',
        },
        {
          term: 'VAN DEN BROECK',
          def: 'A <em>1999</em> geometry with a microscopic outer bubble around a large inner pocket, which cuts the requirement to a few solar masses.',
        },
        {
          term: 'NATÁRIO',
          def: 'A <em>2002</em> variant with zero expansion. It still requires exotic matter.',
        },
      ],
    },
  ],
};

export const useHud = (params: SceneParams) =>
  useMemo(() => {
    const { velocity, radius, sigma } = params;
    const stats = [
      { label: 'v_s', value: velocity.toFixed(1), unit: 'c' },
      { label: 'R', value: (radius * SCENE_UNIT_M).toFixed(0), unit: 'm' },
      { label: 'Δ', value: (wallThickness(radius, sigma) * SCENE_UNIT_M).toFixed(1), unit: 'm' },
      { label: 'θ_MAX', value: peakYorkTheta(params).toFixed(2) },
      { label: '−E', value: negativeEnergySolarMasses(params, SCENE_UNIT_M).toExponential(1), unit: 'M☉' },
      { label: 'INSIDE', value: 'FLAT' },
    ];

    return { ...BASE_HUD_PROPS, stats } satisfies SceneLayoutHudProps;
  }, [params]);
