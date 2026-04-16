import { useMemo } from 'react';
import type { SceneLayoutHudProps } from '@/components/app/scene-layout';
import { schwarzschildRadius } from '@/utils/physics';
import type { SceneParams } from '../types';

const BASE_HUD_PROPS = {
  title: 'White Hole',
  subtitle: 'TIME-REVERSAL SYMMETRY · EJECTA · PENROSE DIAGRAM',
  glossary: [
    {
      title: 'THE OBJECT',
      items: [
        {
          term: 'WHITE HOLE',
          def: "The time-reversal of a black hole. While a black hole's event horizon forbids exit, a white hole's horizon forbids <em>entry</em> — matter and light can only emerge, never fall in. A valid solution to Einstein's field equations, but never observed and likely unstable.",
        },
        {
          term: 'TIME REVERSAL SYMMETRY',
          def: "General relativity's field equations are time-symmetric — if a solution is valid, its time-reverse is also valid. Run a black hole collapse backward and you get a white hole explosion. The asymmetry in nature comes from <em>thermodynamics</em>, not from the laws of gravity themselves.",
        },
        {
          term: 'PENROSE DIAGRAM',
          def: 'A conformal diagram representing the full causal structure of a spacetime. In the maximally extended Schwarzschild solution, the diagram has four regions: the exterior, the black hole interior, the white hole interior, and a second exterior. The white hole is the "past" region that the black hole is the "future" of.',
        },
        {
          term: 'CAUSAL STRUCTURE',
          def: "The set of causal relationships between events — which events can influence which others. A white hole horizon is a <em>past</em> Cauchy horizon: nothing can enter but anything inside must eventually leave. This is the precise time-reversal of a black hole's future event horizon.",
        },
      ],
    },
    {
      title: 'PHENOMENA',
      items: [
        {
          term: 'EJECTA',
          def: "Matter and radiation continuously emitted from the white hole surface. Unlike a black hole's accretion disk (infalling matter), white hole ejecta flow <em>outward in all directions</em>. The emission is spherically symmetric in the simplest models.",
        },
        {
          term: 'PHOTON SPHERE (OUTWARD)',
          formula: 'r = 1.5 rₛ',
          def: 'The photon sphere exists for white holes at the same radius as black holes — but the glow is on the <em>outer face</em> rather than the inner. Photons at this radius orbit unstably; those slightly outside escape outward rather than spiraling in.',
        },
        {
          term: 'LOOP QUANTUM GRAVITY',
          def: "One theoretical framework in which white holes are physically realised: a black hole eventually reaches a Planck-density core, undergoes a quantum bounce, and <em>re-emerges as a white hole</em>. The timescale for this process, from an external observer's perspective, may be astronomically long.",
        },
        {
          term: 'INSTABILITY',
          def: "Classical white holes are thought to be unstable — any small perturbation (a single infalling photon) converts them into black holes. This is why they're never observed: the universe's past light cone contains too many photons for a white hole to survive. They may exist only at the Planck scale.",
        },
      ],
    },
    {
      title: 'PARAMETERS',
      items: [
        {
          term: 'EJECTION VELOCITY',
          def: 'The outward speed of emitted matter as a fraction of c. Near the photon sphere, emission must be near-luminal. At larger distances, matter decelerates due to gravity. Higher velocity = longer visible trails before particles fade at the maximum radius.',
        },
        {
          term: 'EJECTA TEMPERATURE',
          def: "Surface temperature of emitted matter. Cool ejecta (1000–5000 K) appears orange-red like a stellar atmosphere. Hot ejecta (20000–50000 K) approaches blue-white. Color follows Wien's displacement law — peak wavelength λ_max = b/T.",
        },
      ],
    },
  ],
  hints: [
    { title: 'OBSERVED', values: ['Never'] },
    { title: 'SYMMETRY', values: ['Time-reversed BH'] },
  ],
} satisfies Partial<SceneLayoutHudProps>;

export const useHud = (params: SceneParams) =>
  useMemo(() => {
    const rs = schwarzschildRadius(params.mass);
    const stats = [
      { label: 'MASS', value: params.mass.toFixed(1), unit: 'M☉' },
      { label: 'Rₛ', value: rs.toFixed(1), unit: 'km' },
      { label: 'VEL', value: params.ejectionVelocity.toFixed(2), unit: 'c' },
      { label: 'TEMP', value: `${Math.round(params.temperature / 1000)}k`, unit: 'K' },
      { label: 'RATE', value: params.ejectionRate.toUpperCase() },
    ];
    return {
      ...BASE_HUD_PROPS,
      stats,
    };
  }, [params.mass, params.ejectionVelocity, params.temperature, params.ejectionRate]);
