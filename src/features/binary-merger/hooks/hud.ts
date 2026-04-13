import { useMemo } from 'react';
import { BASE_HUD_PROPS, PHASE_LABEL_MAP } from '../constants';
import type { Params, Phase } from '../types';

export const useHud = (params: Params, phase: Phase) =>
  useMemo(() => {
    const totalMass = params.mass1 + params.mass2;
    // Chirp mass formula: (m1*m2)^0.6 / (m1+m2)^0.2
    const chirpMass = Math.pow(params.mass1 * params.mass2, 0.6) / Math.pow(totalMass, 0.2);

    const stats = [
      { label: 'M1', value: params.mass1.toFixed(1), unit: 'M☉' },
      { label: 'M2', value: params.mass2.toFixed(1), unit: 'M☉' },
      { label: 'Total', value: totalMass.toFixed(1), unit: 'M☉' },
      { label: 'Chirp', value: chirpMass.toFixed(1), unit: 'M☉' },
      { label: 'Phase', value: phase.toUpperCase() },
    ];

    return {
      ...BASE_HUD_PROPS,
      status: PHASE_LABEL_MAP[phase],
      stats,
    };
  }, [params.mass1, params.mass2, phase]);
