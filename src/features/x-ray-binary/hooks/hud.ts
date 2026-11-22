import { useMemo } from 'react';
import type { SceneLayoutHudProps } from '@/components/app/scene-layout';
import type { SceneParams } from '../types';
import {
  accretionLuminosity,
  accretorType,
  eddingtonLuminosity,
  innerDiskKeV,
  massTransferRate,
  orbitalPeriodHours,
} from '../utils/physics';
import { eggleton } from '../utils/roche';

const BASE_HUD_PROPS = {
  title: 'X-ray Binary',
  subtitle: 'ROCHE-LOBE OVERFLOW · ACCRETION',
  hints: [
    { title: 'ROCHE LOBE', values: ['r_L/a = 0.49 q^(2/3) / (0.6 q^(2/3) + ln(1 + q^(1/3)))'] },
    { title: 'ACCRETION', values: ['L = GMṀ / R'] },
  ],
  glossary: [
    {
      title: 'THE SYSTEM',
      items: [
        {
          term: 'ROCHE LOBE',
          def: 'The region around a star within which its own gravity dominates. Gas inside stays bound to the star. A star that swells past its lobe spills gas onto its companion.',
        },
        {
          term: 'L1',
          def: 'The inner Lagrange point, the saddle between the two stars where their pulls balance. Gas leaves the donor through it.',
        },
        {
          term: 'LMXB',
          def: 'Low-mass X-ray binary: a low-mass donor, typically below about <em>1 M☉</em>, feeds a compact object. The accretor is a neutron star or a black hole.',
        },
        {
          term: 'HMXB',
          def: 'High-mass X-ray binary: a massive OB star feeds a compact object through its wind or a stream. Mass transfer is usually not by Roche-lobe overflow.',
        },
      ],
    },
    {
      title: 'PHENOMENA',
      items: [
        {
          term: 'ROCHE-LOBE OVERFLOW',
          def: 'The donor fills its lobe and gas streams through L1 toward the accretor. The transfer rate sets how bright the system is.',
        },
        {
          term: 'CORIOLIS DEFLECTION',
          def: 'In the rotating frame the Coriolis force bends the stream. It misses the accretor and strikes the outer rim of the disk, making a hot spot.',
        },
        {
          term: 'ACCRETION DISK',
          formula: 'T ∝ r^(-3/4)',
          def: 'Viscosity drains angular momentum from the gas, which spirals inward and releases its gravitational energy as heat. A thin disk is hottest near its inner edge.',
        },
        {
          term: 'EDDINGTON LIMIT',
          def: 'Radiation pressure on infalling gas caps the luminosity at about <em>1.26 × 10³¹ W</em> per solar mass. Above that, the gas is pushed back out.',
        },
      ],
    },
    {
      title: 'OBSERVED',
      items: [
        {
          term: 'SCO X-1',
          def: 'Found in <em>1962</em> by a rocket flight, the first X-ray source outside the Solar System. A low-mass X-ray binary with a neutron star and an orbital period of about <em>18.9 h</em>.',
        },
        {
          term: 'CYG X-1',
          def: 'A high-mass X-ray binary with a black hole of about <em>21 M☉</em>, fed by the wind of a blue supergiant. It is one of the first black hole candidates.',
        },
        {
          term: 'GX 339-4',
          def: 'A black hole low-mass X-ray binary that goes into outburst every few years. It is a standard laboratory for how disks and jets change between states.',
        },
      ],
    },
  ],
} satisfies Partial<SceneLayoutHudProps>;

export const useHud = (params: SceneParams) =>
  useMemo(() => {
    const { accretorMass, donorMass, mdotLog } = params;
    const q = donorMass / accretorMass;
    const type = accretorType(accretorMass);
    const mdot = massTransferRate(mdotLog);
    const luminosity = accretionLuminosity(accretorMass, mdot, type);

    const stats = [
      { label: 'q', value: q.toFixed(2) },
      { label: 'r_L/a', value: eggleton(q).toFixed(3) },
      { label: 'P', value: orbitalPeriodHours(params).toFixed(1), unit: 'h' },
      { label: 'ACCRETOR', value: type === 'neutron-star' ? 'NEUTRON STAR' : 'BLACK HOLE' },
      { label: 'Ṁ', value: `1e${mdotLog.toFixed(1)}`, unit: 'M☉/yr' },
      { label: 'L', value: (luminosity * 1e7).toExponential(1).replace('+', ''), unit: 'erg/s' },
      { label: 'L/L_Edd', value: (luminosity / eddingtonLuminosity(accretorMass)).toFixed(3) },
      { label: 'kT_in', value: innerDiskKeV(accretorMass, mdot, type).toFixed(2), unit: 'keV' },
    ];

    return { ...BASE_HUD_PROPS, stats };
  }, [params]);
