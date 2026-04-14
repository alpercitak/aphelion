import { useMemo } from 'react';
import type { SceneLayoutHudProps } from '@/components/app/scene-layout';
import { hawkingTemperatureKelvin } from '@/utils/physics';
import { PHASE_LABEL_MAP } from '../constants';
import type { Params, Phase } from '../types';

const BASE_HUD_PROPS = {
  title: 'Hawking Evaporation',
  subtitle: 'HAWKING RADIATION · VIRTUAL PAIRS · QUANTUM DECAY',
  hints: [
    { title: 'PREDICTED', values: ['Hawking 1974'] },
    { title: 'OBSERVED', values: ['Never'] },
  ],
  glossary: [
    {
      title: 'THE PROCESS',
      items: [
        {
          term: 'HAWKING RADIATION',
          formula: 'T = ℏc³ / 8πGMk',
          def: 'Thermal radiation emitted by black holes due to quantum effects near the event horizon. Predicted by Stephen Hawking in 1974 — a landmark result combining quantum mechanics, thermodynamics, and general relativity. The temperature is <em>inversely proportional to mass</em>: smaller black holes are hotter.',
        },
        {
          term: 'VIRTUAL PARTICLE PAIRS',
          def: "Quantum vacuum fluctuations constantly produce particle-antiparticle pairs that normally annihilate immediately. Near the event horizon, tidal forces can separate a pair before annihilation — one particle falls in, one escapes. The escaping particle carries energy away, reducing the black hole's mass.",
        },
        {
          term: 'EVAPORATION TIME',
          formula: 't ~ 5120πG²M³ / ℏc⁴',
          def: 'The time for a black hole to completely evaporate. Proportional to M³ — a 1 M☉ black hole takes ~2×10⁶⁷ years. A Planck-mass black hole evaporates in ~10⁻⁴³ seconds. <em>No stellar black hole will evaporate in the age of the universe.</em>',
        },
        {
          term: 'INFORMATION PARADOX',
          def: 'If a black hole evaporates completely, what happens to the information about the matter that fell in? Hawking radiation appears purely thermal — carrying no information. This conflicts with quantum mechanics, which requires information to be preserved. Unresolved; one of the deepest open problems in physics.',
        },
      ],
    },
    {
      title: 'THE PHYSICS',
      items: [
        {
          term: 'BLACK HOLE TEMPERATURE',
          def: "A 10 M☉ stellar black hole has T ~ 6×10⁻⁹ K — far colder than the CMB (~2.7 K). It absorbs far more radiation than it emits. Only black holes lighter than ~10²² kg (the Moon's mass) are hotter than the CMB and actually evaporating in the current universe.",
        },
        {
          term: 'PLANCK MASS',
          formula: 'mₚ = √(ℏc/G) ≈ 22 μg',
          def: 'The mass at which quantum gravitational effects become dominant. A Planck-mass black hole has a Schwarzschild radius equal to the Planck length (~10⁻³⁵ m). At this scale, general relativity breaks down — a quantum theory of gravity is needed to describe the final evaporation.',
        },
        {
          term: 'QUANTUM GRAVITY',
          def: 'The as-yet-incomplete theory that would unify quantum mechanics with general relativity. Hawking evaporation is one of the few phenomena where both theories are simultaneously essential. The final moments of evaporation — near the Planck mass — cannot be described by either theory alone.',
        },
        {
          term: 'STEPHEN HAWKING',
          def: 'Derived the evaporation formula in 1974, surprising nearly everyone. Hawking himself called it his greatest work. The result showed black holes are not truly black — they have a temperature, an entropy (Bekenstein-Hawking entropy), and a finite lifetime. It remains unobserved experimentally.',
        },
      ],
    },
    {
      title: 'PARAMETERS',
      items: [
        {
          term: 'INITIAL MASS',
          def: 'The starting mass of the black hole in this visualisation, in solar masses. At 0.001 M☉ (~Jupiter mass) the Hawking temperature is ~10⁻⁴ K — still cold but evaporating on a cosmological timescale. Time is compressed here so the sequence completes in seconds rather than eons.',
        },
        {
          term: 'TIME COMPRESSION',
          def: 'Maps the astronomical evaporation timescale to a human-watchable sequence. Real evaporation of a 0.1 M☉ black hole takes ~10⁶⁴ years. Here it completes in ~10–60 seconds depending on compression level.',
        },
      ],
    },
  ],
} satisfies Partial<SceneLayoutHudProps>;

export const useHud = (params: Params, liveMass: number, phase: Phase) =>
  useMemo(() => {
    // Format Hawking Temperature
    const tk = hawkingTemperatureKelvin(liveMass);
    const tempDisp =
      tk > 1e6
        ? `${(tk / 1e9).toExponential(1)}GK`
        : `${(tk / (tk > 1e3 ? 1e3 : 1)).toFixed(tk > 1e3 ? 1 : 2)}${tk > 1e3 ? 'kK' : 'K'}`;

    // Format Mass
    const massDisp = liveMass < 1e-3 ? liveMass.toExponential(2) : liveMass.toFixed(4);
    const massPct = ((liveMass / params.initialMass) * 100).toFixed(1);

    return {
      ...BASE_HUD_PROPS,
      status: PHASE_LABEL_MAP[phase],
      stats: [
        { label: 'MASS', value: massDisp, unit: 'M☉' },
        { label: 'REMAIN', value: massPct, unit: '%' },
        { label: 'T_H', value: tempDisp },
        { label: 'PHASE', value: phase.toUpperCase() },
      ],
    };
  }, [liveMass, params.initialMass, phase]);
