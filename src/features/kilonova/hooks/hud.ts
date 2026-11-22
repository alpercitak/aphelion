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
  glossary: [],
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
