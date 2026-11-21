import { useMemo } from 'react';
import type { SceneLayoutHudProps } from '@/components/app/scene-layout';
import { SPEED_OF_LIGHT, schwarzschildRadius } from '@/utils/physics';
import type { LiveState, SceneParams } from '../types';
import { extractableFraction, horizonRadius, penroseEfficiency } from '../utils/kerr';

const BASE_HUD_PROPS = {
  title: 'Ergosphere',
  subtitle: 'KERR METRIC · PENROSE PROCESS',
  glossary: [
    {
      title: 'THE OBJECT',
      items: [
        {
          term: 'KERR BLACK HOLE',
          formula: 'a = J / M²',
          def: 'A rotating black hole, described by the <em>Kerr metric</em>. Its spin a runs from 0 (Schwarzschild) to 1 (extremal). This scene caps it at 0.998.',
        },
        {
          term: 'OUTER HORIZON',
          formula: 'r₊ = M + √(M² − a²)',
          def: 'The point of <em>no return</em>. Spin shrinks it below the Schwarzschild radius and flattens it into an oblate shape.',
        },
        {
          term: 'ERGOSPHERE',
          formula: 'r_E = M + √(M² − a² cos²θ)',
          def: 'A region outside the horizon where the time coordinate is <em>spacelike</em>. Nothing can stay still relative to distant stars inside it. It touches the horizon at the poles and reaches <em>2M</em> at the equator.',
        },
        {
          term: 'STATIC LIMIT',
          def: 'The outer boundary of the ergosphere. Outside it, a particle can still hover in place. Inside it, every particle must rotate with the hole.',
        },
      ],
    },
    {
      title: 'PHENOMENA',
      items: [
        {
          term: 'FRAME DRAGGING',
          formula: 'ω = 2Mar / ((r² + a²)² − a²Δ sin²θ)',
          def: 'Spinning mass drags spacetime around with it. The frame-dragging rate ω is largest near the horizon, where it equals <em>Ω_H = a / 2r₊</em>.',
        },
        {
          term: 'NO STANDING STILL',
          def: 'Inside the ergosphere, the allowed orbital velocities are all prograde. Particles here are forced to co-rotate, which is why the retrograde dots flip to prograde on entry.',
        },
        {
          term: 'PENROSE PROCESS',
          formula: 'η_max = ½(√(2M/r₊) − 1)',
          def: 'A particle splits inside the ergosphere. One fragment falls in with <em>negative energy</em>, and the other escapes with more energy than the original. The black hole loses rotational energy in the process.',
        },
        {
          term: 'IRREDUCIBLE MASS',
          formula: 'M_irr = √(2r₊) / 2',
          def: 'The mass that can never be extracted. At most <em>29%</em> of a maximally spinning black hole can be turned into energy this way.',
        },
        {
          term: 'SUPERRADIANCE',
          def: 'A wave-based cousin of the Penrose process. Waves scattered off a spinning hole can leave with more energy than they arrived with.',
        },
        {
          term: 'JETS (BLANDFORD–ZNAJEK)',
          def: 'A leading model for relativistic jets. Magnetic field lines threaded through the horizon region extract rotational energy. The Penrose process itself is not the jet mechanism.',
        },
      ],
    },
    {
      title: 'OBSERVED',
      items: [
        {
          term: 'GRAVITY PROBE B',
          def: "Its 2011 results confirmed the <em>frame dragging</em> predicted for Earth's rotation, a tiny effect of about <em>40 milliarcseconds per year</em> on a gyroscope.",
        },
        {
          term: 'STELLAR SPIN',
          def: 'X-ray reflection spectroscopy and continuum fitting give spin estimates for several stellar-mass black holes. Some are above <em>0.9</em>.',
        },
        {
          term: 'M87* (EHT)',
          def: 'The 2019 Event Horizon Telescope image of M87* shows a shadow whose shape is consistent with a spinning Kerr black hole. Spin is not measured directly by this image.',
        },
      ],
    },
  ],
  hints: [
    { title: 'ERGOSPHERE', values: ['r_E = M + √(M² − a² cos²θ)'] },
    { title: 'PENROSE LIMIT', values: ['η_max = ½(√(2M/r₊) − 1)'] },
  ],
} satisfies Partial<SceneLayoutHudProps>;

export const useHud = (params: SceneParams, live: LiveState) =>
  useMemo(() => {
    const { spin, mass } = params;
    const rPlus = horizonRadius(spin);
    // GM/c² in km and GM/c³ in s, for the physical HUD readouts
    const lengthKm = schwarzschildRadius(mass) / 2;
    const timeS = (lengthKm * 1000) / SPEED_OF_LIGHT;
    const horizonHz = spin / (2 * rPlus) / (2 * Math.PI) / timeS;

    const stats = [
      { label: 'a', value: spin.toFixed(3) },
      { label: 'r₊', value: (rPlus * lengthKm).toFixed(2), unit: 'km' },
      { label: 'r_E', value: (2 * lengthKm).toFixed(2), unit: 'km' },
      { label: 'Ω_H', value: horizonHz.toFixed(0), unit: 'Hz' },
      { label: 'η_max', value: (penroseEfficiency(spin) * 100).toFixed(1), unit: '%' },
      { label: 'extractable', value: (extractableFraction(spin) * 100).toFixed(1), unit: '%' },
      { label: 'events', value: live.events.toString() },
      { label: 'extracted', value: live.extracted.toFixed(2), unit: 'm·c²' },
    ];

    return {
      ...BASE_HUD_PROPS,
      status: spin < 0.01 ? '● SCHWARZSCHILD LIMIT' : '◉ FRAME DRAGGING',
      stats,
    };
  }, [params, live]);
