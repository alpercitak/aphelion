import { useMemo } from 'react';
import type { SceneLayoutHudProps } from '@/components/app/scene-layout';
import { DESTINATION_LABEL_MAP } from '../constants';
import type { Params } from '../types';

const BASE_HUD_PROPS = {
  title: 'Wormhole',
  subtitle: 'EINSTEIN-ROSEN BRIDGE · EXOTIC MATTER · SPACETIME TOPOLOGY',
  glossary: [
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
  ],
  hints: [
    { title: 'TOPOLOGY', values: ['Non-trivial'] },
    { title: 'STATUS', values: ['Theoretical'] },
  ],
} as const satisfies Partial<SceneLayoutHudProps>;

export const useHud = (params: Params) =>
  useMemo(() => {
    const stats = [
      { label: 'THROAT', value: params.throatRadius.toFixed(2), unit: 'r₀' },
      { label: 'EXOTIC', value: params.exoticDensity.toFixed(2), unit: 'ρ' },
      { label: 'DEST', value: DESTINATION_LABEL_MAP[params.destination].toUpperCase() },
      { label: 'STATUS', value: 'THEORETICAL' },
    ];

    return {
      ...BASE_HUD_PROPS,
      stats,
    };
  }, [params.throatRadius, params.exoticDensity, params.destination]);
