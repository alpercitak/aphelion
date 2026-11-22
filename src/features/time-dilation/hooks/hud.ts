import { useMemo } from 'react';
import type { SceneLayoutHudProps } from '@/components/app/scene-layout';
import { schwarzschildRadius } from '@/utils/physics';
import type { LiveState, SceneParams } from '../types';
import { canOrbit, clockRadius, clockRate } from '../utils/physics';

const BASE_HUD_PROPS = {
  title: 'Time Dilation',
  subtitle: 'GRAVITATIONAL REDSHIFT · SCHWARZSCHILD',
  hints: [
    { title: 'PROPER TIME', values: ['dτ/dt = √(1 − Rₛ/r)'] },
    { title: 'REDSHIFT', values: ['1 + z = 1 / √(1 − Rₛ/r)'] },
  ],
  glossary: [
    {
      title: 'THE GEOMETRY',
      items: [
        {
          term: 'SCHWARZSCHILD METRIC',
          formula: 'ds² = −(1 − Rₛ/r) dt² + dr²/(1 − Rₛ/r) + r² dΩ²',
          def: "Karl Schwarzschild's 1916 solution of general relativity for empty space around a non-rotating mass.",
        },
        {
          term: 'SCHWARZSCHILD RADIUS',
          formula: 'Rₛ = 2GM / c²',
          def: 'About <em>2.95 km</em> per solar mass. Inside it nothing can escape, and the surface is the event horizon.',
        },
        {
          term: "FLAMM'S PARABOLOID",
          def: "Ludwig Flamm's 1916 embedding of the equatorial slice of space. It is a picture of the geometry, not a potential well.",
        },
      ],
    },
    {
      title: 'PHENOMENA',
      items: [
        {
          term: 'GRAVITATIONAL TIME DILATION',
          def: 'Clocks deeper in a gravitational field tick more slowly than clocks higher up, as judged from far away.',
        },
        {
          term: 'GRAVITATIONAL REDSHIFT',
          def: 'Light climbing out of a gravitational field loses energy, so its wavelength stretches and it looks redder.',
        },
        {
          term: 'ORBITAL TIME DILATION',
          formula: 'dτ/dt = √(1 − 3Rₛ/2r)',
          def: 'An orbiting clock also runs slow from its motion. Circular orbits exist only outside the photon sphere at <em>1.5 Rₛ</em>, where light itself can circle the hole, and are unstable inside the innermost stable circular orbit at <em>3 Rₛ</em>.',
        },
        {
          term: 'RELATIVISTIC DOPPLER',
          formula: 'ν_obs/ν_em = √(1 − Rₛ/r) / γ(1 − v·n̂)',
          def: "An orbiting clock's light is blueshifted on the side moving toward you and redshifted on the side moving away. The γ term is the special-relativistic time dilation already in dτ/dt. Light bending is ignored.",
        },
        {
          term: 'SHAPIRO DELAY',
          def: 'Light passing a massive body takes longer than in flat space. Its coordinate speed, as a distant observer reckons it, drops near the mass; measured locally it is always <em>c</em>.',
        },
      ],
    },
    {
      title: 'OBSERVED',
      items: [
        {
          term: 'POUND–REBKA 1959',
          def: 'Gamma rays falling <em>22.5 m</em> in a Harvard tower gained the predicted blueshift, to about <em>10%</em> at first.',
        },
        {
          term: 'GPS',
          def: 'Satellite clocks run about <em>38 μs</em> per day fast overall: <em>+45 μs</em> from gravity, <em>−7 μs</em> from orbital motion.',
        },
        {
          term: 'GRAVITY PROBE A 1976',
          def: 'A hydrogen maser on a rocket reached about <em>10,000 km</em> altitude and confirmed the gravitational redshift to about <em>70 parts per million</em>.',
        },
      ],
    },
  ],
} satisfies Partial<SceneLayoutHudProps>;

export const useHud = (params: SceneParams, live: LiveState) =>
  useMemo(() => {
    const stats = [
      { label: 'M', value: params.mass.toFixed(1), unit: 'M☉' },
      { label: 'Rₛ', value: schwarzschildRadius(params.mass).toFixed(1), unit: 'km' },
      { label: 't', value: live.t.toFixed(1), unit: 's' },
      ...live.tau.map((tau, i) => {
        const r = clockRadius(params.innerRadius, i);
        const rate = clockRate(r, params.orbiting);
        const frozen = params.orbiting && !canOrbit(r);
        return {
          label: `${r.toFixed(1)} Rₛ`,
          value: tau.toFixed(1),
          unit: `s · ×${rate.toFixed(3)}${frozen ? ' (static)' : ''}`,
        };
      }),
    ];

    return { ...BASE_HUD_PROPS, stats } satisfies SceneLayoutHudProps;
  }, [params, live]);
