import type { SceneLayoutHudProps } from '@/components/app/scene-layout';
import { useMemo } from 'react';
import type { SceneParams } from '../types';

const BASE_HUD_PROPS = {
  title: 'Cosmic String',
  subtitle: 'TOPOLOGICAL DEFECT · CONICAL SPACETIME · KIBBLE MECHANISM',
  glossary: [
    {
      title: 'THE OBJECT',
      items: [
        {
          term: 'COSMIC STRING',
          formula: 'µ ~ η² / c²',
          def: 'A hypothetical 1-dimensional topological defect formed in the early universe when symmetry-breaking phase transitions created regions with different vacuum states. The boundaries between these regions — where the field cannot smoothly interpolate — become strings. Infinitely thin, enormously dense, potentially infinite in length.',
        },
        {
          term: 'TOPOLOGICAL DEFECT',
          def: 'A stable configuration in a quantum field that cannot be smoothed away continuously. Like a knot that cannot be untied without cutting the string. Formed during cosmological phase transitions when the universe cooled through critical temperatures. Cosmic strings are the 1D variety; monopoles are 0D, domain walls are 2D.',
        },
        {
          term: 'KIBBLE MECHANISM',
          def: 'The process by which topological defects form during phase transitions, described by Tom Kibble in 1976. As the universe cooled, different regions independently chose their vacuum state. Where regions with incompatible choices met, defects inevitably formed. The density of defects depends on the correlation length at the transition.',
        },
        {
          term: 'GUT SCALE',
          def: 'Grand Unified Theory scale — the energy ~10¹⁶ GeV at which the strong, weak, and electromagnetic forces may have unified. GUT-scale phase transitions would produce cosmic strings with Gµ ~ 10⁻⁶, near observational limits. Electroweak-scale strings (Gµ ~ 10⁻³⁰) would be far too light to detect.',
        },
      ],
    },
    {
      title: 'PHENOMENA',
      items: [
        {
          term: 'CONICAL SPACETIME',
          def: 'A cosmic string does not attract gravitationally — it creates a <em>deficit angle</em> in the spacetime around it. Space is flat everywhere except at the string, but if you travel around the string, you return having traversed only (2π − δ) radians rather than 2π. This conical geometry causes the double-image lensing effect.',
        },
        {
          term: 'DOUBLE IMAGE',
          def: 'Light passing on either side of a cosmic string is deflected by the same angle toward the string. A source directly behind the string appears as two identical images, one on each side. Unlike gravitational lensing by a mass, both images are the same brightness and the deflection depends only on Gµ, not the distance to the source.',
        },
        {
          term: 'INTERCOMMUTATION',
          def: 'When two cosmic strings cross, they exchange partners — reconnecting in a different topology. This process (probability ~1 for fundamental strings, possibly lower for superstrings) is the primary mechanism by which the string network loses energy. Loops formed by intercommutation oscillate and decay via gravitational wave emission.',
        },
        {
          term: 'GRAVITATIONAL WAVE BACKGROUND',
          def: 'Cosmic string loops oscillating and decaying produce a stochastic gravitational wave background potentially detectable by pulsar timing arrays. The NANOGrav 15-year dataset (2023) reported a signal consistent with cosmic strings at Gµ ~ 10⁻¹⁰ – 10⁻⁸, though other sources are also consistent.',
        },
      ],
    },
    {
      title: 'PARAMETERS',
      items: [
        {
          term: 'LINEAR DENSITY Gµ',
          def: 'The dimensionless parameter Gµ = G × (mass per unit length) / c². Observational constraints from CMB and pulsar timing require Gµ < ~10⁻⁷. GUT strings would have Gµ ~ 10⁻⁶, electroweak strings ~10⁻³⁰. Controls both the lensing strength and the glow intensity here.',
        },
        {
          term: 'TENSION',
          def: 'For a Nambu-Goto string, tension T equals the linear mass density µc² — they are equal. The string oscillates transversely at up to the speed of light. Higher tension = faster oscillation, shorter wavelengths, more rapid energy loss via gravitational radiation.',
        },
      ],
    },
  ],
  hints: [
    { title: 'ORIGIN', values: ['Big Bang ~10⁻³⁵ s'] },
    { title: 'STATUS', values: ['Theoretical'] },
  ],
} as const satisfies Partial<SceneLayoutHudProps>;

export const useHud = (params: SceneParams) =>
  useMemo(() => {
    const gmu = Math.pow(10, -12 + params.linearDensity * 6);
    const deflectionArcsec = (8 * Math.PI * Math.PI * gmu * 206265).toFixed(4);
    const stats = [
      { label: 'Gµ', value: gmu.toExponential(1) },
      { label: 'DEFLECT', value: deflectionArcsec, unit: '″' },
      { label: 'TENSION', value: params.tension.toFixed(2) },
      { label: 'AMP', value: params.oscillationAmp.toFixed(2) },
    ];
    return {
      ...BASE_HUD_PROPS,
      stats,
    };
  }, [params.linearDensity, params.tension, params.oscillationAmp]);
